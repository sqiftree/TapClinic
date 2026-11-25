# TapClinic — *Tap-Where-It-Hurts*

**Antarmuka Peta Tubuh Interaktif Bebas Papan Ketik untuk Anamnesis Pra-Konsultasi di Klinik Kampus**

> **Live Demo (GitHub Pages)**: https://sqiftree.github.io/TapClinic/  
> *(Bila mengaktifkan dari pengaturan repositori GitHub: buka **Settings → Pages → Source: GitHub Actions**, atau **Deploy from a branch: `main` / `/ (root)`** — keduanya sudah didukung otomatis oleh [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) dan [`index.html`](index.html).)*

Repositori riset Interaksi Manusia dan Komputer (IMK / HCI) dari Program Studi Informatika, Fakultas Teknologi Informasi dan Sains Data, **Universitas Sebelas Maret (2026)**. Proyek ini mengembangkan sekaligus mengevaluasi **TapClinic**, prototipe anamnesis pra-konsultasi visual berbasis anatomi tubuh utuh (*Front/Anterior* & *Back/Posterior*) tanpa penekanan pada teks maupun papan ketik.

---

## 1. Latar Belakang & Dasar Literatur

Proyek ini berakar dari telaah kritis terhadap studi potong lintang oleh **Albrink dkk. (2024)** (*JMIR Human Factors*, Vol. 11, e47755) yang mengevaluasi aplikasi anamnesis proyek DASI berbasis tablet di ruang tunggu praktik dokter umum di Jerman (*N* = 406 direkrut; *N* = 397 dianalisis). Meskipun skor rata-rata *System Usability Scale* (SUS) tergolong baik (77,8 pada abstrak/hasil; 77,9 pada pembahasan; 54,4% memberi skor ≥ 80), analisis regresi linier berganda mengungkap hambatan signifikan pada kelompok pengguna heterogen:
- **Usia lebih tinggi** berasosiasi dengan penurunan skor SUS ($\beta = -0{,}17$/tahun; 95% CI $-0{,}27$ s.d. $-0{,}07$; $p = 0{,}001$).
- **Literasi kesehatan lebih rendah** berkorelasi dengan skor SUS lebih rendah ($\beta = 1{,}48$; 95% CI $0{,}45$–$2{,}51$; $p = 0{,}01$).
- **Penutur non-asli bahasa aplikasi** memperoleh skor lebih rendah ($\beta = -5{,}39$; 95% CI $-9{,}61$ s.d. $-1{,}17$; $p = 0{,}01$).

Studi Albrink dkk. (2024) juga tidak memiliki kelompok pembanding (*baseline*/versi desain alternatif) maupun pengukuran waktu pengerjaan tugas (*task completion time*). **TapClinic** hadir untuk menutup celah tersebut dengan merancang antarmuka visual-pertama (*zero-typing*) dan mengujinya secara eksperimental *within-subjects* melawan formulir teks bertahap.

---

## 2. Perbandingan Varian A vs. Varian B

| Aspek Desain | Varian A — Formulir Teks Bertahap (*Baseline*) | Varian B — TapClinic (*Interactive Body Map*) |
| :--- | :--- | :--- |
| **Paradigma Interaksi** | *Wizard* teks 5 langkah (1 pertanyaan per layar) | Peta tubuh anatomi realistis (*tap-to-select* + *bottom sheet* visual) |
| **Ketergantungan Teks / Bahasa** | Tinggi — pasien harus membaca instruksi & mengetik keluhan | Minimal — mode standar (*Visual-First*) tanpa menekankan huruf/kata |
| **Input Utama** | Papan ketik (*free-text* lokasi, sensasi, durasi, keluhan tambahan) | Sentuhan area tubuh (28 zona), 6 ikon sensasi animasi, *slider* wajah nyeri 1–10, 4 ikon durasi |
| **Tampilan Tubuh** | Tidak ada | Anatomi tubuh utuh **Depan (Anterior)** & **Belakang (Posterior)** dengan penanda anatomis jelas |
| **Aksesibilitas Tambahan** | — | Tombol `Aa` opsional (default **OFF**) untuk menampilkan label singkat 1 kata bila dibutuhkan |
| **Ringkasan Klinis** | Rekap teks mentah | Peta visual nyeri + kartu ringkasan klinis terstruktur untuk tenaga medis |

### Sorotan Desain Anatomi TapClinic
1. **Anatomi Realistis Utuh (Depan & Belakang)**: Siluet proporsional 8-kepala berbasis kurva Bézier organik dengan *landmark* permukaan yang langsung membedakan sisi depan (kontur wajah halus, klavikula, tulang dada, pusar, tempurung lutut, jari kaki) dan belakang (kontur belakang kepala, tengkuk C7, tulang belikat/skapula, alur tulang belakang, kontur gluteal, lipatan belakang lutut, betis, tumit) **tanpa bergantung pada teks**.
2. **28 Zona Hitbox Ergonomis (14 Depan + 14 Belakang)**: Zona regional besar dan mudah disentuh (≥44px target efektif) yang dipotong presisi mengikuti siluet tubuh melalui SVG `<clipPath>`.
3. **Antarmuka Bebas Papan Ketik**: Pemilihan lokasi, jenis sensasi nyeri, intensitas (1–10 dengan wajah ekspresif dinamis ala Wong-Baker), serta onset durasi sepenuhnya berbasis ikon visual.

---

## 3. Struktur Repositori

