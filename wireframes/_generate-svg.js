// Generates low-fidelity wireframe SVGs for every app page.
// Run: node wireframes/_generate-svg.js
const fs = require('fs');
const path = require('path');

const W = 1280, H = 860;
const C = {
  page: '#eef2f6', panel: '#ffffff', stroke: '#cbd5e1',
  soft: '#e7ecf2', med: '#cdd6e0', dark: '#aab4c0',
  btn: '#b8c2cd', text: '#7a8694', cap: '#5b6675',
};

// ---- primitives ----------------------------------------------------------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const rect = (x, y, w, h, r = 10, fill = C.panel, stroke = C.stroke) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`;
const fill = (x, y, w, h, r = 6, f = C.soft) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${f}"/>`;
const line = (x, y, w, h = 9, f = C.soft) => fill(x, y, w, h, h / 2, f);
const circle = (cx, cy, r, f = C.soft, stroke = 'none') =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${f}"${stroke !== 'none' ? ` stroke="${stroke}" stroke-width="1.5"` : ''}/>`;
const txt = (x, y, s, size = 13, f = C.text, weight = 500, anchor = 'start') =>
  `<text x="${x}" y="${y}" font-family="Inter,Segoe UI,sans-serif" font-size="${size}" font-weight="${weight}" fill="${f}" text-anchor="${anchor}">${esc(s)}</text>`;
const btn = (x, y, w, h, label, solid = true) =>
  `${rect(x, y, w, h, h / 2, solid ? C.btn : C.panel, solid ? C.btn : C.stroke)}` +
  txt(x + w / 2, y + h / 2 + 4, label, 12, solid ? '#ffffff' : C.text, 600, 'middle');
const dashCircle = (cx, cy, r) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.soft}" stroke="${C.med}" stroke-width="2" stroke-dasharray="6 6"/>`;

