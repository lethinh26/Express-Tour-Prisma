import { Request, Response } from "express";
import prisma from "../utils/prisma";
import argon2 from "argon2";
const jwt = require("jsonwebtoken");

export async function getFavoriteTours(req: Request, res: Response) {
    try {
        const token = req.params.token;
        if (!token) {
            return res.status(400).json({ message: "Missing required fields" })
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }
        // lay ra tourId theo id user
        const favoriteTour = await prisma.tourFavorited.findMany({
            where: { userId: decoded.id }
        })
        if (!favoriteTour) {
            return res.status(404).json({ message: "No favorite tours found" })
        }
        // lay ra tat ca tour theo tourId
        const tourFavorited = await prisma.tour.findMany({
            where: { id: { in: favoriteTour.map(ft => ft.tourId) } }
        })
        return res.status(200).json({ tourFavorited })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function addFavoriteTour(req: Request, res: Response) {
    try {
        const {token, tourId} = req.body;
        if(!token|| !tourId){
            return res.status(400).json({message: "Missing required fields"})
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        if(!decoded){
            return res.status(401).json({message: "Invalid token"})
        }
        const favoriteTour = await prisma.tourFavorited.create({
            data: {
                userId: decoded.id,
                tourId: tourId
            }
        })
        return res.status(201).json({message: "Favorite Tour Added SuccessFully", favoriteTour})
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

export async function deleteFavoriteTour(req: Request, res: Response) {
    try {
        const {token, tourId} = req.body
        if(!token||!tourId){
            return res.status(400).json({message: "Missing required fields"})
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        if(!decoded){
            return res.status(401).json({message: "Invalid token"})
        }
        const favoriteTour = await prisma.tourFavorited.deleteMany({
            where: {userId: decoded.id , tourId: tourId}
        })
        return res.status(200).json({message: "Favorite Tour Deleted Successfully", favoriteTour})
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" })
    }
}