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

async function listActivityBookingByActivityId(id: number) {
  return prisma.activitiesBooking.findMany({
    where: {
      activitiesId: id
    }
  });
}

const activityBookingRepository = {
  findActivitiesById,
  findActivitiesBooking,
  createActivityBooking,
  listActivityBookingByActivityId

};

export default activityBookingRepository;
