# Forked Art Direction & Creative Motion Blueprint

Dokumen ini menetapkan standar pengarahan seni (art direction) dan bahasa gerak (motion language) untuk video promo Instagram Story 25 detik Forked (9:16, 1080 x 1920 @ 30 fps). Dokumen ini berfungsi sebagai acuan baku yang mengikat seluruh fase implementasi adegan di dalam `remotion/`.

---

## 1. Filosofi Inti: Editorial Minimalism Meets Tactile Product Motion

Video promo Forked bukan sekadar tayangan iklan SaaS biasa, melainkan sebuah film produk digital yang dirancang secara cermat (crafted digital product film). Pendekatannya memadukan ketenangan majalah cetak editorial modern dengan interaksi produk digital yang responsif dan terasa nyata disentuh.

### Nilai Utama:
* **Tenang & Berwibawa**: Menggantikan animasi heboh yang berisik dengan gerakan yang terukur, anggun, dan memiliki bobot visual.
* **Jujur pada Produk**: Menampilkan antarmuka nyata Forked yang memecahkan masalah overthinking dalam pengambilan keputusan hidup, bukan sekadar mockup ilustrasi palsu.
* **Ruang Bernapas (Intentional Negative Space)**: Ruang kosong bukan kekosongan yang harus dijejali elemen, melainkan jeda visual yang memberikan kejelasan dan ketenangan pikiran bagi penonton.

---

## 2. Tata Ruang Kanvas & Komposisi Vertikal (9:16)

* **Dimensi Kanvas**: 1080 piksel lebar x 1920 piksel tinggi.
* **Safe Zone Instagram Story**:
  - Batas Atas (Top Safe Margin): 180 piksel (menghindari profil, progress bar, dan username Instagram).
  - Batas Bawah (Bottom Safe Margin): 220 piksel (menghindari kolom balasan pesan dan tombol share Instagram).
  - Batas Samping (Horizontal Margin): 72 piksel pada sisi kiri dan kanan.
* **Prinsip Komposisi**:
  - Menggunakan satu titik fokus dominan (single visual focal anchor) per adegan.
  - Elemen tidak ditumpuk atau dibiarkan melayang tanpa hierarki. Seluruh elemen ditambatkan pada struktur grid vertikal yang kokoh.

---

## 3. Sistem Tipografi Editorial

