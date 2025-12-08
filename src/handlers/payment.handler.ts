import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { PaymentMethod, PaymentStatus, OrderStatus } from '@prisma/client';

export async function getPayments(req: Request, res: Response) {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        user: true,
        order: {
          include: {
            items: {
              include: {
                departure: {
                  include: {
                    tour: {
                      include: {
                        location: true,
                        category: true,
                        images: true
                      }
                    }
                  }
                }
              }
            }
          },
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getPaymentById(req: Request, res: Response) {
  try {
    const id: string = req.params.id;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        user: true,
        order: {
          include: {
            items: {
              include: {
                departure: {
                  include: {
                    tour: {
                      include: {
                        images: true,
                        location: true,
                        category: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getOrders(req: Request, res: Response) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            departure: {
              include: {
                tour: {
                  select: {
                    id: true,
                    name: true,
                    address: true,
                    information: true,
                    category: true
                  }
                }
              }
            }
          }
        },
        payments: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createPayment(req: Request, res: Response) {
  try {
    const { orderId, userId, amount, method, status } = req.body;

    if (!orderId || !userId || !amount || !method || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!Object.values(PaymentMethod).includes(method)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    if (!Object.values(PaymentStatus).includes(status)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }

    const payment = await prisma.payment.create({
      data: {
        orderId,
        userId,
        amount,
        method,
        status,
        description: '', 
      },
    });

    const description = `TOUR PAYMENT ${payment.id}`;
    
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: { description }
    });

    res.status(201).json(updatedPayment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updatePayment(req: Request, res: Response) {
  try {
    const id: string = req.params.id;
    const { amount, method, status, description } = req.body;

    const updateData: any = {}
    if (amount !== undefined) updateData.amount = amount
    if (description !== undefined) updateData.description = description
    if (method) {
      if (!Object.values(PaymentMethod).includes(method)) {
        return res.status(400).json({ message: 'Invalid payment method' });
      }
      updateData.method = method
    }
    if (status) {
      if (!Object.values(PaymentStatus).includes(status)) {
        return res.status(400).json({ message: 'Invalid payment status' });
      }
      updateData.status = status
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({message: 'At least one field is required to update'})
    }

    const currentPayment = await prisma.payment.findUnique({
      where: { id }
    });

    if (!currentPayment) {
      return res.status(404).json({message: 'Payment not found'})
    }

    const payment = await prisma.payment.update({
      where: { id },
      data: updateData
    });

    if (updateData.status === PaymentStatus.SUCCESS && currentPayment.orderId) {
      await prisma.order.update({
        where: { id: currentPayment.orderId },
        data: {
          status: OrderStatus.PAID
        }
      });
      console.log('Order updated to PAID:', currentPayment.orderId);
    }

    res.json(payment);

  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({message: 'Payment not found'})
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createOrder(req: Request, res: Response) {
  try {
    const { userId, items, totalAmount, status } = req.body;
    if (!userId || !items || !Array.isArray(items) || items.length === 0 || !totalAmount || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        status,
        items: {
          create: items.map((item: any) => ({
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            tourDepartureId: item.tourDepartureId
          }))
        }
      },
      include: {
        items: true
      }
    });
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createOrderItem(req: Request, res: Response) {
  try {
    const { orderId, quantity, unitPrice, tourDepartureId } = req.body;
    if (!orderId || !quantity || !unitPrice || !tourDepartureId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const orderItem = await prisma.orderItem.create({
      data: {
        orderId,
        quantity,
        unitPrice,
        tourDepartureId
      }
    });
    res.status(201).json(orderItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function handleSepayIPN(req: Request, res: Response) {
  try {
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    
    const authHeader = req.headers.authorization;
    const apiKey = process.env.SEPAY_SECRET_KEY;

    if (!authHeader) {
      console.error('Missing Authorization header');
      return res.status(401).json({ error: 'Unauthorized: Missing Authorization header' });
    }

    let receivedKey = authHeader;
    
    if (authHeader.startsWith('Apikey ')) {
      receivedKey = authHeader.substring(7); 
    } else if (authHeader.startsWith('ApiKey ')) {
      receivedKey = authHeader.substring(7); 
    }
    
    if (receivedKey !== apiKey) {
      console.error('Invalid API Key received:', authHeader);
      console.error('Expected:', apiKey);
      console.error('Got:', receivedKey);
      return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
    }
    
    console.log('API Key verified successfully');

    const { 
      id,                   
      gateway,               
      transactionDate,
      accountNumber,
      code,
      content,
      transferType,
      transferAmount,
      accumulated,           
      subAccount,            
      referenceCode,         
      description            
    } = req.body;



    if (transferType !== 'in') {
      return res.json({ 
        success: true, 
        message: 'Outbound transaction ignored' 
      });
    }

    let paymentId: string | null = null;

    const contentMatch = content?.match(/TOUR[ -]PAYMENT[ -]([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}|[a-f0-9]{32})/i);
    if (contentMatch) {
      let extractedId = contentMatch[1];
      if (extractedId.length === 32) {
        extractedId = `${extractedId.slice(0,8)}-${extractedId.slice(8,12)}-${extractedId.slice(12,16)}-${extractedId.slice(16,20)}-${extractedId.slice(20)}`;
      }
      paymentId = extractedId;
      console.log('Extracted payment ID:', paymentId);
    }

    if (!paymentId && code) {
      paymentId = code;
    }

    if (!paymentId) {
      console.log('Payment ID not found in content/code, searching by amount...');
      const pendingPayment = await prisma.payment.findFirst({
        where: {
          amount: transferAmount,
          status: PaymentStatus.PENDING
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      if (pendingPayment) {
        paymentId = pendingPayment.id;
        console.log('Found pending payment by amount:', paymentId);
      }
    }

    if (!paymentId) {
      console.error('Payment ID not found in transaction content or code');
      return res.json({ 
        success: true, 
        message: 'Payment ID not found, transaction logged',
        transaction_id: id
      });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId }
    });

    if (!payment) {
      console.error('Payment not found in database:', paymentId);
      return res.json({ 
        success: true, 
        message: 'Payment not found in database',
        transaction_id: id
      });
    }

    if (payment.status === PaymentStatus.SUCCESS) {
      console.log('Payment already processed:', paymentId);
      return res.json({ 
        success: true, 
        message: 'Payment already processed',
        payment_id: paymentId,
        transaction_id: id
      });
    }

    const normalizeContent = (str: string) => str.toUpperCase().replace(/-/g, '').trim();
    const contentNormalized = normalizeContent(content || '');
    const descriptionNormalized = normalizeContent(payment.description || '');
    
    if (!contentNormalized.includes(descriptionNormalized)) {
      console.error('Content mismatch:', {
        expected: payment.description,
        received: content,
        normalized_expected: descriptionNormalized,
        normalized_received: contentNormalized
      });
      return res.json({ 
        success: true, 
        message: 'Content mismatch, payment not updated',
        payment_id: paymentId,
        transaction_id: id
      });
    }

    if (Number(payment.amount) !== transferAmount) {
      console.error('Amount mismatch:', {
        expected: payment.amount,
        received: transferAmount
      });
      return res.json({ 
        success: true, 
        message: 'Amount mismatch, payment not updated',
        payment_id: paymentId,
        transaction_id: id
      });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.SUCCESS,
        method: PaymentMethod.BANK_TRANSFER,
      }
    });

    if (payment.orderId) {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: {
          status: OrderStatus.PAID
        }
      });
      console.log('Order updated to PAID:', payment.orderId);
    }

    console.log('Payment updated successfully:', {
      payment_id: paymentId,
      transaction_id: id,
      amount: transferAmount,
      gateway,
      status: 'SUCCESS'
    });

    return res.json({ 
      success: true, 
      message: 'IPN processed successfully',
      payment_id: paymentId,
      transaction_id: id,
      status: 'SUCCESS'
    });

  } catch (err) {
    console.error('SePay IPN Error:', err);
    res.status(200).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}
