import { Body, Controller, Post } from '@nestjs/common'
import { CreateGoodsCategoryInput } from 'src/dto/goodscategory/creategoodscategory.input'
import { GoodsCategoryService } from 'src/services/goodsCategory/goodsCategory.service'

@Controller('admin')
export class GoodsCategoryController {
  constructor(private readonly goodsCategory: GoodsCategoryService) {}

  @Post('creategoodscategory')
  async create(@Body() params: CreateGoodsCategoryInput) {
    return await this.goodsCategory.createGoodsCategory({
      name: params.name
    })
  }
}
