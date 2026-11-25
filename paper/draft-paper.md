# Evaluasi Kebergunaan *TapClinic* (*Tap-Where-It-Hurts*): Antarmuka Peta Tubuh Interaktif Bebas Papan Ketik untuk Anamnesis Pra-Konsultasi di Klinik Kampus

**Disusun Oleh:**  
Yashif Victoriawan (`L0124124`) • Rafy Dhia Najmi Ilham (`L0124140`) • Odyssey Wibi Pradana (`L0124153`)  
Program Studi Informatika, Fakultas Teknologi Informasi dan Sains Data  
Universitas Sebelas Maret, Surakarta — 2026

---

## Abstrak

> **[TEMPLAT — ISI SETELAH PENGUMPULAN DATA SELESAI]**  
> *Latar belakang:* Digitalisasi pencatatan riwayat medis pra-konsultasi berpotensi menghemat waktu dokter, tetapi antarmuka berbasis teks sering terkendala perbedaan usia, bahasa, dan literasi kesehatan pasien. *Tujuan:* Merancang dan mengevaluasi kebergunaan **TapClinic** (Varian B), antarmuka peta tubuh anatomi utuh bebas papan ketik tanpa penekanan teks, dibandingkan formulir teks bertahap (Varian A). *Metode:* Eksperimen *within-subjects counterbalanced* (`AB`/`BA`) pada `[N]` mahasiswa UNS menggunakan dua skenario klinis fiktif paralel (`X` dan `Y`), mengukur waktu penyelesaian tugas, jumlah galat, skor *System Usability Scale* (SUS), dan preferensi. *Hasil:* `[Isi rata-rata waktu, median/IQR error, rata-rata SUS A vs. B, hasil uji paired t-test/Wilcoxon, dan persentase preferensi]`. *Kesimpulan:* `[Ringkas implikasi desain visual-pertama untuk pasien heterogen]`.  
> **Kata kunci:** *anamnesis pra-konsultasi, peta tubuh interaktif, zero-typing, kebergunaan, System Usability Scale, mHealth*

---

## 1. Pendahuluan

Keterbatasan waktu konsultasi tatap muka di fasilitas layanan kesehatan primer membuat pencatatan keluhan awal (*medical history taking* / anamnesis) secara mandiri sebelum bertemu dokter menjadi pendekatan yang menjanjikan. Pada konteks klinik pratama atau pusat kesehatan kampus, mahasiswa yang datang dalam kondisi demam, pusing, nyeri akut, atau lemas sering merasa terbebani apabila harus mengetik deskripsi gejala panjang pada layar sentuh ponsel atau tablet. Selain beban fisik mengetik, perbedaan literasi kesehatan memengaruhi kemampuan pasien dalam memilih istilah medis yang tepat untuk menggambarkan sensasi dan lokasi keluhannya.

Studi potong lintang berskala besar oleh Albrink dkk. (2024) terhadap aplikasi anamnesis proyek DASI di ruang tunggu layanan primer Jerman (*N* = 406 direkrut; *N* = 397 dianalisis) menunjukkan bahwa meskipun rerata skor *System Usability Scale* (SUS) tergolong baik (77,8 pada abstrak/hasil dan 77,9 pada pembahasan; 54,4% memberi skor ≥ 80), skor kebergunaan berasosiasi secara signifikan dengan karakteristik pengguna. Usia yang lebih tinggi ($\beta = -0{,}17$ per tahun; $p = 0{,}001$) serta status bukan penutur asli bahasa aplikasi ($\beta = -5{,}39$; $p = 0{,}01$) berasosiasi dengan skor SUS lebih rendah, sedangkan literasi kesehatan yang lebih tinggi berasosiasi dengan skor SUS lebih tinggi ($\beta = 1{,}48$; $p = 0{,}01$).

Lebih jauh, Albrink dkk. (2024) mengakui bahwa studi mereka tidak membandingkan dua alternatif desain antarmuka (*baseline* vs. intervensi), tidak melaporkan durasi pengisian tugas individual, serta belum membuktikan efisiensi maupun manfaat klinis. Untuk menutup celah penelitian (*research gap*) tersebut, penelitian ini merancang dan menguji **TapClinic**, sebuah antarmuka anamnesis visual-pertama (*zero-typing*) berbasis peta tubuh anatomi utuh tampak depan dan belakang yang meminimalkan ketergantungan pada huruf maupun kata.

---

## 2. Tinjauan Pustaka

### 2.1 Anamnesis Digital dan Faktor Heterogenitas Pasien
Albrink dkk. (2024) menyoroti bahwa rendahnya kebergunaan pengembangan digital baru kerap menghambat adopsi di layanan kesehatan primer. Meskipun desain satu pertanyaan per layar dan fitur perbesaran (*zoom*) membantu sebagian pasien, ketergantungan pada pemahaman teks tetap menciptakan kesenjangan bagi pasien dengan literasi kesehatan rendah atau hambatan bahasa.

