import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import activitiesBookingService from "@/services/activitiesBooking-service";
import httpStatus from "http-status";

export async function bookingActivity(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const activityId = Number(req.body.activityId);

  try {
    const booking = await activitiesBookingService.createActivitiesBooking(Number(userId), activityId);

    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if(error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if(error.name === "ConflictError") {
      return res.sendStatus(httpStatus.CONFLICT);
    }
    if(error.name === "BAD REQUEST") {
      return res.sendStatus(httpStatus.CONFLICT);
    }
  }
}
