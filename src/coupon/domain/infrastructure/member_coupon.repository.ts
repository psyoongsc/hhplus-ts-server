import { PrismaRepository } from "@app/database/prismaRepository.impl";
import { Member_Coupon } from "@prisma/client";
import { IMemberCouponRepository } from "../member_coupon.repository.interface";
import { PrismaService } from "@app/database/prisma/prisma.service";

export class MemberCouponRepository extends PrismaRepository<Member_Coupon> implements IMemberCouponRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.member_Coupon);
  }

  async issueCoupon(memberId: number, couponId: number): Promise<Member_Coupon> {
    return await this.create({ memberId, couponId, isUsed: false })
  }

  async useCoupon(memberId: number, couponId: number): Promise<Member_Coupon> {
    return await this.prisma.member_Coupon.update({
      where: { memberId_couponId: { memberId, couponId } },
      data: {
        isUsed: true
      }
    })
  }

  async getCouponsByMember(memberId: number): Promise<Member_Coupon[]> {
    return await this.prisma.member_Coupon.findMany({
      where: { memberId },
    })
  }

  async getCouponsByMemberAndCoupon(memberId: number, couponId: number): Promise<Member_Coupon> {
    return await this.prisma.member_Coupon.findUnique({
      where: { memberId_couponId: { memberId, couponId } },
    })
  }
}