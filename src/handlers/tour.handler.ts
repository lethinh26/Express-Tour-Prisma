import { Request, Response } from 'express';
import prisma from '../utils/prisma';
const jwt = require('jsonwebtoken');

export async function getTours(req: Request, res: Response) {
    try {
        const tours = await prisma.tour.findMany();
        res.json(tours);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
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

        await prisma.tour.delete({
            where: { id }
        })

        res.json({message: 'Tour deleted successfully'})

    } catch (error: any) {
        console.error(error)
        if (error.code === 'P2025') {
            return res.status(404).json({message: 'Tour not found'})
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