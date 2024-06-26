import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.wholesalerUser.deleteMany()

  await prisma.goods.deleteMany()
  // await prisma.shop.deleteMany()
  await prisma.merchantUser.deleteMany()

  // const deleteMerchantUser = prisma.merchantUser.deleteMany({})
  //
  // const deleteShop = prisma.shop.deleteMany()
  //
  // const transaction = await prisma.$transaction([
  //   deleteMerchantUser,
  //   deleteShop
  // ])
  // 新增 admin
  await prisma.admin.create({
    data: {
      phone: '15258364583',
      username: 'WANG',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm' // secret42
    }
  })
  console.log('Seeding... Add Wholesaler')

  const wholesalerUser1 = await prisma.wholesalerUser.create({
    data: {
      phone: '15258364583',
      username: 'WANG',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm' // secret42
    }
  })
  console.log({ wholesalerUser1 })

  const merchantUser1 = await prisma.merchantUser.create({
    data: {
      phone: '15258364583',
      username: 'WANG',
      password: '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm' // secret42
    }
  })
  console.log({ merchantUser1 })

  console.log('ADD 分类')
  const goodsCategory = await prisma.goodsCategory.create({
    data: {
      name: '分类 1'
    }
  })
  console.log(merchantUser1)
  console.log('ADD 商品')
  const shop = await prisma.shop.findUnique({
    where: {
      id: merchantUser1.id
    }
  })
  console.log(merchantUser1.id)
  // for (let i = 0; i < 10; i++) {
  //   await prisma.goods.create({
  //     data: {
  //       shopId: shop.id,
  //       merchantUserId: merchantUser1.id,
  //       goodsCategoryId: goodsCategory.id,
  //       stock: 1000,
  //       name: `好东西-${i}`,
  //       price: 1,
  //     }
  //   })
  // }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
