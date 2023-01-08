import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import activityService from "@/services/activities-service";
import httpStatus from "http-status";

export async function getEventDays(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const eventDays = await activityService.getEventDays(Number(userId));

    return res.status(httpStatus.OK).send(eventDays);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getEvents(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  //const userId = 130;
  const eventDayId = Number(req.query.eventDayId);

  try {
    const events = await activityService.getEvents(Number(userId), eventDayId);

    return res.status(httpStatus.OK).send(events);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
