# Skenario Tugas Klinis Fiktif & Rubrik Akurasi

Skenario dirancang berpasangan dengan tingkat kompleksitas setara: masing-masing mencakup **2 titik keluhan** di sisi atau wilayah tubuh yang berbeda agar partisipan menguji navigasi Depan/Belakang sekaligus pengisian sensasi, intensitas, dan durasi.

---

## 1. Skenario X (Diberikan pada Tugas Pertama)

> *"Bayangkan Anda datang ke klinik kampus dengan dua keluhan berikut. Silakan masukkan kedua keluhan tersebut ke dalam aplikasi:"*

1. **Keluhan Utama**: Dada sebelah kiri terasa **berdenyut**, dengan tingkat nyeri **7 dari 10**, mulai terasa sejak **hari ini**.
2. **Keluhan Tambahan**: Punggung bagian bawah / pinggang terasa **pegal**, dengan tingkat nyeri **5 dari 10**, sudah berlangsung **2–6 hari**.

### Kunci Jawaban Target (Varian B — TapClinic)
- Wilayah 1: `front_chest_left` | Sensasi: `throbbing` | Intensitas: `7` | Durasi: `today`
- Wilayah 2: `back_lower_back` | Sensasi: `dull` | Intensitas: `5` | Durasi: `days`

---

## 2. Skenario Y (Diberikan pada Tugas Kedua)

> *"Sekarang bayangkan Anda membantu melaporkan dua keluhan berbeda berikut ke dalam aplikasi pembanding:"*

1. **Keluhan Utama**: Perut bagian atas (ulu hati) terasa **panas/perih**, dengan tingkat nyeri **8 dari 10**, sudah berlangsung **2–6 hari**.
2. **Keluhan Tambahan**: Lengan bawah hingga tangan kanan terasa **kesemutan**, dengan tingkat nyeri **4 dari 10**, muncul **baru saja**.

### Kunci Jawaban Target (Varian B — TapClinic)
- Wilayah 1: `front_abdomen_upper` | Sensasi: `burning` | Intensitas: `8` | Durasi: `days`
- Wilayah 2: `front_forearm_hand_right` (atau `back_forearm_hand_right`) | Sensasi: `tingling` | Intensitas: `4` | Durasi: `just_now`

---

## 3. Rubrik Penilaian Kecocokan Data Klinis (Opsional — Evaluasi Lanjutan)

Untuk melengkapi celah akurasi data klinis yang dicatat pada kajian Albrink dkk. (2024), moderator dapat memeriksa ringkasan hasil akhir (maksimal **8 poin** per skenario):

| Komponen per Keluhan (2 Keluhan × 4 Poin = 8 Poin) | Kriteria Skor 1 | Kriteria Skor 0 |
| :--- | :--- | :--- |
| **Lokasi anatomis & sisi (kiri/kanan/depan/belakang)** | Tepat sesuai skenario | Salah wilayah atau tertukar sisi kiri/kanan |
| **Jenis sensasi nyeri** | Sesuai deskripsi skenario | Tidak diisi atau keliru kategori |
| **Skala intensitas (1–10)** | Tepat (atau selisih ≤ 1 poin) | Selisih > 1 poin atau kosong |
| **Onset / durasi keluhan** | Sesuai rentang waktu skenario | Tidak sesuai atau kosong |
