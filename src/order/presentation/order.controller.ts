import { BadRequestException, Body, Controller, NotFoundException, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { OrderService } from "../domain/service/order.service";
import { OrderProductReqDto } from "./dto/order-product.req.dto";
import { OrderProductResDto } from "./dto/order-product.res.dto";
import { OrderProductCommand } from "../domain/dto/order-product.command.dto";
import { CancelOrderReqDto } from "./dto/cancel-order.req.dto";
import { CancelOrderResDto } from "./dto/cancel-order.res.dto";
import { CancelOrderCommand } from "../domain/dto/cancel-order.command.dto";
@ApiTags("Order Management")
@Controller("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post("")
  @ApiOperation({ summary: "orderProduct" })
  @ApiResponse({ status: 200, description: "200 - OK", type: OrderProductResDto })
  @ApiResponse({ status: 404, description: "404 - NotFound", type: NotFoundException })
  async orderProduct(@Body() orderProductReqDto: OrderProductReqDto): Promise<OrderProductResDto> {
    const command: OrderProductCommand = {
      ...orderProductReqDto,
    };

    try {
      return await this.orderService.orderProduct(command);
    } catch (error) {
      switch (error.message) {
        case "MEMBER_NOT_FOUND":
          throw new NotFoundException("회원을 찾을 수 없습니다.");
        case "PRODUCT_NOT_FOUND":
          throw new NotFoundException("상품을 찾을 수 없습니다.");
        default:
          throw error;
      }
    }
  }

  @Post("cancel")
  @ApiOperation({ summary: "cancelOrder" })
  @ApiResponse({ status: 200, description: "OK", type: CancelOrderResDto })
  @ApiResponse({ status: 404, description: "주문을 찾을 수 없습니다." })
  async cancelOrder(@Body() cancelOrderReqDto: CancelOrderReqDto): Promise<CancelOrderResDto> {
    const command: CancelOrderCommand = {
      ...cancelOrderReqDto,
    };

    try {
      return await this.orderService.cancelOrder(command);
    } catch (error) {
      switch (error.message) {
        case "NOT_FOUND_ORDER":
          throw new NotFoundException("주문 정보를 찾을 수 없습니다.");
        default:
          throw error;
      }
    }
  }
}
