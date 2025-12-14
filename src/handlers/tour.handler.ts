import { Request, Response } from 'express';
import prisma from '../utils/prisma';
const jwt = require('jsonwebtoken');

export async function getTours(req: Request, res: Response) {
    try {
        const { 
            page = '1', 
            pageSize = '6', 
            categoryId, 
            minPrice, 
            maxPrice, 
            search,
            location,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const pageNum = parseInt(page as string);
        const pageSizeNum = parseInt(pageSize as string);
        const skip = (pageNum - 1) * pageSizeNum;

        const where: any = {};
        
        if (categoryId) {
            where.categoryId = parseInt(categoryId as string);
        }
        
        if (search) {
            where.name = {
                contains: search as string
            };
        }

        if (location) {
            where.address = {
                contains: location as string
            };
        }

        const [tours, total] = await Promise.all([
            prisma.tour.findMany({
                where,
                skip,
                take: pageSizeNum,
                include: {
                    reviews: {
                        select: {
                            rating: true
                        }
                    }
                },
                orderBy: {
                    [sortBy as string]: sortOrder as 'asc' | 'desc'
                }
            }),
            prisma.tour.count({ where })
        ]);

        const toursWithRating = tours.map(tour => {
            const totalRating = tour.reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = tour.reviews.length > 0 ? totalRating / tour.reviews.length : 0;
            const { reviews, ...tourWithoutReviews } = tour;
            
            return {
                ...tourWithoutReviews,
                averageRating: Number(averageRating.toFixed(1)),
                totalReviews: tour.reviews.length
            };
        });

        let filteredTours = toursWithRating;
        if (minPrice || maxPrice) {
            filteredTours = toursWithRating.filter(tour => {
                const price = Number(tour.basePrice);
                const min = minPrice ? parseFloat(minPrice as string) : 0;
                const max = maxPrice ? parseFloat(maxPrice as string) : Infinity;
                return price >= min && price <= max;
            });
        }

        res.json({
            data: filteredTours,
            pagination: {
                page: pageNum,
                pageSize: pageSizeNum,
                total,
                totalPages: Math.ceil(total / pageSizeNum)
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error', data: [] });
    }
}

export async function getTourById(req: Request, res: Response) {
    try{
        const idParame = Number(req.params.id)

        const tour = await prisma.tour.findUnique({
            where: {id : idParame}
        })
        if(!tour){
            return res.status(404).json({ message: 'Tour not found'})
        }
        res.json(tour)
    }catch(err){
        console.error(err)
        res.status(500).json({ error: 'Internal server error'})
    }
}

export async function createTour(req: Request, res: Response){

    try {
        const { name, description, basePrice, discount, categoryId, information, address, locationId, createdBy } = req.body
        
        if (!name || !description || !basePrice || !categoryId || !createdBy){
            return res.status(400).json({message: 'Missing required fields'})
        }

        const tour = await prisma.tour.create({
            data: {
                name,
                description,
                basePrice,
                discount,
                categoryId,
                information,
                address,
                locationId,
                createdBy
            }
        })
        res.status(201).json(tour)

    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Internal server error'})
    }
}

export async function updateTour(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        const { name, description, basePrice, discount, categoryId, information, address, locationId } = req.body
        
        const updateData: any = {}
        if (name) updateData.name = name
        if (description) updateData.description = description
        if (basePrice) updateData.basePrice = basePrice
        if (discount !== undefined) updateData.discount = discount
        if (categoryId) updateData.categoryId = categoryId
        if (information) updateData.information = information
        if (address) updateData.address = address
        if (locationId) updateData.locationId = locationId

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({message: 'At least one field is required to update'})
        }

        const tour = await prisma.tour.update({
            where: { id },
            data: updateData
        })

        res.json(tour)

    } catch (error: any) {
        console.error(error)
        if (error.code === 'P2025') {
            return res.status(404).json({message: 'Tour not found'})
        }
        res.status(500).json({message: 'Internal server error'})
    }
}

export async function deleteTour(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)

        const departures = await prisma.tourDeparture.findMany({
            where: { tourId: id },
            include: {
                items: true
            }
        });

        const departuresWithOrders = departures.filter(dep => dep.items.length > 0);
        
        if (departuresWithOrders.length > 0) {
            const departureDate = new Date(departuresWithOrders[0].departure).toLocaleDateString('vi-VN');
            return res.status(400).json({ 
                message: `Không thể xóa tour vì đã có order ở departure ngày ${departureDate}` 
            });
        }

        await prisma.$transaction([
            prisma.tourImage.deleteMany({ where: { tourId: id } }),
            
            prisma.tourFavorited.deleteMany({ where: { tourId: id } }),
            
            prisma.review.deleteMany({ where: { tourId: id } }),
            
            prisma.tourDeparture.deleteMany({ where: { tourId: id } }),
            
            prisma.tour.delete({ where: { id } })
        ])

        res.json({message: 'Tour deleted successfully'})

    } catch (error: any) {
        console.error(error)
        if (error.code === 'P2025') {
            return res.status(404).json({message: 'Tour not found'})
        }
        if (error.code === 'P2003') {
            return res.status(400).json({message: 'Không thể xoá tour đã có orders'})
        }
        res.status(500).json({message: 'Internal server error'})
    }
}

