import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { bookingActivity } from "@/controllers";

const activitiesBookingRouter = Router();

activitiesBookingRouter
  .all("/*", authenticateToken)
  .post("", bookingActivity );

export { activitiesBookingRouter };
