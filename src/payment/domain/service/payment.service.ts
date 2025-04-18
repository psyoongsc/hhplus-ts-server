import { Inject, Injectable } from "@nestjs/common";
import { PaymentRepository } from "../../infrastructure/payment.repository";
import { ProcessPaymentCommand } from "../dto/process-payment.command.dto";
import { PaymentResult } from "../dto/payment.result.dto";
import { IPAYMENT_REPOSITORY } from "../repository/payment.repository.interface";
import { PaymentStatus } from "../dto/payment-status.enum";
import { TransactionService } from "@app/database/prisma/transaction.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class PaymentService {
  constructor(
    @Inject(IPAYMENT_REPOSITORY)
    private readonly paymentRepository: PaymentRepository,
    private readonly transactionService: TransactionService,
  ) {}

  // Payment,Order 관계 1:0..1 -> 환불 한 결제 건에 대해서 재결제 불가
  async processPayment(command: ProcessPaymentCommand, txc?: Prisma.TransactionClient): Promise<PaymentResult> {
    const orderId = command.orderId;
    const couponId = command.couponId;
    const memberId = command.memberId;
    const approved_at = command.approved_at;
    const amount = command.amount;

    return await this.transactionService.executeInTransaction(async (tx) => {
      // orderId 를 이용해 검색하였을 때, 검색되는 내용이 있다면 이미 결제 이력이 있으므로 Error 반환해야 함.
      const client = txc ?? tx;

      const payment_record = await this.paymentRepository.find({
        where: { orderId },
      }, client);
      if (payment_record.length != 0) {
        throw new Error("ALREADY_PREOCESSED");
      }

      return await this.paymentRepository.createPayment(
        orderId,
        couponId,
        memberId,
        amount,
        approved_at,
        PaymentStatus.PAYMENT_COMPLETED,
        client
      );
    });
  }
}
