import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { OrderService } from "../domain/service/order.service";
import { OrderProductReqDto } from "./dto/order-product.req.dto";
import { OrderProductResDto } from "./dto/order-product.res.dto";
import { OrderProductCommand } from "../domain/dto/order-product.command";
import { CancelOrderReqDto } from "./dto/cancel-order.req.dto";
import { CancelOrderResDto } from "./dto/cancel-order.res.dto";
import { CancelOrderCommand } from "../domain/dto/cancel-order.command";
import { PayOrderResDto } from "./dto/pay-order.res.dto";
import { PayOrderReqDto } from "./dto/pay-order.req.dto";
import { PayOrderCommand } from "../domain/dto/pay-order.command";

@ApiTags("Order Management")
@Controller("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: "orderProduct" })
  @ApiResponse({ status: 200, description: "OK", type: OrderProductResDto })
  @ApiResponse({ status: 400, description: "주문 할 상품이 유효하지 않습니다." })
  @ApiResponse({ status: 404, description: "회원을 찾을 수 없습니다." })
  async orderProduct(@Body() orderProductReqDto: OrderProductReqDto): Promise<OrderProductResDto> {
    const command: OrderProductCommand = {
      ...orderProductReqDto,
    };

    return await this.orderService.orderProduct(command);
  }

  @Post("cancel")
  @ApiOperation({ summary: "cancelOrder" })
  @ApiResponse({ status: 200, description: "OK", type: CancelOrderResDto })
  @ApiResponse({ status: 404, description: "주문을 찾을 수 없습니다." })
  async cancelOrder(@Body() cancelOrderReqDto: CancelOrderReqDto): Promise<CancelOrderResDto> {
    const command: CancelOrderCommand = {
      ...cancelOrderReqDto,
    };

    return await this.orderService.cancelOrder(command);
  }

  @Post("pay")
  @ApiOperation({ summary: "payOrder" })
  @ApiResponse({ status: 200, description: "OK", type: PayOrderResDto })
  @ApiResponse({ status: 400, description: "쿠폰이 유효하지 않습니다." })
  @ApiResponse({ status: 404, description: "회원을 찾을 수 없습니다." })
  async payOrder(@Body() payOrderReqDto: PayOrderReqDto): Promise<PayOrderResDto> {
    const command: PayOrderCommand = {
      ...payOrderReqDto,
    };

    return await this.orderService.payOrder(command);
  }
}
