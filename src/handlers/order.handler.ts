import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export async function getOrdersByDeparture(req: Request, res: Response) {
    try {
        const departureId = Number(req.params.departureId);

        if (!departureId || isNaN(departureId)) {
            return res.status(400).json({ message: 'Invalid departure ID' });
        }

        const orders = await prisma.order.findMany({
            where: {
                status: 'PAID',
                items: {
                    some: {
                        tourDepartureId: departureId
                    }
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                items: {
                    where: {
                        tourDepartureId: departureId
                    },
                    include: {
                        departure: {
                            include: {
                                tour: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getAllOrders(req: Request, res: Response) {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                items: {
                    include: {
                        departure: {
                            include: {
                                tour: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
