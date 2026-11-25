# Ringkasan Telaah Literatur: Albrink dkk. (2024) → TapClinic

Dokumen ini merangkum butir-butir kunci yang telah diverifikasi dari ulasan artikel acuan untuk dijadikan dasar Bab 1 dan Bab 2 makalah IMK.

---

## 1. Identitas Artikel Acuan

- **Judul**: *Usability of an App for Medical History Taking in General Practice From the Patients’ Perspective: Cross-Sectional Study*
- **Penulis**: Klara Albrink, Dominik Schröder, Carla Joos, Frank Müller, & Eva Maria Noack
- **Jurnal**: *JMIR Human Factors*, Vol. 11, Artikel e47755 (terbit daring 5 Januari 2024; ISSN 2292-9495)
- **DOI**: https://doi.org/10.2196/47755
- **Konteks**: Department of General Practice, University Medical Center Göttingen, Jerman; pengumpulan data pada 1 klinik layanan luar jam kerja (*out-of-hour urgent care*) dan 7 praktik dokter umum (GP) di Lower Saxony, Jerman (22 November 2021–12 Januari 2022).

---

## 2. Metode & Sampel

- **Desain**: Survei potong lintang (*cross-sectional*) setelah penggunaan aplikasi anamnesis proyek DASI (dikembangkan aidminutes bersama peneliti Göttingen) pada iPad Mini 4 di ruang tunggu, tanpa instruksi navigasi awal dan tanpa kelompok kontrol pembanding.
- **Partisipan**: 406 pasien keluhan akut direkrut; **397 pasien dianalisis** (5 dikeluarkan karena >1 butir SUS hilang; 4 dikeluarkan karena data sosiodemografi hilang). Pada 5 peserta dengan tepat satu butir SUS hilang, nilai diimputasi menggunakan skor netral 2.
- **Instrumen**: *System Usability Scale* (SUS) versi Jerman yang disesuaikan, ditambah 3 pertanyaan literasi kesehatan dari HLS-GER 2 (bukan keseluruhan HLS-EU-Q16).

---

## 3. Hasil Kuantitatif Utama (Data Artikel)

- **Skor SUS Keseluruhan**: Rerata **77,8** pada abstrak dan bagian hasil, serta **77,9** pada bagian pembahasan (penyebab perbedaan tidak dijelaskan dalam artikel). Sebanyak **216 dari 397 (54,4%)** peserta memberi skor SUS ≥ 80.
- **Faktor Terkait Skor SUS (Regresi Linier Berganda)**:
  - **Usia**: $\beta = -0{,}17$ per tahun (95% CI $-0{,}27$ s.d. $-0{,}07$; $p = 0{,}001$).
  - **Literasi kesehatan**: $\beta = 1{,}48$ (95% CI $0{,}45$–$2{,}51$; $p = 0{,}01$).
  - **Penutur non-asli bahasa Jerman**: $\beta = -5{,}39$ (95% CI $-9{,}61$ s.d. $-1{,}17$; $p = 0{,}01$).

---

## 4. Evaluasi Kritis & Celah Penelitian (*Research Gap*)

1. **Ketiadaan Pembanding (*Baseline*)**: Studi tidak membandingkan antarmuka aplikasi DASI dengan formulir manual atau alternatif desain visual lainnya.
2. **Hambatan Bahasa & Literasi Kesehatan**: Pasien dengan literasi kesehatan rendah atau bukan penutur asli cenderung menilai sistem lebih rendah karena beban kognitif memahami teks medis.
3. **Ketiadaan Metrik Efisiensi Tugas & Akurasi Klinis**: Durasi pengisian individual tidak dilaporkan, dan penulis sendiri menegaskan bahwa skor SUS tidak membuktikan efisiensi konsultasi maupun manfaat klinis (hlm. PDF 11–12).

---

## 5. Jembatan ke Inovasi TapClinic

Untuk menutup celah di atas, proyek **TapClinic** merancang antarmuka anamnesis pra-konsultasi yang:
- Mengganti ketergantungan pada papan ketik dan teks medis dengan **peta tubuh anatomi utuh Depan & Belakang** (28 zona regional) serta **ikon sensasi, wajah nyeri dinamis 1–10, dan ikon durasi** tanpa penekanan kata/huruf.
- Dievaluasi secara **komparatif *within-subjects*** melawan formulir teks bertahap (Varian A) dengan mengukur *Task Completion Time*, *Error Count*, dan skor SUS.
