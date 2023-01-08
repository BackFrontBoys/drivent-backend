import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getEventDays, getEvents } from "@/controllers";

const activitiesRouter = Router();

activitiesRouter
  // .all("/*", authenticateToken)
  .get("/", getEventDays)
  .get("/events", getEvents);

export { activitiesRouter };
