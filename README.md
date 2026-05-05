# Simulasi Setup BIOS — Ujian Praktikum

Simulasi interaktif konfigurasi BIOS (AMIBIOS) dan partisi HDD untuk instalasi Windows 10 via USB Flashdisk.

## 🎯 Tentang

Aplikasi web ini mensimulasikan proses konfigurasi BIOS dan partisi HDD yang dilakukan saat ujian praktikum instalasi Windows 10. Dirancang untuk latihan mahasiswa sebelum ujian praktikum Lab Hardware Komputer.

## 📋 Fitur

- **BIOS AMIBIOS Authentic** — Tampilan dan navigasi mirip BIOS asli (blue/gray theme)
- **2 Sesi BIOS** — Sesi 1: Konfigurasi dasar (Floppy, IDE, USB). Sesi 2: Boot priority
- **Windows Installer Flow** — Language selection → Install Now → License → Custom/Upgrade
- **Partisi HDD** — Keyboard-driven partition management (New, Delete, Format, Refresh)
- **Bank Soal** — 8 variasi soal partisi dengan toleransi ±5 GB
- **Timer 20 Menit** — Auto-submit saat waktu habis
- **Scoring & Leaderboard** — Penilaian otomatis dengan leaderboard LocalStorage
- **CRT Effect** — Scanline overlay untuk nuansa retro

## ⌨️ Navigasi

### BIOS
| Tombol | Fungsi |
|--------|--------|
| `DEL` | Masuk BIOS (layar POST) |
| `←` `→` | Pindah tab |
| `↑` `↓` | Navigasi item |
| `Enter` | Masuk sub-menu / pilih nilai |
| `+` `-` | Ganti nilai |
| `ESC` | Kembali |
| `F10` | Save and Exit |

### Partisi
| Tombol | Fungsi |
|--------|--------|
| `↑` `↓` | Pilih partisi |
| `Tab` / `Shift+Tab` | Pindah fokus tombol |
| `Enter` / `Spasi` | Klik tombol aktif |

## 📊 Penilaian (100 poin)

| Kriteria | Poin |
|----------|------|
| Legacy Diskette A → Disabled | 10 |
| ATA/IDE Configuration → Enhanced | 10 |
| USB 2.0 Controller → Enabled | 15 |
| Hard Disk Drives: Sandisk 1st | 15 |
| Boot Device Priority: Sandisk 1st | 15 |
| Partisi sesuai soal | 35 |

## 🚀 Deploy

### Vercel
1. Import repo di [vercel.com](https://vercel.com)
2. Deploy otomatis — tidak perlu build settings (static site)

### Lokal
```bash
npx serve .
```

## 🛠 Tech Stack

- Vanilla HTML/CSS/JavaScript (ES Modules)
- No dependencies, no build step
- LocalStorage untuk leaderboard
