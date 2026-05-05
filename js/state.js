// ============================================
// STATE MANAGEMENT
// ============================================

export const state = {
  nama: '',
  startTime: null,
  timerInterval: null,
  elapsedSeconds: 0,
  timeLimit: 20 * 60, // 20 minutes in seconds

  session: 1, // 1 or 2

  bios1: {
    systemTime: null, // null = use current time
    systemDate: null, // null = use current date
    legacyDiskette: '1.44M, 3.5 in.',
    ataIdeConfig: 'Disabled',
    usb2Controller: 'Disabled',
    saved: false,
  },

  bios2: {
    hddDrive1st: 'HDD:MidasForce SSD 256',
    hddDrive2nd: 'Sandisk',
    bootDevice1st: 'HDD:MidasForce SSD 256',
    bootDevice2nd: 'Disabled',
    saved: false,
  },

  soalPartisi: null,
  partisiDibuat: [], // [{ label, sizeGB }]

  phase: 'START',
  postDelPressed: false,
  postTimeout: null,
};

export const biosNav = {
  currentTab: 0,
  currentItem: 0,
  currentSubMenu: null,
  valuePopup: false,
  valuePopupIndex: 0,
  saveDialog: false,
  saveDialogBtn: 0, // 0=Ok, 1=Cancel
  timeField: 0,  // 0=hour, 1=min, 2=sec
  dateField: 0,  // 0=month, 1=day, 2=year
};

export const partisiNav = {
  selectedRow: 0,
  focusArea: 'table', // 'table' | 'buttons' | 'next'
  focusedBtn: 0,
  sizeDialogOpen: false,
  sizeDialogJustOpened: false,
  confirmDialogOpen: false,
  confirmDialogBtn: 0, // 0=No, 1=Yes
  totalButtons: 5,
};

export function resetState() {
  state.nama = '';
  state.startTime = null;
  if (state.timerInterval) clearInterval(state.timerInterval);
  state.timerInterval = null;
  state.elapsedSeconds = 0;
  state.session = 1;
  state.bios1 = {
    systemTime: null,
    systemDate: null,
    legacyDiskette: '1.44M, 3.5 in.',
    ataIdeConfig: 'Disabled',
    usb2Controller: 'Disabled',
    saved: false,
  };
  state.bios2 = {
    hddDrive1st: 'HDD:MidasForce SSD 256',
    hddDrive2nd: 'Sandisk',
    bootDevice1st: 'HDD:MidasForce SSD 256',
    bootDevice2nd: 'Disabled',
    saved: false,
  };
  state.soalPartisi = null;
  state.partisiDibuat = [];
  state.phase = 'START';
  state.postDelPressed = false;
  if (state.postTimeout) clearTimeout(state.postTimeout);
  state.postTimeout = null;

  biosNav.currentTab = 0;
  biosNav.currentItem = 0;
  biosNav.currentSubMenu = null;
  biosNav.valuePopup = false;
  biosNav.valuePopupIndex = 0;
  biosNav.saveDialog = false;
  biosNav.saveDialogBtn = 0;
  biosNav.timeField = 0;
  biosNav.dateField = 0;

  partisiNav.selectedRow = 0;
  partisiNav.focusArea = 'table';
  partisiNav.focusedBtn = 0;
  partisiNav.sizeDialogOpen = false;
  partisiNav.sizeDialogJustOpened = false;
  partisiNav.confirmDialogOpen = false;
  partisiNav.confirmDialogBtn = 0;
}

export function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function getRemainingSeconds() {
  return Math.max(0, state.timeLimit - state.elapsedSeconds);
}
