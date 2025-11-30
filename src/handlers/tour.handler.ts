import { Request, Response } from 'express';
import prisma from '../utils/prisma';

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
        const {name, description, basePrice, discount, categoryId} = req.body
        
        if (!name || !description || !basePrice || !categoryId){
            return res.status(400).json({message: 'Missing required fields'})
        }

        const tour = await prisma.tour.create({
            data: {
                name,
                description,
                basePrice,
                discount,
                categoryId
            }
        })
        
        res.status(201).json(tour)

    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Internal server error'})
    }
}