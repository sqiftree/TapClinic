# Spesifikasi Anatomi & 28 Zona Hitbox TapClinic

Dokumen ini mendefinisikan koordinat, penamaan ID, konvensi sisi anatomis, serta aturan penyesuaian apabila aset SVG anatomi diperbarui dari Figma.

---

## 1. Prinsip Desain Visual Anatomi

- **Kanvas SVG**: `viewBox="0 0 320 680"` (rasio vertikal ideal untuk tampilan ponsel maupun berdampingan di tablet).
- **Kliping Presisi (`<clipPath>`)**: Setiap zona sentuh regional dibungkus di dalam `<clipPath id="clip-front">` atau `<clipPath id="clip-back">` yang mengikuti kontur luar siluet tubuh secara persis. Artinya, saat zona disentuh atau disorot warna keparahan, sorotan selalu mengikuti lekuk tubuh manusia dengan rapi tanpa keluar garis.
- **Pembeda Visual Depan vs. Belakang (Tanpa Teks)**:
  - **Depan (Anterior)**: Kontur alis, hidung, bibir netral, leher sternokleidomastoid, tulang selangka (klavikula), kontur dada & tulang rusuk, pusar, garis pinggul anterior, tempurung lutut (patela), ibu jari tangan menghadap luar, dan ujung jari kaki ke depan.
  - **Belakang (Posterior)**: Kontur belakang kepala/garis rambut, tengkuk (vertebra C7), tulang belikat kiri & kanan (skapula), alur tulang belakang vertikal, lekuk sakral, kontur gluteal, lipatan belakang lutut (fosa poplitea), kontur otot betis (gastroknemius), tendon Achilles, dan tumit.

---

## 2. Konvensi Kiri / Kanan Anatomis

Penamaan ID memakai **perspektif anatomi pasien**, bukan sisi kiri/kanan layar pengamat:
- **Tampak Depan (Anterior)**:
  - Kanan anatomis pasien (`*_right`) berada di **kiri layar** (`x < 160`).
  - Kiri anatomis pasien (`*_left`) berada di **kanan layar** (`x > 160`).
- **Tampak Belakang (Posterior)**:
  - Kiri anatomis pasien (`*_left`) berada di **kiri layar** (`x < 160`).
  - Kanan anatomis pasien (`*_right`) berada di **kanan layar** (`x > 160`).

---

## 3. Daftar Lengkap 28 Zona Regional (14 Depan + 14 Belakang)

### A. Tampak Depan (`side: "front"`)

| No | `regionId` | Label Medis Indonesia (Ringkasan Dokter) | Pusat Pin `(cx, cy)` |
| :---: | :--- | :--- | :---: |
| 1 | `front_head` | Kepala & Wajah | `(160, 54)` |
| 2 | `front_neck` | Leher Depan & Tenggorokan | `(160, 108)` |
| 3 | `front_chest_right` | Dada Kanan | `(128, 168)` |
| 4 | `front_chest_left` | Dada Kiri | `(192, 168)` |
| 5 | `front_abdomen_upper` | Perut Atas / Ulu Hati | `(160, 232)` |
| 6 | `front_abdomen_lower` | Perut Bawah & Panggul | `(160, 294)` |
| 7 | `front_upper_arm_right` | Bahu & Lengan Atas Kanan | `(84, 182)` |
| 8 | `front_upper_arm_left` | Bahu & Lengan Atas Kiri | `(236, 182)` |
| 9 | `front_forearm_hand_right` | Lengan Bawah & Tangan Kanan | `(54, 286)` |
| 10 | `front_forearm_hand_left` | Lengan Bawah & Tangan Kiri | `(266, 286)` |
| 11 | `front_thigh_right` | Paha & Lutut Kanan | `(130, 412)` |
| 12 | `front_thigh_left` | Paha & Lutut Kiri | `(190, 412)` |
| 13 | `front_lower_leg_foot_right` | Betis, Pergelangan & Kaki Kanan | `(128, 556)` |
| 14 | `front_lower_leg_foot_left` | Betis, Pergelangan & Kaki Kiri | `(192, 556)` |

### B. Tampak Belakang (`side: "back"`)

| No | `regionId` | Label Medis Indonesia (Ringkasan Dokter) | Pusat Pin `(cx, cy)` |
| :---: | :--- | :--- | :---: |
| 15 | `back_head` | Kepala Belakang | `(160, 54)` |
| 16 | `back_neck` | Tengkuk & Leher Belakang | `(160, 108)` |
| 17 | `back_upper_back` | Punggung Atas & Belikat | `(160, 166)` |
| 18 | `back_mid_back` | Punggung Tengah | `(160, 228)` |
| 19 | `back_lower_back` | Pinggang & Punggung Bawah | `(160, 284)` |
| 20 | `back_glutes` | Pinggul & Bokong | `(160, 336)` |
| 21 | `back_upper_arm_left` | Bahu & Lengan Atas Kiri (Belakang) | `(84, 182)` |
| 22 | `back_upper_arm_right` | Bahu & Lengan Atas Kanan (Belakang) | `(236, 182)` |
| 23 | `back_forearm_hand_left` | Lengan Bawah & Tangan Kiri (Belakang) | `(54, 286)` |
| 24 | `back_forearm_hand_right` | Lengan Bawah & Tangan Kanan (Belakang) | `(266, 286)` |
| 25 | `back_thigh_left` | Paha Belakang & Lipatan Lutut Kiri | `(130, 418)` |
| 26 | `back_thigh_right` | Paha Belakang & Lipatan Lutut Kanan | `(190, 418)` |
| 27 | `back_lower_leg_foot_left` | Betis & Tumit Kiri | `(128, 558)` |
| 28 | `back_lower_leg_foot_right` | Betis & Tumit Kanan | `(192, 558)` |

---

## 4. Panduan Penyesuaian Saat Menerima Ekspor SVG dari Figma

Apabila tim mengganti ilustrasi anatomi dari Figma:
1. Ekspor siluet tubuh luar sebagai satu `<path>` bersih, lalu perbarui konstanta `FRONT_OUTLINE_PATH` dan `BACK_OUTLINE_PATH` di `prototype/js/anatomy-svg.js`.
2. Sesuaikan `viewBox` jika proporsi Figma berbeda, dan perbarui koordinat `(cx, cy)` di `ANATOMY_REGIONS` agar pin nyeri tetap berada di tengah tiap wilayah.
3. Jangan mengubah ke-28 kunci `regionId` di `ANATOMY_REGIONS` maupun atribut `data-region-id` agar skenario uji (`study/scenarios.md`) dan telemetri tetap valid.
