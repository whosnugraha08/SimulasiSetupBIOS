// ============================================
// BIOS UI RENDERING & NAVIGATION
// ============================================
import { state, biosNav } from './state.js';
import { HELP_TEXTS } from './data.js';

const TABS = ['Main', 'Advanced', 'Power', 'Boot', 'Tools', 'Exit'];

// ============================================
// MENU DATA BUILDERS
// ============================================
function getTabItems(tabIndex) {
  const tab = TABS[tabIndex];
  switch (tab) {
    case 'Main': return getMainItems();
    case 'Advanced': return getAdvancedItems();
    case 'Power': return getPowerItems();
    case 'Boot': return getBootItems();
    case 'Tools': return getToolsItems();
    case 'Exit': return getExitItems();
    default: return [];
  }
}

function getMainItems() {
  const now = new Date();
  if (!state.bios1.systemTime) {
    state.bios1.systemTime = [now.getHours(), now.getMinutes(), now.getSeconds()];
  }
  if (!state.bios1.systemDate) {
    state.bios1.systemDate = [now.getMonth() + 1, now.getDate(), now.getFullYear()];
  }

  const t = state.bios1.systemTime;
  const d = state.bios1.systemDate;
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const dayName = days[new Date(d[2], d[0]-1, d[1]).getDay()] || 'Sun';

  const items = [
    { id: 'systemTime', label: 'System Time', type: 'time',
      parts: [String(t[0]).padStart(2,'0'), String(t[1]).padStart(2,'0'), String(t[2]).padStart(2,'0')],
      activeField: biosNav.timeField,
      help: HELP_TEXTS.systemTime },
    { id: 'systemDate', label: 'System Date', type: 'date',
      parts: [dayName, String(d[0]).padStart(2,'0'), String(d[1]).padStart(2,'0'), String(d[2])],
      activeField: biosNav.dateField,
      help: HELP_TEXTS.systemDate },
    { id: 'legacyDiskette', label: 'Legacy Diskette A', value: `[${state.bios1.legacyDiskette}]`, type: 'select',
      options: ['Disabled', '360K, 5.25 in.', '1.2M, 5.25 in.', '720K, 3.5 in.', '1.44M, 3.5 in.', '2.88M, 3.5 in.'],
      currentValue: state.bios1.legacyDiskette, stateKey: 'legacyDiskette', stateGroup: 'bios1',
      help: HELP_TEXTS.legacyDiskette },
  ];

  if (state.bios1.ataIdeConfig !== 'Disabled') {
    items.push({ id: 'sep1', type: 'separator' });
    const sata1Val = state.session === 2 ? 'MidasForce SSD 256' : 'Not Detected';
    items.push({ id: 'primaryMaster', label: 'Primary IDE Master', value: ': [Not Detected]', type: 'display', prefix: '▶', help: HELP_TEXTS.primaryIde });
    items.push({ id: 'primarySlave', label: 'Primary IDE Slave', value: ': [Not Detected]', type: 'display', prefix: '▶', help: HELP_TEXTS.primaryIde });
    items.push({ id: 'sata1', label: 'SATA 1', value: `: [${sata1Val}]`, type: 'display', prefix: '▶', help: HELP_TEXTS.sataDevice });
    items.push({ id: 'sata2', label: 'SATA 2', value: ': [Not Detected]', type: 'display', prefix: '▶', help: HELP_TEXTS.sataDevice });
    items.push({ id: 'sata3', label: 'SATA 3', value: ': [Not Detected]', type: 'display', prefix: '▶', help: HELP_TEXTS.sataDevice });
    items.push({ id: 'sata4', label: 'SATA 4', value: ': [Not Detected]', type: 'display', prefix: '▶', help: HELP_TEXTS.sataDevice });
  }

  items.push({ id: 'sep2', type: 'separator' });
  items.push({ id: 'ideConfig', label: 'IDE Configuration', type: 'submenu', prefix: '▶', help: HELP_TEXTS.ideConfig });
  items.push({ id: 'sysInfo', label: 'System Information', type: 'submenu', prefix: '▶', help: HELP_TEXTS.sysInfo });

  return items;
}