```text
TapClinic-IMKProject/
├── .gitignore
├── LICENSE
├── CONTRIBUTING.md
├── README.md
├── design/
│   ├── README.md                  # Panduan serah-terima aset & tautan Figma
│   └── figma-assets/              # Tempat ekspor SVG/PNG referensi Figma
├── docs/
│   ├── anatomy-hitbox-spec.md     # Spesifikasi 28 zona anatomi & konvensi kiri/kanan
│   ├── architecture.md            # Arsitektur modul JS, state machine & skema CSV
│   └── design-rationale.md        # Pemetaan temuan Albrink dkk. (2024) → desain TapClinic
├── paper/
│   ├── README.md                  # Panduan penulisan & pengisian hasil riset
│   ├── draft-paper.md             # Templat makalah ilmiah IMK lengkap (Bahasa Indonesia)
│   └── literature-review-summary.md # Sintesis terverifikasi Albrink dkk. (2024)
├── prototype/
│   ├── index.html                 # Shell aplikasi web standalone (tanpa build/Node)
│   ├── css/
│   │   └── styles.css             # Sistem desain klinis-tenang & responsif mobile/tablet
│   └── js/
│       ├── icons.js               # Ikon SVG sensasi, wajah nyeri dinamis, durasi & siluet
│       ├── anatomy-svg.js         # SVG anatomi Depan & Belakang + 28 zona hitbox & metadata
│       ├── telemetry.js           # Pelacak waktu, error, perhitungan SUS & ekspor CSV/JSON
│       ├── variant-b.js           # Antarmuka TapClinic (Varian B — Visual Body Map)
│       ├── variant-a.js           # Antarmuka Pembanding (Varian A — Formulir Teks)
│       ├── experiment.js          # Mesin eksperimen within-subjects (AB/BA + SUS + intake)
│       └── app.js                 # Router tampilan, modal data tersimpan & toggle label Aa
└── study/
    ├── protocol.md                # Protokol eksperimen within-subjects counterbalanced
    ├── informed-consent.md        # Lembar persetujuan etik partisipan (Bahasa Indonesia)
    ├── scenarios.md               # Skenario klinis fiktif X & Y + rubrik akurasi
    ├── sus-instrument-id.md       # Kuesioner SUS 10 butir (Indonesia) & literasi kesehatan
    ├── data/
    │   └── sample_pilot_data.csv  # Data pilot sintetis (PILOT01–PILOT10) untuk uji skrip
    └── analysis/
        └── analyze_usability.py   # Skrip statistik Python stdlib (t-test, Cohen's d, Wilcoxon)
```

---

## 4. Menjalankan Prototipe Secara Lokal

Prototipe dibangun dengan HTML/CSS/JavaScript murni tanpa ketergantungan *build tool* (`node`/`npm` tidak diperlukan), sehingga berjalan langsung di ponsel, tablet, laptop, maupun GitHub Pages.

```bash
# Dari root direktori repositori:
python3 -m http.server 8000
```

Lalu buka browser dan akses:
- `http://localhost:8000/prototype/`

*(Alternatif: file `prototype/index.html` juga dapat dibuka langsung melalui protokol `file://` karena tidak memakai ES Module CORS-restricted.)*

---

## 5. Menjalankan Eksperimen HCI & Analisis Data

1. Buka **Mode Eksperimen HCI (A/B + SUS)** pada halaman utama prototipe.
2. Masukkan ID partisipan anonim (otomatis `P01`, `P02`, ...), data demografis singkat, dan skala literasi kesehatan 3-butir. Urutan kondisi (`AB` atau `BA`) diseimbangkan (*counterbalanced*) otomatis.
3. Partisipan mengerjakan **Skenario X** pada varian pertama → mengisi kuesioner **SUS 10-butir** → mengerjakan **Skenario Y** pada varian kedua → mengisi **SUS 10-butir** + preferensi.
4. Klik **Simpan ke Dataset** lalu buka panel **Data Tersimpan** untuk mengunduh file `.csv`.
5. Jalankan skrip analisis Python (hanya membutuhkan Python 3 standar, tanpa `scipy`/`pandas`):

```bash
python3 study/analysis/analyze_usability.py study/data/sample_pilot_data.csv
```

Untuk menyimpan tabel Markdown langsung ke file:

```bash
python3 study/analysis/analyze_usability.py study/data/sample_pilot_data.csv --markdown-out study/data/results_summary.md
```

---

## 6. Menyesuaikan Prototipe dengan Desain Figma

Bila tim sudah memiliki rancangan Figma:
1. Letakkan ekspor gambar/SVG atau tautan Figma di folder [`design/`](design/README.md) dan [`design/figma-assets/`](design/figma-assets/).
2. Ikuti panduan penyesuaian di [`docs/anatomy-hitbox-spec.md`](docs/anatomy-hitbox-spec.md) agar seluruh 28 ID zona anatomi dan telemetri eksperimen tetap kompatibel.

---

## 7. Tim Peneliti

| Nama | NIM | Program Studi |
| :--- | :--- | :--- |
| **Yashif Victoriawan** | `L0124124` | Informatika — Universitas Sebelas Maret |
| **Rafy Dhia Najmi Ilham** | `L0124140` | Informatika — Universitas Sebelas Maret |
| **Odyssey Wibi Pradana** | `L0124153` | Informatika — Universitas Sebelas Maret |

---

## 8. Referensi Utama

Albrink, K., Schröder, D., Joos, C., Müller, F., & Noack, E. M. (2024). Usability of an app for medical history taking in general practice from the patients’ perspective: Cross-sectional study. *JMIR Human Factors*, 11, Article e47755. https://doi.org/10.2196/47755