// caption strip + page chrome
function frame(title, file, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${C.page}"/>
  <rect x="0" y="0" width="${W}" height="46" fill="#1f2937"/>
  ${txt(24, 29, 'WIREFRAME — ' + title, 14, '#ffffff', 700)}
  ${txt(W - 24, 29, file, 12, '#9aa4b2', 500, 'end')}
  ${body}
</svg>`;
}

// ---- shared app shell (sidebar + topbar) ---------------------------------
const NAV = {
  karyawan: ['Dashboard', 'Absensi', 'Riwayat Absensi', 'Cuti & Izin', 'Profil'],
  admin: ['Dashboard', 'Data Karyawan', 'Titik Lokasi', 'Rekap & Laporan'],
};
function shell(role, active, pageTitle) {
  const top = 66, left = 24, sw = 248, appH = H - top - 24;
  let s = '';
  // sidebar
  s += rect(left, top, sw, appH, 16);
  s += rect(left + 18, top + 18, 34, 34, 9, C.btn, C.btn);
  s += txt(left + 62, top + 33, 'WinniPresence', 14, C.cap, 700);
  s += txt(left + 62, top + 49, role === 'admin' ? 'HR Admin' : 'Karyawan', 10, C.text, 500);
  s += line(left + 18, top + 74, sw - 36, 1, C.soft);
  NAV[role].forEach((label, i) => {
    const y = top + 96 + i * 46;
    const on = label === active;
    if (on) s += fill(left + 14, y - 18, sw - 28, 38, 10, C.soft);
    s += circle(left + 34, y, 8, on ? C.btn : C.med);
    s += txt(left + 54, y + 4, label, 12.5, on ? C.cap : C.text, on ? 600 : 500);
  });
  // user chip bottom
  s += rect(left + 14, top + appH - 60, sw - 28, 46, 12, C.soft, C.soft);
  s += circle(left + 38, top + appH - 37, 14, C.med);
  s += line(left + 60, top + appH - 44, 90, 9);
  s += line(left + 60, top + appH - 30, 60, 7);
  // topbar
  const mx = left + sw + 20, mw = W - mx - 24;
  s += rect(mx, top, mw, 56, 14);
  s += txt(mx + 22, top + 27, pageTitle, 16, C.cap, 700);
  s += line(mx + 22, top + 38, 220, 8);
  s += rect(mx + mw - 280, top + 13, 150, 30, 15, C.soft, C.soft); // search
  s += txt(mx + mw - 262, top + 32, 'Cari...', 11, C.text, 500);
  s += circle(mx + mw - 90, top + 28, 15, C.soft);   // bell
  s += circle(mx + mw - 46, top + 28, 16, C.med);    // avatar
  return { svg: s, mx, mw, top: top + 56 + 20, contentX: mx };
}
const card = (x, y, w, h, title) =>
  rect(x, y, w, h, 16) + (title ? txt(x + 20, y + 30, title, 13.5, C.cap, 700) : '');

// ---- PAGES ----------------------------------------------------------------
const pages = {};

// 1. Landing
pages['01-index'] = ['Landing Page', 'index.html', (() => {
  let s = '';
  s += rect(24, 66, W - 48, 58, 14);
  s += rect(44, 80, 30, 30, 8, C.btn, C.btn);
  s += txt(86, 100, 'WinniPresence', 14, C.cap, 700);
  s += btn(W - 150, 80, 100, 30, 'Masuk');
  // hero
  s += line(64, 190, 120, 22, C.soft);
  s += txt(64, 206, 'badge: Wireframe Demo', 11, C.text, 600);
  s += line(64, 240, 520, 30, C.med);
  s += line(64, 286, 460, 30, C.med);
  s += line(64, 332, 380, 30, C.med);
  s += line(64, 392, 520, 12);
  s += line(64, 416, 480, 12);
  s += btn(64, 456, 150, 44, 'Mulai Demo');
  s += btn(230, 456, 200, 44, 'Dashboard Karyawan', false);
  // hero preview card
  s += rect(720, 180, 480, 360, 18);
  s += circle(760, 220, 20, C.med);
  s += line(792, 210, 120, 10); s += line(792, 228, 80, 8);
  s += dashCircle(960, 360, 70);
  s += txt(960, 366, 'Face Scan', 12, C.text, 600, 'middle');
  s += fill(760, 470, 120, 50, 10); s += fill(900, 470, 120, 50, 10); s += fill(1040, 470, 120, 50, 10);
  // features row
  s += txt(W / 2, 600, 'Fitur Utama', 18, C.cap, 700, 'middle');
  for (let i = 0; i < 3; i++) {
    const x = 64 + i * 392;
    s += rect(x, 640, 360, 150, 16);
    s += rect(x + 20, 660, 40, 40, 10, C.soft, C.soft);
    s += line(x + 20, 720, 180, 12); s += line(x + 20, 744, 300, 8); s += line(x + 20, 762, 260, 8);
  }
  return s;
})()];

// 2. Login
pages['02-login'] = ['Login', 'login.html', (() => {
  let s = '';
  s += rect(24, 66, (W - 48) / 2, H - 90, 16, C.btn, C.btn); // brand panel
  s += rect(60, 110, 30, 30, 8, '#ffffff', '#ffffff');
  s += txt(104, 130, 'WinniPresence', 14, '#ffffff', 700);
  s += line(60, 380, 460, 26, '#ffffff'); s += line(60, 420, 400, 26, '#ffffff');
  s += line(60, 470, 480, 10, '#e2e8f0'); s += line(60, 492, 440, 10, '#e2e8f0');
  // form panel
  const fx = (W) / 2 + 60;
  s += txt(fx, 230, 'Selamat datang kembali', 20, C.cap, 700);
  s += line(fx, 252, 300, 10);
  s += rect(fx, 280, 520, 44, 10, C.soft, C.soft); // role switch
  s += txt(fx + 130, 307, 'Karyawan', 12, C.cap, 600, 'middle');
  s += txt(fx + 390, 307, 'HR Admin', 12, C.text, 600, 'middle');
  s += txt(fx, 360, 'NIP / Username', 11, C.text, 600);
  s += rect(fx, 372, 520, 44, 10);
  s += txt(fx, 446, 'Password', 11, C.text, 600);
  s += rect(fx, 458, 520, 44, 10);
  s += line(fx, 524, 110, 9); s += line(fx + 410, 524, 110, 9);
  s += btn(fx, 556, 520, 46, 'Masuk');
  s += txt(fx + 260, 636, 'Karyawan diminta verifikasi OTP setelah login', 11, C.text, 500, 'middle');
  return s;
})()];

// 3. OTP
pages['03-otp'] = ['Verifikasi OTP', 'otp.html', (() => {
  let s = '';
  const cw = 520, cx = (W - cw) / 2, cy = 150, ch = 520;
  s += rect(cx, cy, cw, ch, 22);
  s += line(cx + 40, cy + 50, 90, 9);
  s += rect(cx + 40, cy + 80, 56, 56, 14, C.soft, C.soft);
  s += txt(cx + 40, cy + 180, 'Verifikasi OTP', 20, C.cap, 700);
  s += line(cx + 40, cy + 205, 420, 9); s += line(cx + 40, cy + 224, 360, 9);
  s += txt(cx + 40, cy + 224, '', 9);
  // 6 boxes
  for (let i = 0; i < 6; i++) s += rect(cx + 40 + i * 75, cy + 260, 56, 64, 12);
  s += btn(cx + 40, cy + 350, cw - 80, 46, 'Verifikasi');
  s += txt(cx + cw / 2, cy + 430, 'Kirim ulang kode (30s)', 12, C.text, 600, 'middle');
  s += txt(cx + cw / 2, cy + 470, 'Demo: 1 2 3 4 5 6', 11, C.text, 500, 'middle');
  return s;
})()];

// helper: stat cards row
function statRow(x, y, w, n, labels) {
  let s = ''; const gap = 16; const cw = (w - gap * (n - 1)) / n;
  for (let i = 0; i < n; i++) {
    const cx = x + i * (cw + gap);
    s += rect(cx, y, cw, 96, 16);
    s += rect(cx + 18, y + 18, 38, 38, 10, C.soft, C.soft);
    s += line(cx + 18, y + 72, 60, 16, C.med);
    s += txt(cx + 18, y + 90, labels[i] || '', 10, C.text, 500);
  }
  return s;
}
// helper: table block
function table(x, y, w, h, title, rows = 6, cols = ['', '', '', '']) {
  let s = card(x, y, w, h, title);
  s += line(x + w - 120, y + 22, 90, 14, C.soft);
  const ty = y + 50; s += line(x, ty, w, 1, C.soft);
  cols.forEach((c, i) => s += txt(x + 22 + i * (w / cols.length), ty + 24, c, 10, C.text, 600));
  for (let r = 0; r < rows; r++) {
    const ry = ty + 44 + r * 40;
    cols.forEach((c, i) => s += line(x + 22 + i * (w / cols.length), ry, (w / cols.length) - 40, 9));
  }
  return s;
}

// 4. Karyawan Dashboard
pages['04-dashboard'] = ['Dashboard Karyawan', 'dashboard.html', (() => {
  const sh = shell('karyawan', 'Dashboard', 'Dashboard');
  let s = sh.svg; const x = sh.contentX, y = sh.top, w = sh.mw;
  // hero + today
  s += rect(x, y, w - 360, 220, 18, C.btn, C.btn);
  s += line(x + 24, y + 40, 200, 10, '#e2e8f0');
  s += line(x + 24, y + 70, 300, 22, '#ffffff');
  s += line(x + 24, y + 110, 180, 36, '#ffffff');
  s += btn(x + 24, y + 160, 160, 40, 'Absen Sekarang');
  s += rect(x + 200, y + 160, 140, 40, 20, '#ffffff', '#ffffff');
  s += rect(x + w - 344, y, 344, 220, 18); s += txt(x + w - 324, y + 30, 'Status Hari Ini', 13, C.cap, 700);
  for (let i = 0; i < 4; i++) { s += circle(x + w - 320, y + 70 + i * 36, 12, C.soft); s += line(x + w - 300, y + 66 + i * 36, 200, 9); }
  // stats
  s += statRow(x, y + 240, w, 4, ['Hadir', 'Terlambat', 'Izin/Sakit', 'Kehadiran']);
  // table + donut
  s += table(x, y + 360, w - 360, 280, 'Riwayat Terbaru', 5, ['Tanggal', 'Masuk', 'Keluar', 'Status']);
  s += rect(x + w - 344, y + 360, 344, 280, 16); s += txt(x + w - 324, y + 390, 'Ringkasan Cuti', 13, C.cap, 700);
  s += dashCircle(x + w - 172, y + 490, 60);
  s += line(x + w - 324, y + 570, 200, 9); s += line(x + w - 324, y + 590, 160, 9);
  return s;
})()];

// 5. Absensi
pages['05-absensi'] = ['Absensi Face Recognition', 'absensi.html', (() => {
  const sh = shell('karyawan', 'Absensi', 'Absensi');
  let s = sh.svg; const x = sh.contentX, y = sh.top, w = sh.mw;
  const lw = w - 360;
  s += card(x, y, lw, 560, 'Absensi Face Recognition');
  s += rect(x + 20, y + 50, 220, 40, 10, C.soft, C.soft); // mode toggle
  s += txt(x + 80, y + 75, 'Masuk', 12, C.cap, 600, 'middle'); s += txt(x + 180, y + 75, 'Keluar', 12, C.text, 600, 'middle');
  s += dashCircle(x + lw / 2, y + 280, 130);
  s += txt(x + lw / 2, y + 286, 'Area Pindai Wajah', 13, C.text, 600, 'middle');
  s += btn(x + lw / 2 - 110, y + 470, 220, 46, 'Mulai Pindai Wajah');
  // validation panel
  const px = x + lw + 24, pw = 336;
  s += card(px, y, pw, 260, 'Validasi Kehadiran');
  for (let i = 0; i < 3; i++) { s += rect(px + 20, y + 56 + i * 56, 38, 38, 10, C.soft, C.soft); s += line(px + 70, y + 66 + i * 56, 180, 10); s += line(px + 70, y + 82 + i * 56, 120, 8); }
  s += card(px, y + 284, pw, 276, 'Lokasi Anda');
  s += rect(px + 20, y + 320, pw - 40, 150, 12, C.soft, C.soft);
  s += circle(px + pw / 2, y + 395, 16, C.med);
  s += line(px + 20, y + 496, pw - 40, 10);
  return s;
})()];

// 6. Riwayat
pages['06-riwayat'] = ['Riwayat Absensi', 'riwayat.html', (() => {
  const sh = shell('karyawan', 'Riwayat Absensi', 'Riwayat Absensi');
  let s = sh.svg; const x = sh.contentX, y = sh.top, w = sh.mw;
  s += statRow(x, y, w, 4, ['Hadir', 'Terlambat', 'Izin', 'Sakit']);
  s += table(x, y + 120, w, 510, 'Riwayat Kehadiran', 8, ['Tanggal', 'Hari', 'Masuk', 'Keluar', 'Durasi', 'Status']);
  return s;
})()];

// 7. Cuti
pages['07-cuti'] = ['Cuti & Izin', 'cuti.html', (() => {
  const sh = shell('karyawan', 'Cuti & Izin', 'Cuti & Izin');
  let s = sh.svg; const x = sh.contentX, y = sh.top, w = sh.mw;
  const gap = 16, cw = (w - gap * 2) / 3;
  for (let i = 0; i < 3; i++) { s += rect(x + i * (cw + gap), y, cw, 96, 16, i === 0 ? C.btn : C.panel, i === 0 ? C.btn : C.stroke); s += line(x + 20 + i * (cw + gap), y + 36, 120, 10, i === 0 ? '#e2e8f0' : C.soft); s += line(x + 20 + i * (cw + gap), y + 64, 70, 20, i === 0 ? '#ffffff' : C.med); }
  s += table(x, y + 120, w, 510, 'Pengajuan Cuti & Izin', 6, ['ID', 'Jenis', 'Periode', 'Durasi', 'Alasan', 'Status']);
  s += btn(x + w - 160, y + 132, 130, 32, '+ Ajukan Baru');
  return s;
})()];

// 8. Profil
pages['08-profil'] = ['Profil Karyawan', 'profil.html', (() => {
  const sh = shell('karyawan', 'Profil', 'Profil');
  let s = sh.svg; const x = sh.contentX, y = sh.top, w = sh.mw;
  s += card(x, y, 320, 420, '');
  s += rect(x + 110, y + 30, 100, 100, 24, C.soft, C.soft);
  s += line(x + 90, y + 156, 140, 14, C.med); s += line(x + 110, y + 180, 100, 9);
  s += rect(x + 30, y + 230, 120, 70, 12, C.soft, C.soft); s += rect(x + 170, y + 230, 120, 70, 12, C.soft, C.soft);
  // details
  const dx = x + 344, dw = w - 344;
  s += card(dx, y, dw, 420, '');
  s += line(dx, y + 50, dw, 1, C.soft);
  s += txt(dx + 24, y + 36, 'Informasi Pribadi', 12.5, C.cap, 600); s += txt(dx + 200, y + 36, 'Keamanan', 12.5, C.text, 600);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) { const fx = dx + 24 + c * (dw / 2 - 12), fy = y + 80 + r * 80; s += line(fx, fy, 100, 8); s += rect(fx, fy + 12, dw / 2 - 60, 40, 10); }
  s += btn(dx + dw - 180, y + 420 - 56, 150, 38, 'Simpan Perubahan');
  return s;
})()];

// 9. Admin Dashboard
pages['09-admin-dashboard'] = ['Dashboard HR Admin', 'admin-dashboard.html', (() => {
  const sh = shell('admin', 'Dashboard', 'Dashboard HR');
  let s = sh.svg; const x = sh.contentX, y = sh.top, w = sh.mw;
  s += statRow(x, y, w, 4, ['Total Karyawan', 'Hadir', 'Terlambat', 'Izin/Sakit']);
  s += card(x, y + 120, w - 360, 280, 'Kehadiran Mingguan');
  const bx = x + 30, bb = y + 360, bw2 = w - 360 - 60;
  for (let i = 0; i < 7; i++) { const bh = 40 + (i * 23) % 150; s += fill(bx + i * (bw2 / 7) + 10, bb - bh, 34, bh, 6, C.med); }
  s += rect(x + w - 344, y + 120, 344, 280, 16); s += txt(x + w - 324, y + 150, 'Komposisi Hari Ini', 13, C.cap, 700);
  s += dashCircle(x + w - 172, y + 250, 60);
  s += table(x, y + 420, w, 210, 'Menunggu Verifikasi', 3, ['Karyawan', 'Tanggal', 'Masuk', 'Keluar', 'Catatan', 'Aksi']);
  return s;
})()];

// 10. Admin Karyawan
pages['10-admin-karyawan'] = ['Data Karyawan', 'admin-karyawan.html', (() => {
  const sh = shell('admin', 'Data Karyawan', 'Data Karyawan');
  let s = sh.svg; const x = sh.contentX, y = sh.top, w = sh.mw;
  s += table(x, y, w, 630, 'Data Karyawan', 8, ['Karyawan', 'NIP', 'Departemen', 'Status', 'Kehadiran', 'Aksi']);
  s += rect(x + w - 360, y + 16, 150, 32, 16, C.soft, C.soft); // search
  s += btn(x + w - 150, y + 16, 120, 32, '+ Tambah');
  return s;
})()];

// 11. Admin Lokasi
pages['11-admin-lokasi'] = ['Titik Lokasi Absensi', 'admin-lokasi.html', (() => {
  const sh = shell('admin', 'Titik Lokasi', 'Titik Lokasi Absensi');
  let s = sh.svg; const x = sh.contentX, y = sh.top, w = sh.mw;
  const lw = w - 360;
  s += card(x, y, lw, 560, 'Peta Titik Absensi');
  s += rect(x + 20, y + 50, lw - 40, 490, 12, C.soft, C.soft);
  // grid lines
  for (let i = 1; i < 8; i++) s += `<line x1="${x + 20 + i * (lw - 40) / 8}" y1="${y + 50}" x2="${x + 20 + i * (lw - 40) / 8}" y2="${y + 540}" stroke="${C.med}" stroke-width="1" opacity="0.4"/>`;
  s += circle(x + 20 + (lw - 40) * 0.5, y + 270, 50, 'none', C.med);
  s += circle(x + 20 + (lw - 40) * 0.5, y + 270, 6, C.btn);
  s += circle(x + 20 + (lw - 40) * 0.3, y + 400, 40, 'none', C.med);
  // form + list
  const px = x + lw + 24, pw = 336;
  s += card(px, y, pw, 290, 'Tambah Titik Lokasi');
  s += line(px + 20, y + 56, 120, 8); s += rect(px + 20, y + 68, pw - 40, 40, 10);
  s += rect(px + 20, y + 120, (pw - 50) / 2, 40, 10); s += rect(px + 30 + (pw - 50) / 2, y + 120, (pw - 50) / 2, 40, 10);
  s += rect(px + 20, y + 174, pw - 40, 10, 5, C.soft); // slider
  s += btn(px + 20, y + 220, pw - 40, 42, 'Simpan Titik');
  s += card(px, y + 314, pw, 246, 'Daftar Lokasi');
  for (let i = 0; i < 3; i++) { s += circle(px + 38, y + 376 + i * 56, 14, C.soft); s += line(px + 64, y + 366 + i * 56, 160, 10); s += line(px + 64, y + 384 + i * 56, 90, 8); }
  return s;
})()];

// 12. Admin Rekap
pages['12-admin-rekap'] = ['Rekap & Laporan', 'admin-rekap.html', (() => {
  const sh = shell('admin', 'Rekap & Laporan', 'Rekap & Laporan');
  let s = sh.svg; const x = sh.contentX, y = sh.top, w = sh.mw;
  s += card(x, y, w, 96, '');
  for (let i = 0; i < 3; i++) { s += line(x + 24 + i * 220, y + 30, 80, 8); s += rect(x + 24 + i * 220, y + 42, 180, 38, 10); }
  s += btn(x + w - 320, y + 42, 130, 38, 'Excel', false);
  s += btn(x + w - 180, y + 42, 150, 38, 'Cetak Laporan');
  s += statRow(x, y + 116, w, 4, ['Rata Kehadiran', 'Keterlambatan', 'Izin & Sakit', 'Diverifikasi']);
  s += table(x, y + 236, w, 394, 'Rekap Absensi — Mei 2026', 6, ['Karyawan', 'Departemen', 'Hadir', 'Telat', 'Izin', 'Persentase']);
  return s;
})()];

// ---- write files ----------------------------------------------------------
const outDir = path.join(__dirname, 'svg');
fs.mkdirSync(outDir, { recursive: true });
const manifest = [];
Object.keys(pages).forEach((key) => {
  const [title, file, body] = pages[key];
  const svg = frame(title, file, body);
  const name = key + '.svg';
  fs.writeFileSync(path.join(outDir, name), svg, 'utf8');
  manifest.push({ name, title, file });
  console.log('wrote svg/' + name);
});
fs.writeFileSync(path.join(__dirname, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('done:', manifest.length, 'wireframes');
