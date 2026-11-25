# Panduan Kontribusi Tim (TapClinic IMK Project)

Dokumen ini mengatur alur kerja kolaborasi GitHub untuk tim peneliti TapClinic (Universitas Sebelas Maret).

## 1. Struktur Cabang (*Branching*)

- `main` — Cabang stabil yang siap dipresentasikan, diuji kepada partisipan, dan dirujuk oleh makalah.
- `feat/<topik>` — Pengembangan fitur atau penyesuaian desain baru (mis. `feat/figma-anatomy-update`, `feat/sus-export`).
- `study/<topik>` — Pembaruan protokol uji, skenario, atau hasil olah data (mis. `study/pilot-analysis`).
- `paper/<topik>` — Penyusunan dan revisi draf makalah IMK (mis. `paper/draft-bab-4-5`).

## 2. Alur *Pull Request*

1. Tarik perubahan terbaru dari `main` sebelum membuat cabang baru.
2. Pastikan perubahan pada `prototype/` tidak memutus:
   - Mode **TapClinic (Varian B)** dan **Pembanding (Varian A)**
   - **Mode Eksperimen HCI** serta format header CSV untuk `study/analysis/analyze_usability.py`
   - 28 ID zona anatomi pada `prototype/js/anatomy-svg.js`
3. Verifikasi aplikasi secara lokal menggunakan `python3 -m http.server 8000` pada viewport ponsel (~375px) dan tablet (~768px).
4. Verifikasi skrip analisis dengan data pilot:
   ```bash
   python3 study/analysis/analyze_usability.py study/data/sample_pilot_data.csv
   ```

## 3. Memperbarui Aset dari Figma

Jika tim mengekspor aset SVG atau tangkapan layar dari Figma:
1. Simpan file sumber/ekspor ke `design/figma-assets/` (gunakan nama deskriptif, mis. `body-front-v2.svg`, `screen-pain-sheet.png`).
2. Catat tautan Figma serta catatan komponen di `design/README.md`.
3. Pertahankan atribut `data-region-id` yang tercantum di `docs/anatomy-hitbox-spec.md` pada setiap elemen zona sentuh SVG agar telemetri tidak berubah.

## 4. Etika Data Partisipan

- **Jangan pernah** mengunggah data identitas pribadi partisipan (nama lengkap, NIM, nomor telepon, atau foto wajah) ke repositori publik.
- Gunakan selalu ID anonim (`P01`, `P02`, ...).
- File `study/data/sample_pilot_data.csv` hanya berisi data simulasi sintetis untuk menguji skrip statistik.
