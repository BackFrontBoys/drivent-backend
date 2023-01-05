import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import { cannotListActivitiesError } from "@/errors/cannot-list-activities";
import activityRepository from "@/repositories/activities-repository";

async function getEventDays(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if(!ticket) {
    throw cannotListActivitiesError();
  }

  const eventDays = await activityRepository.findEventDays();

  if (eventDays.length === 0) {
    throw notFoundError();
  }

  return eventDays;
}

const activityService = {
  getEventDays
};

export default activityService;
