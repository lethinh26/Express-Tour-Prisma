import { Request, Response } from "express";
import prisma from "../utils/prisma";

export async function getTourDeparture(req: Request, res: Response) {
    try {
        const tourDeparture = await prisma.tourDeparture.findMany({});

        res.json(tourDeparture || []);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error", data: [] });
    }
}

export async function getTourDepartureByTourId(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const tourDepartureById = await prisma.tourDeparture.findMany({
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

export async function updateTourDeparture(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        const { departure, price, capacity, availableSeats, tourId } = req.body;
        
        const updateData: any = {}
        if (departure !== undefined) updateData.departure = new Date(departure)
        if (price !== undefined) updateData.price = Number(price)
        if (capacity !== undefined) updateData.capacity = Number(capacity)
        if (availableSeats !== undefined) updateData.availableSeats = Number(availableSeats)
        if (tourId !== undefined) updateData.tourId = Number(tourId)

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({message: 'At least one field is required to update'})
        }

        const tourDeparture = await prisma.tourDeparture.update({
            where: { id },
            data: updateData
        });

        res.json(tourDeparture);

    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2025') {
            return res.status(404).json({message: 'TourDeparture not found'})
        }
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteTourDeparture(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);

        await prisma.tourDeparture.delete({
            where: { id }
        });

        res.json({message: 'TourDeparture deleted successfully'});

    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2025') {
            return res.status(404).json({message: 'TourDeparture not found'})
        }
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteTourDepartureByTourId(req: Request, res: Response) {
    try {
        const tourId = Number(req.params.tourId);

        if (isNaN(tourId)) {
            return res.status(400).json({ message: 'Invalid tour ID' });
        }

        const departures = await prisma.tourDeparture.findMany({
            where: { tourId },
            include: {
                items: true
            }
        });

        if (departures.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy departure của tour này' });
        }

        const departuresWithOrders = departures.filter(dep => dep.items.length > 0);
        
        if (departuresWithOrders.length > 0) {
            const departureDate = new Date(departuresWithOrders[0].departure).toLocaleDateString('vi-VN');
            return res.status(400).json({ 
                message: `Không thể xóa vì đã có order ở departure ngày ${departureDate}` 
            });
        }

        const result = await prisma.tourDeparture.deleteMany({
            where: { tourId }
        });

        res.json({
            message: 'Đã xóa tất cả lịch khởi hành thành công',
            count: result.count
        });

    } catch (error: any) {
        console.error('Error in deleteTourDepartureByTourId:', {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
        res.status(500).json({ message: "Internal server error" });
    }
}
