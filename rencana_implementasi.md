# 🚗 Perencanaan Fitur Sistem Manajemen Cuci Mobil (Untuk Elbar Car Wash)

> **Stack**: Laravel 11 + React (Inertia.js) + TailwindCSS  
> **Status Sekarang**: Fondasi awal — model `Service`, `ServiceCategory`, tabel users & services sudah ada.

---

## 🎯 Visi Produk

Sistem Manajemen Cuci Mobil ini adalah platform yang dirancang khusus untuk **Elbar Car Wash**, memungkinkan pemilik usaha mengelola operasional dari A sampai Z — mulai dari pemesanan pelanggan, manajemen antrian, pencatatan transaksi, hingga laporan keuangan — semua dalam satu dashboard yang modern dan intuitif.

---

## 🏗️ Standar Arsitektur & Teknis (Non-Functional)

Sistem ini dirancang dengan prinsip **Scalable, Maintainable, Modular, dan Mobile-First**:

1. **Backend (Laravel 11)**:
   - **Service / Action Pattern**: Logika bisnis (seperti hitung harga, poin) dipisahkan dari Controller ke *Service Classes* agar rapi dan *reusable* (Modular).
   - **Scalable**: Database dirancang optimal dengan *indexing* pada kolom kunci (seperti `plate_number` atau `order_number`) agar tetap cepat walau data jutaan.

2. **Frontend (React + Inertia.js)**:
   - **Mobile-First & Responsif**: Menggunakan TailwindCSS, seluruh antarmuka (terutama POS Kasir) di-desain mulai dari ukuran layar HP (mobile), lalu disesuaikan ke Tablet dan Desktop. Kasir bisa bekerja sambil berjalan membawa tablet.
   - **Component-Driven**: UI dipecah menjadi komponen kecil yang dapat didaur ulang (Button, Card, Modal, Form Input) sehingga sangat mudah di-*maintenance* jika ada perubahan desain.
   - **Format Mata Uang Indonesia (IDR)**: Semua tampilan nominal mata uang (harga, total, diskon) dan *input* nominal di *form* wajib menggunakan format Rupiah (contoh: Rp 15.000) dengan pemisah ribuan otomatis.

---

## 📦 Modul & Fitur Lengkap

### 🔐 MODUL 1 — Autentikasi & Manajemen Pengguna

| Fitur | Deskripsi | Prioritas |
|-------|-----------|-----------|
| Login & Register | Multi-role: Admin, Kasir, Teknisi | 🔴 Wajib |
| Role & Permission | Guard berbeda untuk setiap role | 🔴 Wajib |
| Profil Pengguna | Edit profil, foto, password | 🟡 Penting |
| Activity Log | Rekam semua aktivitas user di sistem | 🟢 Tambahan |
| 2FA (OTP) | Keamanan login dengan kode OTP via WhatsApp | 🟢 Tambahan |

**Roles yang direncanakan:**
- `superadmin` — akses penuh, setup sistem
- `admin` — kelola semua operasional
- `kasir` — input order, terima pembayaran
- `teknisi` — lihat antrian & update status
- `pelanggan` — booking mandiri (opsional, jika ada fitur self-service)

---

### 🛠️ MODUL 2 — Manajemen Layanan (Sudah Ada Fondasi)

| Fitur | Deskripsi | Prioritas |
|-------|-----------|-----------|
| Kategori Layanan | Contoh: Cuci Biasa, Poles, Detailing | 🔴 Wajib |
| Daftar Layanan | Harga, deskripsi, ukuran kendaraan | 🔴 Wajib |
| Harga per Ukuran | Small / Medium / Large / XL / Lux | 🔴 Wajib |
| Paket Bundling | Gabungan beberapa layanan dengan harga spesial | 🟡 Penting |
| Layanan Add-on | Extra item yang bisa ditambah ke order (parfum, lap kaca, dll) | 🟡 Penting |
| Manajemen Foto Layanan | Upload foto contoh hasil layanan | 🟢 Tambahan |

