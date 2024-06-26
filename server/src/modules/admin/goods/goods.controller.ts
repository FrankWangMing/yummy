import { Body, Controller, Get, Post } from '@nestjs/common'
import { GoodsService } from 'src/services/goods/goods.service'
import { GoodsCategoryService } from 'src/services/goodsCategory/goodsCategory.service'

@Controller('admin/goods')
export class GoodsController {
  constructor(
    private readonly goodsCategory: GoodsCategoryService,
    private readonly goods: GoodsService
  ) {}

  @Post('createCategory')
  async createCategory(@Body() params) {
    return await this.goodsCategory.createGoodsCategory({
      name: params.name
    })
  }

  @Get('getCategory')
  async getCategory(@Body() params) {
    return await this.goodsCategory.getGoodsCategory({
      name: params.name
    })
  }

  @Post('delCategory')
  async delCategory(@Body() params) {
    return await this.goodsCategory.delGoodsCategory(params)
  }

  @Post('updateCategory')
  async updateCategory(@Body() params) {
    return await this.goodsCategory.updateGoodsCategory(params)
  }

  @Get('getGoods')
  async getGoods(@Body() params) {
    return await this.goods.getGoods(params)
  }

  @Post('delGoods')
  async delGoods(@Body() params) {
    return await this.goods.delGoods(params)
  }

  @Post('updateGoods')
  async updateGoods(@Body() params) {
    return await this.goods.updateGoods(params)
  }
}