export async function countTour(req: Request, res: Response) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: 'Authorization token missing' });

        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
        const secret = process.env.JWT_SECRET;

        let decoded: any;
        try {
            decoded = jwt.verify(token, secret);
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const userId = decoded?.id

        const count = await prisma.tour.count({
            where: { createdBy: Number(userId) }
        });

        return res.json({ count });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function countAllTours(req: Request, res: Response) {
    try {
        const count = await prisma.tour.count();
        return res.json({ count });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function createReview(req: Request, res: Response) {
    try {
        const { tourId, userId, rating, comment, orderId } = req.body;

        if (!tourId || !userId || !rating || !orderId) {
            return res.status(400).json({ message: 'Missing required fields: tourId, userId, rating, orderId' });
        }

        if (rating < 1 || rating > 10) {
            return res.status(400).json({ message: 'Rating must be between 1 and 10' });
        }

        const order = await prisma.order.findFirst({
            where: {
                id: Number(orderId),
                userId: Number(userId),
                status: 'PAID'
            }
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found or not paid' });
        }

        const existingReview = await prisma.review.findUnique({
            where: {
                orderId_userId: {
                    orderId: Number(orderId),
                    userId: Number(userId)
                }
            }
        });

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this order' });
        }

        const review = await prisma.review.create({
            data: {
                tourId: Number(tourId),
                userId: Number(userId),
                orderId: Number(orderId),
                rating: Number(rating),
                comment: comment || null
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                tour: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        res.status(201).json(review);
    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2003') {
            return res.status(404).json({ message: 'Tour or User not found' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getReviews(req: Request, res: Response) {
    try {
        const reviews = await prisma.review.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                tour: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(reviews || []);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error', data: [] });
    }
}

export async function getReviewsByTourId(req: Request, res: Response) {
    try {
        const tourId = Number(req.params.tourId);

        if (isNaN(tourId)) {
            return res.status(400).json({ message: 'Invalid tour ID' });
        }

        const reviews = await prisma.review.findMany({
            where: {
                tourId: tourId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

        res.json({
            reviews: reviews || [],
            totalReviews: reviews.length,
            averageRating: averageRating
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error', data: [] });
    }
}

export async function deleteReview(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid review ID' });
        }

        await prisma.review.delete({
            where: { id }
        });

        res.json({ message: 'Review deleted successfully' });
    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getUserReviewForTour(req: Request, res: Response) {
    try {
        const tourId = Number(req.params.tourId);
        const userId = Number(req.params.userId);

        if (isNaN(tourId) || isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid tour ID or user ID' });
        }

        const review = await prisma.review.findFirst({
            where: {
                tourId: tourId,
                userId: userId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        if (!review) {
            return res.json({ hasReviewed: false, review: null });
        }

        res.json({ hasReviewed: true, review: review });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getOrderReview(req: Request, res: Response) {
    try {
        const orderId = Number(req.params.orderId);
        const userId = Number(req.params.userId);

        if (isNaN(orderId) || isNaN(userId)) {
            return res.status(400).json({ message: 'Invalid order ID or user ID' });
        }

        const review = await prisma.review.findUnique({
            where: {
                orderId_userId: {
                    orderId: orderId,
                    userId: userId
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        if (!review) {
            return res.json({ hasReviewed: false, review: null });
        }

        res.json({ hasReviewed: true, review: review });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}