import { prisma } from "@/config";

async function findEventDays() {
  return prisma.eventDays.findMany();
}

const activityRepository = {
  findEventDays
};

export default activityRepository;
