import { BadRequestException, Body, Controller, Get, NotFoundException, Post } from "@nestjs/common";
import { ProductService } from "../domain/service/product.service";
import { GetAllProductsResDto } from "./dto/get-all-products.res.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetProductReqDto } from "./dto/get-product.req.dto";
import { GetProductResDto } from "./dto/get-product.res.dto";
import { GetProductCommand } from "../domain/dto/get-product.command.dto";
import { AddStockReqDto } from "./dto/add-stock.req.dto";
import { AddStockResDto } from "./dto/add-stock.res.dto";
import { AddStockCommand } from "../domain/dto/add-stock.command.dto";
import { DeductStockReqDto } from "./dto/deduct-stock.req.dto";
import { DeductStockResDto } from "./dto/deduct-stock.res.dto";
import { DeductStockCommand } from "../domain/dto/deduct-stock.command.dto";

@ApiTags("Product Management")
@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: "getAllProducts" })
  @ApiResponse({ status: 200, description: "200 - OK", type: GetAllProductsResDto })
  async getAllProducts(): Promise<GetAllProductsResDto> {
    const products = await this.productService.getAllProducts();

    return { products: products };
  }

  @Post("")
  @ApiOperation({ summary: "getProduct" })
  @ApiResponse({ status: 200, description: "200 - OK", type: GetProductResDto })
  @ApiResponse({ status: 404, description: "404 - NotFound", type: NotFoundException })
  async getProduct(@Body() getProductReqDto: GetProductReqDto): Promise<GetProductResDto> {
    const command: GetProductCommand = {
      ...getProductReqDto,
    };

    try {
      return await this.productService.getProduct(command);
    } catch (error) {
      switch (error.message) {
        case "PRODUCT_NOT_FOUND":
          throw new NotFoundException("상품을 찾을 수 없습니다.");
        default:
          throw error;
      }
    }
  }

  @Post("stock/add")
  @ApiOperation({ summary: "addProductStock" })
  @ApiResponse({ status: 200, description: "200 - OK", type: GetProductResDto })
  @ApiResponse({ status: 400, description: "400 - BadRequest", type: BadRequestException })
  @ApiResponse({ status: 404, description: "404 - NotFound", type: NotFoundException })
  async addProductStock(@Body() addStockReqDto: AddStockReqDto): Promise<AddStockResDto> {
    const command: AddStockCommand = {
      ...addStockReqDto,
    };

    try {
      return await this.productService.addProductStock(command);
    } catch (error) {
      switch (error.message) {
        case "PRODUCT_NOT_FOUND":
          throw new NotFoundException("상품을 찾을 수 없습니다.");
        case "OVER_STOCK_LIMIT":
          throw new NotFoundException("재고 추가 후 재고량이 최대 재고량인 2_147_483_647개 보다 많습니다.");
        default:
          throw error;
      }
    }
  }

  @Post("stock/deduct")
  @ApiOperation({ summary: "deductProductStock" })
  @ApiResponse({ status: 200, description: "200 - OK", type: GetProductResDto })
  @ApiResponse({ status: 400, description: "400 - BadRequest", type: BadRequestException })
  @ApiResponse({ status: 404, description: "404 - NotFound", type: NotFoundException })
  async deductProductStock(@Body() deductStockReqDto: DeductStockReqDto): Promise<DeductStockResDto> {
    const command: DeductStockCommand = {
      ...deductStockReqDto,
    };

    try {
      return await this.productService.deductProductStock(command);
    } catch (error) {
      switch (error.message) {
        case "PRODUCT_NOT_FOUND":
          throw new NotFoundException("상품을 찾을 수 없습니다.");
        case "NOT_ENOUGH_STOCK":
          throw new NotFoundException("잔여 재고가 부족합니다.");
        default:
          throw error;
      }
    }
  }
}
