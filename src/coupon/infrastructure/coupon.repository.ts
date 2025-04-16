import { PrismaRepository } from "@app/database/prismaRepository.impl"
import { Coupon, Prisma } from "@prisma/client";
import { ICouponRepository } from "../domain/repository/coupon.repository.interface";
import { PrismaService } from "@app/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CouponRepository extends PrismaRepository<Coupon> implements ICouponRepository {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma, (client) => client.coupon);
  }

  async getAllAvailableCoupons(tx?: Prisma.TransactionClient): Promise<Coupon[]> {
    const client = tx ?? this.prisma;

    return await client.coupon.findMany({
      where: {
        stock: { gt: 0 },
      },
    })
  }

  async addCoupon(couponId: number, tx?: Prisma.TransactionClient): Promise<Coupon> {
    const client = tx ?? this.prisma;

    return await client.coupon.update({
      where: { id: couponId },
      data: {
        stock: {
          increment: 1
        }
      }
    })
  }

  async deductCoupon(couponId: number, tx?: Prisma.TransactionClient): Promise<Coupon> {
    const client = tx ?? this.prisma;
    
    return await client.coupon.update({
      where: { id: couponId },
      data: {
        stock: {
          decrement: 1
        }
      }
    })
  }
}