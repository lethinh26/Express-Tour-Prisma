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