function getAdvancedItems() {
  return [
    { id: 'jumperFree', label: 'JumperFree Configuration', type: 'display', prefix: '▶', help: 'Configure system\nfrequency/voltage.' },
    { id: 'usbConfig', label: 'USB Configuration', type: 'submenu', prefix: '▶', help: 'Configure the USB\nsupport.' },
    { id: 'cpuConfig', label: 'CPU Configuration', type: 'display', prefix: '▶', help: 'Configure CPU\nsettings.' },
    { id: 'chipset', label: 'Chipset', type: 'display', prefix: '▶', help: 'Configure chipset\nsettings.' },
    { id: 'onboardDevices', label: 'Onboard Devices Configuration', type: 'display', prefix: '▶', help: 'Configure onboard\ndevices.' },
    { id: 'pcipnp', label: 'PCIPnP', type: 'display', prefix: '▶', help: 'Configure PCI/PnP\nsettings.' },
  ];
}

function getPowerItems() {
  return [
    { id: 'suspendMode', label: 'Suspend Mode', value: '[Auto]', type: 'display', help: 'Configures suspend\nmode.' },
    { id: 'acpi20', label: 'ACPI 2.0 Support', value: '[Disabled]', type: 'display', help: 'Enable/Disable ACPI\n2.0 support.' },
    { id: 'acpiApic', label: 'ACPI APIC Support', value: '[Enabled]', type: 'display', help: 'Enable/Disable ACPI\nAPIC support.' },
  ];
}

function getBootItems() {
  return [
    { id: 'bootDevicePriority', label: 'Boot Device Priority', type: 'submenu', prefix: '▶', help: 'Specifies the Boot\nDevice Priority\nsequence.\n\nA virtual floppy disk\ndrive (Floppy Drive B\n) may appear when you\nset the CD-ROM drive\nas the first boot\ndevice.' },
    { id: 'hardDiskDrives', label: 'Hard Disk Drives', type: 'submenu', prefix: '▶', help: 'Specifies the boot\nsequence from the\navailable devices.' },
    { id: 'bootSettingsConfig', label: 'Boot Settings Configuration', type: 'display', prefix: '▶', help: 'Configure boot\nsettings.' },
    { id: 'security', label: 'Security', type: 'display', prefix: '▶', help: 'Configure security\nsettings.' },
  ];
}

function getToolsItems() {
  return [
    { id: 'biosFlash', label: 'ASUS EZ Flash 2', type: 'display', prefix: '▶', help: 'Flash BIOS from file.' },
  ];
}

function getExitItems() {
  return [
    { id: 'exitSave', label: 'Exit & Save Changes', type: 'action', help: 'Save changes and exit\nBIOS Setup.' },
    { id: 'exitDiscard', label: 'Exit & Discard Changes', type: 'action', help: 'Discard changes and\nexit BIOS Setup.' },
    { id: 'discardChanges', label: 'Discard Changes', type: 'action', help: 'Discard all changes\nmade to BIOS Setup.' },
    { id: 'loadDefaults', label: 'Load Setup Defaults', type: 'action', help: 'Load default values\nfor all Setup items.' },
  ];
}

// ============================================
// SUB-MENU DATA
// ============================================
function getSubMenuItems(subMenuId) {
  switch (subMenuId) {
    case 'ideConfig': return getIdeConfigItems();
    case 'sysInfo': return getSysInfoItems();
    case 'usbConfig': return getUsbConfigItems();
    case 'hardDiskDrives': return getHardDiskDrivesItems();
    case 'bootDevicePriority': return getBootDevicePriorityItems();
    default: return [];
  }
}

function getIdeConfigItems() {
  let helpText = HELP_TEXTS.ataIdeConfig;
  if (state.bios1.ataIdeConfig === 'Enhanced') helpText = HELP_TEXTS.ataIdeConfigEnhanced;
  else if (state.bios1.ataIdeConfig === 'Compatible') helpText = HELP_TEXTS.ataIdeConfigCompatible;

  const items = [
    { id: 'ataIdeConfig', label: 'ATA/IDE Configuration', value: `[${state.bios1.ataIdeConfig}]`, type: 'select',
      options: ['Disabled', 'Compatible', 'Enhanced'],
      currentValue: state.bios1.ataIdeConfig, stateKey: 'ataIdeConfig', stateGroup: 'bios1',
      help: helpText },
  ];

  // "Enhanced Mode Support On" only shows when Enhanced is selected
  if (state.bios1.ataIdeConfig === 'Enhanced') {
    items.push({ id: 'enhancedModeSupport', label: 'Enhanced Mode Support On', value: '[S-ATA]', type: 'display',
      help: 'Configures Enhanced\nMode support on\nS-ATA or P-ATA.' });
  }

  items.push({ id: 'ideDetectTimeout', label: 'IDE Detect Time Out (Sec)', value: '[35]', type: 'display',
    help: HELP_TEXTS.ideDetectTimeout });

  return items;
}

