import { Request, Response } from "express";
import prisma from "../utils/prisma";

export async function getAllImage(req: Request, res: Response) {
    try {
        const tourImages = await prisma.tourImage.findMany({
            orderBy: [
                { tourId: 'asc' },
                { position: 'asc' }
            ]
        });
        res.json(tourImages || [])
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error', data: []})
    }
}

export async function getImageTour(req: Request, res: Response) {
    try {
        const tourImage = await prisma.tourImage.findMany({
            where: {position: 0}
        });
        res.json(tourImage)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error'})
    }
}

export async function getTourImgFirst(req: Request, res: Response) {
    try {
        const tourId = Number(req.params.id)

        const tourImage = await prisma.tourImage.findMany({
            where: { tourId }
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

export async function updateTourImage(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        const { url, position, tourId } = req.body
        
        const updateData: any = {}
        if (url) updateData.url = url
        if (position !== undefined) updateData.position = position
        if (tourId) updateData.tourId = tourId

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({message: 'At least one field is required to update'})
        }

        const tourImage = await prisma.tourImage.update({
            where: { id },
            data: updateData
        })

        res.json(tourImage)

    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2025') {
            return res.status(404).json({message: 'TourImage not found'})
        }
        res.status(500).json({message: 'Internal server error'})
    }
}

export async function deleteTourImage(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)

        await prisma.tourImage.delete({
            where: { id }
        })

        res.json({message: 'TourImage deleted successfully'})

    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2025') {
            return res.status(404).json({message: 'TourImage not found'})
        }
        res.status(500).json({message: 'Internal server error'})
    }
}