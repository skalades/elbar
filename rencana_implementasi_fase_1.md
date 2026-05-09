# 🚗 Rencana Implementasi Fase 1: MVP (Minimum Viable Product)

Dokumen ini memuat rincian fitur dan arsitektur untuk Fase 1 Elbar Car Wash. Fase ini berfokus pada fondasi utama agar bisnis bisa segera berjalan secara digital.

## 🏗️ Standar Arsitektur & UI/UX (Wajib di Fase 1)

Untuk memastikan sistem **Scalable, Mudah Dimaintenance, Modular, Mobile-First, dan Responsif**, kita menerapkan standar berikut:

1. **Card-Based Dashboard (Mobile UI/UX)**
   - Desain tidak akan mengandalkan tabel data (DataTables) yang kaku.
   - Semua entitas (Daftar Layanan, Antrian, Histori Transaksi) akan ditampilkan dalam bentuk **Card** dengan *rounded corners*, *soft shadows*, dan tipografi yang jelas (seperti UI aplikasi Gojek/Grab).
   - Menu navigasi menggunakan *Bottom Navigation Bar* untuk akses dari HP, dan *Sidebar* untuk akses dari PC/Tablet.

2. **Frontend Modular (React + Inertia + TailwindCSS)**
   - Semua elemen UI dipecah menjadi komponen: `Card`, `FloatingActionButton`, `BottomSheetModal`, `Badge`.
   - Kode *frontend* harus bersih, *reusable*, dan mudah dimodifikasi (*Maintainable*).
   - **Format Mata Uang (Rupiah)**: Semua input nominal di kasir dan tampilan harga wajib menggunakan format mata uang Indonesia (IDR), lengkap dengan prefix "Rp" dan separator ribuan otomatis saat mengetik.

3. **Backend Scalable & Modular (Laravel 11)**
   - Logika transaksi POS dan Antrian tidak diletakkan di *Controller*. Semuanya akan dipisah ke dalam *Service Classes* (contoh: `OrderService.php`, `QueueService.php`).
   - *Database Indexing* pada kolom `plate_number` dan `status` untuk memastikan query secepat kilat walaupun data mencapai ratusan ribu.

---

## 📦 Rincian Fitur Fase 1

### 1. Autentikasi & Role Management
- **Login Multi-Role**: Akses masuk terpisah untuk Superadmin (Developer), Owner, dan Kasir.
- **Spatie Permission**: Hak akses per modul. Kasir tidak bisa menghapus transaksi atau mengubah harga.

### 2. Manajemen Layanan (UI Card Based)
- **Tampilan Grid Card**: Layanan ditampilkan dalam *grid* berupa kartu bergambar ikon/foto dengan tombol "Edit" dan "Hapus".
- **Kustomisasi Ukuran**: Harga berbeda otomatis menyesuaikan dengan ukuran mobil (Kecil, Sedang, Besar).

### 3. Point of Sales (POS) Kasir Super Cepat
- **Input Berbasis Plat Nomor**: Alur kasir dimulai dengan *input* plat nomor (huruf besar otomatis, format rapi).
- **Cart/Keranjang Belanja**: Tampilan keranjang *floating* atau *bottom sheet* untuk kasir HP/Tablet. Kasir tinggal klik *Card* layanan yang diminta.
- **Checkout Multi Payment**: Mendukung Tunai (otomatis hitung kembalian), Transfer Bank, dan QRIS.
- **Cetak Struk**: Terintegrasi via Bluetooth/USB ke **Printer Thermal** dan tombol "Kirim via WhatsApp".

### 4. Manajemen Antrian (Queue & TV Monitor)
- **Kasir View (Card List)**: Kasir melihat daftar antrian dalam bentuk tumpukan kartu. Bisa digeser (*swipe* / *drag*) jika ada prioritas.
- **TV Monitor View**: Tampilan khusus untuk Smart TV di ruang tunggu. Layar dibagi 3 kolom: "Menunggu", "Dicuci", "Selesai".
- **Update Status 1-Klik**: Tombol besar di UI HP teknisi/kasir untuk pindah status mobil (Menunggu -> Dicuci -> Selesai).

### 5. Laporan Harian Dasar
- **Dashboard Summary Card**: Kartu ringkasan omzet hari ini, jumlah mobil masuk, dan rata-rata transaksi.
- **Histori Order**: *List of Cards* untuk melihat transaksi yang sudah lalu.

---

## 🗄️ Database Schema (Fase 1)

```text
users (id, name, email, password, role)
vehicles (id, plate_number, total_visits, created_at)
service_categories (id, name, icon)
services (id, service_category_id, name, price, vehicle_size)
orders (id, order_number, vehicle_id, cashier_id, status, total, payment_method)
order_items (id, order_id, service_id, price)
order_status_logs (id, order_id, status, created_at)
```
