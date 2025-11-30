import { Request, Response } from "express";
import prisma from "../utils/prisma";
import argon2 from "argon2";
const jwt = require("jsonwebtoken");

export async function createAccount(req: Request, res: Response) {
    try {
        const { name, email, passwordHash, role } = req.body;
        if (!name || !email || !passwordHash || !role) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const hasedPass = await argon2.hash(passwordHash);

        const account = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash: hasedPass,
                role,
                createdAt: new Date(),
            },
        });

        const token = jwt.sign({ id: account.id }, process.env.SECRET_KEY, { expiresIn: "24h" });

        return res.status(201).json({ account, token });
    } catch (error: any) {
        if (error.code === "P2002") {
            return res.status(409).json({ message: "Email already exists" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, passwordHash } = req.body;
        if (!email || !passwordHash) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ message: "Email or password is not correct" });
        }

        const isPassValid = await argon2.verify(user.passwordHash, passwordHash);

        if (!isPassValid) {
            return res.status(404).json({ message: "Email or password is not correct" });
        }

        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: "24h" });
        return res.json({ user, token });
    } catch (error: any) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getUser(req: Request, res: Response) {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ message: "Missing token" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({ user });
    } catch (error: any) {
        return res.status(500).json({ message: "Internal server error" });
    }
}

        