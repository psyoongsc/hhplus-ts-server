import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
} from "@nestjs/common";
import { MemberService } from "../domain/service/member.service";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ChargeBalanceControllerReqDto } from "./dto/charge-balance.req.dto";
import { ChargeBalanceControllerResDto } from "./dto/charge-balance.res.dto";
import { UseBalanceControllerReqDto } from "./dto/use-balance.req.dto";
import { UseBalanceControllerResDto } from "./dto/use-balance.res.dto";
import { GetBalanceControllerResDto } from "./dto/get-balance.res.dto";
import { ChargeBalanceCommand } from "../domain/dto/charge-balance.command";
import { UseBalanceCommand } from "../domain/dto/use-balance.command";
import { GetBalanceCommand } from "../domain/dto/get-balance.command";

@ApiTags("Member Management")
@Controller("member")
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get(":memberId")
  @ApiOperation({ summary: "getBalance" })
  @ApiParam({ name: "memberId", example: "1" })
  @ApiResponse({ status: 200, description: "200 - OK", type: GetBalanceControllerResDto })
  @ApiResponse({ status: 404, description: "404 - NotFound", type: NotFoundException })
  async getBalance(@Param("memberId", ParseIntPipe) memberId: number): Promise<GetBalanceControllerResDto> {
    const command: GetBalanceCommand = {
      memberId,
    };

    try {
      return await this.memberService.getBalance(command);
    } catch (error) {
      switch (error.message) {
        case "MEMBER_NOT_FOUND":
          throw new NotFoundException("회원을 찾을 수 없습니다.");
        default:
          throw error;
      }
    }
  }

  @Post("charge")
  @ApiOperation({ summary: "chargeBalance" })
  @ApiResponse({ status: 200, description: "200 - OK", type: ChargeBalanceControllerResDto })
  @ApiResponse({ status: 400, description: "400 - BadRequest", type: BadRequestException })
  @ApiResponse({ status: 404, description: "404 - NotFound", type: NotFoundException })
  async chargeBalance(
    @Body() chargeBalanceReqDto: ChargeBalanceControllerReqDto,
  ): Promise<ChargeBalanceControllerResDto> {
    const command: ChargeBalanceCommand = {
      ...chargeBalanceReqDto,
    };

    try {
      return await this.memberService.charge(command);
    } catch (error) {
      switch (error.message) {
        case "MEMBER_NOT_FOUND":
          throw new NotFoundException("회원을 찾을 수 없습니다.");
        case "OVER_BALANCE_LIMIT":
          throw new BadRequestException("충전 후 잔액이 충전 가능 금액 2_147_483_647원을 초과합니다.");
        default:
          throw error;
      }
    }
  }

  @Post("use")
  @ApiOperation({ summary: "useBalance" })
  @ApiResponse({ status: 200, description: "200 - OK", type: UseBalanceControllerResDto })
  @ApiResponse({ status: 400, description: "400 - BadRequest", type: BadRequestException })
  @ApiResponse({ status: 404, description: "404 - NotFound", type: NotFoundException })
  async useBalance(@Body() useBalanceReqDto: UseBalanceControllerReqDto): Promise<UseBalanceControllerResDto> {
    const command: UseBalanceCommand = {
      ...useBalanceReqDto,
    };

    try {
      return await this.memberService.charge(command);
    } catch (error) {
      switch (error.message) {
        case "MEMBER_NOT_FOUND":
          throw new NotFoundException("회원을 찾을 수 없습니다.");
        case "NOT_ENOUTH_BALANCE":
          throw new BadRequestException("사용 할 수 있는 잔액이 충분하지 않습니다.");
        default:
          throw error;
      }
    }
  }
}
