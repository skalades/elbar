# 🚗 Rencana Implementasi Fase 2: Fitur Operasional & Kontrol

Dokumen ini memuat rincian fitur lanjutan untuk kontrol operasional bisnis (setelah MVP Fase 1 berjalan). Arsitektur tetap mengacu pada pondasi **Scalable, Modular, Mobile-First, dan Responsif**.

## 🏗️ Standar Arsitektur & UI/UX (Fase 2)

1. **Card-Based Dashboard (Mobile UI/UX)**
   - Laporan stok dan daftar karyawan akan direpresentasikan melalui *Employee Card* dan *Inventory Card*.
   - Informasi detail komisi atau stok akan muncul melalui *Slide-Over Panel* atau *Bottom Sheet* agar tidak meninggalkan halaman utama, sehingga pengalaman *mobile* tetap terjaga.
   - **Format Mata Uang (Rupiah)**: Tampilan slip gaji, perhitungan komisi otomatis, dan nominal voucher promo wajib menggunakan format Rupiah (IDR) yang konsisten (misal: Rp 5.000.000).

2. **Backend Scalable & Modular**
   - Menambahkan *Job Queue* (Laravel Horizon / Database Queue) untuk memproses kalkulasi komisi bulanan dan notifikasi stok habis secara *background* tanpa memberatkan server (*scalable*).
   - Penggunaan *Traits* dan *Interfaces* pada perhitungan komisi agar rumus komisi bisa diubah tanpa merusak kode inti (*Maintainable*).

---

## 📦 Rincian Fitur Fase 2

### 1. Manajemen Karyawan & Komisi Otomatis
- **Employee Card Dashboard**: Profil teknisi berbentuk kartu, menampilkan foto, jabatan, dan total mobil yang dicuci hari ini.
- **Penugasan Pekerjaan**: Kasir menekan *Card* Order, lalu menekan *Card* Teknisi untuk "Assign" (menugaskan) siapa yang mencuci mobil tersebut.
- **Auto-Komisi**: Sistem otomatis merekap setiap mobil yang diselesaikan oleh teknisi dan mengalikan dengan nominal komisi (contoh: Rp 5.000 / mobil).
- **Slip Gaji Generator**: Fitur mencetak rekap gaji dan komisi dalam bentuk PDF per karyawan.

### 2. Manajemen Stok Bahan Baku (Inventori)
- **Inventory Card List**: Tampilan stok (Shampo, Semir Ban, Obat Kaca) dalam format kartu dengan indikator warna (Hijau: Aman, Merah: Stok Menipis).
- **Auto-Deduction**: Setiap kali "Layanan Poles" terjual di POS, stok "Obat Poles" otomatis berkurang sesuai takaran standar.
- **Low Stock Alerts**: Notifikasi ke dashboard Owner (berupa ikon lonceng merah) jika stok bahan sudah di bawah batas minimum.

### 3. Sistem Diskon & Voucher Promo
- **Input Voucher di POS**: Kasir dapat memasukkan kode kupon (contoh: "ELBARJUMAT") di keranjang belanja.
- **Diskon Fleksibel**: Mendukung diskon Persentase (10%) maupun Nominal Fix (Potongan Rp 15.000).
- **Validasi Cerdas**: Sistem mengecek otomatis kedaluwarsa kupon atau batasan penggunaan kupon (maksimal 100x pakai).

### 4. Laporan & Analitik Lanjutan
- **Chart.js / Recharts**: Menampilkan grafik garis (*line chart*) untuk tren omzet bulanan, dan grafik batang (*bar chart*) untuk teknisi paling rajin. Semua grafik *responsive* di layar HP.
- **Export Data**: Fitur unduh laporan ke format Excel dan PDF.
- **Peak Hour Analysis**: Analisis pintar untuk menunjukkan hari dan jam paling sibuk, sehingga Owner tahu kapan harus menambah karyawan *shift*.

---

## 🗄️ Database Schema (Fase 2 Additions)

```text
employees (id, user_id, position, base_salary, commission_rate)
order_employee (order_id, employee_id, commission_earned) // Pivot tabel siapa mengerjakan apa
products (id, name, unit, current_stock, min_stock)
product_usages (service_id, product_id, qty_used)
stock_mutations (id, product_id, type[in/out], qty, date, notes)
vouchers (id, code, type, value, max_uses, current_uses, expired_at)
```
