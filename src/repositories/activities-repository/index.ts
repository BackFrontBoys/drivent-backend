import { prisma } from "@/config";

async function findEventDays() {
  return prisma.eventDays.findMany();
}

async function findEventsByEventsDayId(eventDayId: number) {
  console.log(eventDayId);
  return prisma.activities.findMany({
    where: {
      eventDayId: eventDayId,
    },
    include: {
      ActivitiesBooking: {
        select: {
          id: true,
          activitiesId: true,
          userId: true,
        },
      },

      Locations: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

const activityRepository = {
  findEventDays,
  findEventsByEventsDayId,
};

export default activityRepository;
