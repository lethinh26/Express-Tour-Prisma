import { Router } from "express";
import { countAllBookingsSuccess, countAllCustomers, countBookingSuccess, countCustomers, getMonthlyRevenue, getMonthlyRevenueAll, getTopTour, getTopTourAll } from "../handlers/booking.handle";

const router = Router();
router.get("/countCustomers", countCustomers);
router.get("/countAllCustomers", countAllCustomers);
router.get("/countBookingSuccess", countBookingSuccess);
router.get("/countAllBookingsSuccess", countAllBookingsSuccess);
router.get("/monthlyRevenue", getMonthlyRevenue);
router.get("/monthlyRevenueAll", getMonthlyRevenueAll);
router.get("/topTourAll", getTopTourAll);
router.get("/topTour", getTopTour);

export default router;