# PRD — Simulasi Ujian Installasi Windows 10 via BIOS (AMIBIOS)
**Product Requirements Document — Revisi 1.2**
**Tanggal:** 6 Mei 2026
**Platform:** Web Browser (HTML + CSS + JS, tanpa instalasi)
**Referensi:** Buku Panduan Praktikum Lab. Hardware Komputer, www.unikom.ac.id

---

## 1. Latar Belakang

Praktikum Lab. Hardware Komputer mensyaratkan mahasiswa mampu mengkonfigurasi BIOS AMIBIOS (American Megatrends v02.58) dan melakukan instalasi Windows 10 Pro via USB Flashdisk Sandisk, termasuk pembagian partisi HDD MidasForce SSD 256GB sesuai soal. Waktu ujian: **20 menit**.

Simulasi ini dirancang se-realistis mungkin meniru BIOS asli, termasuk perilaku menu yang berubah tergantung konfigurasi (hidden/visible) dan konsekuensi nyata dari setiap tindakan.

---

## 2. Spesifikasi Perangkat yang Disimulasikan

| Komponen | Nama Asli | Tampil di BIOS / Layar |
|---|---|---|
| BIOS | American Megatrends AMIBIOS v02.58 | `v02.58 (C)Copyright 1985-2007, American Megatrends, Inc.` |
| Harddisk | MidasForce SSD 256GB | `MidasForce SSD 256` |
| USB Flashdisk | Sandisk | `Sandisk` (di Boot menu) |
| RAM | 4 GB | `4096 MB OK` |

---

## 3. Alur Lengkap Simulasi

> Simulasi terdiri dari **2 sesi masuk BIOS** — ini adalah perilaku nyata AMIBIOS:
> Sesi 1: konfigurasi dasar → Save & Exit → restart → Sesi 2: setting boot priority setelah device terdeteksi.

---

### FASE 0 — Start Screen & Input Nama

```
╔══════════════════════════════════════════════════════════╗
║        SIMULASI UJIAN PRAKTIKUM                          ║
║        Installasi Windows 10 via USB — AMIBIOS           ║
║                                                          ║
║   Masukkan nama kamu:                                    ║
║   ┌────────────────────────────────┐                     ║
║   │ _                              │                     ║
║   └────────────────────────────────┘                     ║
║                                                          ║
║              [ MULAI SIMULASI ]                          ║
║              [ LIHAT PANDUAN  ]                          ║
║              [ LEADERBOARD    ]                          ║
╚══════════════════════════════════════════════════════════╝
```

- Nama wajib diisi (min. 2 karakter)
- Timer **20:00** mulai tepat setelah klik **MULAI SIMULASI**
- Timer selalu terlihat di pojok kanan atas selama simulasi
- Jika waktu habis → auto-submit, skor dihitung dari yang sudah selesai

---

### FASE 1 — POST Screen (Pertama)

Layar hitam meniru POST AMIBIOS saat komputer dinyalakan:

```
American Megatrends, Inc.

AMIBIOS (C)2007 American Megatrends, Inc.
BIOS Version  : 02.58
Build Date    : 04/19/07

Checking Memory... 4096 MB OK

Press DEL to run Setup
Press F8 for BBS POPUP
```

> ⚠️ Tidak ada entri SATA atau IDE di POST ini — karena ATA/IDE Configuration masih Disabled, controller belum aktif sehingga tidak ada device yang bisa dideteksi maupun ditampilkan.

**Aksi:** Tekan `DEL` → masuk BIOS Sesi 1.
**Jika tidak tekan DEL dalam 5 detik:** Muncul `"Operating System Not Found"`, lalu auto-restart POST lagi.

---

### FASE 2 — BIOS SESI 1

#### 2.1 Menu Main (kondisi awal — IDE Disabled)

