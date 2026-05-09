# 🚗 Rencana Implementasi Fase 3: Ekspansi & Retensi Pelanggan

Dokumen ini memuat fitur skala Enterprise (Advanced) yang difokuskan pada perluasan bisnis (multi-cabang) dan retensi pelanggan tingkat tinggi. 

## 🏗️ Standar Arsitektur & UI/UX (Fase 3)

1. **Scalable Multi-Tenant Architecture**
   - Menghadapi implementasi **Multi-Cabang**, database akan dirancang menggunakan skema *Single Database Multi-Tenancy* (kolom `branch_id` di setiap tabel utama). Hal ini memastikan data antar cabang tidak tercampur, namun Owner tetap bisa melihat laporan *Consolidated* dari satu dashboard utama.
   - *Query Scope* global di Laravel untuk memastikan keamanan akses data per cabang.

2. **Mobile-First Customer Facing App**
   - Fitur Booking Online akan didesain *seolah-olah* seperti aplikasi *Native* (Progressive Web App / PWA). 
   - Pelanggan dapat membuka web dari HP mereka, menambahkannya ke *Homescreen*, dan merasakan UX setara aplikasi App Store/Play Store (tanpa perlu *download*).
   - **Format Mata Uang (Rupiah)**: Layar aplikasi pelanggan yang menampilkan katalog layanan atau total pembayaran wajib diformat ke Rupiah (IDR) secara elegan dan mudah dibaca (misal: Rp 150.000).

---

## 📦 Rincian Fitur Fase 3

### 1. Multi-Cabang (Branch Management)
- **Branch Selector**: Dashboard Owner memiliki fitur *dropdown* di bagian atas untuk berpindah memantau Cabang A, Cabang B, atau melihat *All Branches*.
- **Database Isolasi**: Kasir Cabang A hanya bisa melihat antrian, layanan, dan laporan di Cabang A.
- **Sentralisasi Layanan**: Harga dan jenis layanan bisa diatur sama untuk semua cabang, atau berbeda per cabang.

### 2. CRM & Loyalty Poin Otomatis
- **Loyalty Tracker**: Sistem mendeteksi Plat Nomor pelanggan yang sering datang. Jika telah mencapai batas tertentu (misal 10 poin), pelanggan berhak mendapat "Reward Card".
- **Notifikasi Auto-Reminder (WhatsApp)**: Sistem mendeteksi pelanggan yang sudah 2 bulan tidak mencuci mobilnya, lalu mengirimkan pesan WhatsApp otomatis: *"Halo kak, mobilnya dengan plat B 1234 CD belum dicuci lagi nih, ada diskon 10% untuk kakak hari ini!"*
- **Customer Segmentation**: Sistem memisahkan pelanggan menjadi "Baru", "Reguler", "VIP", dan "Churning" (hampir hilang).

### 3. Booking Online Pelanggan (Self-Service)
- **Halaman PWA Pelanggan**: Halaman publik cantik, *mobile-first*, dengan tema *Dark Mode/Light Mode*.
- **Pilih Slot Waktu**: Pelanggan memilih jam kedatangan yang tersedia. Sistem memblokir slot yang sudah penuh (mencegah antrian bentrok dengan pelanggan *walk-in*).
- **Live Status Tracker**: Pelanggan memasukkan Plat Nomor di website untuk melacak mobil mereka sedang dalam tahap apa secara *real-time* dari rumah atau dari kafe sebelah.

### 4. Integrasi WhatsApp Gateway Terpusat
- Menyambungkan server ke API WhatsApp (seperti Fonnte atau Wablas).
- Digunakan untuk:
  - Kirim e-Struk setelah pembayaran.
  - Kirim notifikasi "Mobil Anda Sudah Selesai".
  - Kirim *broadcast* promo ke database pelanggan.

---

## 🗄️ Database Schema (Fase 3 Additions)

```text
branches (id, name, address, phone)
// Hampir semua tabel sebelumnya ditambah kolom: branch_id
loyalty_points (id, vehicle_id, points_earned, order_id)
online_bookings (id, vehicle_id, branch_id, book_date, book_time, status)
whatsapp_templates (id, name, message_content, type)
```
