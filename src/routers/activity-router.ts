import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getEventDays } from "@/controllers";

const activitiesRouter = Router();

activitiesRouter
  .all("/*", authenticateToken)
  .get("/", getEventDays);

export { activitiesRouter };