```
╔════════════════════════════════════════════════════════════════════╗
║                      BIOS SETUP UTILITY                           ║
║  Main    Advanced    Power    Boot    Tools    Exit                ║
╠════════════════════════════════════════════════════════════════════╣
║                                         │ Use [ENTER], [TAB]      ║
║  System Time          [10:41:54]        │ or [SHIFT-TAB] to       ║
║  System Date          [Sun 10/06/2024]  │ select a field.         ║
║  Legacy Diskette A    [1.44M, 3.5 in.]  │                         ║
║                                         │ Use [+] or [-] to       ║
║  ▶ IDE Configuration                    │ configure System Time.  ║
║  ▶ System Information                   │                         ║
║                                         │ →→  Select Screen       ║
║                                         │ ↑↓  Select Item         ║
║                                         │ +-  Change Field        ║
║                                         │ Tab Select Field        ║
║                                         │ F1  General Help        ║
║                                         │ F10 Save and Exit       ║
║                                         │ ESC Exit                ║
╠════════════════════════════════════════════════════════════════════╣
║  v02.58 (C)Copyright 1985-2007, American Megatrends, Inc.         ║
╚════════════════════════════════════════════════════════════════════╝
```

> 🔑 **KUNCI REALISTIS:** Saat ATA/IDE Configuration = **Disabled**, entri **Primary IDE Master, Primary IDE Slave, SATA 1–4 tidak muncul sama sekali** di menu Main. Menu hanya menampilkan System Time, System Date, Legacy Diskette A, IDE Configuration, dan System Information. Ini perilaku nyata AMIBIOS — controller yang dimatikan tidak menampilkan slot device-nya.

---

#### TUGAS 2A — Disable Legacy Diskette A

- **Kondisi awal:** `[1.44M, 3.5 in.]`
- **Cara:** Pilih baris Legacy Diskette A → Enter → pilih **Disabled**
- **Pilihan opsi:** `[Disabled]` `[360K, 5.25 in.]` `[1.2M, 5.25 in.]` `[720K, 3.5 in.]` `[1.44M, 3.5 in.]` `[2.88M, 3.5 in.]`
- **Target:** `[Disabled]`
- **Konsekuensi jika tidak diubah:** BIOS mencari boot dari floppy drive yang tidak ada, bisa mengganggu proses boot.

---

#### TUGAS 2B — IDE Configuration → ATA/IDE Configuration ke Enhanced

Masuk sub-menu **IDE Configuration**:

```
╔════════════════════════════════════════════════════════════════════╗
║                      BIOS SETUP UTILITY                           ║
║  Main  ▶  IDE Configuration                                       ║
╠════════════════════════════════════════════════════════════════════╣
║                                         │ Options                 ║
║  ATA/IDE Configuration   [Disabled]     │ ─────────────────       ║
║  IDE Detect Time Out     [35]           │ ► Disabled              ║
║                                         │   Compatible            ║
║                                         │   Enhanced              ║
║                                         │                         ║
║                                         │ [Disabled]              ║
║                                         │ Mematikan SATA &        ║
║                                         │ PATA controller.        ║
║                                         │ Tidak ada HDD yang      ║
║                                         │ terdeteksi.             ║
╠════════════════════════════════════════════════════════════════════╣
║  v02.58 (C)Copyright 1985-2007, American Megatrends, Inc.         ║
╚════════════════════════════════════════════════════════════════════╝
```

- **Kondisi awal:** `[Disabled]`
- **Pilihan:**
  - `Disabled` → SATA & PATA controller dimatikan, tidak ada HDD terdeteksi
  - `Compatible` → SATA berjalan mode PATA (legacy), maks. 4 device, untuk OS lama
  - `Enhanced` → SATA berjalan native/penuh, diperlukan untuk Windows 10
- **Target:** `[Enhanced]`
- **Konsekuensi jika Disabled atau Compatible:** HDD tidak terdeteksi optimal, instalasi Windows 10 bisa gagal.

Setelah diubah → ESC kembali ke menu Main.

> 🔑 **Setelah ATA/IDE diubah ke Enhanced**, entri Primary IDE Master, IDE Slave, SATA 1–4 **LANGSUNG MUNCUL** di menu Main (tanpa perlu restart), tapi semuanya masih menampilkan `Not Detected` karena restart belum dilakukan:

```
║  Legacy Diskette A    [Disabled]        │
║                                         │
║  ▶ Primary IDE Master  : Not Detected   │
║  ▶ Primary IDE Slave   : Not Detected   │
║  ▶ SATA 1              : Not Detected   │
║  ▶ SATA 2              : Not Detected   │
║  ▶ SATA 3              : Not Detected   │
║  ▶ SATA 4              : Not Detected   │
║                                         │
║  ▶ IDE Configuration                    │
║  ▶ System Information                   │
```

