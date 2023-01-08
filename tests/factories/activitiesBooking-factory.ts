import { faker } from "@faker-js/faker";
import { prisma } from "@/config";

export function createActivityBooking( userId: number, activitiesId: number ) {
  return prisma.activitiesBooking.create({
    data: {
      userId,
      activitiesId
    }
  });
}

export function createEventDay() {
  return prisma.eventDays.create({
    data: {
      date: faker.date.future()
    }
  });
}

export function createLocation() {
  return prisma.locations.create({
    data: {
      name: "Auditório Principal"
    }
  });
}

export function createValidActivity( eventDayId: number, locationId: number ) {
  return prisma.activities.create({
    data: {
      name: faker.name.findName(),
      eventDayId,
      startTime: "09:00",
      endTime: "10:00",
      maxQuantity: 10,
      locationId 
    }
  });
}