### 2.2 Pengukuran Kebergunaan dengan *System Usability Scale* (SUS)
*System Usability Scale* (Brooke, 1996) merupakan kuesioner standar 10 butir skala Likert 5-poin yang menghasilkan skor komposit 0–100 (bukan persentase keberhasilan tugas). Studi empiris Bangor dkk. (2008) dan tolok ukur interpretasi Lewis & Sauro (2018) menetapkan skor rata-rata industri sekitar 68, sedangkan skor ≥ 80 dikategorikan sangat baik (*excellent*). Dalam evaluasi interaksi klinis, skor SUS perlu dilengkapi metrik objektif seperti *Task Completion Time* dan *Error Rate* agar efisiensi interaksi dapat dinilai secara menyeluruh.

---

## 3. Perancangan Sistem *TapClinic*

Prototipe dikembangkan dengan pendekatan *User-Centered Design* (UCD) dalam arsitektur aplikasi web responsif berbasis HTML5, CSS3, dan JavaScript tanpa *build tool* agar dapat diuji langsung melalui perangkat seluler maupun tablet responden.

### 3.1 Varian A — Formulir Teks Bertahap (*Baseline*)
Varian A mengadaptasi pola satu pertanyaan per layar seperti pada literatur acuan dalam bentuk *wizard* 5 langkah: (1) input teks lokasi keluhan utama, (2) deskripsi teks sensasi nyeri, (3) pemilihan skala intensitas 1–10 dan input teks durasi, (4) input teks keluhan tambahan/lokasi kedua, dan (5) tinjauan ringkasan teks.

### 3.2 Varian B — *TapClinic* (Peta Tubuh Anatomi Visual-Pertama)
Varian B menghilangkan papan ketik sepenuhnya dan meminimalkan penggunaan teks (*Visual-First*, tombol label `Aa` dalam kondisi **OFF** secara bawaan):
1. **Anatomi Realistis Utuh (Depan & Belakang)**: Siluet manusia proporsional 8-kepala yang digambar menggunakan kurva Bézier dengan *landmark* permukaan pembeda yang jelas tanpa perlu membaca label—meliputi kontur wajah, klavikula, tulang rusuk, pusar, tempurung lutut, dan jari kaki pada tampak **Depan (Anterior)**, serta kontur belakang kepala, tengkuk C7, tulang belikat (skapula), alur tulang belakang, lipatan gluteal, fosa poplitea, betis, dan tumit pada tampak **Belakang (Posterior)**.
2. **28 Zona Hitbox Ergonomis**: Area tubuh dibagi menjadi 14 wilayah depan dan 14 wilayah belakang berukuran luas (target sentuh ≥ 44px) yang dipotong presisi menggunakan SVG `<clipPath>` guna mencegah kesalahan sentuh (*fat-finger error*).
3. **Panel Visual Keluhan (*Bottom Sheet*)**: Sentuhan pada wilayah tubuh membuka panel visual berisi 6 ikon sensasi animasi (berdenyut, menusuk, panas, pegal, kram, kesemutan), *slider* intensitas 1–10 dengan wajah ekspresif dinamis ala skala Wong-Baker, dan 4 ikon durasi onset.
4. **Ringkasan Klinis Berjenjang (*Progressive Disclosure*)**: Pada layar akhir, pasien melihat peta visual titik nyeri depan-belakang, sementara tenaga medis dapat membuka kartu ringkasan klinis terstruktur yang menerjemahkan pilihan visual ke istilah lokasi anatomis Bahasa Indonesia.

---

## 4. Metode Evaluasi

### 4.1 Desain Eksperimen
Penelitian menggunakan desain eksperimen **within-subjects** (*repeated measures*) dengan penyeimbangan urutan (*counterbalancing*) `AB` dan `BA`:
- Kelompok urutan `AB` mengerjakan Skenario X pada Varian A terlebih dahulu, mengisi SUS A, lalu mengerjakan Skenario Y pada Varian B dan mengisi SUS B.
- Kelompok urutan `BA` mengerjakan Skenario X pada Varian B terlebih dahulu, mengisi SUS B, lalu mengerjakan Skenario Y pada Varian A dan mengisi SUS A.

### 4.2 Partisipan dan Instrumen
Target partisipan adalah `[10–12]` mahasiswa aktif Universitas Sebelas Maret yang direkrut secara sukarela melalui *convenience sampling* dengan persetujuan etik (*informed consent*) dan kode anonim (`P01` dst.). Sebelum pengujian, partisipan mengisi usia, jenis kelamin, riwayat kunjungan klinik kampus, serta 3 butir literasi kesehatan (skala 1–4) yang diadaptasi dari Albrink dkk. (2024).

