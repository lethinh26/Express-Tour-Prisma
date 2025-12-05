import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { PaymentMethod, PaymentStatus } from '@prisma/client';

export async function getPayments(req: Request, res: Response) {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        user: true,
        order: true,
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
    const id = Number(req.params.id);

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        user: true,
        order: true,
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
    const id = Number(req.params.id);
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

export async function deletePayment(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    await prisma.payment.delete({
      where: { id }
    });

    res.json({message: 'Payment deleted successfully'});

  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({message: 'Payment not found'})
    }
    res.status(500).json({ error: 'Internal server error' });
  }
}
