<div align="center">

# Design System Generator

**Plugin Figma untuk menghasilkan Fondasi Design System dan Komponen berbasis Shadcn UI secara otomatis**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Figma Plugin API](https://img.shields.io/badge/Figma_Plugin_API-Variables-F24E1E?style=flat-square&logo=figma&logoColor=white)](https://www.figma.com/plugin-docs/)
[![Vitest](https://img.shields.io/badge/Vitest-154_Tests-6E9F18?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/Status-In_Development-orange?style=flat-square)]()

**Bahasa UI:** Bahasa Indonesia &nbsp;|&nbsp; English

</div>

---

## Apa Itu Design System Generator?

**Design System Generator** adalah plugin Figma berbasis TypeScript yang dirancang untuk mengotomatisasi pembuatan fondasi Design System (variabel warna, tipografi, spacing, radius, efek, motion, dan sistem ikon) serta pembuatan komponen berbasis aturan Shadcn UI.

---

## Cara Uji Coba & Instalasi di Figma (Tanpa Build)

Pengunjung yang ingin menguji coba plugin ini langsung di Figma Desktop dapat menginstalnya tanpa perlu melakukan *compile* atau `npm install`:

1. **Unduh Repository Publik Ini**:
   - Klik tombol **Code** > **Download ZIP** di bagian atas halaman GitHub ini, lalu *extract* file ZIP tersebut di komputer Anda.
   - *(Atau gunakan `git clone https://github.com/ariyoaziz/Design-System-Generator.git`)*

2. **Buka Aplikasi Figma**:
   - Buka aplikasi **Figma Desktop**.
   - Klik ikon menu Figma (logo Figma di kiri atas) > **Plugins** > **Development** > **Import plugin from manifest...**

3. **Pilih File `manifest.json`**:
   - Cari dan pilih file `manifest.json` yang ada di dalam folder hasil *extract* tadi.

4. **Jalankan Plugin**:
   - Plugin **Design System Generator** akan otomatis muncul di bawah menu **Plugins** > **Development** dan siap digunakan langsung.

---

## Status Pengembangan Fitur

### 1. Fitur Siap Gunakan (Selesai & Fix)

| Fitur | Keterangan | Status |
|:---|:---|:---:|
| **Warna — Shadcn Colors** | Pemilihan 22 palet Tailwind primitives (50-950) langsung ke Figma Variables | Ready |
| **Warna — Custom Brand (Adobe Harmonies)** | Color Wheel interaktif, 5 kurva harmoni (Analogous, Triad, Split-Complementary, Complementary, Monochromatic), generator skala 50-950, dan status warna semantik | Ready |

---

### 2. Fitur Berfungsi (Masih Perlu Perbaikan & Perbaikan Bug)

| Fitur | Keterangan | Catatan |
|:---|:---|:---|
| **Tipografi** | Skala font dan Native Figma Text Styles | Berfungsi, dalam perbaikan bug |
| **Tata Letak (Layout)** | Spacing grid scale (0.25rem) dan Border Radius float scale | Berfungsi, dalam perbaikan bug |
| **Visual** | Effects/Drop Shadow, Motion (durasi + easing), dan Layers (Z-index) | Berfungsi, dalam perbaikan bug |
| **Sistem (System)** | Token dimensi ikon dan stroke weight | Berfungsi, dalam perbaikan bug |
| **Ekspor & Impor** | CSS Variables (`:root` / `.dark`), Tailwind Config, dan W3C DTCG JSON | Berfungsi, dalam perbaikan bug |
| **Dashboard & Inspector** | Live audit integritas variabel, cakupan, dan reset fondasi | Berfungsi, dalam perbaikan bug |
| **Bilingual UI (ID / EN)** | Dukungan Bahasa Indonesia dan English pada interface plugin | Berfungsi, dalam perbaikan label |

---

## Rencana Pengembangan Selanjutnya

Setelah seluruh fondasi (Warna, Tipografi, Tata Letak, Visual, Sistem, serta Ekspor/Impor) selesai disempurnakan dan 100% stabil, pengembangan akan berlanjut ke tahap utama berikutnya:

### Otomatisasi Komponen Shadcn UI

- **Generasi Komponen Otomatis**: Plugin akan membuat komponen UI Figma secara otomatis sesuai dengan spesifikasi dan aturan resmi **Shadcn UI** (Button, Input, Card, Dialog, Badge, Select, dan komponen lainnya).
- **Binding Variabel Otomatis**: Setiap komponen yang dihasilkan akan langsung terhubung (*bound*) ke variabel fondasi warna, tipografi, radius, dan spacing yang sudah dibuat sebelumnya.
- **Tanpa Buat Komponen Manual**: Desainer tidak perlu lagi menyusun varian komponen secara manual dari nol di Figma.

---

## Arsitektur Kelompok Fondasi

1. **Warna (Colors)**: Tailwind primitives (242 warna), Shadcn UI theme tokens (Light & Dark), Adobe Color Harmonies Engine, status colors, semantic colors, sidebar, dan chart colors.
2. **Tipografi (Typography)**: Font scale, weight, line-height, letter-spacing, dan Native Figma Text Styles (`Display XL` hingga `Overline`).
3. **Tata Letak (Layout)**: Spacing scale 0.25rem (`spacing-0` hingga `spacing-96`) dan border radius float scale (`radius-sm` hingga `radius-full`).
4. **Visual**: Native Figma Effect Styles (drop shadow), motion duration/easing tokens, dan Z-index layer tokens.
5. **Sistem (System)**: Icon dimension dan stroke weight tokens.

---

## Perintah Build & Pengembangan

| Perintah | Keterangan |
|:---|:---|
| `npm run dev` | Dev watch: auto-rebuild `ui.html` dan `code.js` saat file disimpan |
| `npm run build` | Build produksi penuh (UI bundle + TypeScript check + esbuild) |
| `npm run build:ui` | Rebuild `ui.html` saja |
| `npm test` | Jalankan unit test Vitest (154 tests) |
| `npm run lint` | Jalankan ESLint |
| `npm run push:private` | Push seluruh kode sumber dan dokumen ke repository Private |
| `npm run push:public` | Push rilis bundle bersih (`manifest.json`, `code.js`, `ui.html`) ke repository Public |

---

## Kredit

Dibuat oleh **Ariyo Aziz** ([@ariyoaziz_](https://github.com/ariyoaziz_))
Terinspirasi oleh **shadcn/ui** (*Proyek komunitas independen. Tidak berafiliasi dengan proyek resmi shadcn/ui.*)