**Tipe Layanan yang umum:**
```
├── Cuci Standar (Eksterior)
├── Cuci Interior
├── Cuci Full (Eksterior + Interior)
├── Poles Body
├── Coating / Nano Coating
├── Detailing
├── Salon Mobil
└── Odor Treatment
```

---

### 📋 MODUL 3 — Manajemen Order / Pemesanan

| Fitur | Deskripsi | Prioritas |
|-------|-----------|-----------|
| Buat Order Baru | Input manual oleh kasir (walk-in) | 🔴 Wajib |
| Nomor Antrian Otomatis | Generate nomor antrian per hari | 🔴 Wajib |
| Order Online (Self-Service) | Pelanggan booking via link/web | 🟡 Penting |
| Multi-layanan per Order | 1 order bisa memilih beberapa layanan | 🔴 Wajib |
| Estimasi Durasi | Hitung otomatis durasi berdasarkan layanan | 🟡 Penting |
| Estimasi Selesai | Tampilkan jam perkiraan selesai | 🟡 Penting |
| Data Kendaraan | Pencatatan super cepat hanya menggunakan Plat Nomor | 🔴 Wajib |
| Catatan Khusus | Instruksi tambahan dari pelanggan | 🔴 Wajib |
| Booking Jadwal | Reservasi untuk hari/jam tertentu | 🟡 Penting |

**Status Siklus Order:**
```
MENUNGGU → DIPROSES → SELESAI → DIBAYAR
                ↓
            DIBATALKAN
```

---

### 🚦 MODUL 4 — Manajemen Antrian (Queue Management)

| Fitur | Deskripsi | Prioritas |
|-------|-----------|-----------|
| Dashboard Antrian Real-time | Tampilan antrian live untuk teknisi | 🔴 Wajib |
| Drag & Drop Antrian | Atur ulang prioritas antrian | 🟡 Penting |
| Update Status oleh Teknisi | Teknisi klik tombol selesai per tahap | 🔴 Wajib |
| Display Monitor (TV Mode) | Layar besar untuk ruang tunggu pelanggan | 🟡 Penting |
| Notifikasi Selesai | WhatsApp/SMS/notif in-app saat kendaraan selesai | 🟡 Penting |
| Bay/Stall Management | Kelola slot area pengerjaan (Bay 1, Bay 2, dst) | 🟢 Tambahan |

---

### 💰 MODUL 5 — Kasir & Transaksi

| Fitur | Deskripsi | Prioritas |
|-------|-----------|-----------|
| Point of Sale (POS) | Interface kasir yang cepat & intuitif | 🔴 Wajib |
| Multi Metode Pembayaran | Tunai, Transfer, QRIS, Kartu Debit | 🔴 Wajib |
| Cetak Struk | Print struk ke Printer Thermal & kirim via WhatsApp | 🔴 Wajib |
| Diskon & Voucher | Diskon persen/nominal, kupon promo | 🟡 Penting |
| Loyalty Points | Poin reward untuk pelanggan setia | 🟢 Tambahan |
| Hitung Kembalian | Kalkulasi kembalian uang cash otomatis | 🔴 Wajib |
| Riwayat Transaksi | Semua riwayat transaksi per hari/bulan | 🔴 Wajib |
| Void / Batal Transaksi | Batalkan transaksi dengan alasan & approval | 🟡 Penting |
| Refund | Proses pengembalian uang | 🟢 Tambahan |

---

### 👥 MODUL 6 — Manajemen Pelanggan (CRM)

| Fitur | Deskripsi | Prioritas |
|-------|-----------|-----------|
| Database Kendaraan | Data historis kunjungan berdasarkan Plat Nomor | 🔴 Wajib |
| Riwayat Kunjungan | Semua order & pembayaran per Plat Nomor | 🔴 Wajib |
| Poin Loyalitas | Akumulasi & redeem poin otomatis berbasis Plat | 🟢 Tambahan |
| Membership / Langganan | Paket membership bulanan (cuci X kali/bulan) | 🟡 Penting |
| Customer Segmentation | Kategorikan: VIP, Regular, Baru | 🟢 Tambahan |
| Reminder Servis | Notif otomatis jika sudah lama tidak cuci | 🟢 Tambahan |
| Rating & Ulasan | Pelanggan beri bintang & ulasan | 🟡 Penting |