function getSysInfoItems() {
  return [
    { id: 'sysInfoBios', label: 'AMIBIOS', value: '', type: 'info', help: '' },
    { id: 'sysInfoVersion', label: 'Version', value: ': 02.58', type: 'info', help: '' },
    { id: 'sysInfoBuild', label: 'Build Date', value: ': 04/19/07', type: 'info', help: '' },
    { id: 'sep', type: 'separator' },
    { id: 'sysInfoProc', label: 'Processor', value: '', type: 'info', help: '' },
    { id: 'sysInfoCpuType', label: '  Type', value: ': Intel Core 2 Duo', type: 'info', help: '' },
    { id: 'sysInfoCpuSpeed', label: '  Speed', value: ': 1600MHz', type: 'info', help: '' },
    { id: 'sysInfoCpuCount', label: '  Count', value: ': 2', type: 'info', help: '' },
    { id: 'sep2', type: 'separator' },
    { id: 'sysInfoMem', label: 'System Memory', value: '', type: 'info', help: '' },
    { id: 'sysInfoMemSize', label: '  Usable Size', value: ': 4096MB', type: 'info', help: '' },
  ];
}

function getUsbConfigItems() {
  const usbDevices = state.bios1.usb2Controller === 'Enabled' ? '5 Drives' : '0 Drives';
  return [
    { id: 'usbModuleVer', label: 'Module Version - 2.24.2-13.4', value: '', type: 'info', help: '' },
    { id: 'sep0', type: 'separator' },
    { id: 'usbDevices', label: 'USB Devices Enabled:', value: '', type: 'info', help: '' },
    { id: 'usbDevicesCount', label: `  ${usbDevices}`, value: '', type: 'info', help: '' },
    { id: 'sep', type: 'separator' },
    { id: 'usb2Controller', label: 'USB 2.0 Controller', value: `[${state.bios1.usb2Controller}]`, type: 'select',
      options: ['Disabled', 'Enabled'],
      currentValue: state.bios1.usb2Controller, stateKey: 'usb2Controller', stateGroup: 'bios1',
      help: HELP_TEXTS.usb2Controller },
    { id: 'legacyUsb', label: 'Legacy USB Support', value: '[Auto]', type: 'display', help: HELP_TEXTS.legacyUsbSupport },
    { id: 'usb2Mode', label: 'USB 2.0 Controller Mode', value: '[HiSpeed]', type: 'display', help: HELP_TEXTS.usb2ControllerMode },
    { id: 'sep2', type: 'separator' },
    { id: 'usbMassStorage', label: 'USB Mass Storage Device Configuration', type: 'display', prefix: '▶', help: HELP_TEXTS.usbMassStorage },
  ];
}

function getHardDiskDrivesItems() {
  return [
    { id: 'hddDrive1st', label: '1st Drive', value: `[${state.bios2.hddDrive1st}]`, type: 'select',
      options: ['HDD:MidasForce SSD 256', 'Sandisk'],
      currentValue: state.bios2.hddDrive1st, stateKey: 'hddDrive1st', stateGroup: 'bios2',
      help: 'Specifies the boot\nsequence from the\navailable devices.' },
    { id: 'hddDrive2nd', label: '2nd Drive', value: `[${state.bios2.hddDrive2nd}]`, type: 'select',
      options: ['HDD:MidasForce SSD 256', 'Sandisk'],
      currentValue: state.bios2.hddDrive2nd, stateKey: 'hddDrive2nd', stateGroup: 'bios2',
      help: 'Specifies the boot\nsequence from the\navailable devices.' },
  ];
}

