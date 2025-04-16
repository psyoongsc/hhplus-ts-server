import { BadRequestException, Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post } from "@nestjs/common";
import { CouponService } from "../domain/service/coupon.service";
import { GetAllCouponsResDto } from "./dto/get-all-coupons.res.dto";
import { IssueCouponReqDto } from "./dto/issue-coupon.req.dto";
import { IssueCouponResDto } from "./dto/issue-coupon.res.dto";
import { IssueCouponCommand } from "../domain/dto/issue-coupon.command.dto";
import { UseCouponReqDto } from "./dto/use-coupon.req.dto";
import { UseCouponResDto } from "./dto/use-coupon.res.dto";
import { UseCouponCommand } from "../domain/dto/use-coupon.command.dto";
import { GetCouponsByMemberCommand } from "../domain/dto/get-coupons-by-member.command.dto";
import { GetCouponByMemberResDto } from "./dto/get-coupons-by-member.res.dto";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Coupon Management")
@Controller("coupon")
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get("all")
  @ApiOperation({ summary: "get all available coupons" })
  @ApiResponse({ status: 200, description: "200 - OK", type: GetAllCouponsResDto })
  async getAllCoupons(): Promise<GetAllCouponsResDto> {
    const coupons = await this.couponService.getAllCoupons();
    return { coupons: coupons };
  }

  @Get(":memberId")
  @ApiOperation({ summary: "get coupons (member having)" })
  @ApiParam({ name: "memberId", example: "1" })
  @ApiResponse({ status: 200, description: "200 - OK", type: GetCouponByMemberResDto })
  async getCouponsByMember(@Param("memberId", ParseIntPipe) memberId: number): Promise<GetCouponByMemberResDto> {
    const command: GetCouponsByMemberCommand = { memberId };

    const coupons = await this.couponService.getCouponsByMember(command);

    return { coupons: coupons };
  }

  @Post("issue")
  @ApiOperation({ summary: "issueCoupon" })
  @ApiResponse({ status: 200, description: "200 - OK", type: IssueCouponResDto })
  @ApiResponse({ status: 400, description: "400 - BadRequest", type: BadRequestException })
  @ApiResponse({ status: 404, description: "404 - NotFound", type: NotFoundException })
  async issueCoupon(@Body() issueCouponReqDto: IssueCouponReqDto): Promise<IssueCouponResDto> {
    const command: IssueCouponCommand = {
      ...issueCouponReqDto,
    };

    try {
      return await this.couponService.issueCoupon(command);
    } catch (error) {
      switch (error.message) {
        case "ALREADY_HAVING_COUPON":
          throw new BadRequestException("이미 쿠폰을 보유하고 있습니다.");
        case "NOT_FOUND_COUPON":
          throw new NotFoundException("쿠폰을 찾을 수 없습니다.");
        case "NOT_ENOUTH_STOCK":
          throw new BadRequestException("쿠폰의 재고가 부족합니다.");
        default:
          throw error;
      }
    }
  }

  @Post("use")
  @ApiOperation({ summary: "useCoupon" })
  @ApiResponse({ status: 200, description: "OK", type: UseCouponResDto })
  @ApiResponse({ status: 400, description: "400 - BadRequest", type: BadRequestException })
  @ApiResponse({ status: 404, description: "404 - NotFound", type: NotFoundException })
  async useCoupon(@Body() useCouponReqDto: UseCouponReqDto): Promise<UseCouponResDto> {
    const command: UseCouponCommand = {
      ...useCouponReqDto,
    };

    try {
      return await this.couponService.useCoupon(command);
    } catch (error) {
      switch (error.message) {
        case "NOT_FOUND_MEMBER_COUPON":
          throw new Error("해당 쿠폰을 보유하고 있지 않습니다.");
        case "ALREADY_USED_COUPON":
          throw new Error("이미 해당 쿠폰을 사용하였습니다.");
        default:
          throw error;
      }
    }
  }
}