---

### 🧑‍🔧 MODUL 7 — Manajemen Karyawan / Teknisi

| Fitur | Deskripsi | Prioritas |
|-------|-----------|-----------|
| Data Karyawan | Profil, jabatan, kontak | 🔴 Wajib |
| Jadwal Shift | Kelola jadwal kerja karyawan | 🟡 Penting |
| Absensi | Clock in/out, rekap kehadiran | 🟡 Penting |
| Penugasan Order | Assign teknisi ke setiap order | 🔴 Wajib |
| Kinerja Teknisi | Jumlah order selesai, rating dari pelanggan | 🟡 Penting |
| Komisi/Insentif | Hitung komisi berdasarkan jumlah order | 🟢 Tambahan |
| Penggajian | Rekap gaji bulanan | 🟢 Tambahan |

---

### 🧴 MODUL 8 — Manajemen Stok & Inventori

| Fitur | Deskripsi | Prioritas |
|-------|-----------|-----------|
| Daftar Produk/Bahan | Sabun, cairan poles, microfiber, dll | 🟡 Penting |
| Stok Masuk | Input pembelian stok baru | 🟡 Penting |
| Stok Keluar | Catat pemakaian bahan per order | 🟡 Penting |
| Stok Minimum Alert | Notifikasi saat stok hampir habis | 🟡 Penting |
| Supplier Management | Data supplier & riwayat pembelian | 🟢 Tambahan |
| Laporan Pemakaian | Analisis penggunaan bahan per periode | 🟢 Tambahan |

---

### 📊 MODUL 9 — Laporan & Analitik

| Fitur | Deskripsi | Prioritas |
|-------|-----------|-----------|
| Laporan Penjualan Harian | Total omzet, jumlah order, rata-rata | 🔴 Wajib |
| Laporan Bulanan / Tahunan | Trend penjualan antar periode | 🔴 Wajib |
| Laporan per Layanan | Layanan apa yang paling laku | 🟡 Penting |
| Laporan per Teknisi | Produktivitas masing-masing teknisi | 🟡 Penting |
| Laporan Keuangan | Pemasukan, pengeluaran, laba bersih | 🟡 Penting |
| Grafik & Dashboard Visual | Chart line, bar, pie yang interaktif | 🔴 Wajib |
| Export Excel / PDF | Unduh laporan dalam format standar | 🟡 Penting |
| Peak Hour Analysis | Analisis jam/hari tersibuk | 🟢 Tambahan |

---

### ⚙️ MODUL 10 — Pengaturan Sistem

| Fitur | Deskripsi | Prioritas |
|-------|-----------|-----------|
| Profil Bisnis | Nama toko, logo, alamat, kontak | 🔴 Wajib |
| Jam Operasional | Setting jam buka/tutup, hari libur | 🔴 Wajib |
| Konfigurasi Printer | Setup printer termal untuk struk | 🟡 Penting |
| Template Notifikasi | Kustomisasi pesan WhatsApp/SMS | 🟡 Penting |
| Backup Data | Export & backup database otomatis | 🟡 Penting |
| Multi-Cabang | Kelola lebih dari 1 lokasi cuci mobil | 🟢 Tambahan |
| Integrasi WhatsApp | Notif otomatis via WA Gateway | 🟢 Tambahan |

---

### 📱 MODUL 11 — Fitur Pelanggan (Self-Service / Customer Facing)

| Fitur | Deskripsi | Prioritas |
|-------|-----------|-----------|
| Landing Page | Halaman publik profil usaha & layanan | 🔴 Wajib |
| Booking Online | Form reservasi dari halaman publik | 🟡 Penting |
| Cek Status Order | Pelanggan cek status via no. HP / kode order | 🟡 Penting |
| Riwayat Order Pelanggan | Jika ada akun pelanggan | 🟢 Tambahan |
| Program Referral | Ajak teman dapat poin | 🟢 Tambahan |

---

## 🗺️ Roadmap Pengembangan