> Device baru akan terbaca setelah **Save & Exit lalu restart** — inilah mengapa diperlukan 2 sesi BIOS.

---

#### TUGAS 2C — Advanced → USB Configuration → Enable USB 2.0 Controller

Tab **Advanced** → sub-menu **USB Configuration**:

```
╔════════════════════════════════════════════════════════════════════╗
║  Advanced  ▶  USB Configuration                                   ║
╠════════════════════════════════════════════════════════════════════╣
║                                         │ Options                 ║
║  Module Version - 2.24.2-13.4           │ ─────────────────       ║
║  USB Devices Enabled: 0 Drives          │ ► Disabled              ║
║                                         │   Enabled               ║
║  USB 2.0 Controller      [Disabled]     │                         ║
║  Legacy USB Support      [Auto]         │                         ║
║  USB 2.0 Controller Mode [HiSpeed]      │                         ║
║                                         │                         ║
║  ▶ USB Mass Storage Device Config       │                         ║
╠════════════════════════════════════════════════════════════════════╣
║  v02.58 (C)Copyright 1985-2007, American Megatrends, Inc.         ║
╚════════════════════════════════════════════════════════════════════╝
```

- **Kondisi awal:** USB 2.0 Controller = `[Disabled]`, USB Devices Enabled: **0 Drives**
- **Target:** USB 2.0 Controller = `[Enabled]`
- **Setelah diubah:** USB Devices Enabled berubah langsung menjadi **5 Drives**
- **Konsekuensi jika tetap Disabled:** USB Sandisk tidak terbaca, instalasi tidak bisa dimulai.

---

#### F10 — Save & Exit BIOS Sesi 1

Tekan `F10` dari mana saja:

```
┌──────────────────────────────────────┐
│                                      │
│    Save configuration and reset?     │
│                                      │
│         [  Ok  ]    [ Cancel ]       │
│                                      │
└──────────────────────────────────────┘
```

Pilih **Ok** → animasi:
```
Saving configuration...
System will now reset.
```
→ Komputer restart → POST Screen Kedua.

---

### FASE 3 — POST Screen Kedua (Setelah Restart)

Setelah restart, ATA/IDE sudah Enhanced dan USB sudah Enabled. POST kini menampilkan device:

```
American Megatrends, Inc.

AMIBIOS (C)2007 American Megatrends, Inc.
BIOS Version  : 02.58
Build Date    : 04/19/07

Checking Memory... 4096 MB OK
Primary IDE Master   : Not Detected
Primary IDE Slave    : Not Detected
SATA 1               : MidasForce SSD 256
SATA 2               : Not Detected
SATA 3               : Not Detected
SATA 4               : Not Detected

USB Device Detected  : Sandisk

Press DEL to run Setup
Press F8 for BBS POPUP
```

**Aksi:** Tekan `DEL` → masuk BIOS Sesi 2.

---

### FASE 4 — BIOS SESI 2: Setting Boot Priority

#### 4.1 Menu Main (Sesi 2)

```
║  Legacy Diskette A    [Disabled]           │  (sudah benar)
║                                            │
║  ▶ Primary IDE Master  : Not Detected      │
║  ▶ Primary IDE Slave   : Not Detected      │
║  ▶ SATA 1              : MidasForce SSD 256│  ← Terdeteksi!
║  ▶ SATA 2              : Not Detected      │
║  ▶ SATA 3              : Not Detected      │
║  ▶ SATA 4              : Not Detected      │
```

---

#### TUGAS 4A — Boot → Hard Disk Drives: Sandisk jadi 1st Drive

Tab **Boot** → sub-menu **Hard Disk Drives**:

