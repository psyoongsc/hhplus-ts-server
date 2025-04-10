import { IRepository } from "@app/database/repository.interface";
import { Payment } from "@prisma/client";
import { PaymentStatus } from "./dto/payment-status.enum";

export interface IPaymentRepository extends IRepository<Payment> {
  createPayment(
    orderId: number,
    couponId: number,
    memberId: number,
    paid_amount: number,
    approved_at: Date,
    status: PaymentStatus,
  ): Promise<Payment>;
}

export const IPAYMENT_REPOSITORY = Symbol("IPAYMENT_REPOSITORY");
