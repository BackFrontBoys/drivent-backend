import { prisma } from "@/config";

async function findEventDays() {
  return prisma.eventDays.findMany();
}

async function findEventsByEventsDayId(eventDayId: number) {
  return prisma.locations.findMany({
    include: {
      Activities: {
        where: {
          eventDayId
        },
      },
    }
  });
}

const activityRepository = {
  findEventDays,
  findEventsByEventsDayId,
};

export default activityRepository;
