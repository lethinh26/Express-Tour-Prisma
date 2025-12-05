import { Request, Response } from "express";
import prisma from "../utils/prisma";

export async function createPromotion(req: Request, res: Response) {
  try {
    const {
      discount = 0,
      amount = 0,
      code,
      type,
      name,
      description,
      startAt,
      endAt,
    } = req.body;

    if (!code || !type || !name || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (discount < 0 || amount < 0) {
      return res.status(400).json({ message: "discount/amount must be >= 0" });
    }

    const promotion = await prisma.promotion.create({
      data: {
        discount,
        amount,
        code,
        type,
        name,
        description,
        startAt: startAt ? new Date(startAt) : undefined,
        endAt: endAt ? new Date(endAt) : null,
      },
    });

    return res.status(201).json(promotion);
  } catch (err: any) {
    console.error("createPromotion error:", err);
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Promotion code already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updatePromotion(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const {
      discount,
      amount,
      code,
      type,
      name,
      description,
      startAt,
      endAt,
    } = req.body;
    console.log(description);
    

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid promotion id" });
    }

    const updateData: any = {};
    if (discount !== undefined) {
      if (discount < 0) {
        return res.status(400).json({ message: "discount must be >= 0" });
      }
      updateData.discount = discount;
    }
    if (amount !== undefined) {
      if (amount < 0) {
        return res.status(400).json({ message: "amount must be >= 0" });
      }
      updateData.amount = amount;
    }
    if (code) updateData.code = code;
    if (type) updateData.type = type;
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (startAt) updateData.startAt = new Date(startAt);
    if (endAt !== undefined) updateData.endAt = endAt ? new Date(endAt) : null;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "At least one field is required to update" });
    }

    const promotion = await prisma.promotion.update({
      where: { id },
      data: updateData,
    });

    return res.json(promotion);
  } catch (err: any) {
    console.error("updatePromotion error:", err);
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Promotion not found" });
    }
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Promotion code already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function checkPromotionUsable(req: Request, res: Response) {
  try {
    const { code } = req.body;
    const userId = (req as any).user?.id || req.body.userId;

    if (!code || !userId) {
      return res.status(400).json({ message: "Missing code or used" });
    }

    const promotion = await prisma.promotion.findUnique({
      where: { code },
    });

    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    const promotionId = promotion.id;

    const now = new Date();
    if (promotion.startAt > now || (promotion.endAt && promotion.endAt < now)) {
      return res.status(400).json({ message: "Promotion is expired or not started yet" });
    }

    if (promotion.type === "NEW") {
      const ordersCount = await prisma.order.count({
        where: {
          userId: userId,
        },
      });

      if (ordersCount > 0) {
        return res.status(400).json({ message: "Promotion only for new users" });
      }
    }

    const used = await prisma.promotionUsage.findUnique({
      where: {
        userId_promotionId: {
          userId,
          promotionId,
        },
      },
    });

    if (used) {
      return res.status(400).json({ message: "You already used this promotion" });
    }

    return res.json({
      usable: true,
      promotion: {
        id: promotion.id,
        code: promotion.code,
        discount: promotion.discount,
        amount: promotion.amount,
        type: promotion.type,
        name: promotion.name,
        description: promotion.description,
      },
    });
  } catch (err) {
    console.error("checkPromotionUsable error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPromotionByUserId(req: Request, res: Response) {
  try {
    const userId = Number(req.params.userId || req.query.userId);

    if (!userId || Number.isNaN(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const now = new Date();

    const usedPromotions = await prisma.promotionUsage.findMany({
      where: { userId },
      select: { promotionId: true },
    });

    const usedIds = usedPromotions.map((u) => u.promotionId);

    const availablePromotions = await prisma.promotion.findMany({
      where: {
        id: { notIn: usedIds },
        startAt: { lte: now },
        OR: [
          { endAt: null },
          { endAt: { gte: now } }
        ]
      },
      orderBy: { startAt: "asc" },
    });

    return res.json(availablePromotions);
  } catch (err) {
    console.error("getPromotionByUserId error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function deletePromotionById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id || req.query.id);

    if (!id || Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid promotion id" });
    }

    const promotion = await prisma.promotion.delete({
      where: { id },
    });

    return res.json({
      message: "Promotion deleted",
      promotion,
    });
  } catch (err: any) {
    console.error("deletePromotionById error:", err);

    if (err.code === "P2025") {
      return res.status(404).json({ message: "Promotion not found" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function usePromotion(req: Request, res: Response) {
  try {
    const { code } = req.body;
    const userId = (req as any).user?.id || req.body.userId; 

    if (!code || !userId) {
      return res.status(400).json({ message: "Missing code or userId" });
    }

    const promotion = await prisma.promotion.findUnique({
      where: { code },
    });

    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    const now = new Date();
    if (promotion.startAt > now || (promotion.endAt && promotion.endAt < now)) {
      return res.status(400).json({ message: "Promotion is expired or not active" });
    }

    if (promotion.type === "NEW") {
      const ordersCount = await prisma.order.count({
        where: {
          userId: Number(userId),
        },
      });

      if (ordersCount > 0) {
        return res.status(400).json({ message: "Promotion only for new users" });
      }
    }

    const existedUsage = await prisma.promotionUsage.findUnique({
      where: {
        userId_promotionId: {
          userId: Number(userId),
          promotionId: promotion.id,
        },
      },
    });

    if (existedUsage) {
      return res.status(400).json({ message: "You already used this promotion" });
    }

    const usage = await prisma.promotionUsage.create({
      data: {
        userId: Number(userId),
        promotionId: promotion.id,
      },
    });

    return res.json({
      message: "Promotion applied successfully",
      usage,
      promotion: {
        id: promotion.id,
        code: promotion.code,
        discount: promotion.discount,
        amount: promotion.amount,
        type: promotion.type,
        name: promotion.name,
        description: promotion.description,
      },
    });
  } catch (err) {
    console.error("usePromotion error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPromotion(req: Request, res: Response) {
  try {
    const promotions = await prisma.promotion.findMany({
      orderBy: {
        startAt: "asc",
      },
    });

    return res.json(promotions);
  } catch (err) {
    console.error("getPromotion error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}