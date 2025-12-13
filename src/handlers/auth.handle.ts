import { Request, Response } from "express";
import prisma from "../utils/prisma";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../utils/email";

export async function createAccount(req: Request, res: Response) {
    try {
        const { name, email, password, phoneNumber } = req.body;
        if (!name || !email || !password || !phoneNumber) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const hasedPass = await argon2.hash(password);
        const account = await prisma.user.create({
            data: {
                name,
                email,
                phoneNumber,
                passwordHash: hasedPass,
                role: "USER",
                createdAt: new Date(),
            },
        });
        const {passwordHash, ...acc} = account 
        const token = jwt.sign({ id: account.id }, process.env.SECRET_KEY, { expiresIn: "24h" });

        // Send welcome email (non-blocking)
        sendWelcomeEmail(account.email, account.name).catch(err => {
            console.error('Failed to send welcome email:', err);
        });

        return res.status(201).json({ account: acc, token });
    } catch (error: any) {
        if (error.code === "P2002") {
            return res.status(409).json({ message: "Email already exists" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ message: "Email or password is not correct" });
        }

        const isPassValid = await argon2.verify(user.passwordHash, password);

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

        if (!process.env.SECRET_KEY) {
            return res.status(500).json({ message: "Missing JWT secret key" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY) as JwtPayload;

        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: "Invalid token payload" });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { passwordHash, ...rest } = user;
        return res.json(rest);

    } catch (error: any) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

export async function changePassword(req: Request, res: Response) {
    try {
        const { token, oldPassword, newPassword } = req.body;

        if (!token || !oldPassword || !newPassword) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY as string);
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isOldPassValid = await argon2.verify(user.passwordHash, oldPassword);
        console.log(isOldPassValid);
        

        if (!isOldPassValid) {
            return res.status(400).json({ message: "Old password is not correct" });
        }

        if (oldPassword === newPassword) {
            return res.status(400).json({ message: "New password must be different from old password" });
        }

        const newHashedPass = await argon2.hash(newPassword);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash: newHashedPass,
            },
        });

        return res.status(200).json({ message: "Password changed successfully" });

    } catch (error: any) {
        console.log("Change Password Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteAccount(req: Request, res: Response) {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ message: "Missing token" });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY as string);
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Delete user account
        await prisma.user.delete({
            where: { id: user.id },
        });

        return res.status(200).json({ message: "Account deleted successfully" });

    } catch (error: any) {
        console.log("Delete Account Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
