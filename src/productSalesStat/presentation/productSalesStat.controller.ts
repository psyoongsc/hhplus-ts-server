import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProductSalesStatService } from "../domain/service/productSalesStat.service";
import { GetPopularProductsResDto } from "./dto/get-popular-products.res.dto";
import { AddProductSalesStatReqDto } from "./dto/add-product-sales-stat.req.dto";
import { AddProductSalesStatCommand } from "../domain/dto/add-product-sales-stat.command.dto";
import { AddProductSalesStatResDto } from "./dto/add-product-sales-stat-res.dto";

@ApiTags("Product Sales Stat Management")
@Controller("productsalesstat")
export class ProductSalesStatController {
  constructor(private readonly productSalesStatService: ProductSalesStatService) {}

  @Get("top5")
  @ApiOperation({ summary: "getPopularProducts" })
  @ApiResponse({ status: 200, description: "200 - OK", type: GetPopularProductsResDto })
  async getPopularProducts(): Promise<GetPopularProductsResDto> {
    const products = await this.productSalesStatService.getPopularProducts();

    return { products: products };
  }

  // @Get("v2/top5")
  // @ApiOperation({ summary: "getPopularProducts" })
  // @ApiResponse({ status: 200, description: "200 - OK", type: GetPopularProductsResDto })
  // async getPopularProductsV2(): Promise<GetPopularProductsResDto> {
  //   const products = await this.productSalesStatService.getPopularProductsV2();

  //   return { products: products };
  // }

  @Post("add")
  @ApiOperation({ summary: "addProductSalesStat" })
  @ApiResponse({ status: 200, description: "200 - OK", type: AddProductSalesStatResDto })
  async addProductSalesStat(
    @Body() addProductSalesStatReqDto: AddProductSalesStatReqDto,
  ): Promise<AddProductSalesStatResDto> {
    const command: AddProductSalesStatCommand = {
      ...addProductSalesStatReqDto,
    };

    return await this.productSalesStatService.addProductSalesStat(command);
  }
}
