# Forked Promo Creative Audit & Art Direction Blueprint

Dokumen audit ini menganalisis secara komprehensif video promo Instagram Story 25 detik Forked (9:16, 1080 x 1920 @ 30 fps) di dalam direktori `remotion/`. Audit ini membedah akar permasalahan visual, memetakan aset yang dipertahankan dan diganti, mengekstraksi sistem desain autentik dari aplikasi web Forked, serta merumuskan storyboard baru dengan sinkronisasi musikal presisi.

---

## 1. Penyebab Spesifik Masalah Visual (Root Causes)

Berdasarkan audit mendalam terhadap kode sumber dan frame render, ditemukan 6 akar masalah visual yang membuat video terkesan generik dan beraroma AI instan:

### A. Palet Warna Terdisosiasi dari Brand Asli
* **Kondisi Eksisting di Video**: Menggunakan warna generic Tailwind default seperti biru elektrik (`#2563eb`), hijau neon (`#10b981`), dan merah terang (`#ef4444`). Latar belakang menggunakan `#fbfbf9` dengan titik-titik radial generik.
* **Kondisi Asli Aplikasi Web Forked**: Aplikasi web asli (`src/style.css`) dibangun dengan palet editorial bernuansa organik dan tenang:
  - Canvas: `#f8f8f5` (warm paper tint).
  - Teks Utama (Foreground): `#1e261f` (deep forest charcoal).
  - Primary Brand Green: `#245d3e` (deep organic forest green) dengan accent glow `#55ad76` dan `#a4dcba`.
  - Secondary Slate Blue: `#366077` (muted petrol blue).
  - Alert / Risk Red: `#b54739` (terracotta warm red).
  - Surface Card: `#ffffff` dengan border `#e3e6de` dan `#c9d0c4`.
* **Dampak**: Promo video terasa seperti template SaaS generik dan tidak mencerminkan jiwa produk Forked yang privat, tenang, dan reflektif.

