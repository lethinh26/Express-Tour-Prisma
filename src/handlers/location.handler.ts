import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export async function getLocation(req: Request, res: Response) {
    try {
        const locations = await prisma.location.findMany();
        res.json(locations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export async function getLocationById(req: Request, res: Response) {
    try {
        const idParame = Number(req.params.id)

        const location = await prisma.location.findUnique({
            where: { id: idParame }
        })
        if (!location) {
            return res.status(404).json({ message: 'Tour not found' })
        }
        res.json(location)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' })
    }
}

export async function createLocation(req: Request, res: Response) {

    try {
        // const { name, description, basePrice, discount, categoryId, information, address, locationId } = req.body
        const {name} = req.body
        if (!name) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        const location = await prisma.location.create({
            data: {
                name
            }
        })
        res.status(201).json(location)

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}