function getBootDevicePriorityItems() {
  // Boot Device Priority depends on Hard Disk Drives order
  // Sandisk only appears as a boot option when it's set as 1st in Hard Disk Drives
  const hdd1st = state.bios2.hddDrive1st;

  let options;
  if (hdd1st === 'Sandisk') {
    // User has set Sandisk as 1st HDD — now it appears in boot options
    options = ['Sandisk', 'HDD:MidasForce SSD 256', 'Disabled'];
  } else {
    // Sandisk not set as 1st — only HDD and Disabled available
    options = ['HDD:MidasForce SSD 256', 'Disabled'];
    // Reset boot device if it was Sandisk but HDD order changed back
    if (state.bios2.bootDevice1st === 'Sandisk') {
      state.bios2.bootDevice1st = 'HDD:MidasForce SSD 256';
    }
    if (state.bios2.bootDevice2nd === 'Sandisk') {
      state.bios2.bootDevice2nd = 'Disabled';
    }
  }

  return [
    { id: 'bootDevice1st', label: '1st Boot Device', value: `[${state.bios2.bootDevice1st}]`, type: 'select',
      options: options,
      currentValue: state.bios2.bootDevice1st, stateKey: 'bootDevice1st', stateGroup: 'bios2',
      help: 'Specifies the boot\nsequence from the\navailable devices.\n\nA device enclosed in\nparentheses has been\ndisabled in the\ncorresponding type\nmenu.' },
    { id: 'bootDevice2nd', label: '2nd Boot Device', value: `[${state.bios2.bootDevice2nd}]`, type: 'select',
      options: options,
      currentValue: state.bios2.bootDevice2nd, stateKey: 'bootDevice2nd', stateGroup: 'bios2',
      help: 'Specifies the boot\nsequence from the\navailable devices.' },
  ];
}

// ============================================
// NAVIGATION HELPERS
// ============================================
function getCurrentItems() {
  if (biosNav.currentSubMenu) return getSubMenuItems(biosNav.currentSubMenu);
  return getTabItems(biosNav.currentTab);
}

function getSelectableIndices(items) {
  return items.map((item, i) => (item.type !== 'separator' && item.type !== 'info') ? i : -1).filter(i => i >= 0);
}

function clampItemIndex(items) {
  const selectable = getSelectableIndices(items);
  if (selectable.length === 0) { biosNav.currentItem = 0; return; }
  if (!selectable.includes(biosNav.currentItem)) biosNav.currentItem = selectable[0];
}

// ============================================
// RENDERING
// ============================================
export function renderBios() {
  const items = getCurrentItems();
  clampItemIndex(items);

  // Tabs
  document.getElementById('bios-tabs').innerHTML = TABS.map((t, i) =>
    `<div class="bios-tab ${i === biosNav.currentTab ? 'active' : ''}">${t}</div>`
  ).join('');

  // Menu content
  const menuEl = document.getElementById('bios-menu');
  let html = '';
  if (biosNav.currentSubMenu) {
    const subLabel = getSubMenuLabel(biosNav.currentSubMenu);
    html += `<div class="bios-submenu-title">${subLabel}</div>`;
  }

  items.forEach((item, i) => {
    if (item.type === 'separator') { html += '<div class="bios-item separator"></div>'; return; }
    const sel = i === biosNav.currentItem ? 'selected' : '';
    const info = item.type === 'info' ? 'info-item' : '';
    const pfx = item.prefix ? `<span class="item-prefix">${item.prefix}</span>` : '';

    let val = '';
    if (item.type === 'time') {
      // Render time with highlighted sub-field: [HH:MM:SS]
      const isActive = i === biosNav.currentItem;
      const p = item.parts;
      const af = item.activeField;
      val = '<span class="item-value">[' +
        p.map((v, fi) => isActive && fi === af ? `<span class="field-active">${v}</span>` : v).join(':') +
        ']</span>';
    } else if (item.type === 'date') {
      // Render date with highlighted sub-field: [Day MM/DD/YYYY]
      const isActive = i === biosNav.currentItem;
      const p = item.parts; // [dayName, MM, DD, YYYY]
      const af = item.activeField;
      const dayPart = p[0] + ' ';
      const dateParts = [p[1], p[2], p[3]];
      val = '<span class="item-value">[' + dayPart +
        dateParts.map((v, fi) => isActive && fi === af ? `<span class="field-active">${v}</span>` : v).join('/') +
        ']</span>';
    } else {
      val = item.value ? `<span class="item-value">${item.value}</span>` : '';
    }

    html += `<div class="bios-item ${sel} ${info}">${pfx}<span class="item-label">${item.label}</span>${val}</div>`;
  });
  menuEl.innerHTML = html;

  // Sidebar: help text on top, nav hints at bottom
  const sidebarEl = document.getElementById('bios-sidebar');
  const currentItem = items[biosNav.currentItem];
  const helpText = currentItem?.help || '';

  const navHints = biosNav.currentSubMenu
    ? '→→  Select Screen\n↑↓  Select Item\n+-  Change Option\nF1  General Help\nF10 Save and Exit\nESC Exit'
    : '→→  Select Screen\n↑↓  Select Item\nEnter Go to Sub Screen\nF1  General Help\nF10 Save and Exit\nESC Exit';

  sidebarEl.innerHTML = `<div class="sidebar-help">${helpText}</div><div class="sidebar-nav">${navHints}</div>`;

  renderValuePopup(items);
  renderSaveDialog();
}

