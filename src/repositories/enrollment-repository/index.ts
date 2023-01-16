import { prisma } from "@/config";
import { Enrollment } from "@prisma/client";
import { CreateAddressParams } from "@/repositories/address-repository";

async function findWithAddressByUserId(userId: number) {
  return prisma.enrollment.findFirst({
    where: { userId },
    include: {
      Address: true,
    },
  });
}

async function findById(enrollmentId: number) {
  return prisma.enrollment.findFirst({
    where: { id: enrollmentId },
  });
}

async function upsert(
  userId: number,
  createdEnrollment: CreateEnrollmentParams,
  updatedEnrollment: UpdateEnrollmentParams,
) {
  return prisma.enrollment.upsert({
    where: {
      userId,
    },
    create: createdEnrollment,
    update: updatedEnrollment,
  });
}

async function upsertEnrollmentThenAddress(
  userId: number,
  createdEnrollment: CreateEnrollmentParams,
  updatedEnrollment: UpdateEnrollmentParams,
  address: CreateAddressParams,
) {
  await prisma.$transaction(async () => {
    const newEnroll = await prisma.enrollment.upsert({
      where: {
        userId,
      },
      create: createdEnrollment,
      update: updatedEnrollment,
    });

    await prisma.address.upsert({
      where: {
        enrollmentId: newEnroll.id,
      },
      create: {
        ...address,
        Enrollment: { connect: { id: newEnroll.id } },
      },
      update: address,
    });
  });
}

export type CreateEnrollmentParams = Omit<Enrollment, "id" | "createdAt" | "updatedAt">;
export type UpdateEnrollmentParams = Omit<CreateEnrollmentParams, "userId">;

const enrollmentRepository = {
  findWithAddressByUserId,
  upsert,
  findById,
  upsertEnrollmentThenAddress,
};

export default enrollmentRepository;
