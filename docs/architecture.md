# Arsitektur Sistem Prototipe TapClinic

Dokumen ini menjelaskan struktur modul frontend, *state machine* mode demo maupun eksperimen, serta skema telemetri dan ekspor CSV.

---

## 1. Pilihan Teknologi (*Zero-Build Standalone*)

Prototipe dibangun menggunakan **HTML5, CSS3, dan Vanilla ES6+ JavaScript** dengan pola *namespace* global (`window.TapClinic`) melalui tag `<script defer>` berurutan. Pertimbangan desain:
- Berjalan tanpa *build tools* (`node`, `npm`, `vite`) sehingga langsung bisa dijalankan dengan `python3 -m http.server`, GitHub Pages, atau dibuka langsung lewat `file://` (tanpa error CORS ES Module).
- Mudah diinspeksi, dimodifikasi saat iterasi Figma, dan diuji di browser ponsel/tablet responden kampus.

---

## 2. Susunan Modul (`prototype/js/`)

| Urutan Muat | File | Tanggung Jawab |
| :--- | :--- | :--- |
| 1 | `icons.js` | Seluruh ikon SVG inline: 6 sensasi nyeri, generator wajah ekspresif 1–10 (`getPainFaceSvg`), 4 ikon durasi, siluet mini Depan/Belakang, ikon putar 180°, ikon tampilan ganda, dan ikon kontrol. |
| 2 | `anatomy-svg.js` | Siluet anatomi realistis Depan & Belakang (`viewBox="0 0 320 680"`), `<clipPath>` tubuh utuh, *landmark* anatomis internal, 28 *path* zona hitbox regional, kamus metadata `ANATOMY_REGIONS`, serta fungsi `renderBodySvg(...)`. |
| 3 | `telemetry.js` | Kelas `TaskTracker` (pengatur waktu resolusi tinggi & pencatat event), kalkulator skor SUS (`calculateSUS`), dan `DatasetStore` (`localStorage` + ekspor CSV/JSON). |
| 4 | `variant-b.js` | Komponen interaktif **TapClinic (Varian B)**: peta tubuh visual-pertama, *bottom sheet* input sensasi/intensitas/durasi, penanda sisi berlawanan, tampilan ganda opsional, dan layar ringkasan klinis. |
| 5 | `variant-a.js` | Komponen kontrol **Pembanding (Varian A)**: *wizard* formulir teks bertahap 5 langkah beserta pelacakan ketikan, *backspace*, galat validasi, dan langkah mundur. |
| 6 | `experiment.js` | Orkestrator eksperimen *within-subjects*: intake demografis & literasi kesehatan → Skenario 1 → SUS 1 → Skenario 2 → SUS 2 + preferensi → ringkasan hasil & simpan ke `DatasetStore`. |
| 7 | `app.js` | Pengendali utama: routing layar (`home`, `demo-b`, `demo-a`, `experiment`), pengelolaan modal data tersimpan, dan toggle global `Aa` (`body.show-labels`). |

---

## 3. *State Machine* Aplikasi & Eksperimen

```text
[HOME]
  ├──► [DEMO B: TapClinic Visual] ──► (Selesai) ──► [Visual Summary + Ringkasan Medis]
  ├──► [DEMO A: Formulir Teks]    ──► (Selesai) ──► [Text Summary]
  └──► [EXPERIMENT MODE]
         │
         ▼
    [1. Intake Partisipan] (ID, Usia, Gender, Riwayat Klinik, 3-item HLS, Order AB/BA)
         │
         ▼
    [2. Task 1: Skenario X pada Varian Pertama]  ──(TaskTracker aktif)──► selesai
         │
         ▼
    [3. Kuesioner SUS 10-Butir (Varian Pertama)]
         │
         ▼
    [4. Task 2: Skenario Y pada Varian Kedua]    ──(TaskTracker aktif)──► selesai
         │
         ▼
    [5. Kuesioner SUS 10-Butir (Varian Kedua) + Preferensi]
         │
         ▼
    [6. Ringkasan Komparatif + Simpan ke localStorage + Ekspor CSV/JSON]
```

---

## 4. Definisi Telemetri & Skema CSV

### Metrik Tugas
- **Varian B (`TapClinic`)**:
  - `durationSec`: selisih `performance.now()` dari layar tugas muncul hingga klik selesai.
  - `errorCount`: akumulasi `mis_tap` (ketukan di luar siluet anatomi) + `cancel_region` (membatalkan wilayah baru tanpa menyimpan) + upaya selesai saat belum ada satu pun titik nyeri tersimpan.
  - `interactionCount`: seluruh ketukan zona, perpindahan sisi, simpan, hapus, dan pembatalan.
- **Varian A (`Text Form`)**:
  - `durationSec`: selisih `performance.now()` dari langkah 1 hingga pengiriman akhir.
  - `errorCount`: akumulasi `validationErrors` (mencoba lanjut saat kolom wajib kosong) + koreksi `backSteps` + rasio koreksi ketik (`Math.floor(backspaces / 5)` sebagai indikator revisi teks agar terukur sebanding namun tetap terpisah di kolom detail JSON). *Catatan*: jumlah mentah `keystrokes` dan `backspaces` juga disimpan lengkap pada JSON ekspor dan tabel ringkasan.

### Kolom CSV (`DatasetStore.toCSV()`)
Header CSV dirancang persis cocok dengan `study/analysis/analyze_usability.py`:

```text
participant_id,order,age,gender,clinic_history,hl_1,hl_2,hl_3,hl_mean,scenario_a,scenario_b,time_a_sec,errors_a,keystrokes_a,backspaces_a,sus_a,time_b_sec,errors_b,interactions_b,regions_b_count,sus_b,preference,completed_at
```
