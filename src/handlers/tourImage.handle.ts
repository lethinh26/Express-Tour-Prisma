import { Request, Response } from "express";
import prisma from "../utils/prisma";

export async function getImageTour(req: Request, res: Response) {
    try {
        const tourImage = await prisma.tourImage.findMany();
        res.json(tourImage)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error'})
    }
}

export async function getTourImgFirst(req: Request, res: Response) {
    try {
        const tourId = Number(req.params.tourId)

        const tourImage = await prisma.tourImage.findMany({
            where: { tourId, position: 0 }
        })

        if (!tourImage || !tourImage.length) {
            return res.status(404).json({ message: "Image not found" })
        }

        res.json(tourImage)
    }catch(error){
        console.error(error);
        res.status(500).json({message: 'Internal server error'})
    }
}

export async function createTourImage(req: Request, res: Response) {
    try {
        const { url, position, tourId } = req.body

        if (!url || !position || !tourId){
            return res.status(404).json({message: "Missing tourImage fields"})
        }

        const tourImage = await prisma.tourImage.create({
            data: {
                url,
                position,
                tourId
            }
        })
        
        res.status(201).json(tourImage)

    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Internal server error'})
    }
}