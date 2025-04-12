import { Test, TestingModule } from "@nestjs/testing";
import { ProductRepository } from "../../infrastructure/product.repository";
import { ProductService } from "./product.service";
import { Product } from "../entity/product.entity";
import { ProductResult } from "../dto/product.result";
import { GetProductCommand } from "../dto/get-product.command";
import { AddStockCommand } from "../dto/add-stock.command";
import { DeductStockCommand } from "../dto/deduct-stock.command";
import { IPRODUCT_REPOSITORY } from "../../repository/product.repository.interface";

describe("ProductService", () => {
  let productService: ProductService;
  let productRepositoryStub: Partial<ProductRepository>;

  let mockProducts: Product[] = [
    { id: 1, name: "다이슨 에어랩", stock: 121, price: 1200000 },
    { id: 2, name: "애플 맥세이프 충전기 20W", stock: 1, price: 79000 },
    { id: 3, name: "무지 라운드넥 반팔티 Free(W/M)", stock: 1500, price: 24900 },
    { id: 4, name: "안경닦이 100x100", stock: 0, price: 500 },
    { id: 5, name: "미니 향균 티슈 250매", stock: 37, price: 2500 },
    { id: 6, name: "아디다스 삼선 슬리퍼 275mm", stock: 15, price: 65000 },
    { id: 7, name: "모나미 볼펜 12자루", stock: 1000, price: 5900 },
  ];

  beforeEach(async () => {
    productRepositoryStub = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      updateById: jest.fn(),
      deleteById: jest.fn(),
      find: jest.fn(),
      updateStock: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService, { provide: IPRODUCT_REPOSITORY, useValue: productRepositoryStub }],
    }).compile();

    productService = module.get<ProductService>(ProductService);
  });

  it("should be defined", () => {
    expect(productService).toBeDefined();
  });

  describe("getAllProducts", () => {
    it("mock으로 등록된 모든 상품이 조회되어야 함✅", async () => {
      // mock & stub settings
      (productRepositoryStub.findAll as jest.Mock).mockResolvedValue(mockProducts);

      // real service calls
      const result: ProductResult[] = await productService.getAllProducts();

      // expectactions
      expect(result).toEqual(mockProducts);
      expect(productRepositoryStub.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("getProduct", () => {
    it("mock으로 등록되어 있는 상품을 조회할 경우 상품이 정상적으로 조회 되어야 함✅", async () => {
      // mock & stub settings
      (productRepositoryStub.findById as jest.Mock).mockResolvedValue(mockProducts[0]);

      // dto settings
      const command: GetProductCommand = { productId: 1 };

      // real service calls
      const result: ProductResult = await productService.getProduct(command);

      // expectactions
      expect(result).toEqual(mockProducts[0]);
      expect(productRepositoryStub.findById).toHaveBeenCalledTimes(1);
      expect(productRepositoryStub.findById).toHaveBeenCalledWith(1);
    });

    it("존재하지 않는 상품을 조회할 경우 'PRODUCT_NOT_FOUND' 메시지와 함께 에러 발생❌", async () => {
      // mock & stub settings
      (productRepositoryStub.findById as jest.Mock).mockResolvedValue(null);

      // dto settings
      const command: GetProductCommand = { productId: 10 };

      // real service calls & expectactions
      expect(productService.getProduct(command)).rejects.toThrow("PRODUCT_NOT_FOUND");
      expect(productRepositoryStub.findById).toHaveBeenCalledTimes(1);
      expect(productRepositoryStub.findById).toHaveBeenCalledWith(10);
    });
  });

  describe("addProductStock", () => {
    it("다이슨 에어랩의 재고를 10개 추가하면 131개의 재고가 남아있어야 함✅", async () => {
      // mock & stub settings
      const updatedProduct = { id: 1, name: "다이슨 에어랩", stock: 131, price: 1200000 };
      (productRepositoryStub.findById as jest.Mock).mockResolvedValue(mockProducts[0]);
      (productRepositoryStub.updateStock as jest.Mock).mockResolvedValue(updatedProduct);

      // dto settings
      const command: AddStockCommand = { productId: 1, amount: 10 };

      // real service calls
      const result: ProductResult = await productService.addProductStock(command);

      // expectactions
      expect(result.stock).toBe(131);
      expect(productRepositoryStub.findById).toHaveBeenCalledTimes(1);
      expect(productRepositoryStub.findById).toHaveBeenCalledWith(1);
      expect(productRepositoryStub.updateStock).toHaveBeenCalledTimes(1);
      expect(productRepositoryStub.updateStock).toHaveBeenCalledWith(1, 131);
    });

    it("존재하지 않는 상품에 재고를 1개 추가하면 'PRODUCT_NOT_FOUND' 메시지와 함께 에러 발생❌", async () => {
      // mock & stub settings
      (productRepositoryStub.findById as jest.Mock).mockResolvedValue(null);

      // dto settings
      const command: AddStockCommand = { productId: 10, amount: 1 };

      // real service calls & expectactions
      expect(productService.addProductStock(command)).rejects.toThrow("PRODUCT_NOT_FOUND");
      expect(productRepositoryStub.findById).toHaveBeenCalledTimes(1);
      expect(productRepositoryStub.findById).toHaveBeenCalledWith(10);
      expect(productRepositoryStub.updateStock).not.toHaveBeenCalled();
    });

    it("재고가 1개인 애플 맥세이프 충전기 20W의 재고를 2_147_483_647개 추가하면 'OVER_STOCK_LIMIT' 메시지와 함께 에러 발생❌", async () => {
      // mock & stub settings
      (productRepositoryStub.findById as jest.Mock).mockResolvedValue(mockProducts[1]);

      // dto settings
      const command: AddStockCommand = { productId: 2, amount: 2_147_483_647 };

      // real service calls & expectactions
      expect(productService.addProductStock(command)).rejects.toThrow("OVER_STOCK_LIMIT");
      expect(productRepositoryStub.findById).toHaveBeenCalledTimes(1);
      expect(productRepositoryStub.findById).toHaveBeenCalledWith(2);
      expect(productRepositoryStub.updateStock).not.toHaveBeenCalled();
    });
  });

  describe("deductProductStock", () => {
    it("다이슨 에어랩의 재고를 1개 차감하면 120개의 재고가 남아있어야 함✅", async () => {
      // mock & stub settings
      const updatedProduct = { id: 1, name: "다이슨 에어랩", stock: 120, price: 1200000 };
      (productRepositoryStub.findById as jest.Mock).mockResolvedValue(mockProducts[0]);
      (productRepositoryStub.updateStock as jest.Mock).mockResolvedValue(updatedProduct);

      // dto settings
      const command: DeductStockCommand = { productId: 1, amount: 1 };

      // real service calls
      const result: ProductResult = await productService.deductProductStock(command);

      // expectactions
      expect(result.stock).toBe(120);
      expect(productRepositoryStub.findById).toHaveBeenCalledTimes(1);
      expect(productRepositoryStub.findById).toHaveBeenCalledWith(1);
      expect(productRepositoryStub.updateStock).toHaveBeenCalledTimes(1);
      expect(productRepositoryStub.updateStock).toHaveBeenCalledWith(1, 120);
    });

    it("존재하지 않는 상품에 재고를 1개 차감하면 'PRODUCT_NOT_FOUND' 메시지와 함께 에러 발생❌", async () => {
      // mock & stub settings
      (productRepositoryStub.findById as jest.Mock).mockResolvedValue(null);

      // dto settings
      const command: DeductStockCommand = { productId: 10, amount: 1 };

      // real service calls & expectactions
      expect(productService.deductProductStock(command)).rejects.toThrow("PRODUCT_NOT_FOUND");
      expect(productRepositoryStub.findById).toHaveBeenCalledTimes(1);
      expect(productRepositoryStub.findById).toHaveBeenCalledWith(10);
      expect(productRepositoryStub.updateStock).not.toHaveBeenCalled();
    });

    it("재고가 0개인 안경닦이 100x100의 재고를 1개 차감하면 'NOT_ENOUGH_STOCK' 메시지와 함께 에러 발생❌", async () => {
      // mock & stub settings
      (productRepositoryStub.findById as jest.Mock).mockResolvedValue(mockProducts[3]);

      // dto settings
      const command: DeductStockCommand = { productId: 4, amount: 1 };

      // real service calls & expectactions
      expect(productService.deductProductStock(command)).rejects.toThrow("NOT_ENOUGH_STOCK");
      expect(productRepositoryStub.findById).toHaveBeenCalledTimes(1);
      expect(productRepositoryStub.findById).toHaveBeenCalledWith(4);
      expect(productRepositoryStub.updateStock).not.toHaveBeenCalled();
    });
  });
});
