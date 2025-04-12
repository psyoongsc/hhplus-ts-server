import { Test, TestingModule } from "@nestjs/testing";
import { PaymentFacade } from "./payment.facade";
import { OrderService } from "@app/order/domain/service/order.service";
import { ProductService } from "@app/product/domain/service/product.service";
import { MemberService } from "@app/member/domain/service/member.service";
import { ProductSalesStatService } from "@app/productSalesStat/domain/service/productSalesStat.service";
import { PaymentService } from "../service/payment.service";
import { ProcessPaymentFacadeReqDto } from "./dto/process-payment.facade.req.dto";
import { PaymentResult } from "../dto/payment.result";
import { OrderStatus } from "@app/order/domain/dto/order-status.enum";

describe("PaymentFacade", () => {
  let facade: PaymentFacade;
  let orderService: any;
  let productService: any;
  let memberService: any;
  let paymentService: any;
  let productSalesStatService: any;

  beforeEach(async () => {
    orderService = { getOrder: jest.fn() };
    productService = {
      deductProductStock: jest.fn(),
      addProductStock: jest.fn(),
    };
    memberService = {
      useBalance: jest.fn(),
      chargeBalance: jest.fn(),
    };
    paymentService = {
      processPayment: jest.fn(),
    };
    productSalesStatService = {
      addProductSalesStat: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentFacade,
        { provide: OrderService, useValue: orderService },
        { provide: ProductService, useValue: productService },
        { provide: MemberService, useValue: memberService },
        { provide: PaymentService, useValue: paymentService },
        { provide: ProductSalesStatService, useValue: productSalesStatService },
      ],
    }).compile();

    facade = module.get(PaymentFacade);
  });

  describe("processPayment", () => {
    it("정상적인 결제 시 모든 서비스가 순차적으로 호출되고 PaymentResult가 반환되어야 함✅", async () => {
      // Arrange - 요청 DTO
      const req: ProcessPaymentFacadeReqDto = {
        orderId: 1,
        memberId: 10,
        couponId: null,
      };

      // 주문 정보 mock (상품 포함)
      const order = {
        id: 1,
        memberId: 10,
        totalSales: 10000,
        status: OrderStatus.PAYMENT_PREPARING,
        orderProducts: [
          {
            productId: 101,
            amount: 2,
            product: { id: 101, name: "상품A", price: 5000 },
          },
        ],
      };
      orderService.getOrder.mockResolvedValue(order);

      // 결제 결과 mock
      const paymentResult: PaymentResult = {
        id: 1,
        orderId: 1,
        memberId: 10,
        couponId: null,
        status: "결제완료",
        paid_amount: 10000,
        approved_at: new Date(),
      };
      paymentService.processPayment.mockResolvedValue(paymentResult);

      // Act
      const result = await facade.processPayment(req);

      // Assert - 모든 서비스가 제대로 호출되었는지 검증
      expect(orderService.getOrder).toHaveBeenCalledWith({ orderId: 1 });

      expect(productService.deductProductStock).toHaveBeenCalledWith({
        productId: 101,
        amount: 2,
      });

      expect(memberService.useBalance).toHaveBeenCalledWith({
        memberId: 10,
        amount: 10000,
      });

      expect(paymentService.processPayment).toHaveBeenCalledWith(
        expect.objectContaining({
          orderId: 1,
          memberId: 10,
          couponId: null,
          amount: 10000,
        }),
      );

      expect(productSalesStatService.addProductSalesStat).toHaveBeenCalledWith(
        expect.objectContaining({
          paidProducts: [
            {
              productId: 101,
              productName: "상품A",
              total_amount: 2,
              total_sales: 10000,
            },
          ],
        }),
      );

      expect(result).toEqual(paymentResult);
    });
  });
});