```
╔════════════════════════════════════════════════════════════════════╗
║  Boot  ▶  Hard Disk Drives                                        ║
╠════════════════════════════════════════════════════════════════════╣
║                                         │ Specifies the boot      ║
║  1st Drive  [HDD:MidasForce SSD 256]    │ sequence from the       ║
║  2nd Drive  [Sandisk]                   │ available devices.      ║
║                                         │                         ║
║                                         │ →→  Select Screen       ║
║                                         │ ↑↓  Select Item         ║
║                                         │ +-  Change Option       ║
║                                         │ F1  General Help        ║
║                                         │ F10 Save and Exit       ║
║                                         │ ESC Exit                ║
╠════════════════════════════════════════════════════════════════════╣
║  v02.58 (C)Copyright 1985-2007, American Megatrends, Inc.         ║
╚════════════════════════════════════════════════════════════════════╝
```

- **Kondisi awal (sengaja salah):** HDD di 1st, Sandisk di 2nd
- **Target:**
  - 1st Drive = `[Sandisk]`
  - 2nd Drive = `[HDD:MidasForce SSD 256]`

---

#### TUGAS 4B — Boot Device Priority: Sandisk jadi 1st Boot Device

Kembali ke Boot → sub-menu **Boot Device Priority**:

```
╔════════════════════════════════════════════════════════════════════╗
║  Boot  ▶  Boot Device Priority                                    ║
╠════════════════════════════════════════════════════════════════════╣
║                                         │ Specifies the boot      ║
║  1st Boot Device  [HDD:MidasForce SSD]  │ sequence from the       ║
║  2nd Boot Device  [Disabled]            │ available devices.      ║
║                                         │                         ║
║                                         │ A device enclosed in    ║
║                                         │ parentheses has been    ║
║                                         │ disabled in the         ║
║                                         │ corresponding type      ║
║                                         │ menu.                   ║
╠════════════════════════════════════════════════════════════════════╣
║  v02.58 (C)Copyright 1985-2007, American Megatrends, Inc.         ║
╚════════════════════════════════════════════════════════════════════╝
```

- **Kondisi awal (sengaja salah):**
  - 1st Boot Device = `[HDD:MidasForce SSD 256]`
  - 2nd Boot Device = `[Disabled]`
- **Pilihan tersedia** di setiap slot:
  - `[Sandisk]`
  - `[HDD:MidasForce SSD 256]`
  - `[Disabled]`
- **Target:**
  - 1st Boot Device = `[Sandisk]`
  - 2nd Boot Device = `[HDD:MidasForce SSD 256]` *(atau Disabled — keduanya diterima)*
- **Konsekuensi jika salah:** Komputer boot dari HDD, tidak bisa mulai instalasi Windows.

---

#### F10 — Save & Exit BIOS Sesi 2

Sama seperti Sesi 1 → dialog konfirmasi → Ok → restart.

---

### FASE 5 — Boot dari USB

```
Press any key to boot from CD or DVD...
```
Tekan sembarang tombol →

```
Windows is loading files...
[████████████░░░░░░░░] 65%
```
Animasi ±3 detik → masuk halaman partisi.

---

### FASE 6 — SOAL PARTISI HDD

#### 6.1 Tampilan Kotak Soal

Kotak soal floating/sticky di atas layar partisi, selalu terlihat:

```
╔══════════════════════════════════════════════════════════╗
║  📋 SOAL PARTISI                                        ║
║                                                          ║
║  Bagi HDD MidasForce SSD 256 (±255 GB tersedia)         ║
║  sebagai berikut:                                        ║
║                                                          ║
║  • Drive F: = Sisa (semua ruang yang tersisa)           ║
║  • Drive C: = 80 GB                                     ║
║  • Drive D: = 80 GB                                     ║
║                                                          ║
║  ⚠ Perhatikan urutan soal! F bukan di akhir.            ║
║  Toleransi: ±5 GB per partisi (kecuali Sisa)            ║
╚══════════════════════════════════════════════════════════╝
```

---

#### 6.2 Tampilan Layar Partisi Windows Setup (Full Keyboard)

