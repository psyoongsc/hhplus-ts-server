import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { MemberService } from "../domain/service/member.service";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ChargeBalanceControllerReqDto } from "./dto/charge-balance.req.dto";
import { ChargeBalanceControllerResDto } from "./dto/charge-balance.res.dto";
import { UseBalanceControllerReqDto } from "./dto/use-balance.req.dto";
import { UseBalanceControllerResDto } from "./dto/use-balance.res.dto";
import { GetBalanceControllerResDto } from "./dto/get-balance.res.dto";
import { ChargeBalanceCommand } from "../domain/dto/charge-balance.command";
import { UseBalanceCommand } from "../domain/dto/use-balance.command";

@ApiTags("Member Management")
@Controller("member")
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get(":memberId")
  @ApiOperation({ summary: "getBalance" })
  @ApiParam({ name: "memberId", example: "1" })
  @ApiResponse({ status: 200, description: "OK", type: GetBalanceControllerResDto })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없습니다." })
  async getBalance(@Param("memberId", ParseIntPipe) memberId: number): Promise<GetBalanceControllerResDto> {
    return await this.memberService.getBalance({ memberId });
  }

  @Post("charge")
  @ApiOperation({ summary: "chargeBalance" })
  @ApiResponse({ status: 200, description: "OK", type: ChargeBalanceControllerResDto })
  @ApiResponse({ status: 400, description: "충전 금액이 유효하지 않습니다." })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없습니다." })
  async chargeBalance(
    @Body() chargeBalanceReqDto: ChargeBalanceControllerReqDto,
  ): Promise<ChargeBalanceControllerResDto> {
    const command: ChargeBalanceCommand = {
      ...chargeBalanceReqDto,
    };

    return await this.memberService.charge(command);
  }

  @Post("use")
  @ApiOperation({ summary: "useBalance" })
  @ApiResponse({ status: 200, description: "success", type: UseBalanceControllerResDto })
  @ApiResponse({ status: 400, description: "충전 금액이 유효하지 않습니다." })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없습니다." })
  async useBalance(@Body() useBalanceReqDto: UseBalanceControllerReqDto): Promise<UseBalanceControllerResDto> {
    const command: UseBalanceCommand = {
      ...useBalanceReqDto,
    };

    return await this.memberService.charge(command);
  }
}
