# Sinkronisasi Cloud ke Google Sheets Privat Tim (2 Tab Otomatis)

Agar semua hasil pengujian partisipan dari berbagai HP otomatis masuk ke **1 Google Spreadsheet privat milik 3 orang tim peneliti** dalam 2 tab terpisah:
- **`Dataset_Paper`** — Tab khusus berisi angka/variabel kuantitatif yang siap diunduh sebagai `.csv` untuk dihitung di Python (`study/analysis/analyze_usability.py`).
- **`Detail_Respon_Pasien`** — Tab terpisah berisi catatan kualitatif: teks yang diketik responden pada Varian A (`va_lokasi_ketik`, `va_gejala_ketik`, `va_skala_nyeri`), lokasi tubuh/sensasi/skala/durasi yang di-*tap* pada Varian B (`vb_ringkasan_tap`), preferensi, dan `feedback`.

---

## Pemasangan Baru (2 Menit)
1. Buka Google Sheets privat Anda (dibagikan **hanya** ke 3 anggota tim inti).
2. Buka **Extensions → Apps Script**, hapus kode bawaan, tempel seluruh isi [`google-apps-script.gs`](google-apps-script.gs), lalu simpan (`Ctrl + S`).
3. Klik **Deploy → New deployment → Web app**:
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` *(hanya `doPost` tulis-saja; tidak ada akses baca/hapus)*
4. Salin Web App URL `/exec` ke `CLOUD_SYNC_URL` di `prototype/js/telemetry.js`.

## Jika Memperbarui Script yang Sudah Terpasang (URL Tetap Sama — 10 Detik)
1. Ganti kode di **Extensions → Apps Script** dengan [`google-apps-script.gs`](google-apps-script.gs) terbaru lalu **Save** (`Ctrl + S`).
2. Klik **Deploy → Manage deployments** → klik ikon pensil (**Edit**) → pada *Version* pilih **New version** → klik **Deploy**.
3. URL `/exec` lama tetap berlaku tanpa perlu mengubah kode web lagi.

## Mengolah Data untuk Makalah
Buka tab **`Dataset_Paper`** → **File → Download → Comma Separated Values (.csv)** → jalankan:
```bash
python3 study/analysis/analyze_usability.py <file_dataset_paper.csv>
```
