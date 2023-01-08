import app, { init } from "@/app";
import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import e from "express";
import httpStatus from "http-status";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  createPayment,
  generateCreditCardData,
  createTicketTypeWithHotel,
  createTicketTypeRemote,
  createHotel,
  createRoomWithHotelId,
  createBooking,
  createActivityBooking,
  createLocation,
  createEventDay,
  createValidActivity
} from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
});
  
beforeEach(async () => {
  await cleanDb();
});
const server = supertest(app);

describe("POST /activitiesBooking", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/activitiesBooking");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/activitiesBooking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post("/activitiesBooking").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when user has no enrollment ", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const ticketType = await createTicketTypeRemote();

      const response = await server.post("/activitiesBooking").set("Authorization", `Bearer ${token}`).send({
        activityId: 0
      });

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when user has no ticket", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
  
      const ticketType = await createTicketTypeRemote();
  
      const response = await server.post("/activitiesBooking").set("Authorization", `Bearer ${token}`).send({
        activityId: 0
      });
  
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when user has ticket RESERVED", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeWithHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    
      const response = await server.post("/activitiesBooking").set("Authorization", `Bearer ${token}`).send({
        activityId: 0
      });
    
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when has no valid activity", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
  
      const response = await server.post("/activitiesBooking").set("Authorization", `Bearer ${token}`).send({
        activityId: 0
      });
  
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it("should respond with status 409 as user already registered", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const location = await createLocation();
      const day = await createEventDay();
      const activity = await createValidActivity(day.id, location.id);
      const booking = await createActivityBooking(user.id, activity.id);
    
      const response = await server.post("/activitiesBooking").set("Authorization", `Bearer ${token}`).send({
        activityId: activity.id
      });
    
      expect(response.status).toEqual(httpStatus.CONFLICT);
    });

    it("should respond with status 200 unsubscribed user in activity", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeRemote();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const location = await createLocation();
      const day = await createEventDay();
      const activity = await createValidActivity(day.id, location.id);
      
      const response = await server.post("/activitiesBooking").set("Authorization", `Bearer ${token}`).send({
        activityId: activity.id
      });
      
      expect(response.status).toEqual(httpStatus.OK);
    });
  });
});

