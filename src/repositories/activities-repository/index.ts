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
        include: {
          ActivitiesBooking: {
            select: {
              id: true,
              userId: true
            }
          }
        }
      },
    }
  });
}

const activityRepository = {
  findEventDays,
  findEventsByEventsDayId,
};

export default activityRepository;