function getSubMenuLabel(id) {
  const labels = {
    ideConfig: 'IDE Configuration', sysInfo: 'System Information',
    usbConfig: 'USB Configuration', hardDiskDrives: 'Hard Disk Drives',
    bootDevicePriority: 'Boot Device Priority',
  };
  return labels[id] || id;
}

function renderValuePopup(items) {
  const popup = document.getElementById('value-popup');
  if (!biosNav.valuePopup) { popup.classList.add('hidden'); return; }
  popup.classList.remove('hidden');
  const item = items[biosNav.currentItem];
  if (!item?.options) { popup.classList.add('hidden'); return; }
  document.getElementById('value-popup-content').innerHTML = item.options.map((opt, i) =>
    `<div class="popup-option ${i === biosNav.valuePopupIndex ? 'selected' : ''}">${opt}</div>`
  ).join('');
}

function renderSaveDialog() {
  const dialog = document.getElementById('save-dialog');
  if (!biosNav.saveDialog) { dialog.classList.add('hidden'); return; }
  dialog.classList.remove('hidden');
  document.getElementById('btn-save-ok').className = `dialog-btn ${biosNav.saveDialogBtn === 0 ? 'active' : ''}`;
  document.getElementById('btn-save-cancel').className = `dialog-btn ${biosNav.saveDialogBtn === 1 ? 'active' : ''}`;
}

// ============================================
// KEYBOARD HANDLING
// ============================================
export function handleBiosKey(e, onSaveExit) {
  const key = e.key;
  if (biosNav.saveDialog) { handleSaveDialogKey(key, onSaveExit); renderBios(); return; }
  if (biosNav.valuePopup) { handleValuePopupKey(key); renderBios(); return; }

  const items = getCurrentItems();
  const selectable = getSelectableIndices(items);

  switch (key) {
    case 'ArrowLeft':
      if (!biosNav.currentSubMenu) { biosNav.currentTab = (biosNav.currentTab - 1 + TABS.length) % TABS.length; biosNav.currentItem = 0; }
      break;
    case 'ArrowRight':
      if (!biosNav.currentSubMenu) { biosNav.currentTab = (biosNav.currentTab + 1) % TABS.length; biosNav.currentItem = 0; }
      break;
    case 'ArrowUp': { const idx = selectable.indexOf(biosNav.currentItem); if (idx > 0) biosNav.currentItem = selectable[idx - 1]; break; }
    case 'ArrowDown': { const idx = selectable.indexOf(biosNav.currentItem); if (idx < selectable.length - 1) biosNav.currentItem = selectable[idx + 1]; break; }
    case 'Enter': handleEnter(items); break;
    case 'Escape': handleEscape(); break;
    case 'Tab': {
      // Tab cycles sub-fields for time/date items
      e.preventDefault();
      const curItem = items[biosNav.currentItem];
      if (curItem?.type === 'time') {
        biosNav.timeField = e.shiftKey ? (biosNav.timeField - 1 + 3) % 3 : (biosNav.timeField + 1) % 3;
      } else if (curItem?.type === 'date') {
        biosNav.dateField = e.shiftKey ? (biosNav.dateField - 1 + 3) % 3 : (biosNav.dateField + 1) % 3;
      }
      break;
    }
    case 'F10': e.preventDefault(); biosNav.saveDialog = true; biosNav.saveDialogBtn = 0; break;
    case '+': case '=': handleValueChange(items, 1); break;
    case '-': handleValueChange(items, -1); break;
  }
  renderBios();
}