```
┌──────────────────────────────────────────────────────────────────┐
│  Windows Setup                                                   │
├──────────────────────────────────────────────────────────────────┤
│  Where do you want to install Windows?                           │
│                                                                  │
│  Name                    Total Size   Free Space   Type          │
│  ──────────────────────────────────────────────────────────      │
│  ▶ Drive 0 Unallocated Space   255.5 GB   255.5 GB              │
│                                                                  │
│                                                                  │
│                                                                  │
│  [ Refresh ]  [ Delete ]  [ Format ]  [ New ]  [ Load Driver ]  │
│                                                                  │
│                                              [    Next    ]      │
└──────────────────────────────────────────────────────────────────┘

Navigasi: Tab/Shift+Tab pindah fokus | ↑↓ pilih partisi | Enter/Spasi klik tombol
```

**⌨️ Aturan Navigasi — Full Keyboard, Tanpa Mouse:**

| Tombol | Fungsi |
|---|---|
| `↑` `↓` | Pilih partisi di tabel |
| `Tab` | Pindah fokus ke tombol berikutnya (Refresh → Delete → Format → New → Load Driver → Next) |
| `Shift+Tab` | Pindah fokus ke tombol sebelumnya |
| `Enter` atau `Spasi` | Klik/aktifkan tombol yang sedang difokus |
| `Tab` saat di input size | Konfirmasi ukuran (seperti klik Apply) |

**Alur membuat partisi (keyboard):**
1. Pilih `Drive 0 Unallocated Space` dengan ↓
2. Tab hingga fokus ke tombol **[ New ]** → Enter
3. Muncul input: `Size (GB): [____]` → ketik angka → Tab/Enter untuk Apply
4. Partisi baru muncul di tabel
5. Ulangi dari langkah 1 untuk partisi berikutnya
6. Setelah semua partisi selesai → Tab hingga fokus **[ Next ]** → Enter

**Catatan teknis simulasi:**
- Windows Setup otomatis membuat **System Reserved ~100 MB** saat partisi pertama dibuat — ini disimulasikan dan tidak dihitung dalam soal
- Input ukuran dalam **GB**
- Urutan label drive: C → D → E → F → dst sesuai urutan dibuat mahasiswa
- Jika membuat terlalu banyak atau terlalu sedikit partisi, validasi dilakukan saat klik Next

---

#### 6.3 Bank Soal Partisi (Random setiap sesi)

**⚠️ PENTING: "Sisa/Free" TIDAK selalu ada di partisi terakhir.** Soal dirancang agar mahasiswa harus menghitung manual berapa GB yang harus diberikan ke partisi tertentu.

| ID | Teks Soal (urutan = urutan yang harus dibuat) | Tantangan |
|---|---|---|
| S-01 | C: 50 GB, D: 50 GB, F: Sisa | Mudah — Sisa di akhir |
| S-02 | C: 80 GB, D: 80 GB, F: Sisa | Mudah — Sisa di akhir |
| S-03 | C: Sisa, D: 80 GB, F: 80 GB | Sedang — Sisa di awal, hitung: 255-80-80=95 GB |
| S-04 | C: 60 GB, D: Sisa, E: 60 GB | Sedang — Sisa di tengah, hitung: 255-60-60=135 GB |
| S-05 | C: 70 GB, F: Sisa, D: 70 GB, E: 70 GB | Sedang — Sisa di tengah 3 partisi lain |
| S-06 | C: Sisa, D: 60 GB, E: 60 GB, F: 60 GB | Sulit — Sisa di awal, 4 partisi |
| S-07 | C: 80 GB, D: 50 GB, F: Sisa, Unallocated: 30 GB wajib ada | Sulit — Ada unallocated sisa tertentu |
| S-08 | C: 50 GB, D: Sisa, E: 50 GB, F: 50 GB, Unallocated: Sisa | Sulit — Sisa di tengah + unallocated |

**Cara mahasiswa mengatasi Sisa di awal/tengah:**
- Hitung manual: Total tersedia (±255 GB) dikurangi semua partisi bernilai angka
- Buat partisi Sisa dengan angka hasil perhitungan tersebut
- Toleransi ±5 GB masih berlaku — sehingga kalkulasi tidak harus presisi sempurna

---

#### 6.4 Aturan Validasi Partisi

