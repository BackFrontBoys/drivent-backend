import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError, conflictError } from "@/errors";
import activityBookingRepository from "@/repositories/activitiesBooking-repository";
import { redisClient } from "../../utils/redis-service";

async function createActivitiesBooking(userId: number, activityId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED") {
    throw notFoundError();
  }

  const activity = await activityBookingRepository.findActivitiesById(activityId);

  if (!activity) {
    throw notFoundError();
  }

  const activityBooking = await activityBookingRepository.listActivityBookingByActivityId(activityId);
  const vagas = Number(activity.maxQuantity) - Number(activityBooking.length );
  if(vagas < 1) {
    throw { name: "BAD REQUEST" };
  }

  if (await redisClient.exists(`activitiesBooking-${userId}-${activityId}`)) {
    throw conflictError("subscribed user");
  }

  const userBooking = await activityBookingRepository.findActivitiesBooking(userId, activityId);

  if (userBooking) {
    throw conflictError("subscribed user");
  }

  const booking = await activityBookingRepository.createActivityBooking(userId, activityId);
  await redisClient.set(`activitiesBooking-${userId}-${activityId}`, JSON.stringify(booking));
  return booking;
}

const activitiesBookingService = {
  createActivitiesBooking
};

export default activitiesBookingService;
