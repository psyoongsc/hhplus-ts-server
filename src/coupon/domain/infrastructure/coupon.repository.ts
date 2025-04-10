import { PrismaRepository } from "@app/database/prismaRepository.impl"
import { Coupon } from "@prisma/client";
import { ICouponRepository } from "../coupon.repository.interface";
import { PrismaService } from "@app/database/prisma/prisma.service";

export class CouponRepository extends PrismaRepository<Coupon> implements ICouponRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, prisma.coupon);
  }

  async getAllAvailableCoupons(): Promise<Coupon[]> {
    return await this.prisma.coupon.findMany({
      where: {
        stock: { gt: 0 },
      },
    })
  }

  async addCoupon(couponId: number): Promise<Coupon> {
    return await this.prisma.coupon.update({
      where: { id: couponId },
      data: {
        stock: {
          increment: 1
        }
      }
    })
  }

  async deductCoupon(couponId: number): Promise<Coupon> {
    return await this.prisma.coupon.update({
      where: { id: couponId },
      data: {
        stock: {
          decrement: 1
        }
      }
    })
  }
}