import { Request, Response } from "express";
import prisma from "../utils/prisma";

export async function getCategory(req: Request, res: Response) {
    try {
        const category = await prisma.category.findMany({})
        res.json(category)
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'})
    }
}

export async function getCategoryById(req: Request, res: Response) {
    try {
        const id = Number(req.params.idCategory)
        const categoryById = await prisma.category.findUnique(
            {
                where: { id }
            }
        )

        if (!categoryById){
            return res.status(404).json({message: 'Category not found'})
        }

        res.json(categoryById)

    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error'})
    }
}

export async function createCategory(req: Request, res: Response) {
    try {
        const {name, description} = req.body
        
        if (!name || !description) {
            return res.status(404).json({message: 'Missing required fields'})
        }

        const category = await prisma.category.create({
            data: {
                name,
                description
            }
        })

        res.status(201).json(category)

    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Invalid category'})
    }
}