```
Untuk partisi dengan target angka:
  BENAR jika |ukuran_input - target| <= 5 GB

Untuk partisi bertipe "Sisa" (tanpa unallocated):
  BENAR jika ukuran >= 1 GB DAN sisa ruang setelah partisi lain <= 5 GB
  (artinya mahasiswa mengalokasikan hampir semua ruang tersisa)

Untuk partisi bertipe "Sisa" (dengan unallocated tertentu):
  BENAR jika (total - partisi_lain - unallocated_target) ± 5 GB

Untuk "Unallocated wajib ada":
  BENAR jika ada ruang yang tidak dialokasikan >= 1 GB

Total semua partisi:
  Tidak boleh melebihi 255.5 GB
```

---

## 4. Leaderboard

### 4.1 Mekanisme

- Disimpan di **LocalStorage** browser
- Tampilkan **10 entri terbaik** berdasarkan waktu tercepat
- Hanya masuk leaderboard utama jika **semua 5 tugas BIOS benar + semua partisi benar**
- Skor parsial → masuk leaderboard terpisah "Skor Latihan"

### 4.2 Tampilan Leaderboard

```
╔══════════════════════════════════════════════════════════════╗
║               🏆 LEADERBOARD — Tercepat Sempurna            ║
║                  (Semua langkah benar, skor 100)            ║
╠══╦══════════════════╦══════════╦════════════════════════════╣
║# ║ Nama             ║ Waktu    ║ Soal                       ║
╠══╬══════════════════╬══════════╬════════════════════════════╣
║1 ║ Budi             ║ 08:23    ║ C:80 D:80 F:Sisa           ║
║2 ║ Siti             ║ 10:47    ║ C:Sisa D:80 F:80           ║
║3 ║ Andi             ║ 12:05    ║ C:60 D:Sisa E:60           ║
╚══╩══════════════════╩══════════╩════════════════════════════╝

[ Kembali ]   [ Reset Leaderboard ]
```

---

## 5. Sistem Penilaian & Hasil Akhir

### 5.1 Komponen Penilaian

| No | Tugas | Poin |
|---|---|---|
| 1 | Legacy Diskette A → Disabled | 10 |
| 2 | ATA/IDE Configuration → Enhanced | 10 |
| 3 | USB 2.0 Controller → Enabled | 15 |
| 4 | Hard Disk Drives: Sandisk sebagai 1st Drive | 15 |
| 5 | Boot Device Priority: Sandisk sebagai 1st Boot Device | 15 |
| 6 | Partisi sesuai soal (dinilai per partisi) | 35 |
| **Total** | | **100** |

Nilai partisi: `35 / jumlah_partisi_berukuran` per partisi benar (kecuali Sisa otomatis valid jika perhitungan tepat).

### 5.2 Halaman Hasil Akhir

```
╔════════════════════════════════════════════════════════════╗
║              ✅ SIMULASI SELESAI                           ║
╠════════════════════════════════════════════════════════════╣
║  Nama       : Budi Santoso                                ║
║  ⏱ Waktu   : 12 menit 34 detik                           ║
║  📊 Skor    : 75 / 100                                    ║
╠════════════════════════════════════════════════════════════╣
║  DETAIL PENGERJAAN:                                        ║
║  ✅ Legacy Diskette A → Disabled              (+10 poin)  ║
║  ✅ ATA/IDE Configuration → Enhanced          (+10 poin)  ║
║  ✅ USB 2.0 Controller → Enabled              (+15 poin)  ║
║  ❌ Hard Disk Drives Priority (salah)          (+0 poin)  ║
║  ✅ Boot Device Priority → Sandisk 1st        (+15 poin)  ║
║  🟡 Partisi: 2 dari 3 benar                  (+25 poin)  ║
╠════════════════════════════════════════════════════════════╣
║  ⚠️  CATATAN KESALAHAN:                                   ║
║                                                            ║
║  ❌ Hard Disk Drives: 1st Drive masih HDD bukan Sandisk    ║
║     → Komputer tidak bisa boot dari USB                   ║
║       Instalasi Windows tidak bisa dimulai.               ║
║                                                            ║
║  ❌ Partisi D: kamu buat 44 GB, soal = 50 GB              ║
║     Selisih 6 GB melebihi toleransi ±5 GB → GAGAL         ║
║     → Pembagian tidak sesuai instruksi ujian.             ║
╠════════════════════════════════════════════════════════════╣
║  [ 🔁 Ulangi Simulasi ]   [ 🏆 Lihat Leaderboard ]        ║
╚════════════════════════════════════════════════════════════╝
```

