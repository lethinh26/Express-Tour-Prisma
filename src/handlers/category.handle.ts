import { Request, Response } from "express";
import prisma from "../utils/prisma";

export async function getCategory(req: Request, res: Response) {
    try {
        const category = await prisma.category.findMany({})
        
        res.json(category || [])
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Internal server error', data: []})
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

export async function updateCategory(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)
        const {name, description} = req.body
        
        if (!name && !description) {
            return res.status(400).json({message: 'At least one field is required to update'})
        }

        const category = await prisma.category.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(description && { description })
            }
        })

        res.json(category)

    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2025') {
            return res.status(404).json({message: 'Category not found'})
        }
        res.status(500).json({message: 'Internal server error'})
    }
}

export async function deleteCategory(req: Request, res: Response) {
    try {
        const id = Number(req.params.id)

        await prisma.category.delete({
            where: { id }
        })

        res.json({message: 'Category deleted successfully'})

    } catch (error: any) {
        console.error(error);
        if (error.code === 'P2025') {
            return res.status(404).json({message: 'Category not found'})
        }
        res.status(500).json({message: 'Internal server error'})
    }
}