import { Body, Controller, Get, Post } from "@nestjs/common";
import { ProductService } from "../domain/service/product.service";
import { GetAllProductsResDto } from "./dto/get-all-products.res.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetProductReqDto } from "./dto/get-product.req.dto";
import { GetProductResDto } from "./dto/get-product.res.dto";
import { GetProductCommand } from "../domain/dto/get-product.command";
import { AddStockReqDto } from "./dto/add-stock.req.dto";
import { AddStockResDto } from "./dto/add-stock.res.dto";
import { AddStockCommand } from "../domain/dto/add-stock.command";
import { DeductStockReqDto } from "./dto/deduct-stock.req.dto";
import { DeductStockResDto } from "./dto/deduct-stock.res.dto";
import { DeductStockCommand } from "../domain/dto/deduct-stock.command";
import { GetPopularProductsResDto } from "./dto/get-popular-products.res.dto";

@ApiTags("Product Management")
@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: "getAllProducts" })
  @ApiResponse({ status: 200, description: "OK", type: GetAllProductsResDto })
  async getAllProducts(): Promise<GetAllProductsResDto> {
    const products = await this.productService.getAllProducts();

    return { products: products };
  }

  @Post("")
  @ApiOperation({ summary: "getProduct" })
  @ApiResponse({ status: 200, description: "OK", type: GetProductResDto })
  @ApiResponse({ status: 404, description: "상품을 찾을 수 없습니다." })
  async getProduct(@Body() getProductReqDto: GetProductReqDto): Promise<GetProductResDto> {
    const command: GetProductCommand = {
      ...getProductReqDto,
    };

    return await this.productService.getProduct(command);
  }

  @Post("stock/add")
  @ApiOperation({ summary: "addStock" })
  @ApiResponse({ status: 200, description: "OK", type: AddStockResDto })
  @ApiResponse({ status: 400, description: "재고 추가량이 유효하지 않습니다." })
  @ApiResponse({ status: 404, description: "상품을 찾을 수 없습니다." })
  async addStock(@Body() addStockReqDto: AddStockReqDto): Promise<AddStockResDto> {
    const command: AddStockCommand = {
      ...addStockReqDto,
    };

    return await this.productService.addStock(command);
  }

  @Post("stock/deduct")
  @ApiOperation({ summary: "deductStock" })
  @ApiResponse({ status: 200, description: "OK", type: DeductStockResDto })
  @ApiResponse({ status: 400, description: "재고 추가량이 유효하지 않습니다." })
  @ApiResponse({ status: 404, description: "상품을 찾을 수 없습니다." })
  async deductStock(@Body() deductStockReqDto: DeductStockReqDto): Promise<DeductStockResDto> {
    const command: DeductStockCommand = {
      ...deductStockReqDto,
    };

    return await this.productService.deductStock(command);
  }

  @Get("top5")
  @ApiOperation({ summary: "getPopularProducts" })
  @ApiResponse({ status: 200, description: "OK", type: GetPopularProductsResDto })
  async getPopularProducts(): Promise<GetPopularProductsResDto> {
    const products = await this.productService.getPopularProducts();

    return { products: products };
  }
}
