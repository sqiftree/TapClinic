# Sinkronisasi Cloud ke Google Sheets Privat Tim (2 Menit Setup)

Agar semua hasil pengujian partisipan dari berbagai HP otomatis masuk ke **1 Google Spreadsheet privat milik 3 orang tim peneliti** (sementara responden/pengunjung publik sama sekali tidak bisa melihat maupun menghapus data), ikuti langkah berikut:

## Langkah 1 — Buat Google Spreadsheet Privat
1. Buka Google Sheets dan buat Spreadsheet baru, misalnya **`TapClinic HCI Dataset (2026)`**.
2. Klik tombol **Share** dan pastikan aksesnya **Restricted**, lalu bagikan **hanya kepada 3 anggota tim inti** (Yashif, Rafy, Odyssey).

## Langkah 2 — Pasang Apps Script (*Write-Only*)
1. Di Spreadsheet tersebut, buka menu **Extensions → Apps Script**.
2. Hapus seluruh isi default di `Code.gs`, lalu salin-tempel seluruh isi file [`google-apps-script.gs`](google-apps-script.gs).
3. Klik ikon **Save** (`Ctrl + S`).

## Langkah 3 — Deploy sebagai Web App
1. Klik **Deploy → New deployment**.
2. Pada ikon roda gigi (*Select type*), pilih **Web app**.
3. Isi konfigurasi persis seperti ini:
   - **Description**: `TapClinic Collector v1`
   - **Execute as**: **Me** *(email pemilik Spreadsheet)*
   - **Who has access**: **Anyone** *(izin hanya untuk mengirim `doPost` menulis baris baru; tidak ada akses baca atau hapus)*
4. Klik **Deploy** → klik **Authorize access** → pilih akun Google Anda → jika muncul peringatan *"Google hasn’t verified this app"*, klik **Advanced → Go to ... (unsafe) → Allow**.
5. Salin **Web app URL** yang berakhiran `/exec` (contoh: `https://script.google.com/macros/s/AKfycb.../exec`).

## Langkah 4 — Hubungkan ke Prototipe TapClinic
- Kirimkan URL `/exec` tersebut kepada Antigravity (atau tempel langsung ke konstanta `CLOUD_SYNC_URL` di `prototype/js/telemetry.js`), lalu *push* ke `main`.
- Mulai saat itu, setiap partisipan yang selesai mengisi dari HP mana pun otomatis mengirim 1 baris ke Spreadsheet Anda.
- Untuk analisis statistik: di Google Sheets cukup pilih **File → Download → Comma Separated Values (.csv)** lalu jalankan:
  ```bash
  python3 study/analysis/analyze_usability.py <file_hasil_download.csv>
  ```