### 4.3 Pengumpulan Data dan Analisis Statistik
Telemetri otomatis pada aplikasi mencatat *Task Completion Time* (detik, via `performance.now()`), *Error Count* (ketukan di luar tubuh/batal pada Varian B; galat validasi/langkah mundur/rasio revisi pada Varian A), jumlah ketikan/interaksi, serta skor SUS 0–100. Data diekspor ke CSV dan dianalisis menggunakan skrip Python (`study/analysis/analyze_usability.py`) dengan statistik deskriptif (Mean ± SD, Median, IQR), *paired t-test*, ukuran efek Cohen's $d_z$, serta uji non-parametrik *Wilcoxon signed-rank* dua sisi.

---

## 5. Hasil dan Analisis

> **[TEMPLAT — ISI DENGAN OUTPUT NYATA DARI `analyze_usability.py` SETELAH PENGUMPULAN DATA]**

### 5.1 Karakteristik Partisipan
- Total partisipan dianalisis: *N* = `[ISI N]` (`AB`: `[n_AB]`, `BA`: `[n_BA]`).
- Rentang/rata-rata usia: `[ISI USIA]`; rata-rata literasi kesehatan 3-butir: `[ISI MEAN HLS]`.

### 5.2 Perbandingan Kinerja Tugas dan Skor SUS
*(Tempelkan tabel Markdown hasil keluaran `python3 study/analysis/analyze_usability.py <file_data_nyata.csv>` di sini)*

| Metrik | Varian A (Mean ± SD) | Varian B (Mean ± SD) | Uji Berpasangan (*t* / *W*) | Nilai *p* | Cohen's $d_z$ |
| :--- | :---: | :---: | :---: | :---: | :---: |
| Waktu Pengisian (detik) | `[ISI]` | `[ISI]` | `[ISI]` | `[ISI]` | `[ISI]` |
| Jumlah Error Tugas | `[ISI]` | `[ISI]` | `[ISI]` | `[ISI]` | `[ISI]` |
| Skor SUS (0–100) | `[ISI]` | `[ISI]` | `[ISI]` | `[ISI]` | `[ISI]` |

### 5.3 Preferensi dan Observasi Kualitatif
- Preferensi partisipan: Varian B (`[n/%]`), Varian A (`[n/%]`), Sama saja (`[n/%]`).
- Ringkasan temuan wawancara singkat (*debriefing*): `[ISI TEMUAN OBSERVASI NYATA, misalnya apakah sisi depan/belakang langsung dikenali tanpa kata]`.

---

## 6. Pembahasan dan Keterbatasan

> **[TEMPLAT — SESUAIKAN INTERPRETASI DENGAN HASIL NYATA PADA BAB 5]**

### 6.1 Diskusi Temuan Utama
Bahas apakah hipotesis bahwa antarmuka peta tubuh visual-pertama (*TapClinic*) mempercepat pengisian, menekan kesalahan input, dan meningkatkan skor SUS dibandingkan formulir teks terkonfirmasi oleh data eksperimen. Kaitkan kembali dengan temuan literasi kesehatan dan beban bahasa pada Albrink dkk. (2024).

### 6.2 Keterbatasan Penelitian
1. Pengujian dilakukan menggunakan skenario keluhan fiktif pada populasi mahasiswa kampus sehingga generalisasi terhadap pasien lansia atau pasien dengan nyeri klinis akut nyata masih memerlukan studi lanjutan di ruang tunggu klinik sebenarnya.
2. Jumlah sampel berskala studi pilot (*N* = `[ISI]`) membatasi kekuatan analisis subkelompok regresi multivariat seperti pada Albrink dkk. (2024).
3. Evaluasi akurasi klinis penuh oleh dokter praktik belum menjadi bagian dari pengukuran terotomasi pada prototipe ini.

---

## 7. Kesimpulan

> **[TEMPLAT — RINGKAS KESIMPULAN AKHIR BERDASARKAN DATA NYATA]**

Prototipe **TapClinic** mendemonstrasikan pendekatan anamnesis pra-konsultasi berbasis anatomi tubuh utuh depan-belakang tanpa ketergantungan pada papan ketik maupun teks panjang. `[Lengkapi dengan ringkasan angka kinerja A vs. B dan rekomendasi pengembangan lanjutan]`.

---

## Daftar Pustaka

Albrink, K., Schröder, D., Joos, C., Müller, F., & Noack, E. M. (2024). Usability of an app for medical history taking in general practice from the patients’ perspective: Cross-sectional study. *JMIR Human Factors*, 11, Article e47755. https://doi.org/10.2196/47755

Bangor, A., Kortum, P. T., & Miller, J. T. (2008). An empirical evaluation of the System Usability Scale. *International Journal of Human-Computer Interaction*, 24(6), 574–594. https://doi.org/10.1080/10447310802205776

Brooke, J. (1996). SUS: A "quick and dirty" usability scale. Dalam P. W. Jordan, B. Thomas, B. A. Weerdmeester, & A. L. McClelland (Ed.), *Usability evaluation in industry* (hlm. 189–194). Taylor & Francis.

Lewis, J. R., & Sauro, J. (2018). Item benchmarks for the System Usability Scale. *Journal of Usability Studies*, 13(3), 158–167.
