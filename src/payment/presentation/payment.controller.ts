import { BadRequestException, Body, Controller, NotFoundException, Post } from "@nestjs/common";
import { PaymentService } from "../domain/service/payment.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProcessPaymentReqDto } from "./dto/process-payment.req.dto";
import { ProcessPaymentResDto } from "./dto/process-payment.res.dto";
import { ProcessPaymentFacadeReqDto } from "../domain/application/dto/process-payment.facade.req.dto";
import { PaymentFacade } from "../domain/application/payment.facade";

@ApiTags("Payment Management")
@Controller("payment")
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly payemntFacade: PaymentFacade,
  ) {}

  @Post("process")
  @ApiOperation({ summary: "processPayment" })
  @ApiResponse({ status: 200, description: "200 - OK", type: ProcessPaymentResDto })
  @ApiResponse({ status: 400, description: "400 - BadRequest", type: BadRequestException })
  @ApiResponse({ status: 404, description: "404 - NotFound", type: NotFoundException })
  async processPayment(@Body() processPaymentReqDto: ProcessPaymentReqDto): Promise<ProcessPaymentResDto> {
    const processPaymentFacadeReqDto: ProcessPaymentFacadeReqDto = {
      ...processPaymentReqDto,
    };

    try {
      return await this.payemntFacade.processPayment(processPaymentFacadeReqDto);
    } catch (error) {
      switch (error.message) {
        case "MEMBER_NOT_FOUND":
          throw new NotFoundException("회원을 찾을 수 없습니다.");
        case "NOT_ENOUTH_BALANCE":
          throw new BadRequestException("사용 할 수 있는 잔액이 충분하지 않습니다.");
        case "OVER_BALANCE_LIMIT":
          throw new BadRequestException("충전 후 잔액이 충전 가능 금액 2_147_483_647원을 초과합니다.");
        case "PRODUCT_NOT_FOUND":
          throw new NotFoundException("상품을 찾을 수 없습니다.");
        case "NOT_ENOUGH_STOCK":
          throw new NotFoundException("잔여 재고가 부족합니다.");
        case "OVER_STOCK_LIMIT":
          throw new NotFoundException("재고 추가 후 재고량이 최대 재고량인 2_147_483_647개 보다 많습니다.");
        case "NOT_FOUND_ORDER":
          throw new NotFoundException("주문 정보를 찾을 수 없습니다.");
        case "ALREADY_PREOCESSED":
          throw new BadRequestException("이미 결제가 처리 된 주문입니다.");
        default:
          throw error;
      }
    }
  }
}