---

## 6. Desain Visual & Navigasi BIOS

### 6.1 Tampilan

| Elemen | Spesifikasi |
|---|---|
| Background BIOS | Hitam `#000000` |
| Teks utama | Abu-abu terang `#AAAAAA` / putih `#FFFFFF` |
| Item yang dipilih (highlight) | Background `#00AAAA` (cyan), teks hitam `#000000` |
| Header tab | Background `#555555`, teks putih |
| Tab aktif | Background `#AAAAAA`, teks hitam |
| Sidebar kanan (help) | Background `#000066`, teks `#AAAAAA` |
| Font | `'Courier New', monospace` |
| Footer | `v02.58 (C)Copyright 1985-2007, American Megatrends, Inc.` |
| Efek CRT | CSS scan lines tipis `repeating-linear-gradient` sebagai overlay |
| Cursor BIOS | Blinking `█` pada field aktif (CSS animation 1s blink) |

### 6.2 Navigasi Keyboard — BIOS

| Tombol | Fungsi |
|---|---|
| `↑` `↓` | Navigasi item vertikal |
| `←` `→` | Pindah tab (Main / Advanced / Power / Boot / Tools / Exit) |
| `Enter` | Masuk sub-menu / pilih nilai |
| `ESC` | Kembali ke menu sebelumnya |
| `F10` | Save and Exit (dari mana saja) |
| `+` | Ganti nilai ke opsi berikutnya |
| `-` | Ganti nilai ke opsi sebelumnya |
| `DEL` | Masuk BIOS (hanya di layar POST) |

### 6.3 Timer

| Kondisi | Warna Timer |
|---|---|
| > 10 menit tersisa | Hijau |
| 5–10 menit tersisa | Kuning |
| < 5 menit tersisa | Merah + berkedip |
| Habis | Auto-submit |

---

## 7. Arsitektur Teknis

### 7.1 Stack

| Layer | Teknologi |
|---|---|
| Frontend | HTML5 + CSS3 + Vanilla JavaScript |
| State | JavaScript object (in-memory) |
| Persistensi | LocalStorage (leaderboard) |
| Hosting | GitHub Pages / Vercel / Netlify (static) |
| Backend | Tidak diperlukan |

### 7.2 State Utama

```javascript
const state = {
  nama: "",
  startTime: null,
  timerInterval: null,

  bios1: {
    legacyDiskette: "1.44M, 3.5 in.",  // target: "Disabled"
    ataIdeConfig: "Disabled",            // target: "Enhanced"
    usb2Controller: "Disabled",          // target: "Enabled"
    saved: false,
  },

  bios2: {
    hddDrive1st: "HDD:MidasForce SSD 256", // target: "Sandisk"
    bootDevice1st: "HDD:MidasForce SSD 256", // target: "Sandisk"
    bootDevice2nd: "Disabled",
    saved: false,
  },

  soalPartisi: null,    // dipilih random dari bankSoal[]
  partisiDibuat: [],    // [{ label, ukuranGB, tipe }]

  phase: "START",
  // Phases: START | POST1 | BIOS1 | POST2 | BIOS2 | BOOT | PARTISI | HASIL
};
```

### 7.3 Bank Soal (Konfigurasi)

```javascript
const bankSoal = [
  {
    id: "S-03",
    teks: "C: Sisa, D: 80 GB, F: 80 GB",
    hint: "Hitung C: 255 - 80 - 80 = ±95 GB",
    partisi: [
      { label: "C:", tipe: "sisa" },
      { label: "D:", target: 80, toleransi: 5, tipe: "angka" },
      { label: "F:", target: 80, toleransi: 5, tipe: "angka" },
    ]
  },
  {
    id: "S-04",
    teks: "C: 60 GB, D: Sisa, E: 60 GB",
    hint: "Hitung D: 255 - 60 - 60 = ±135 GB",
    partisi: [
      { label: "C:", target: 60, toleransi: 5, tipe: "angka" },
      { label: "D:", tipe: "sisa" },
      { label: "E:", target: 60, toleransi: 5, tipe: "angka" },
    ]
  },
  // dst...
];
```

