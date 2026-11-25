# Rasional Desain TapClinic (Berbasis Temuan Albrink dkk., 2024)

Dokumen ini memetakan temuan empiris dan keterbatasan studi acuan **Albrink dkk. (2024)** (*JMIR Human Factors*, 11, e47755) langsung ke keputusan perancangan antarmuka **TapClinic**.

---

## 1. Pemetaan Kesenjangan Literatur ke Keputusan Desain

| Temuan / Keterbatasan pada Albrink dkk. (2024) | Bukti Empiris Artikel Acuan | Keputusan Desain pada TapClinic (Varian B) |
| :--- | :--- | :--- |
| **Ketergantungan tinggi pada kemampuan membaca & bahasa** | Penutur non-asli bahasa aplikasi mencatat skor SUS jauh lebih rendah ($\beta = -5{,}39$; 95% CI $-9{,}61$ s.d. $-1{,}17$; $p = 0{,}01$). | **Mode Visual-Pertama (*Zero-Text Emphasis*)**: Secara bawaan (`Aa` OFF), tidak ada instruksi paragraf atau kolom ketik. Pemilihan area, sensasi nyeri, keparahan, dan durasi dipandu sepenuhnya oleh anatomi realistis dan ikon ekspresif. |
| **Hambatan literasi kesehatan (*health literacy*)** | Literasi kesehatan yang lebih tinggi berasosiasi positif dengan skor SUS ($\beta = 1{,}48$; 95% CI $0{,}45$–$2{,}51$; $p = 0{,}01$). | **Terjemahan Istilah Medis ke Metafora Visual**: Pasien tidak perlu tahu istilah anatomi atau deskriptor klinis ("epigastrium", "nyeri kolik", "parestesia"). Pasien cukup menyentuh bagian tubuh yang sakit dan memilih ikon sensasi (berdenyut, menusuk, panas, pegal, kram, kesemutan) serta wajah ekspresif 1–10. |
| **Penurunan kebergunaan seiring usia / kondisi lemas** | Usia lebih tinggi menurunkan skor SUS ($\beta = -0{,}17$/tahun; 95% CI $-0{,}27$ s.d. $-0{,}07$; $p = 0{,}001$). Di klinik kampus, mahasiswa yang demam/pusing juga mengalami penurunan toleransi mengetik. | **28 Zona Regional Besar + Bebas Papan Ketik**: Menghilangkan papan ketik layar sentuh sama sekali pada Varian B. Organ kecil dikelompokkan menjadi zona sentuh regional luas sehingga mengurangi beban motorik halus dan risiko salah sentuh (*fat-finger error*). |
| **Tidak adanya pembanding (*baseline* / versi lain)** | Studi observasional potong lintang hanya menguji satu versi aplikasi DASI tanpa pembanding kontrol (hlm. PDF 2–5). | **Eksperimen Komparatif *Within-Subjects* (A vs. B)**: Prototipe menyediakan Varian A (formulir teks bertahap) dan Varian B (TapClinic peta tubuh) dalam satu alur *counterbalanced* (`AB`/`BA`). |
| **Tidak mengukur durasi tugas & ketepatan pengisian** | Albrink dkk. mencatat SUS tidak membuktikan efisiensi atau manfaat klinis (hlm. PDF 11–12), serta durasi sesi individual tidak dilaporkan (hlm. PDF 3). | **Telemetri Otomatis & Rubrik Skenario**: Sistem merekam *Task Completion Time* (detik), *Error Count*, jumlah interaksi/ketikan, serta mendukung penilaian kecocokan klinis terhadap skenario standar. |

---

## 2. Mengapa Anatomi Realistis Utuh Depan & Belakang Penting?

1. **Disambiguasi Sisi Tubuh Tanpa Kata-Kata**: Siluet kartun/kotak generik sering membuat pengguna bingung membedakan dada vs. punggung atau perut vs. pinggang bawah jika tidak diberi label huruf besar ("DEPAN" / "BELAKANG"). Dengan kontur wajah halus, klavikula, pusar, dan tempurung lutut di sisi **Depan**, serta belakang kepala, tulang belikat, alur tulang belakang, gluteal, dan tumit di sisi **Belakang**, orientasi tubuh langsung dikenali secara perseptual (*affordance* visual langsung).
2. **Kepercayaan Klinis (*Perceived Credibility*)**: Proporsi anatomi manusia yang realistis dan tenang (palet *medical teal* dan garis anatomi bersih) memberi rasa aman dan keseriusan medis tanpa terasa mengintimidasi seperti buku teks kedokteran yang padat label.
3. **Konsep *Progressive Disclosure***: Kompleksitas klinis baru muncul dalam bentuk teks terstruktur di **Ringkasan Untuk Dokter** (berikon stetoskop) pada akhir sesi, sehingga pasien cukup berinteraksi secara visual sementara tenaga medis tetap menerima data anamnesis yang siap dibaca.
