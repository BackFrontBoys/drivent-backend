import { prisma } from "@/config";
import { Payment, TicketStatus } from "@prisma/client";

async function findPaymentByTicketId(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId,
    },
  });
}

async function createPayment(ticketId: number, params: PaymentParams) {
  return prisma.payment.create({
    data: {
      ticketId,
      ...params,
    },
  });
}

export type PaymentParams = Omit<Payment, "id" | "createdAt" | "updatedAt">;

async function createPaymentUpdateTicket(ticketId: number, params: PaymentParams) {
  const pay = await prisma.$transaction([
    prisma.payment.create({
      data: {
        ticketId,
        ...params,
      },
    }),
    prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        status: TicketStatus.PAID,
      },
    }),
  ]);
  return pay;
}

const paymentRepository = {
  findPaymentByTicketId,
  createPayment,
  createPaymentUpdateTicket,
};

export default paymentRepository;
