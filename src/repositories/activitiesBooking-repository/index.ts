import { prisma } from "@/config";

async function findActivitiesById(id: number) {
  return prisma.activities.findUnique({
    where: {
      id: id
    }
  });
}

async function findActivitiesBooking(userId: number, activitiesId: number) {
  return prisma.activitiesBooking.findFirst({
    where: {
      userId: userId,
      activitiesId: activitiesId
    }
  });
}

async function createActivityBooking(userId: number, activitiesId: number) {
  return prisma.activitiesBooking.create({
    data: {
      userId,
      activitiesId
    }
  });
}

const activityBookingRepository = {
  findActivitiesById,
  findActivitiesBooking,
  createActivityBooking

};

export default activityBookingRepository;
