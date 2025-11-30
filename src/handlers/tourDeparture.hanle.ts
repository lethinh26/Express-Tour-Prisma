import { Request, Response } from "express";
import prisma from "../utils/prisma";

export async function getTourDeparture(req: Request, res: Response) {
    try {
        const tourDeparture = await prisma.tourDeparture.findMany({});

        res.json(tourDeparture);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getTourDepartureByTourId(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const tourDepartureById = await prisma.tourDeparture.findFirst({
            where: { tourId: id },
        });

        if (!tourDepartureById) {
            return res.status(404).json({ message: "Tour Departure not found" });
        }

        res.json(tourDepartureById);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function createTourDeparture(req: Request, res: Response) {
    try {
        const { departure, price, capacity, availableSeats, tourId } = req.body;

        if (!departure || !price || !capacity || !availableSeats || !tourId) {
            return res.status(404).json({ message: "Missing required fields" });
        }

        const tourDeparture = await prisma.tourDeparture.create({
            data: {
                departure,
                price,
                capacity,
                availableSeats,
                tourId,
            },
        });

        res.status(201).json(tourDeparture);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Invalid category" });
    }
}
