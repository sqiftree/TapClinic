# Aset Desain & Integrasi Figma TapClinic

Folder ini menyimpan tautan sumber Figma, tangkapan layar referensi, dan catatan penyelarasan dengan prototipe web (`prototype/`).

## Sumber Figma Tim

- **File Figma**: [`PROGRES-IMK`](https://www.figma.com/design/9eO9fkWO4NQ9NmyeBRoRQv/PROGRES-IMK?node-id=0-1)
- **Tangkapan Layar Referensi**: [`figma-assets/figma-progres-imk-reference.png`](figma-assets/figma-progres-imk-reference.png)

## Design Tokens yang Diselaraskan

| Token | Nilai Hex / Font | Penggunaan |
| :--- | :--- | :--- |
| `--primary` | `#0284c7` | Tombol aksi utama, header EMR Dokter (B5), border pilihan aktif |
| `--primary-dark` | `#0369a1` | Status *hover*, teks aksen |
| `--primary-soft` | `#e0f2fe` | Latar kartu sensasi aktif (B2), badge status EMR |
| `--surface-tint` | `#f0f9ff` | Latar blok ringkasan cepat klinis (B4/B5) |
| `--bg` | `#f1f5f9` | Latar kanvas aplikasi |
| `--border` | `#e2e8f0` | Garis tepi kartu & input |
| `--font` | `"Plus Jakarta Sans", "Inter", system-ui, sans-serif` | Tipografi bersih & ramah baca |

## Checklist Penyelarasan Prototipe

- [x] **Varian A (`A1` → `A2` → `A3`)**: *Wizard* formulir teks 3 langkah (*Langkah 1 dari 3*, *2 dari 3*, *3 dari 3*) sesuai alur Figma (`prototype/js/variant-a.js`).
- [x] **Varian B (`B1` → `B2` → `B3` → `B4` → `B5`)**: Alur bertahap TapClinic dari peta tubuh side-by-side (`B1`), grid sensasi 2×3 (`B2`), slider wajah nyeri + 5 mini-wajah (`B3`), ringkasan + disclaimer (`B4`), hingga Dashboard EMR Dokter (*Quick Scan 3 Detik*, `B5`) (`prototype/js/variant-b.js`).
- [x] **Peningkatan Anatomi Realistis Tanpa Teks**: Siluet kotak berlabel huruf pada B1/B5 Figma ditingkatkan menjadi anatomi tubuh manusia utuh **Depan & Belakang** berbasis kurva Bézier dengan *landmark* permukaan (wajah halus, klavikula, pusar, lutut vs. belakang kepala, skapula, alur tulang belakang, gluteal, betis, tumit) **tanpa teks menumpuk di tubuh** (`prototype/js/anatomy-svg.js`).
- [x] **Sinkronisasi Balik ke Figma `PROGRES-IMK`**: Diagram tubuh kotak pada frame **B1** (`1:328`, `1:347`) dan **B5** (`1:624`) di Figma telah diperbarui langsung menggunakan vektor anatomi realistis Depan & Belakang tanpa teks.
