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

