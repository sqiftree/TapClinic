# Panduan Penyusunan Makalah Ilmiah IMK — TapClinic

Folder `paper/` berisi bahan baku siap pakai untuk menulis laporan akhir dan artikel ilmiah mata kuliah **Interaksi Manusia dan Komputer (IMK)**, Program Studi Informatika, Universitas Sebelas Maret.

## Berkas yang Tersedia

1. [`literature-review-summary.md`](literature-review-summary.md) — Sintesis terverifikasi artikel acuan **Albrink dkk. (2024)** (*JMIR Human Factors*, 11, e47755) beserta angka statistik eksak dan jembatan menuju ide riset TapClinic.
2. [`draft-paper.md`](draft-paper.md) — Templat artikel ilmiah lengkap dalam Bahasa Indonesia (Pendahuluan, Tinjauan Pustaka, Perancangan Sistem, Metode Evaluasi, tempat Hasil & Analisis, Pembahasan, dan Daftar Pustaka APA 7).

## Alur Pengisian Setelah Pengambilan Data Nyata

1. Jalankan eksperimen dengan 10–12 partisipan mahasiswa UNS menggunakan `prototype/index.html` (**Mode Eksperimen HCI**) sesuai [`../study/protocol.md`](../study/protocol.md).
2. Ekspor hasil dari browser menjadi file CSV (misalnya `study/data/tapclinic_real_data.csv`).
3. Jalankan skrip analisis Python:
   ```bash
   python3 study/analysis/analyze_usability.py study/data/tapclinic_real_data.csv --markdown-out study/data/results_summary.md
   ```
4. Salin tabel hasil statistik deskriptif, *paired t-test*, Cohen's $d_z$, dan *Wilcoxon signed-rank* dari `results_summary.md` ke bagian `[ISI HASIL]` pada Bab 5 di `draft-paper.md`, lalu lengkapi Abstrak dan Pembahasan.
5. **Penting**: Jangan menyalin angka dari `study/data/sample_pilot_data.csv` ke makalah akhir — file tersebut adalah data pilot sintetis yang hanya digunakan untuk menguji skrip analisis.
