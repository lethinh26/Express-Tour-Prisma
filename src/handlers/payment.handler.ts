import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { PaymentMethod, PaymentStatus } from '@prisma/client';

export async function getPayments(req: Request, res: Response) {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        user: true,
        order: {
          include: {
            items: true,
          },
        },
      },
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

    const payment = await prisma.payment.update({
      where: { id },
      data: updateData
    });

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

// IPN Handler for SePay payment notifications
export async function handleSepayIPN(req: Request, res: Response) {
  try {
    console.log('=== SePay IPN Received ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    
    // Verify API Key từ header Authorization
    const authHeader = req.headers.authorization;
    const apiKey = process.env.SEPAY_SECRET_KEY;

    if (!authHeader) {
      console.error('Missing Authorization header');
      return res.status(401).json({ error: 'Unauthorized: Missing Authorization header' });
    }

    if (!apiKey) {
      console.error('SEPAY_SECRET_KEY not configured in .env');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // SePay gửi "Authorization: Apikey YOUR_SECRET_KEY"
    if (authHeader !== apiKey && authHeader !== `Apikey ${apiKey}`) {
      console.error('Invalid API Key:', authHeader);
      return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
    }

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

    console.log('Transaction details:', {
      id,
      gateway,
      transferAmount,
      content,
      transferType,
      transactionDate
    });

    if (transferType !== 'in') {
      console.log('Skipping outbound transaction');
      return res.json({ 
        success: true, 
        message: 'Outbound transaction ignored' 
      });
    }

    let paymentId: string | null = null;

    // Cách 1: Tìm payment_id trong content (format: TOUR PAYMENT uuid hoặc TOUR-PAYMENT-uuid)
    const contentMatch = content?.match(/TOUR[ -]PAYMENT[ -]([a-f0-9-]{36})/i);
    if (contentMatch) {
      paymentId = contentMatch[1];
    }

    // Cách 2: Nếu code chứa payment_id
    if (!paymentId && code) {
      paymentId = code;
    }

    // Cách 3: Tìm payment theo số tiền và status PENDING (fallback)
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

    const contentUpper = content?.toUpperCase().trim();
    const descriptionUpper = payment.description?.toUpperCase().trim();
    
    if (contentUpper !== descriptionUpper) {
      console.error('Content mismatch:', {
        expected: payment.description,
        received: content
      });
      // Vẫn trả success nhưng không cập nhật
      return res.json({ 
        success: true, 
        message: 'Content mismatch, payment not updated',
        payment_id: paymentId,
        transaction_id: id
      });
    }

    // Kiểm tra số tiền khớp
    if (Number(payment.amount) !== transferAmount) {
      console.error('Amount mismatch:', {
        expected: payment.amount,
        received: transferAmount
      });
      // Vẫn trả success nhưng không cập nhật
      return res.json({ 
        success: true, 
        message: 'Amount mismatch, payment not updated',
        payment_id: paymentId,
        transaction_id: id
      });
    }

    // Cập nhật payment status thành SUCCESS
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.SUCCESS,
        method: PaymentMethod.BANK_TRANSFER,
        // Có thể lưu thêm thông tin giao dịch vào note/metadata nếu cần
      }
    });

    console.log('Payment updated successfully:', {
      payment_id: paymentId,
      transaction_id: id,
      amount: transferAmount,
      gateway,
      status: 'SUCCESS'
    });

    // Trả về success để SePay biết đã nhận và xử lý
    return res.json({ 
      success: true, 
      message: 'IPN processed successfully',
      payment_id: paymentId,
      transaction_id: id,
      status: 'SUCCESS'
    });

  } catch (err) {
    console.error('SePay IPN Error:', err);
    // Vẫn trả về 200 để SePay không retry liên tục
    res.status(200).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}
