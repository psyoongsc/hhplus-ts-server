import { Test, TestingModule } from "@nestjs/testing";
import { PaymentService } from "./payment.service";
import { IPAYMENT_REPOSITORY } from "../payment.repository.interface";
import { PaymentStatus } from "../dto/payment-status.enum";
import { ProcessPaymentCommand } from "../dto/process-payment.command";
import { PaymentResult } from "../dto/payment.result";

describe("PaymentService", () => {
  let paymentService: PaymentService;
  let paymentRepository: {
    find: jest.Mock;
    createPayment: jest.Mock;
  };

  beforeEach(async () => {
    paymentRepository = {
      find: jest.fn(),
      createPayment: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: IPAYMENT_REPOSITORY,
          useValue: paymentRepository,
        },
      ],
    }).compile();

    paymentService = module.get<PaymentService>(PaymentService);
  });

  it("이미 결제 정보가 존재하면 'ALREADY_PREOCESSED' 메시지와 함께 에러 발생❌", async () => {
    const command: ProcessPaymentCommand = {
      orderId: 1,
      couponId: null,
      memberId: 42,
      amount: 10000,
      approved_at: new Date(),
    };

    paymentRepository.find.mockResolvedValue([{ id: 1 }]);

    await expect(paymentService.processPayment(command)).rejects.toThrow("ALREADY_PREOCESSED");
    expect(paymentRepository.find).toHaveBeenCalledWith({ where: { orderId: 1 } });
    expect(paymentRepository.createPayment).not.toHaveBeenCalled();
  });

  it("결제 정보가 존재하지 않는 주문이라면 결제가 정상적으로 처리되어야 함✅", async () => {
    const command: ProcessPaymentCommand = {
      orderId: 2,
      couponId: 10,
      memberId: 7,
      amount: 15000,
      approved_at: new Date(),
    };

    const expectedResult: PaymentResult = {
      id: 100,
      orderId: 2,
      memberId: 7,
      couponId: 10,
      status: PaymentStatus.PAYMENT_COMPLETED,
      paid_amount: 15000,
      approved_at: command.approved_at,
    };

    paymentRepository.find.mockResolvedValue([]); // no previous payment
    paymentRepository.createPayment.mockResolvedValue(expectedResult);

    const result = await paymentService.processPayment(command);

    expect(result).toEqual(expectedResult);
    expect(paymentRepository.find).toHaveBeenCalledWith({ where: { orderId: 2 } });
    expect(paymentRepository.createPayment).toHaveBeenCalledWith(
      2,
      10,
      7,
      15000,
      expect.any(Date),
      PaymentStatus.PAYMENT_COMPLETED,
    );
  });
});
