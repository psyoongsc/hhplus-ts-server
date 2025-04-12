import { PrismaService } from "@app/database/prisma/prisma.service";
import { PrismaRepository } from "@app/database/prismaRepository.impl";
import { Injectable } from "@nestjs/common";
import { Payment } from "@prisma/client";
import { IPaymentRepository } from "../payment.repository.interface";
import { PaymentStatus } from "../dto/payment-status.enum";

@Injectable()
export class PaymentRepository extends PrismaRepository<Payment> implements IPaymentRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.payment);
  }

  async createPayment(
    orderId: number,
    couponId: number,
    memberId: number,
    paid_amount: number,
    approved_at: Date,
    status: PaymentStatus,
  ): Promise<Payment> {
    return await this.prisma.payment.create({
      data: {
        order: { connect: { id: orderId } },
        couponId,
        member: { connect: { id: memberId } },
        paid_amount,
        approved_at,
        status,
      },
    });
  }
}
