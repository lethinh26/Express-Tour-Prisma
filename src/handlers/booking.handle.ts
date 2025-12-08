import prisma from "../utils/prisma";
import { Request, Response } from "express";
const jwt = require("jsonwebtoken");

export async function countCustomers(req: Request, res: Response) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: "Authorization token missing" });

        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
        const secret = process.env.SECRET_KEY;

        let decoded: any;
        try {
            decoded = jwt.verify(token, secret);
        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const userId = Number(decoded?.id);
        const customers = await prisma.order.findMany({
            where: {
                items: {
                    some: {
                        departure: {
                            tour: {
                                createdBy: userId,
                            },
                        },
                    },
                },
                payments: {
                    some: {
                        status: "SUCCESS",
                    },
                },
            },
            select: {
                userId: true,
            },
            distinct: ["userId"],
        });

        return res.status(200).json({ count: customers.length });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function countAllCustomers(req: Request, res: Response) {
    try {
        const customers = await prisma.payment.findMany({
            where: {
                status: "SUCCESS",
            },
            select: {
                userId: true,
            },
            distinct: ["userId"],
        });

        const countAllPaidCustomers = customers.length;
        return res.status(200).json({ count: countAllPaidCustomers });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function countBookingSuccess(req: Request, res: Response) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: "Authorization token missing" });

        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
        const secret = process.env.SECRET_KEY;

        let decoded: any;
        try {
            decoded = jwt.verify(token, secret);
        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const userId = Number(decoded?.id);

        const bookings = await prisma.payment.count({
            where: {
                status: "SUCCESS",
                order: {
                    items: {
                        some: {
                            departure: {
                                tour: {
                                    createdBy: userId,
                                },
                            },
                        },
                    },
                },
            },
        });

        return res.status(200).json({ count: bookings });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function countAllBookingsSuccess(req: Request, res: Response) {
    try {
        const bookings = await prisma.payment.count({
            where: {
                status: "SUCCESS",
            },
        });
        return res.status(200).json({ count: bookings });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getMonthlyRevenueAll(req: Request, res: Response) {
    try {
        const month = Number(req.query.month);
        const year = Number(req.query.year || new Date().getFullYear());

        if (!month || month < 1 || month > 12) {
            return res.status(400).json({ message: "Invalid month (1-12)" });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const payments = await prisma.payment.findMany({
            where: {
                status: "SUCCESS",
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                amount: true,
            },
        });

        const totalRevenue = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
        const count = payments.length;

        return res.status(200).json({
            month,
            year,
            count,
            totalRevenue,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getMonthlyRevenue(req: Request, res: Response) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: "Authorization token missing" });

        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
        const secret = process.env.SECRET_KEY;

        let decoded: any;
        try {
            decoded = jwt.verify(token, secret);
        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const userId = Number(decoded?.id);
        const month = Number(req.query.month);
        const year = Number(req.query.year || new Date().getFullYear());

        if (!month || month < 1 || month > 12) {
            return res.status(400).json({ message: "Invalid month (1-12)" });
        }

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        const payments = await prisma.payment.findMany({
            where: {
                status: "SUCCESS",
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
                order: {
                    items: {
                        some: {
                            departure: {
                                tour: {
                                    createdBy: userId,
                                },
                            },
                        },
                    },
                },
            },
            select: {
                amount: true,
            },
        });

        const totalRevenue = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
        const count = payments.length;

        return res.status(200).json({
            month,
            year,
            count,
            totalRevenue,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getTopTourAll(req: Request, res: Response) {
    try {
        const limit = Number(req.query.limit || 10);

        const topTours = await prisma.orderItem.groupBy({
            by: ["tourDepartureId"],
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: "desc",
                },
            },
            take: limit,
        });

        const tourDetails = await Promise.all(
            topTours.map(async (item) => {
                const departure = await prisma.tourDeparture.findUnique({
                    where: { id: item.tourDepartureId },
                    include: {
                        tour: {
                            include: {
                                location: true,
                            },
                        },
                    },
                });

                return {
                    tourId: departure?.tour.id,
                    tourName: departure?.tour.name,
                    location: departure?.tour.location?.name || null,
                    bookingCount: item._count.id,
                };
            })
        );

        const tourMap = new Map();
        tourDetails.forEach((tour) => {
            if (tour.tourId) {
                if (tourMap.has(tour.tourId)) {
                    tourMap.get(tour.tourId).bookingCount += tour.bookingCount;
                } else {
                    tourMap.set(tour.tourId, tour);
                }
            }
        });

        const result = Array.from(tourMap.values())
            .sort((a, b) => b.bookingCount - a.bookingCount)
            .slice(0, limit);

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getTopTour(req: Request, res: Response) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: "Authorization token missing" });

        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
        const secret = process.env.SECRET_KEY;

        let decoded: any;
        try {
            decoded = jwt.verify(token, secret);
        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const userId = Number(decoded?.id);
        const limit = Number(req.query.limit || 10);

        const topTours = await prisma.orderItem.groupBy({
            by: ["tourDepartureId"],
            _count: {
                id: true,
            },
            orderBy: {
                _count: {
                    id: "desc",
                },
            },
        });

        const tourDetails = await Promise.all(
            topTours.map(async (item) => {
                const departure = await prisma.tourDeparture.findUnique({
                    where: { id: item.tourDepartureId },
                    include: {
                        tour: {
                            include: {
                                location: true,
                            },
                        },
                    },
                });

                if (departure?.tour.createdBy === userId) {
                    return {
                        tourId: departure.tour.id,
                        tourName: departure.tour.name,
                        location: departure.tour.location?.name || null,
                        bookingCount: item._count.id,
                    };
                }
                return null;
            })
        );

        const validTours = tourDetails.filter((tour) => tour !== null);
        const tourMap = new Map();
        validTours.forEach((tour) => {
            if (tour && tour.tourId) {
                if (tourMap.has(tour.tourId)) {
                    tourMap.get(tour.tourId).bookingCount += tour.bookingCount;
                } else {
                    tourMap.set(tour.tourId, tour);
                }
            }
        });

        const result = Array.from(tourMap.values())
            .sort((a, b) => b.bookingCount - a.bookingCount)
            .slice(0, limit);

        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}