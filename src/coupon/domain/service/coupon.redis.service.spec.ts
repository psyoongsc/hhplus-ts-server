import { Test, TestingModule } from '@nestjs/testing';
import { CouponRedisService } from './coupon.redis.service';
import { ICOUPON_REPOSITORY } from '../repository/coupon.repository.interface';
import { IMEMBER_COUPON_REPOSITORY } from '../repository/member_coupon.repository.interface';
import { ICOUPON_REDIS_REPOSITORY } from '../repository/coupon.redis.repository.interface';
import { CouponRepository } from '@app/coupon/infrastructure/coupon.repository';
import { MemberCouponRepository } from '@app/coupon/infrastructure/member_coupon.repository';
import { CouponRedisRepository } from '@app/coupon/infrastructure/coupon.redis.repository';
import { TransactionService } from '@app/database/prisma/transaction.service';
import { BadRequestException } from '@nestjs/common';

describe('CouponRedisService 단위 테스트', () => {
  let service: CouponRedisService;

  const mockCouponRepo = {
    findById: jest.fn(),
    getAllAvailableCoupons: jest.fn(),
    updateCouponStock: jest.fn(),
  };

  const mockMemberCouponRepo = {
    getCouponsByIdAndMember: jest.fn(),
    useCouponV2: jest.fn(),
  };

  const mockRedisRepo = {
    enrollCouponStock: jest.fn(),
    enrollWaitQueue: jest.fn(),
    getLockForCouponScheduler: jest.fn(),
    releaseLockForCouponScheduler: jest.fn(),
    getMembersInQueue: jest.fn(),
    issueCoupon: jest.fn(),
    getCouponStock: jest.fn(),
    isCouponExists: jest.fn(),
    useCoupon: jest.fn(),
  };

  const mockTxService = {
    executeInTransaction: jest.fn().mockImplementation(fn => fn({})),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CouponRedisService,
        { provide: ICOUPON_REPOSITORY, useValue: mockCouponRepo },
        { provide: IMEMBER_COUPON_REPOSITORY, useValue: mockMemberCouponRepo },
        { provide: ICOUPON_REDIS_REPOSITORY, useValue: mockRedisRepo },
        { provide: TransactionService, useValue: mockTxService },
      ],
    }).compile();

    service = module.get<CouponRedisService>(CouponRedisService);
  });

  describe('getAllCoupons()', () => {
    it('모든 사용 가능한 쿠폰 목록을 조회할 수 있다', async () => {
      mockCouponRepo.getAllAvailableCoupons.mockResolvedValueOnce(['coupon1']);
      const result = await service.getAllCoupons();
      expect(result).toEqual(['coupon1']);
      expect(mockCouponRepo.getAllAvailableCoupons).toHaveBeenCalled();
    });
  });

  describe('enrollCouponStock()', () => {
    it('Redis에 쿠폰 재고를 등록할 수 있다', async () => {
      await service.enrollCouponStock(1, 100);
      expect(mockRedisRepo.enrollCouponStock).toHaveBeenCalledWith(1, 100);
    });
  });

  describe('requestIssueCoupon()', () => {
    it('쿠폰 발급 대기열에 멤버를 등록할 수 있다', async () => {
      mockRedisRepo.enrollWaitQueue.mockResolvedValueOnce(true);
      const result = await service.requestIssueCoupon({ couponId: 1, memberId: 2 });
      expect(result).toBe(true);
      expect(mockRedisRepo.enrollWaitQueue).toHaveBeenCalledWith(1, 2);
    });
  });

  describe('processIssueCoupon()', () => {
    it('락을 획득하면 대기열의 멤버에게 쿠폰을 발급하고 재고를 DB에 동기화한다', async () => {
      mockRedisRepo.getLockForCouponScheduler.mockResolvedValueOnce(true);
      mockRedisRepo.getMembersInQueue.mockResolvedValueOnce([1, 2]);
      mockRedisRepo.getCouponStock.mockResolvedValueOnce(8);

      await service.processIssueCoupon(1);

      expect(mockRedisRepo.issueCoupon).toHaveBeenCalledTimes(2);
      expect(mockCouponRepo.updateCouponStock).toHaveBeenCalledWith(1, 8, expect.anything());
      expect(mockRedisRepo.releaseLockForCouponScheduler).toHaveBeenCalled();
    });
  });

  describe('useCoupon()', () => {
    it('Redis에 쿠폰이 없으면 예외를 발생시킨다', async () => {
      mockRedisRepo.isCouponExists.mockResolvedValueOnce(false);

      await expect(service.useCoupon({ memberId: 1, couponId: 2, amount: 1000 }))
        .rejects
        .toThrow(BadRequestException);
    });

    it('FLAT 타입 쿠폰이 성공적으로 적용되고 사용 처리된다', async () => {
      mockRedisRepo.isCouponExists.mockResolvedValueOnce(true);
      mockMemberCouponRepo.getCouponsByIdAndMember.mockResolvedValueOnce(null);
      mockCouponRepo.findById.mockResolvedValueOnce({
        id: 2,
        type: 'FLAT',
        offFigure: 300,
      });
    
      const result = await service.useCoupon({ memberId: 1, couponId: 2, amount: 1000 });
    
      expect(result.discountedAmount).toBe(700);
      expect(mockRedisRepo.useCoupon).toHaveBeenCalled();
      expect(mockMemberCouponRepo.useCouponV2).toHaveBeenCalled();
    });

    it('PERCENTAGE 타입 쿠폰이 성공적으로 적용되고 사용 처리된다', async () => {
      mockRedisRepo.isCouponExists.mockResolvedValueOnce(true);
      mockMemberCouponRepo.getCouponsByIdAndMember.mockResolvedValueOnce(null);
      mockCouponRepo.findById.mockResolvedValueOnce({
        id: 2,
        type: 'PERCENTAGE',
        offFigure: 10,
      });
    
      const result = await service.useCoupon({ memberId: 1, couponId: 2, amount: 1000 });
    
      expect(result.discountedAmount).toBe(900);
      expect(mockRedisRepo.useCoupon).toHaveBeenCalled();
      expect(mockMemberCouponRepo.useCouponV2).toHaveBeenCalled();
    });
  });
});
