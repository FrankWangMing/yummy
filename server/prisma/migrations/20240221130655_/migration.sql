-- CreateEnum
CREATE TYPE "Role" AS ENUM ('UNDEFINED', 'WHOLESALER', 'MERCHANT', 'DRIVER');

-- CreateEnum
CREATE TYPE "ShopState" AS ENUM ('onLine', 'offline', 'applying', 'turnDown');

-- CreateEnum
CREATE TYPE "UserState" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "OrderState" AS ENUM ('PendingPay', 'Processing', 'Completed', 'Cancel');

-- CreateEnum
CREATE TYPE "OrderPayState" AS ENUM ('Pending', 'Processing', 'Paid', 'Cancelled');

-- CreateTable
CREATE TABLE "WXUser" (
    "openId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'UNDEFINED',

    CONSTRAINT "WXUser_pkey" PRIMARY KEY ("openId")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "phone" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userImg" TEXT,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WholesalerUser" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "userImg" TEXT,

    CONSTRAINT "WholesalerUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MerchantUser" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "money" INTEGER NOT NULL DEFAULT 0,
    "userImg" TEXT,

    CONSTRAINT "MerchantUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DriverUser" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "driver_state" "UserState" NOT NULL DEFAULT 'UNAVAILABLE',
    "userImg" TEXT,

    CONSTRAINT "DriverUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "goodsCategoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shopId" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "merchantUserId" TEXT NOT NULL,
    "goodsImg" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "mainGoodsImg" TEXT NOT NULL,

    CONSTRAINT "Goods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoodsCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GoodsCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriesOnShop" (
    "goodsCategoryId" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "CategoriesOnShop_pkey" PRIMARY KEY ("shopId","goodsCategoryId")
);

-- CreateTable
CREATE TABLE "Shop" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "merchantUserId" TEXT NOT NULL,
    "moveInTime" TIMESTAMP(3),
    "moveOutTime" TIMESTAMP(3),
    "recommend" BOOLEAN NOT NULL DEFAULT false,
    "shopState" "ShopState" NOT NULL DEFAULT 'applying',
    "shopImg" TEXT,
    "shopAddress" TEXT NOT NULL,
    "shopLevelId" TEXT,
    "shopApplicationId" TEXT NOT NULL,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopApplication" (
    "id" TEXT NOT NULL,
    "lengthOfStay" INTEGER NOT NULL,
    "appliyState" "ShopState" NOT NULL DEFAULT 'applying',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "moneyOfStay" INTEGER NOT NULL,
    "description" TEXT,
    "companyId" TEXT,
    "merchantUserId" TEXT NOT NULL,

    CONSTRAINT "ShopApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyAddress" TEXT NOT NULL,
    "companyCode" TEXT NOT NULL,
    "companyCard" TEXT NOT NULL,
    "companyOwner" TEXT NOT NULL,
    "ownerPhone" TEXT NOT NULL,
    "ownerID" TEXT NOT NULL,
    "ownerIDfrontend" TEXT NOT NULL,
    "ownerIDback" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingInformation" (
    "id" TEXT NOT NULL,
    "shopId" TEXT NOT NULL,

    CONSTRAINT "BillingInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShopLevel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "money" INTEGER NOT NULL,
    "description" TEXT,
    "commissionRatio" DOUBLE PRECISION NOT NULL,
    "handling" DOUBLE PRECISION NOT NULL,
    "remark" TEXT,

    CONSTRAINT "ShopLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoodsOnOrder" (
    "goodsId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,

    CONSTRAINT "GoodsOnOrder_pkey" PRIMARY KEY ("goodsId","orderId")
);

-- CreateTable
CREATE TABLE "Order" (
    "order_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderState" "OrderState" NOT NULL,
    "payState" "OrderPayState" NOT NULL DEFAULT 'Pending',
    "payMoney" INTEGER NOT NULL,
    "payTime" TIMESTAMP(3),
    "wholesalerUserId" TEXT NOT NULL,
    "goodsId" TEXT NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "GoodsCart" (
    "id" TEXT NOT NULL,
    "goodsId" TEXT[],
    "wholesalerUserId" TEXT NOT NULL,

    CONSTRAINT "GoodsCart_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_phone_key" ON "Admin"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "WholesalerUser_id_key" ON "WholesalerUser"("id");

-- CreateIndex
CREATE UNIQUE INDEX "WholesalerUser_phone_key" ON "WholesalerUser"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "MerchantUser_id_key" ON "MerchantUser"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MerchantUser_phone_key" ON "MerchantUser"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "DriverUser_id_key" ON "DriverUser"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DriverUser_phone_key" ON "DriverUser"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Goods_id_key" ON "Goods"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GoodsCategory_id_key" ON "GoodsCategory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Shop_id_key" ON "Shop"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Shop_merchantUserId_key" ON "Shop"("merchantUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Shop_shopLevelId_key" ON "Shop"("shopLevelId");

-- CreateIndex
CREATE UNIQUE INDEX "Shop_shopApplicationId_key" ON "Shop"("shopApplicationId");

-- CreateIndex
CREATE UNIQUE INDEX "ShopApplication_id_key" ON "ShopApplication"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ShopApplication_companyId_key" ON "ShopApplication"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "ShopApplication_merchantUserId_key" ON "ShopApplication"("merchantUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_id_key" ON "Company"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BillingInformation_id_key" ON "BillingInformation"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BillingInformation_shopId_key" ON "BillingInformation"("shopId");

-- CreateIndex
CREATE UNIQUE INDEX "ShopLevel_id_key" ON "ShopLevel"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_order_id_key" ON "Order"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "GoodsCart_id_key" ON "GoodsCart"("id");

-- CreateIndex
CREATE UNIQUE INDEX "GoodsCart_wholesalerUserId_key" ON "GoodsCart"("wholesalerUserId");

-- AddForeignKey
ALTER TABLE "Goods" ADD CONSTRAINT "Goods_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goods" ADD CONSTRAINT "Goods_goodsCategoryId_fkey" FOREIGN KEY ("goodsCategoryId") REFERENCES "GoodsCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goods" ADD CONSTRAINT "Goods_merchantUserId_fkey" FOREIGN KEY ("merchantUserId") REFERENCES "MerchantUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnShop" ADD CONSTRAINT "CategoriesOnShop_goodsCategoryId_fkey" FOREIGN KEY ("goodsCategoryId") REFERENCES "GoodsCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoriesOnShop" ADD CONSTRAINT "CategoriesOnShop_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_merchantUserId_fkey" FOREIGN KEY ("merchantUserId") REFERENCES "MerchantUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_shopLevelId_fkey" FOREIGN KEY ("shopLevelId") REFERENCES "ShopLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_shopApplicationId_fkey" FOREIGN KEY ("shopApplicationId") REFERENCES "ShopApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopApplication" ADD CONSTRAINT "ShopApplication_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShopApplication" ADD CONSTRAINT "ShopApplication_merchantUserId_fkey" FOREIGN KEY ("merchantUserId") REFERENCES "MerchantUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingInformation" ADD CONSTRAINT "BillingInformation_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsOnOrder" ADD CONSTRAINT "GoodsOnOrder_goodsId_fkey" FOREIGN KEY ("goodsId") REFERENCES "Goods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsOnOrder" ADD CONSTRAINT "GoodsOnOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_wholesalerUserId_fkey" FOREIGN KEY ("wholesalerUserId") REFERENCES "WholesalerUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsCart" ADD CONSTRAINT "GoodsCart_wholesalerUserId_fkey" FOREIGN KEY ("wholesalerUserId") REFERENCES "WholesalerUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
