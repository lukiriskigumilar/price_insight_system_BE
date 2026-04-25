-- CreateEnum
CREATE TYPE "Source" AS ENUM ('api', 'scraping');

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "price" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION,
    "total_sold" INTEGER NOT NULL DEFAULT 0,
    "source" "Source" NOT NULL,
    "store_name" VARCHAR(255),
    "product_url" TEXT,
    "category_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_title_source_key" ON "Product"("title", "source");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
