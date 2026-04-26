# 🛒 Price Insight System - Backend

Sistem backend berbasis REST API untuk melakukan *scraping*, sinkronisasi, dan analisis perbandingan harga produk dari berbagai sumber *e-commerce* (Lazada & Mock API). Dibangun dengan arsitektur modern yang bersih, efisien, dan sepenuhnya di-Dockerize.

## ✨ Fitur Utama

- 🕷️ **Multi-source Scraping**: Mengambil data dari HTML web dinamis menggunakan **Puppeteer (Stealth Mode)** dan endpoint REST API menggunakan **Axios**.
- ⚡ **Parallel Processing**: Menjalankan ekstraksi data dari berbagai sumber secara bersamaan untuk memangkas waktu respons.
- 🛡️ **Smart Deduplication**: Mencegah data ganda secara otomatis di level *database engine* menggunakan Prisma `createMany` dengan `skipDuplicates`.
- 📊 **Price Analytics**: Menghitung statistik produk secara langsung (Harga rata-rata, termurah, termahal, dan total produk).
- 🐳 **Docker Ready**: Lingkungan pengembangan yang terisolasi dengan instalasi OS Alpine Linux + Chromium bawaan.

---

## 🛠️ Teknologi yang Digunakan

- **Platform**: Node.js (v24)
- **Framework**: Express.js
- **Database & ORM**: PostgreSQL (v13) & Prisma ORM
- **Scraping Engine**: Puppeteer Extra (Stealth Plugin) & Cheerio
- **Validation**: Joi
- **Testing**: Jest
- **Containerization**: Docker & Docker Compose

---

## ⚙️ Prasyarat (Prerequisites)

Pastikan sistem Anda sudah memiliki perangkat lunak berikut sebelum menjalankan aplikasi:
- Docker & Docker Compose
- Git
- Node.js (Opsional, hanya jika ingin menjalankan di luar Docker)

---

## 🚀 Cara Instalasi & Menjalankan Aplikasi

### 1. Clone Repository
```bash
git clone <repository-url>
cd price_insight_system_BE
```

### 2. Konfigurasi Environment Variables
Buat file `.env` di root direktori proyek dan sesuaikan dengan konfigurasi berikut:
```env
# Database Config
POSTGRES_USER=postgres
POSTGRES_PASSWORD=rahasia
POSTGRES_DB=price_insight_db

# Prisma Database URL (Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public)
DATABASE_URL="postgresql://postgres:rahasia@db:5432/price_insight_db?schema=public"

# Target API URL untuk Scraper
API_SCRAPER_URL="https://69eb7f8297482ad5c527c833.mockapi.io/products/"
```

### 3. Build & Launch dengan Docker
Jalankan perintah berikut untuk mem-build *image* Node.js (dan mengunduh Chromium) serta menyalakan database PostgreSQL:
```bash
docker compose up -d --build
```

### 4. Migrasi and Generate Database (Prisma)
Setelah container menyala, jalankan migrasi Prisma untuk membuat tabel di dalam PostgreSQL:
```bash
docker compose exec app npx prisma migrate dev --name init
docker compose exec app npx prisma generate
```

Aplikasi sekarang berjalan di `http://localhost:3000` 

---

## 📖 Dokumentasi API (Routing)

Aplikasi ini menggunakan *prefix* `/api` untuk semua *endpoint*. Berikut adalah daftar *route* utama yang tersedia:

### 1. Sinkronisasi Data Produk (Scraping)
Memicu bot scraper (Puppeteer & Axios) untuk mencari produk berdasarkan *keyword* dan menyimpannya ke database PostgreSQL. Dilengkapi validasi *payload* menggunakan Joi.
- **Method:** `POST`
- **Endpoint:** `/api/product-sync`
- **Payload (JSON):**
  ```json
  {
      "keyword": "iphone"
  }
  ```
- **Response (201 Created):**
  ```json
  {
      "status": "success",
      "message": "Successfully added 40 products",
      "data": null,
  }
  ```

### 2. Ambil Daftar Produk
Mengambil daftar produk yang sudah tersimpan di database. Mendukung filter pencarian berdasarkan nama kategori menggunakan *query parameter*.
- **Method:** `GET`
- **Endpoint:** `/api/products`
- **Query Parameters (Opsional):**
  - `category` (string) - Contoh: `?category=iphone`
- **Response (200 OK):**
  ```json
  {
      "status": "success",
      "message": "success get products with category \"iphone\"",
      "data": [
          {
              "id": 1,
              "title": "Apple iPhone 14 Pro Max",
              "price": 15000000,
              "rating": null,
              "total_sold": 1500,
              "source": "scraping",
              "store_name": null,
              "product_url": "https://lazada.co.id/...",
              "category_id": 1
          }
      ]
  }
  ```

### 3. Analisis & Statistik Produk
Mengambil ringkasan data produk (Total, Rata-rata Harga, Harga Termurah, Harga Termahal). Sangat berguna untuk *dashboard* analitik. Mendukung filter pencarian berdasarkan nama kategori.
- **Method:** `GET`
- **Endpoint:** `/api/products/stats`
- **Query Parameters (Opsional):**
  - `category` (string) - Contoh: `?category=iphone`
- **Response (200 OK):**
  ```json
  {
      "status": "success",
      "message": "success get product stats with category \"iphone\"",
      "data": {
          "totalProducts": 42,
          "averagePrice": 12500000,
          "minPrice": 9000000,
          "maxPrice": 22000000
      },
  }

