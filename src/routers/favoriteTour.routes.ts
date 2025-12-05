import { Router } from "express";
import { addFavoriteTour, deleteFavoriteTour, getFavoriteTours } from "../handlers/favoriteTour.handle";

const router = Router();
router.get("/:token", getFavoriteTours);
router.post("/", addFavoriteTour);
router.delete("/", deleteFavoriteTour);

export default router;