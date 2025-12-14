# 🛒 CekiMarket (CekiCekiMart)

<div align="center">

![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Inertia.js](https://img.shields.io/badge/Inertia.js-2.x-9553E9?style=for-the-badge)
![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=for-the-badge&logo=php&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Marketplace Terbaik untuk Jual Beli Online**

[Fitur](#-fitur) • [Instalasi](#-instalasi) • [Tech Stack](#-tech-stack) • [Struktur Project](#-struktur-project)

</div>

---

## 📖 Tentang Project

CekiMarket adalah platform marketplace modern yang dibangun dengan teknologi terdepan untuk memberikan pengalaman jual beli online yang nyaman dan aman. Platform ini memungkinkan penjual (seller) untuk mendaftar, mengelola produk, dan berinteraksi dengan pembeli, sementara admin dapat mengelola seluruh aktivitas marketplace.

## ✨ Fitur

### 👥 Untuk Pembeli
- 🔍 **Pencarian & Filter Produk** - Cari produk berdasarkan nama, kategori, kondisi, dan lokasi
- 📱 **Katalog Produk** - Jelajahi berbagai produk dengan tampilan yang menarik
- ⭐ **Review & Rating** - Berikan ulasan dan rating untuk produk yang dibeli
- 🏪 **Informasi Toko** - Lihat detail toko dan produk dari seller terpercaya
- 🎨 **UI Modern** - Antarmuka yang responsif dan user-friendly

### 🏪 Untuk Seller
- 📝 **Registrasi Seller** - Daftar sebagai penjual dengan proses verifikasi
- 📦 **Manajemen Produk** - Tambah, edit, dan kelola produk dengan mudah
- 📊 **Dashboard Seller** - Pantau performa penjualan dan statistik produk
- 📈 **Laporan Penjualan** - Generate laporan produk berdasarkan rating, stok, dan kebutuhan restock
- 🖼️ **Upload Gambar** - Upload gambar produk dengan thumbnail

### 👨‍💼 Untuk Admin
- 🎛️ **Dashboard Admin** - Overview lengkap aktivitas marketplace
- ✅ **Manajemen Seller** - Approve/reject pendaftaran seller
- 📊 **Laporan Komprehensif** - Laporan seller berdasarkan status, provinsi, dan produk berdasarkan rating
- 🔐 **Kontrol Akses** - Manajemen user dan permission

## 🛠️ Tech Stack

### Backend
- **Laravel 12** - PHP Framework yang powerful
- **MySQL** - Database management
- **Laravel Sanctum** - API Authentication
- **DomPDF** - PDF generation untuk laporan

### Frontend
- **React 18** - UI Library modern
- **Inertia.js** - SPA tanpa API
- **Tailwind CSS** - Utility-first CSS framework
- **Ziggy** - Route helper untuk JavaScript

### Development Tools
- **Laravel Breeze** - Authentication scaffolding
- **Vite** - Build tool yang cepat
- **Pest** - Testing framework

## 📦 Instalasi

### Prerequisites
- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL >= 8.0
- Git

### Langkah-langkah

1. **Clone repository**
   ```bash
   git clone https://github.com/rafihendiansyah/CekiMarket.git
   cd CekiMarket
   ```

2. **Install dependencies**
   ```bash
   composer install
   npm install
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Konfigurasi database**
   
   Edit file `.env` dan sesuaikan konfigurasi database:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=cekmarket
   DB_USERNAME=root
   DB_PASSWORD=
   ```

5. **Jalankan migration**
   ```bash
   php artisan migrate
   ```

6. **Build assets**
   ```bash
   npm run build
   # atau untuk development
   npm run dev
   ```

7. **Jalankan server**
   ```bash
   php artisan serve
   ```

   Aplikasi akan berjalan di `http://localhost:8000`

## 🚀 Development

### Menjalankan Development Server

```bash
# Jalankan Laravel server, queue worker, dan Vite dev server secara bersamaan
composer run dev
```

Atau secara terpisah:

```bash
# Terminal 1: Laravel server
php artisan serve

# Terminal 2: Vite dev server
npm run dev

# Terminal 3: Queue worker (jika menggunakan queue)
php artisan queue:work
```

### Testing

```bash
php artisan test
```

## 📁 Struktur Project

```
CekiMarket/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/          # Controller untuk admin
│   │   │   ├── Seller/         # Controller untuk seller
│   │   │   └── ...             # Controller lainnya
│   │   └── Middleware/
│   ├── Mail/                   # Email templates
│   └── Models/                 # Eloquent models
├── database/
│   ├── migrations/             # Database migrations
│   └── seeders/                # Database seeders
├── resources/
│   ├── js/
│   │   ├── Components/         # React components
│   │   ├── Layouts/            # Layout components
│   │   └── Pages/              # Page components
│   └── views/
│       ├── admin/              # Admin blade views
│       └── seller/             # Seller blade views
├── routes/
│   └── web.php                 # Web routes
└── public/                      # Public assets
```

## 🎯 Fitur Utama

### Kategori Produk
Platform mendukung berbagai kategori produk seperti:
- Elektronik
- Fashion & Pakaian
- Kesehatan & Kecantikan
- Makanan & Minuman
- Rumah Tangga
- Olahraga & Hobi
- Dan banyak lagi...

### Sistem Review
- Pembeli dapat memberikan review dan rating
- Review mencakup nama, email, dan komentar
- Rating berbasis bintang (1-5)

### Laporan
- **Admin**: Laporan seller berdasarkan status dan provinsi, laporan produk berdasarkan rating
- **Seller**: Laporan produk berdasarkan rating, stok, dan kebutuhan restock

## 🤝 Kontribusi

Kontribusi sangat diterima! Jika Anda ingin berkontribusi:

1. Fork repository ini
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

## 📝 License

Project ini menggunakan [MIT License](https://opensource.org/licenses/MIT).

## 👨‍💻 Developer

Dikembangkan dengan ❤️ oleh tim CekiMarket

---

<div align="center">

**⭐ Jika project ini membantu Anda, jangan lupa berikan star! ⭐**

Made with Laravel & React

</div>
