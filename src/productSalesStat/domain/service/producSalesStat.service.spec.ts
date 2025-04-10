import { Test, TestingModule } from "@nestjs/testing";
import { ProductSalesStatRepository } from "../infrastructure/product_sales_stat.repository";
import { ProductSalesStatService } from "./productSalesStat.service";
import { AddProductSalesStatCommand, PaidProduct } from "../dto/add-product-sales-stat.command";
import { IPRODUCT_SALES_STAT_REPOSITORY } from "../product_sales_stat.interface.repository";

describe("ProductSalesStatService", () => {
  let productSalesStatService: ProductSalesStatService;
  let productSalesStatRepositoryStub: Partial<ProductSalesStatRepository>;

  let mockPopularProducts = [
    { rank: 1, productId: 2, productName: "애플 맥세이프 충전기 20W", amount: 700, sales: 55300000 },
    { rank: 2, productId: 5, productName: "미니 향균 티슈 250매", amount: 342, sales: 855000 },
    { rank: 3, productId: 7, productName: "모나미 볼펜 12자루", amount: 321, sales: 321000 },
    { rank: 4, productId: 1, productName: "다이슨 에어랩", amount: 50, sales: 60500000 },
    { rank: 5, productId: 3, productName: "무지 라운드넥 반팔티 Free(W/M)", amount: 1, sales: 24900 },
  ];

  beforeEach(async () => {
    productSalesStatRepositoryStub = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      updateById: jest.fn(),
      deleteById: jest.fn(),
      find: jest.fn(),
      getTop5ProductByAmountLast3Days: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductSalesStatService,
        { provide: IPRODUCT_SALES_STAT_REPOSITORY, useValue: productSalesStatRepositoryStub },
      ],
    }).compile();

    productSalesStatService = module.get<ProductSalesStatService>(ProductSalesStatService);
  });

  it("should be defined", () => {
    expect(productSalesStatService).toBeDefined();
  });

  describe("getPopularProducts", () => {
    it("mock으로 등록된 통계 정보가 조회되어야 함✅", async () => {
      // mock & stub settings
      (productSalesStatRepositoryStub.getTop5ProductByAmountLast3Days as jest.Mock).mockResolvedValue(
        mockPopularProducts,
      );

      // real service calls
      const result = await productSalesStatService.getPopularProducts();

      // expectactions
      expect(result).toEqual(mockPopularProducts);
    });
  });

  describe("addProductSalesStat", () => {
    it("3개의 상품에 대한 통계 반영 요청을 하면 요청한 상품들의 지불 총액을 반환하여야 함✅", async () => {
      // mock & stub settings
      (productSalesStatRepositoryStub.find as jest.Mock)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{ total_amount: 1, total_sales: 79000 }])
        .mockResolvedValueOnce([]);

      // dto settings
      const paidProducts: PaidProduct[] = [
        { productId: 1, productName: "다이슨 에어랩", total_amount: 1, total_sales: 1200000 },
        { productId: 2, productName: "애플 맥세이프 충전기 20W", total_amount: 10, total_sales: 790000 },
        { productId: 7, productName: "모나미 볼펜 12자루", total_amount: 1000, total_sales: 5900000 },
      ];
      const today = new Date();
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const command: AddProductSalesStatCommand = { salesDate: todayDate, paidProducts };

      // real service calls
      const result = await productSalesStatService.addProductSalesStat(command);

      // expectations
      expect(result.total_sales).toBe(7890000);
      expect(productSalesStatRepositoryStub.find).toHaveBeenCalledTimes(3);
      expect(productSalesStatRepositoryStub.create).toHaveBeenCalledTimes(2);
      expect(productSalesStatRepositoryStub.updateById).toHaveBeenCalledTimes(1);
    });
  });
});
