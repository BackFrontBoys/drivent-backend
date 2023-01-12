import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import { cannotListActivitiesError } from "@/errors/cannot-list-activities";
import activityRepository from "@/repositories/activities-repository";
import { createClient } from "redis";

async function getEventDays(userId: number) {
  const redisClient = createClient();
  await redisClient.connect();
  
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket) {
    throw cannotListActivitiesError();
  }

  if (await redisClient.exists("activities")) {
    const cache = await redisClient.get("activities");
    return JSON.parse(cache);
  }

  const eventDays = await activityRepository.findEventDays();

  if (eventDays.length === 0) {
    throw notFoundError();
  }

  await redisClient.set("activities", JSON.stringify(eventDays));

  return eventDays;
}

async function getEvents(userId: number, eventDayId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED") {
    throw notFoundError();
  }

  const events = await activityRepository.findEventsByEventsDayId(eventDayId);
  if (!events || events.length === 0) {
    throw notFoundError();
  }

  return events;
}

const activityService = {
  getEventDays,
  getEvents,
};

export default activityService;