Mengacu pada sistem desain asli di [remotion/src/theme/forkedTheme.ts](file:///d:/coding/www/forked/remotion/src/theme/forkedTheme.ts):

* **Font Display (Manrope)**:
  - Digunakan untuk judul utama, headline ekspresif, dan angka nominal besar.
  - Bobot: 800 (ExtraBold) dan 700 (Bold).
  - Karakter: Geometris, kokoh, berwibawa, dengan letter-spacing rapat (`-0.03em` hingga `-0.02em`).
  - Ukuran: Hero Title (82px - 104px), Section Header (58px - 64px), Nilai Finansial Utama (38px - 46px).
* **Font Sans Body (DM Sans)**:
  - Digunakan untuk label data, teks penjelas, parameter simulasi, dan subtitle.
  - Bobot: 500 (Medium) dan 600 (SemiBold).
  - Karakter: Humanis, hangat, mudah dibaca seketika di layar smartphone kecil.
  - Ukuran: Body Large (26px - 28px), Subteks (22px - 24px), Pill Label (20px).
* **Batas Keterbacaan Mutlak**: Tidak ada teks di bawah 20 piksel. Seluruh kata wajib ditulis lengkap (tanpa singkatan seperti `mgg`, `bln`, dll).

---

## 4. Material Visual & Palet Warna Otentik

Menggunakan palet organik resmi Forked, bebas dari warna generic Tailwind neon:

* **Canvas Utama**: `#f8f8f5` (warm paper tint) yang nyaman di mata, bukan putih silau atau abu-abu dingin.
* **Canvas Subtle**: `#f1f4ee` untuk area parameter dan kartu sekunder.
* **Surface Card**: `#ffffff` dengan border organik `#e3e6de` (2px) dan bayangan lembut `0 20px 40px -10px rgba(30, 38, 31, 0.08)`.
* **Teks Utama**: `#1e261f` (deep forest charcoal) yang memberikan kontras tajam tanpa kekakuan warna hitam pekat `#000000`.
* **Aksen Dominan (Primary Forest Green)**: `#245d3e` dengan latar pill `#eaf3ec` dan accent glow `#55ad76`.
* **Aksen Sekunder (Trade-Off Petrol Blue)**: `#366077` dengan latar pill `#e9f2f6`.
* **Aksen Peringatan / Risiko (Terracotta Red)**: `#b54739` dengan latar pill `#fdf0ed`.
* **Aksen Keberhasilan (Warm Amber)**: `#94641f` dengan latar pill `#fbf2de`.
* **Brand Logo Mark**: Gradien resmi tiga titik `#347852` -> `#245d3e` -> `#143b27` dengan bayangan pinus `#133522` dan cabang `#a7dec0`.

---

## 5. Bahasa Gerak & Koreografi Kamera Sinematik

### A. Easing & Fisika Gerak:
* **Dilarang**: Efek pantulan pegas berlebihan (wobbly / high-bounce physics), getaran acak, atau zoom bolak-balik tanpa tujuan.
* **Diterapkan**:
  - Spring tenang Remotion dengan parameter: `stiffness: 90 - 100`, `damping: 14 - 16` (gerakan berhenti stabil dan elegan).
  - Kurva interpolasi halus: `cubic-bezier(0.22, 1, 0.36, 1)` untuk pergeseran kamera.

### B. Pergerakan Kamera Terpandu (Cinematic Focal Tracking):
* Kamera bergerak layaknya lensa kamera makro fisik yang mengamati produk berkualitas tinggi:
  - Gerakan perlahan mendekat (*slow push-in*: scale 0.98 -> 1.02) untuk membangun fokus emosional.
  - Pergeseran vertikal lembut (*smooth focal pan*) untuk memandu mata penonton saat slider interaktif digerakkan.
  - Penarikan mundur tenang (*camera reveal pullback*) saat menyajikan gambaran komparasi utuh.

---

## 6. Standar Integrasi Karakter Maskot 3D

Karakter maskot adalah jembatan emosional antara kebingungan pengguna dan kejelasan produk:

1. **Wajib Transparan (Alpha Channel PNG)**:
   - Maskot tidak boleh dibungkus dalam kotak foto atau kartu JPG berlatar kaku.
   - Karakter harus berdiri menyatu di atas kanvas atau bersanding langsung di sebelah elemen kartu antarmuka.
2. **Perjalanan Psikologis (Emotional Arc)**:
   - **Scene 1 (Hook)**: Karakter bingung menggaruk kepala di persimpangan jalan, lalu membeku dalam ekspresi overthinking yang komikal.
   - **Scene 5 (Closing)**: Karakter tersenyum lega dan memberikan jempol (*thumbs up*) setelah melihat kalkulasi keputusan yang jelas dan terukur.
3. **Ukuran Proporsional**:
   - Karakter ditampilkan berskala besar dan terintegrasi (380px - 480px), bukan sebagai stiker kecil di sudut layar.

---

## 7. Sinkronisasi Audio & Gerak (Audio-Motion Synergy)

Gerakan visual dan audio harus saling mengunci secara matematis pada tempo 96 BPM (1 birama 4/4 = 75 frame = 2.50 detik):

* **Frame 0 (0.0s)**: Akor Rhodes pertama berbunyi saat judul utama dan maskot pertama muncul.
* **Frame 95 (3.16s)**: Efek tape stop / freeze seketika mengunci layar saat karakter masuk mode overthinking akut.
* **Frame 135 (4.5s)**: Beat drop drum kick dan rimshot berbunyi bertepatan dengan logo Forked mekar di Scene 2.
* **Frame 255 (8.5s)**: Transisi akor baru saat kanvas simulasi What-If terbuka penuh.
* **Frame 345 - 435 (11.5s - 14.5s)**: Efek suara haptic click terdengar presisi seirama dengan kursor yang menggeser slider persentase biaya.
* **Frame 540 (18.0s)**: Hening visual dan break drum sejenak saat punchline "Bukan peramal masa depan" muncul.
* **Frame 645 (21.5s)**: Ketukan drum kembali masuk dengan bassline padat saat CTA `forked.hafidzrdwn.dev` dan maskot selebrasi tersenyum.

---

## 8. Daftar Larangan Visual Ketat (Negative Visual Constraints)

Untuk menjaga kemurnian estetika produk, elemen-elemen berikut dilarang keras:

* **DILARANG**: Ilustrasi manusia generik atau avatar AI yang tidak berhubungan dengan produk.
* **DILARANG**: Kartu antarmuka melayang acak di luar konteks simulasi.
* **DILARANG**: Partikel bintang, bintik debu melayang, atau confetti neon yang tidak bermakna.
* **DILARANG**: Sudut membulat berlebihan pada seluruh elemen tanpa hierarki.
* **DILARANG**: Pop-up bertubi-tubi yang menutupi konten utama.
* **DILARANG**: Chart palsu atau grafik garis fiktif yang tidak didukung data nyata [scoring.ts](file:///d:/coding/www/forked/remotion/src/utils/scoring.ts).
* **DILARANG**: Teks kecil di bawah 20 piksel.
* **DILARANG**: Singkatan kata (`mgg`, `bln`, `thn`, dll). Seluruh terminologi wajib menggunakan kata penuh bahasa Indonesia yang baku dan elegan.

---

## 9. Spesifikasi Pengarahan Seni per Adegan (Scene Specifications)

### Scene 1: The Dilemma & Overthinking Freeze (0.0s - 4.5s | Frame 0 - 135)
* **Warna Latar**: Canvas Base `#f8f8f5` dengan vignette radial lembut.
* **Tipografi**: Headline Manrope 800 (78px) warna `#1e261f`.
* **Karakter**: Maskot 3D dilema (frame 0-95) bertransisi ke ekspresi spiral overthinking dengan komikal badge merah terracotta `#b54739` pada frame 95.
* **Tujuan Emosional**: Membangun empati instan dengan kegelisahan penonton saat menghadapi pilihan karir/hidup.

### Scene 2: The Solution Reveal (4.5s - 8.5s | Frame 135 - 255)
* **Warna Latar**: Canvas Base `#f8f8f5` dengan ambient glow forest green `#245d3e` lembut.
* **Fokus**: Brand Mark Forked mekar dengan path animation SVG, diikuti wordmark `forked.` dalam Manrope 800 (104px) dan 3 pilar fitur inti dalam kartu bersih berbobot.
* **Tujuan Emosional**: Memberikan kelegaan dan harapan bahwa ada alat yang dapat menyusun pertimbangan rumit menjadi rapi.

### Scene 3: The Living Simulation (8.5s - 18.0s | Frame 255 - 540)
* **Fokus**: Dua kartu perbandingan autentik (Jalur A vs Jalur B), slider What-If interaktif dengan kursor, dan live decision score matrix.
* **Motion**: Kursor menggeser slider; angka gaji, biaya, jam kerja, dan tabungan bersih bereaksi seketika. Bar trade-off bergerak real-time membuktikan logika matematis asli.
* **Tujuan Emosional**: Membuktikan kekuatan dan kegunaan nyata Forked secara objektif.

### Scene 4: The Reality Check & Punchline (18.0s - 21.5s | Frame 540 - 645)
* **Tipografi**: Kontras teks abu-abu netral `#5e665d` (72px) menuju punchline hijau forest `#245d3e` (90px).
* **Pesan**: "Bukan peramal masa depan. Cuma cara lebih waras buat mengambil keputusan."
* **Tujuan Emosional**: Menghadirkan humor cerdas yang membumi tanpa janji muluk.

### Scene 5: Confident Closing & CTA (21.5s - 25.0s | Frame 645 - 750)
* **Visual**: Maskot tersenyum memberikan jempol di samping tombol CTA raksasa `forked.hafidzrdwn.dev` berlatar hijau forest `#245d3e` dengan teks putih dan ikon panah.
* **Pilar Privasi**: Tiga badge pill netral: "100% Client-Side", "Tanpa Registrasi", "Data Milikmu".
* **Tujuan Emosional**: Mengajak penonton langsung mencoba di browser tanpa hambatan registrasi.