### ✅ Fase 0 — Fondasi (SUDAH ADA)
- [x] Setup Laravel + Inertia.js + React
- [x] Model `Service` & `ServiceCategory`
- [x] Migrasi tabel dasar

### 🔴 Fase 1 — MVP (Bulan 1-2)
- [ ] Role & Permission (Spatie Laravel Permission)
- [ ] CRUD Layanan & Kategori (lengkap dengan UI)
- [ ] Manajemen Order (buat, update status, data kendaraan)
- [ ] Antrian Sederhana (dashboard real-time)
- [ ] Kasir & Transaksi Dasar (POS, multi payment)
- [ ] Cetak Struk (PDF)
- [ ] Laporan Harian Sederhana

### 🟡 Fase 2 — Core Features (Bulan 3-4)
- [ ] CRM Pelanggan & Database Kendaraan
- [ ] Manajemen Karyawan & Penugasan Teknisi
- [ ] Manajemen Stok & Inventori
- [ ] Sistem Diskon & Voucher
- [ ] Laporan Lengkap (chart, export Excel/PDF)
- [ ] Display Monitor (TV Antrian)
- [ ] Notifikasi WhatsApp

### 🟢 Fase 3 — Advanced (Bulan 5-6)
- [ ] Booking Online (Customer Self-Service)
- [ ] Loyalty Points & Membership
- [ ] Absensi & Penggajian Karyawan
- [ ] Analitik Lanjutan (Peak Hour, Segmentasi)
- [ ] Multi-Cabang
- [ ] Aplikasi Mobile (PWA atau React Native)

---

## 🗄️ Rancangan Database (Entity Relationship)

```
users (id, name, email, role, phone, avatar)
  └── employees (id, user_id, position, shift_start, shift_end)

vehicles (id, plate_number, points, total_visits)

service_categories (id, name, slug, icon, type)
  └── services (id, service_category_id, name, price, vehicle_size, duration_minutes)
        └── service_packages (id, name, price, services[])

orders (id, order_number, vehicle_id, employee_id, bay_id, status, notes, total, discount, grand_total)
  ├── order_items (id, order_id, service_id, price, quantity)
  └── order_status_logs (id, order_id, status, changed_by, changed_at)

payments (id, order_id, method, amount, paid_at, cashier_id)
  └── payment_details (id, payment_id, method, amount)

queues (id, order_id, bay_id, queue_number, started_at, finished_at)
bays (id, name, is_active)

products (id, name, category, unit, stock, min_stock, cost_price)
  ├── stock_in (id, product_id, qty, supplier_id, date, notes)
  └── stock_out (id, product_id, qty, order_id, date)

vouchers (id, code, type[percent/nominal], value, max_use, used_count, expired_at)
loyalty_points (id, customer_id, points, type[earn/redeem], order_id)

notifications (id, user_id, type, message, data, read_at)
settings (id, key, value, group)
```

---

## ❓ Pertanyaan & Keputusan Diskusi

### ✅ Keputusan yang Sudah Disepakati:
- **Pencatatan Order**: Menggunakan input super cepat (hanya **Plat Nomor Kendaraan**). Tidak perlu mendata nama/no HP saat awal, dan tidak perlu fitur unggah foto kendaraan.
- **Cetak Struk & Notifikasi**: Sistem pos harus terintegrasi dengan **Printer Thermal** untuk cetak fisik, sekaligus mendukung pengiriman notifikasi/struk via **WhatsApp**.

### ❓ Pertanyaan yang Belum Terjawab:
1. **Skala Bisnis**: Apakah sistem ini untuk **1 cabang Elbar Car Wash** saja atau perlu mendukung **multi-cabang** dari awal?
2. **Pelanggan Self-Service**: Apakah pelanggan bisa **daftar akun sendiri** dan booking online? Atau semua order **hanya bisa diinput kasir**?
3. **WhatsApp Gateway**: Layanan apa yang akan dipakai? (Fonnte, WablasAPI, dll)
4. **Pembayaran Digital**: Apakah perlu integrasi QRIS/payment gateway otomatis (seperti Midtrans, Xendit) atau cukup **input manual** (kasir konfirmasi saldo sendiri)?
