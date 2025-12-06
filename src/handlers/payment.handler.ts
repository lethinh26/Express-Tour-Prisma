import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { PaymentMethod, PaymentStatus } from '@prisma/client';
import crypto from 'crypto';

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
      },
    });

    res.status(201).json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updatePayment(req: Request, res: Response) {
  try {
    const id: string = req.params.id;
    const { amount, method, status } = req.body;

    const updateData: any = {}
    if (amount !== undefined) updateData.amount = amount
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

function verifySepaySignature(data: any, receivedSignature: string): boolean {
  try {
    const secretKey = process.env.SEPAY_SECRET_KEY || process.env.SECRET_KEY;
    
    if (!secretKey) {
      console.error('SEPAY_SECRET_KEY not configured');
      return false;
    }

    const signString = `${data.transaction_id}${data.payment_id}${data.amount}${data.status}`;
    
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(signString)
      .digest('hex');
    
    console.log('Signature verification:', {
      received: receivedSignature,
      expected: expectedSignature,
      match: expectedSignature === receivedSignature
    });

    return expectedSignature === receivedSignature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

export async function handleSepayIPN(req: Request, res: Response) {
  try {
    console.log('SePay IPN received:', req.body);
    
    const { 
      transaction_id,
      payment_id,
      amount,
      status,
      signature
    } = req.body;

    if (!signature) {
      console.error('Missing signature in IPN request');
      return res.status(400).json({ error: 'Missing signature' });
    }

    const isValidSignature = verifySepaySignature(req.body, signature);
    if (!isValidSignature) {
      console.error('Invalid signature from SePay');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    if (!payment_id) {
      return res.status(400).json({ error: 'Missing payment_id' });
    }

    const payment = await prisma.payment.findUnique({
      where: { id: payment_id }
    });

    if (!payment) {
      console.error('Payment not found:', payment_id);
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.status === 'SUCCESS') {
      console.log('Payment already processed:', payment_id);
      return res.json({ 
        success: true, 
        message: 'Payment already processed' 
      });
    }

    let newStatus: PaymentStatus;
    
    if (status === 'SUCCESS') {
      newStatus = PaymentStatus.SUCCESS;
    } else if (status === 'FAILED') {
      newStatus = PaymentStatus.FAILED;
    } else {
      newStatus = PaymentStatus.PENDING;
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: payment_id },
      data: {
        status: newStatus,
        method: PaymentMethod.BANK_TRANSFER,
      }
    });

    console.log('Payment updated:', updatedPayment);

    return res.json({ 
      success: true, 
      message: 'IPN processed successfully',
      payment_id: payment_id,
      status: newStatus
    });

  } catch (err) {
    console.error('SePay IPN Error:', err);
    // 200 để SePay không retry liên tục
    res.status(200).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}