function handleEnter(items) {
  const item = items[biosNav.currentItem];
  if (!item) return;
  if (item.type === 'submenu') { biosNav.currentSubMenu = item.id; biosNav.currentItem = 0; }
  else if (item.type === 'select') { biosNav.valuePopup = true; biosNav.valuePopupIndex = Math.max(0, item.options.indexOf(item.currentValue)); }
  else if (item.type === 'action' && item.id === 'exitSave') { biosNav.saveDialog = true; biosNav.saveDialogBtn = 0; }
}

function handleEscape() {
  if (biosNav.currentSubMenu) { biosNav.currentSubMenu = null; biosNav.currentItem = 0; }
}

function handleValueChange(items, dir) {
  const item = items[biosNav.currentItem];
  if (!item) return;

  // Handle System Time (+/- changes selected field)
  if (item.type === 'time') {
    const t = state.bios1.systemTime;
    const f = biosNav.timeField;
    if (f === 0) t[0] = (t[0] + dir + 24) % 24;       // hour 0-23
    else if (f === 1) t[1] = (t[1] + dir + 60) % 60;   // min 0-59
    else if (f === 2) t[2] = (t[2] + dir + 60) % 60;   // sec 0-59
    return;
  }

  // Handle System Date (+/- changes selected field)
  if (item.type === 'date') {
    const d = state.bios1.systemDate; // [month, day, year]
    const f = biosNav.dateField;
    if (f === 0) { // month 1-12
      d[0] = ((d[0] - 1 + dir + 12) % 12) + 1;
      const maxD = new Date(d[2], d[0], 0).getDate();
      if (d[1] > maxD) d[1] = maxD;
    } else if (f === 1) { // day
      const maxD = new Date(d[2], d[0], 0).getDate();
      d[1] = d[1] + dir;
      if (d[1] > maxD) d[1] = 1;
      if (d[1] < 1) d[1] = maxD;
    } else if (f === 2) { // year
      d[2] = Math.max(2000, Math.min(2099, d[2] + dir));
      const maxD = new Date(d[2], d[0], 0).getDate();
      if (d[1] > maxD) d[1] = maxD;
    }
    return;
  }

  if (item.type !== 'select' || !item.options) return;
  let idx = item.options.indexOf(item.currentValue) + dir;
  if (idx < 0) idx = item.options.length - 1;
  if (idx >= item.options.length) idx = 0;
  applyValue(item, item.options[idx]);
}

function handleValuePopupKey(key) {
  const items = getCurrentItems();
  const item = items[biosNav.currentItem];
  if (!item?.options) return;
  switch (key) {
    case 'ArrowUp': biosNav.valuePopupIndex = Math.max(0, biosNav.valuePopupIndex - 1); break;
    case 'ArrowDown': biosNav.valuePopupIndex = Math.min(item.options.length - 1, biosNav.valuePopupIndex + 1); break;
    case 'Enter': applyValue(item, item.options[biosNav.valuePopupIndex]); biosNav.valuePopup = false; break;
    case 'Escape': biosNav.valuePopup = false; break;
  }
}

function applyValue(item, newValue) {
  if (item.stateGroup && item.stateKey) state[item.stateGroup][item.stateKey] = newValue;
  if (item.stateKey === 'hddDrive1st') state.bios2.hddDrive2nd = newValue === 'Sandisk' ? 'HDD:MidasForce SSD 256' : 'Sandisk';
  else if (item.stateKey === 'hddDrive2nd') state.bios2.hddDrive1st = newValue === 'Sandisk' ? 'HDD:MidasForce SSD 256' : 'Sandisk';
}

function handleSaveDialogKey(key, onSaveExit) {
  switch (key) {
    case 'ArrowLeft': case 'ArrowRight': biosNav.saveDialogBtn = biosNav.saveDialogBtn === 0 ? 1 : 0; break;
    case 'Enter': biosNav.saveDialog = false; if (biosNav.saveDialogBtn === 0 && onSaveExit) onSaveExit(); break;
    case 'Escape': biosNav.saveDialog = false; break;
  }
}
