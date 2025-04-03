import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { CouponService } from "../domain/service/coupon.service";
import { GetAllCouponsResDto } from "./dto/get-all-coupons.res.dto";
import { IssueCouponReqDto } from "./dto/issue-coupon.req.dto";
import { IssueCouponResDto } from "./dto/issue-coupon.res.dto";
import { IssueCouponCommand } from "../domain/dto/issue-coupon.command";
import { UseCouponReqDto } from "./dto/use-coupon.req.dto";
import { UseCouponResDto } from "./dto/use-coupon.res.dto";
import { UseCouponCommand } from "../domain/dto/use-coupon.command";
import { GetCouponsByMemberCommand } from "../domain/dto/get-coupons-by-member.command";
import { GetCouponByMemberResDto } from "./dto/get-coupons-by-member.res.dto";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Coupon Management")
@Controller("coupon")
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Get("all")
  @ApiOperation({ summary: "get all available coupons" })
  @ApiResponse({ status: 200, description: "OK", type: GetAllCouponsResDto })
  async getAllCoupons(): Promise<GetAllCouponsResDto> {
    const coupons = await this.couponService.getAllCoupons();
    return { coupons: coupons };
  }

  @Get(":memberId")
  @ApiOperation({ summary: "get coupons (member having)" })
  @ApiParam({ name: "memberId", example: "1" })
  @ApiResponse({ status: 200, description: "OK", type: GetCouponByMemberResDto })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없습니다." })
  async getCouponsByMember(@Param("memberId", ParseIntPipe) memberId: number): Promise<GetCouponByMemberResDto> {
    const command: GetCouponsByMemberCommand = { memberId };

    const coupons = await this.couponService.getCouponsByMember(command);

    return { coupons: coupons };
  }

  @Post("issue")
  @ApiOperation({ summary: "issueCoupon" })
  @ApiResponse({ status: 200, description: "OK", type: IssueCouponResDto })
  @ApiResponse({ status: 400, description: "쿠폰이 유효하지 않습니다." })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없습니다." })
  async issueCoupon(@Body() issueCouponReqDto: IssueCouponReqDto): Promise<IssueCouponResDto> {
    const command: IssueCouponCommand = {
      ...issueCouponReqDto,
    };

    return await this.couponService.issue(command);
  }

  @Post("use")
  @ApiOperation({ summary: "useCoupon" })
  @ApiResponse({ status: 200, description: "OK", type: UseCouponResDto })
  @ApiResponse({ status: 400, description: "쿠폰이 유효하지 않습니다." })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없습니다." })
  async useCoupon(@Body() useCouponReqDto: UseCouponReqDto): Promise<UseCouponResDto> {
    const command: UseCouponCommand = {
      ...useCouponReqDto,
    };

    return await this.couponService.use(command);
  }
}
