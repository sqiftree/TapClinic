# Protokol Eksperimen Kebergunaan *Within-Subjects* — TapClinic

Dokumen ini menjadi panduan standar pelaksanaan uji kebergunaan komparatif antara **Varian A (Formulir Teks Bertahap)** dan **Varian B (TapClinic — Peta Tubuh Interaktif Bebas Papan Ketik)** untuk mata kuliah Interaksi Manusia dan Komputer (IMK), Universitas Sebelas Maret.

---

## 1. Desain Eksperimen

- **Jenis Desain**: Eksperimen komparatif *within-subjects* dengan penyeimbangan urutan (*counterbalancing* `AB` / `BA`). Setiap responden menguji kedua varian sehingga variabilitas antarindividu terkontrol.
- **Target Partisipan**: 10–12 mahasiswa aktif Universitas Sebelas Maret yang pernah atau berpotensi menggunakan fasilitas kesehatan kampus (*convenience sampling*, sukarela).
- **Perangkat Uji**: Ponsel layar sentuh atau tablet dalam orientasi potret, menjalankan `prototype/index.html` dalam **Mode Eksperimen HCI**.
- **Pengaturan Bawaan Varian B**: Mode `Aa` dalam keadaan **OFF** (tampilan visual murni tanpa teks penjelas) untuk menguji apakah anatomi Depan/Belakang dan ikon dapat dipahami secara intuitif.

---

## 2. Alokasi Kondisi & Penyeimbangan (*Counterbalancing*)

| Urutan | Tugas Pertama (Skenario X) | Kuesioner 1 | Tugas Kedua (Skenario Y) | Kuesioner 2 |
| :--- | :--- | :--- | :--- | :--- |
| **`AB`** (Partisipan ganjil: P01, P03, ...) | Varian A (Formulir Teks) | SUS A | Varian B (TapClinic) | SUS B + Preferensi |
| **`BA`** (Partisipan genap: P02, P04, ...) | Varian B (TapClinic) | SUS B | Varian A (Formulir Teks) | SUS A + Preferensi |

*Catatan*: Penyeimbangan urutan mencegah efek belajar (*learning effect*) maupun kelelahan (*fatigue bias*) memihak salah satu desain.

---

## 3. Variabel yang Diukur

1. ***Task Completion Time* (detik)**: Diukur otomatis oleh `TaskTracker` menggunakan `performance.now()` dari kemunculan antarmuka hingga pengiriman ringkasan akhir.
2. ***Error Count* (jumlah kesalahan)**:
   - Varian B: ketukan di luar siluet anatomi (`mis_tap`), pembatalan area baru tanpa simpan (`cancel_region`), atau upaya selesai saat belum ada titik nyeri.
   - Varian A: galat validasi kolom wajib kosong (`validation_error`), navigasi mundur untuk revisi (`back_step`), serta rasio revisi ketikan (`floor(backspaces / 5)`).
3. ***System Usability Scale* (SUS)**: Skor komposit 0–100 dari 10 butir kuesioner standar Brooke dalam Bahasa Indonesia (`study/sus-instrument-id.md`).
4. **Preferensi & Kovariat**: Pilihan preferensi subjektif (`A`, `B`, `Equal`), usia, jenis kelamin, riwayat klinik kampus, serta skor rata-rata 3-butir literasi kesehatan.

---

## 4. Prosedur Pelaksanaan Sesi (±15 Menit / Partisipan)

1. **Penyambutan & *Informed Consent* (2 menit)**: Jelaskan tujuan studi (mengevaluasi antarmuka, bukan menguji kemampuan responden). Minta responden membaca dan menyetujui `study/informed-consent.md`.
2. **Pengisian Intake Anonim (2 menit)**: Moderator/responden mengisi ID anonim (`P01` dst.), usia, jenis kelamin, riwayat klinik, dan 3 butir literasi kesehatan di layar pembuka Mode Eksperimen.
3. **Tugas 1 + SUS 1 (4 menit)**: Berikan kartu **Skenario X** (`study/scenarios.md`). Jangan memberi petunjuk cara navigasi sebelum responden mencoba sendiri, kecuali responden benar-benar berhenti >30 detik (catat sebagai catatan observasi). Setelah selesai, responden mengisi SUS 10-butir.
4. **Tugas 2 + SUS 2 + Preferensi (4 menit)**: Berikan kartu **Skenario Y**. Setelah selesai pada varian kedua, responden mengisi SUS 2 serta memilih preferensi antarmuka.
5. **Wawancara Singkat / *Debriefing* (3 menit)**: Tanyakan: *"Apakah sisi depan dan belakang tubuh langsung dapat dibedakan tanpa kata-kata? Bagian mana yang paling membantu atau membingungkan?"*
6. **Penyimpanan Data**: Klik ekspor CSV/JSON dari modal data tersimpan setelah seluruh sesi selesai.