---

## 8. Urutan Build (Prioritas)

| Tahap | Komponen | Estimasi |
|---|---|---|
| 1 | Start screen + input nama + timer | 0.5 hari |
| 2 | POST screen 1 (tanpa device entry) + DEL detection | 0.5 hari |
| 3 | BIOS UI engine: tab, navigasi keyboard, sidebar | 2 hari |
| 4 | Menu Main: Legacy Diskette A + IDE Config (hidden/show SATA logic) | 1.5 hari |
| 5 | Menu Advanced: USB Configuration | 1 hari |
| 6 | F10 Save & restart + POST screen 2 (device terdeteksi) | 1 hari |
| 7 | BIOS Sesi 2: Hard Disk Drives + Boot Device Priority | 1.5 hari |
| 8 | F10 Save + Boot animation + Windows loading | 0.5 hari |
| 9 | Kotak soal random + UI partisi Windows (keyboard only) | 2 hari |
| 10 | Validasi partisi ±5 GB + logika Sisa | 1.5 hari |
| 11 | Halaman hasil akhir + penilaian + konsekuensi | 1 hari |
| 12 | Leaderboard (LocalStorage) | 0.5 hari |
| 13 | Polish visual: CRT effect, font, animasi | 1 hari |
| 14 | Testing semua skenario soal + edge case | 1.5 hari |
| **Total** | | **~17 hari** |

---

## 9. Perubahan dari Revisi Sebelumnya (Changelog)

| # | Perubahan |
|---|---|
| 1 | ATA/IDE Configuration kondisi awal = `Disabled` (bukan Compatible) |
| 2 | Saat ATA/IDE = Disabled: entri SATA/IDE **tidak muncul** di menu Main (bukan "Not Detected") |
| 3 | Entri SATA/IDE muncul di Main **setelah Enhanced dipilih** (tanpa restart), tapi masih Not Detected |
| 4 | Setelah restart (POST 2): SATA 1 menampilkan `MidasForce SSD 256` |
| 5 | USB tampil sebagai `Sandisk` (bukan `USB:SCSI DISK`) |
| 6 | Boot Device Priority hanya 2 slot (1st dan 2nd), opsi include `[Disabled]` |
| 7 | Partisi Windows Setup: **full keyboard** (Tab/Shift+Tab + Enter/Spasi), tanpa mouse |
| 8 | Bank soal partisi: "Sisa" bisa di awal, tengah, atau akhir — mahasiswa harus hitung manual |
| 9 | POST screen 1 tidak menampilkan entri SATA sama sekali (konsisten dengan Disabled) |

---

## 10. Batasan (Out of Scope)

- Tidak mensimulasikan proses instalasi Windows setelah partisi selesai
- Tidak ada login/akun berbasis server
- Tidak ada backend (semua LocalStorage)
- Tidak mendukung UEFI atau BIOS versi lain
- Tidak mensimulasikan format filesystem (NTFS, FAT32)

---

## 11. Kriteria Selesai (Definition of Done)

- [ ] Timer 20 menit berjalan & auto-submit jika habis
- [ ] POST screen 1 tidak menampilkan entri SATA/IDE
- [ ] Menu Main tidak menampilkan SATA/IDE saat ATA/IDE = Disabled
- [ ] Entri SATA/IDE muncul di Main setelah Enhanced dipilih (sebelum restart)
- [ ] POST screen 2 menampilkan `MidasForce SSD 256` dan `Sandisk`
- [ ] Semua 5 tugas BIOS tervalidasi dengan benar
- [ ] Soal partisi random, termasuk Sisa di awal/tengah
- [ ] UI partisi full keyboard (Tab + Enter/Spasi), tanpa mouse
- [ ] Validasi ±5 GB berjalan benar
- [ ] Leaderboard 10 skor terbaik tersimpan di LocalStorage
- [ ] Tampilan BIOS: hitam, cyan, monospace, CRT effect
- [ ] Berjalan langsung di browser tanpa instalasi

---

*PRD Revisi 1.2 — Perubahan utama: SATA entries hidden saat Disabled, USB nama Sandisk, full keyboard di partisi, soal Sisa bisa di awal/tengah.*