### B. Logo Brand dan Aksen Grafis Kurang Autentik
* Di [remotion/src/components/BrandLogo.tsx](file:///d:/coding/www/forked/remotion/src/components/BrandLogo.tsx), gradien logo menggunakan warna hijau neon (`#10b981` ke `#059669`), berbeda dengan logo asli di [src/components/common/BrandLogo.vue](file:///d:/coding/www/forked/src/components/common/BrandLogo.vue) yang menggunakan gradien forest green mewah (`#347852` ke `#245d3e` ke `#143b27`) serta drop shadow hijau pinus `#133522`.

### C. Karakter Maskot Terlihat "Ditempel" (Pasted-On)
* Aset maskot di `remotion/public/assets/` berformat JPG dengan latar belakang statis kotak (1024 x 1024):
  - `mascot_crossroads.jpg` memiliki latar belakang pemandangan alam dengan papan penunjuk arah kayu bertuliskan "ADVENTURE AHEAD" dan "COZY CABIN" yang bertabrakan dengan kartu UI "Jalur A" dan "Jalur B".
  - Karena tidak memiliki transparansi (alpha channel), gambar terpaksa dibungkus dalam kartu kotak membulat (`borderRadius: 48px`), sehingga tampak seperti foto galeri atau thumbnail stiker yang ditempel, bukan entitas 3D hidup yang berinteraksi dengan antarmuka aplikasi.

### D. Ketidaksinkronan Musikal (Desynchronized Audio-Visual Rhythms)
* Soundtrack procedural di [generate_soundtrack.mjs](file:///d:/coding/www/forked/remotion/scripts/generate_soundtrack.mjs) berjalan pada 96 BPM.
  - Pada 96 BPM: 1 ketukan = 0.625 detik = 18.75 frame; 1 birama 4/4 = 2.50 detik = 75 frame.
  - Namun pemotongan scene di `Composition.tsx` berjalan pada frame 120 (4.0 detik = 6.4 ketukan), frame 240 (8.0 detik), frame 540 (18.0 detik), dan frame 660 (22.0 detik).
  - Scene cuts jatuh di antara birama (off-beat), chime efek suara muncul terlambat pada frame 126 (bukan tepat di frame 120), dan pergantian akor di audio tidak sinkron dengan pergantian slide di visual. Ini memicu persepsi bahwa lagu dan video balapan atau tidak kawin.

### E. Adegan Simulasi Kurang Berenergi dan Terlalu Datar
* Pada scene simulasi [MainFeatureScene.tsx](file:///d:/coding/www/forked/remotion/src/scenes/MainFeatureScene.tsx), hanya ada 2 kartu putih berdampingan dan 1 slider. Tidak ada visualisasi radar chart, bar dimensi trade-off (Uang, Waktu, Peluang Karir, Risiko), atau dinamika micro-interaction yang membuktikan kehebatan mesin kalkulasi Forked.
* Teks nominal angka terasa seperti mockup statis alih-alih simulasi live yang responsif dan memukau.

### F. Ikon dan Tipografi Generik
* Menggunakan ikon default Lucide tanpa pembobotan visual yang berkarakter.
* Hirarki tipografi belum memanfaatkan kontras antara font display `Manrope` yang geometris tegas dan font sans `DM Sans` yang humanis elegan seperti pada aplikasi web aslinya.

---

## 2. Inventaris Aset: Keep vs Replace

### A. Aset yang Dipertahankan (Worth Keeping)
1. **Model Logika Skor Autentik**:
   - Fungsi [scoreScenario()](file:///d:/coding/www/forked/remotion/src/utils/scoring.ts) yang mengimplementasikan rumus matematis asli Forked (bobot Uang 35%, Waktu 20%, Karir 30%, Risiko 15%).
2. **Karakter Dasar Maskot (Concept)**:
   - Desain karakter 3D makhluk bulat biru beraksen oranye hangat dengan ekspresi menggemaskan dan tas ransel sangat disukai dan cocok menjadi ikon emosional produk.
3. **Format & Spesifikasi Output**:
   - Kanvas vertikal Instagram Story 1080 x 1920 piksel @ 30 fps, durasi 750 frame (25.0 detik).
4. **Font Pairing Resmi**:
   - `Manrope` (Headlines / Display) dan `DM Sans` (Body / UI Metrics).

### B. Aset yang Perlu Diganti atau Diperbaiki (Assets to Replace / Refactor)
1. **Aset Maskot JPG Tanpa Transparansi**:
   - Perlu diekstrak atau digenerasi ulang sebagai PNG dengan alpha channel transparan bersih, sehingga maskot dapat berdiri langsung di atas kartu UI, menunjuk slider, atau memegang badge tanpa kotak putih pembungkus.
2. **Palet Warna Tailwind Generik**:
   - Hapus seluruh penggunaan `#2563eb`, `#10b981`, `#ef4444`. Gantikan dengan token warna asli Forked: Forest Green `#245d3e`, Warm Slate Charcoal `#1e261f`, Terracotta `#b54739`, Petrol Blue `#366077`, dan Paper Canvas `#f8f8f5`.
3. **Soundtrack Timing & SFX**:
   - Perbaiki susunan birama di `generate_soundtrack.mjs` agar setiap hit drum, drop bass, dan chime akor jatuh tepat di frame pergantian scene dan animasi slider.
4. **Brand Logo Mark**:
   - Perbarui gradien dan bayangan SVG di `BrandLogo.tsx` agar 100% identik dengan `BrandLogo.vue` aplikasi utama.
5. **UI Simulasi Flat**:
   - Ganti kartu perbandingan statis dengan komponen interaktif terintegrasi yang menampilkan 4 progress bar metrik (Finansial, Jam Kerja, Potensi Karir, Indeks Risiko) yang bergerak reaktif mengikuti slider What-If.

---

## 3. Ekstraksi Palet Warna & Tipografi Resmi

### A. Palet Warna Produk (Product Design System)
* **Background Canvas**: `#f8f8f5` (Warm Canvas Paper)
* **Background Subtle**: `#f1f4ee` (Soft Moss Canvas)
* **Surface Card**: `#ffffff` (Pure White Card)
* **Surface Elevated**: `#fdfdfa` (Light Warm Surface)
* **Border Default**: `#e3e6de` (Organic Subtle Border)
* **Border Hover / Focus**: `#c9d0c4` (Deep Organic Border)
* **Foreground Primary**: `#1e261f` (Deep Forest Charcoal)
* **Foreground Muted**: `#5e665d` (Muted Sage Gray)
* **Foreground Subtle**: `#868e85` (Soft Slate)
* **Primary Brand**: `#245d3e` (Forked Signature Forest Green)
* **Primary Brand Dark**: `#19432c` (Deep Pine)
* **Primary Brand Soft**: `#eaf3ec` (Pine Tint Pill)
* **Accent Glow Light**: `#55ad76` / `#a4dcba`
* **Trade-Off Blue**: `#366077` (Muted Petrol Blue)
* **Trade-Off Blue Soft**: `#e9f2f6` (Petrol Tint)
* **Alert Danger**: `#b54739` (Terracotta Brick)
* **Alert Danger Soft**: `#fdf0ed` (Terracotta Tint)
* **Accent Amber**: `#94641f` (Warm Honey Amber)
* **Accent Amber Soft**: `#fbf2de` (Honey Tint)

### B. Sistem Tipografi
* **Display Font (Headings, Hero Titles, Big Numbers)**: `Manrope`, weights 700 (Bold) dan 800 (ExtraBold). Letter-spacing: `-0.03em`.
* **Body Font (Labels, Explanations, Financial Details)**: `DM Sans`, weights 500 (Medium), 600 (SemiBold), 700 (Bold).

---

## 4. Usulan Storyboard Baru & Rencana Sinkronisasi Audio Presisi

Total durasi video adalah 25 detik (750 frame @ 30 fps).
Pada tempo 96 BPM, 1 birama (4 ketukan) berdurasi tepat 2.50 detik (75 frame). Dengan demikian, 25 detik terbagi menjadi 10 birama musik sempurna.

Setiap scene kini dirancang mengikuti ketukan birama musik matematis:

### Scene 1: The Dilemma & The Overthinking Freeze (0.0s - 4.5s | Frame 0 - 135)
* **Durasi Musik**: Birama 1 & 2 (8 ketukan, frame 0 - 135).
* **Audio**:
  - Frame 0: Suara hangat Rhodes chord pertama (Cmaj7/9) dengan desis piringan hitam vinyl.
  - Frame 75 (2.5s): Ketukan kick drum pertama dan transisi ke akor kedua.
  - Frame 95 (3.16s): Sound effect tape stop / needle scratch instan saat karakter membeku.
* **Visual**:
  - Karakter 3D berdiri di tengah dengan latar belakang canvas hangat, memandang dua pilihan karir yang melayang.
  - Judul: "Bingung Pilih Jalur Masa Depan?" dalam Manrope 800 warna `#1e261f`.
  - Tepat pada frame 95: Efek freeze-frame dramatis. Karakter berubah ekspresi mata spiral dengan komikal badge: "OVERTHINKING 99%".

### Scene 2: The Solution Reveal (4.5s - 8.5s | Frame 135 - 255)
* **Durasi Musik**: Birama 3 & 4 (frame 135 - 255).
* **Audio**:
  - Frame 135 (4.5s): Beat drop santai! Kick dan rimshot snare masuk beriringan dengan bassline sub hangat dan chime kristal gemerincing.
* **Visual**:
  - Kamera melakukan transisi zoom halus.
  - Brand Logo Forked dengan animasi path SVG bercabang mekar sempurna berlatar aura glow hijau pinus `#245d3e`.
  - Tipografi: "forked." dan subtitle "Eksplorasi Skenario Hidup Tanpa Penyesalan".
  - Tiga pilar produk meluncur dinamis dengan badge pill lembut beraksen `#245d3e` dan `#366077`.

### Scene 3: Interactive Simulation & What-If Stress Test (8.5s - 18.0s | Frame 255 - 540)
* **Durasi Musik**: Birama 5, 6, 7, 8 (frame 255 - 540).
* **Audio**:
  - Frame 255 (8.5s): Akor Rhodes berpindah ke progresi jazz-hop minor hangat.
  - Frame 345 - 435 (11.5s - 14.5s): Serangkaian efek suara tactile click haptic saat slider What-If digeser kursor.
* **Visual**:
  - Visualisasi perbandingan penuh antara Jalur A (MT BUMN) dan Jalur B (Remote Startup).
  - Teks angka terukur jelas: Gaji Rp 16.000.000 / bulan, Biaya Hidup Rp 5.000.000 / bulan.
  - Kursor interaktif menarik slider "Uji Lonjakan Biaya Hidup (+35%)".
  - Saat slider bergerak, 4 bar trade-off bergerak real-time:
    * Finansial Bersih
    * Keseimbangan Waktu
    * Potensi Karir
    * Indeks Risiko
  - Skor total live berfluktuasi secara matematis membuktikan keaslian kalkulator Forked.

### Scene 4: The Reality Check & Punchline (18.0s - 21.5s | Frame 540 - 645)
* **Durasi Musik**: Birama 9 (frame 540 - 645).
* **Audio**:
  - Drum sejenak berhenti (breakbeat drop), menyisakan akor elektrik piano yang mengambang lembut dan chime halus di frame 570.
* **Visual**:
  - Tipografi punchline berskala besar:
    "Bukan peramal masa depan."
    (Jeda hening visual)
    "Cuma cara lebih waras buat mengambil keputusan."
  - Tiga kartu checklist transparan dengan centang hijau forest `#245d3e`.

### Scene 5: Confident Closing & Call to Action (21.5s - 25.0s | Frame 645 - 750)
* **Durasi Musik**: Birama 10 (frame 645 - 750).
* **Audio**:
  - Ketukan drum masuk kembali untuk resolusi akhir bersama bassline padat, diakhiri fade-out alami pada detik ke-24.5.
* **Visual**:
  - Karakter 3D tersenyum percaya diri memberikan jempol (*thumbs up*).
  - CTA Button berukuran besar dan berkilau: `forked.hafidzrdwn.dev`.
  - Teks penjelas: "100% Client-Side. Tanpa Registrasi. Data Tetap Milikmu."
  - Komposisi terdistribusi proporsional tanpa ruang kosong berlebih di batas atas maupun bawah.

---

## 5. Ringkasan Kepatuhan & Jaminan Keamanan Aset
* File audio asli [soundtrack.wav](file:///d:/coding/www/forked/remotion/public/soundtrack.wav) dan aset asli di `remotion/public/assets/` tetap terjaga utuh tanpa dihapus.
* Tidak ada perubahan kode animasi atau scene sebelum audit ini disetujui.
