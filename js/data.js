// ============================================
// BANK SOAL PARTISI
// ============================================
export const TOTAL_DISK_GB = 255.5;
export const SYSTEM_RESERVED_MB = 100;
export const TOLERANCE_GB = 5;

export const bankSoal = [
  {
    id: 'S-01',
    teks: 'C: 50 GB, D: 50 GB, F: Sisa',
    hint: 'Sisa = 255 - 50 - 50 = ±155 GB',
    partisi: [
      { label: 'C:', target: 50, toleransi: 5, tipe: 'angka' },
      { label: 'D:', target: 50, toleransi: 5, tipe: 'angka' },
      { label: 'F:', tipe: 'sisa' },
    ]
  },
  {
    id: 'S-02',
    teks: 'C: 80 GB, D: 80 GB, F: Sisa',
    hint: 'Sisa = 255 - 80 - 80 = ±95 GB',
    partisi: [
      { label: 'C:', target: 80, toleransi: 5, tipe: 'angka' },
      { label: 'D:', target: 80, toleransi: 5, tipe: 'angka' },
      { label: 'F:', tipe: 'sisa' },
    ]
  },
  {
    id: 'S-03',
    teks: 'C: Sisa, D: 80 GB, F: 80 GB',
    hint: 'Hitung C: 255 - 80 - 80 = ±95 GB',
    partisi: [
      { label: 'C:', tipe: 'sisa' },
      { label: 'D:', target: 80, toleransi: 5, tipe: 'angka' },
      { label: 'F:', target: 80, toleransi: 5, tipe: 'angka' },
    ]
  },
  {
    id: 'S-04',
    teks: 'C: 60 GB, D: Sisa, E: 60 GB',
    hint: 'Hitung D: 255 - 60 - 60 = ±135 GB',
    partisi: [
      { label: 'C:', target: 60, toleransi: 5, tipe: 'angka' },
      { label: 'D:', tipe: 'sisa' },
      { label: 'E:', target: 60, toleransi: 5, tipe: 'angka' },
    ]
  },
  {
    id: 'S-05',
    teks: 'C: 70 GB, F: Sisa, D: 70 GB, E: 70 GB',
    hint: 'Hitung F: 255 - 70 - 70 - 70 = ±45 GB',
    partisi: [
      { label: 'C:', target: 70, toleransi: 5, tipe: 'angka' },
      { label: 'F:', tipe: 'sisa' },
      { label: 'D:', target: 70, toleransi: 5, tipe: 'angka' },
      { label: 'E:', target: 70, toleransi: 5, tipe: 'angka' },
    ]
  },
  {
    id: 'S-06',
    teks: 'C: Sisa, D: 60 GB, E: 60 GB, F: 60 GB',
    hint: 'Hitung C: 255 - 60 - 60 - 60 = ±75 GB',
    partisi: [
      { label: 'C:', tipe: 'sisa' },
      { label: 'D:', target: 60, toleransi: 5, tipe: 'angka' },
      { label: 'E:', target: 60, toleransi: 5, tipe: 'angka' },
      { label: 'F:', target: 60, toleransi: 5, tipe: 'angka' },
    ]
  },
  {
    id: 'S-07',
    teks: 'C: 80 GB, D: 50 GB, F: Sisa, Unallocated: 30 GB wajib ada',
    hint: 'Hitung F: 255 - 80 - 50 - 30 = ±95 GB. Sisakan 30 GB unallocated.',
    hasUnallocated: true,
    unallocatedTarget: 30,
    partisi: [
      { label: 'C:', target: 80, toleransi: 5, tipe: 'angka' },
      { label: 'D:', target: 50, toleransi: 5, tipe: 'angka' },
      { label: 'F:', tipe: 'sisa' },
    ]
  },
  {
    id: 'S-08',
    teks: 'C: 50 GB, D: Sisa, E: 50 GB, F: 50 GB, Unallocated: Sisa',
    hint: 'Hitung D: 255 - 50 - 50 - 50 = ±105 GB. Unallocated = sisa apapun.',
    hasUnallocated: true,
    unallocatedTarget: null,
    partisi: [
      { label: 'C:', target: 50, toleransi: 5, tipe: 'angka' },
      { label: 'D:', tipe: 'sisa' },
      { label: 'E:', target: 50, toleransi: 5, tipe: 'angka' },
      { label: 'F:', target: 50, toleransi: 5, tipe: 'angka' },
    ]
  },
];

// ============================================
// SCORING CONFIG
// ============================================
export const SCORING = {
  legacyDiskette: { points: 10, label: 'Legacy Diskette A → Disabled' },
  ataIdeConfig:   { points: 10, label: 'ATA/IDE Configuration → Enhanced' },
  usb2Controller: { points: 15, label: 'USB 2.0 Controller → Enabled' },
  hddPriority:    { points: 15, label: 'Hard Disk Drives: Sandisk sebagai 1st Drive' },
  bootPriority:   { points: 15, label: 'Boot Device Priority: Sandisk sebagai 1st Boot Device' },
  partisi:        { points: 35, label: 'Partisi sesuai soal' },
};

// ============================================
// BIOS MENU HELP TEXTS
// ============================================
export const HELP_TEXTS = {
  systemTime: 'Use [ENTER], [TAB]\nor [SHIFT-TAB] to\nselect a field.\n\nUse [+] or [-] to\nconfigure System Time.',
  systemDate: 'Use [ENTER], [TAB]\nor [SHIFT-TAB] to\nselect a field.\n\nUse [+] or [-] to\nconfigure System Date.',
  legacyDiskette: 'Specifies the capacity\nof floppy drive.',
  ideConfig: 'Configure ATA/IDE\ncontroller settings.',
  sysInfo: 'View system hardware\ninformation.',
  ataIdeConfig: 'Options\n─────────────────\n► Disabled\n  Compatible\n  Enhanced\n\n[Disabled]\nMematikan SATA &\nPATA controller.\nTidak ada HDD yang\nterdeteksi.',
  ataIdeConfigEnhanced: 'Options\n─────────────────\n  Disabled\n  Compatible\n► Enhanced\n\n[Enhanced]\nSATA berjalan native.\nDiperlukan untuk\nWindows 10.',
  ataIdeConfigCompatible: 'Options\n─────────────────\n  Disabled\n► Compatible\n  Enhanced\n\n[Compatible]\nSATA berjalan mode\nPATA (legacy).\nMaks 4 device.',
  ideDetectTimeout: 'Specifies the time\nout value for\ndetecting ATA/IDE\ndevices.',
  usb2Controller: 'Enables or disables\nthe USB 2.0 (EHCI)\ncontroller.',
  legacyUsbSupport: 'Enables support for\nlegacy USB devices\nlike keyboard and\nmouse in DOS.',
  usb2ControllerMode: 'Configures the USB\n2.0 controller mode.',
  usbMassStorage: 'Configure USB Mass\nStorage devices.',
  hddDrive1st: 'Specifies the boot\nsequence from the\navailable devices.',
  bootDevice1st: 'Specifies the boot\nsequence from the\navailable devices.\n\nA device enclosed in\nparentheses has been\ndisabled in the\ncorresponding type\nmenu.',
  defaultNav: '→→  Select Screen\n↑↓  Select Item\n+-  Change Field\nTab Select Field\nF1  General Help\nF10 Save and Exit\nESC Exit',
  primaryIde: 'Press [Enter] to\nview device details.',
  sataDevice: 'Press [Enter] to\nview device details.',
};
