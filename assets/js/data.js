// Mock data used by the wireframe pages. Pure front-end, no backend.
const APP = {
  company: 'PT Winnicode Garuda Teknologi',
  appName: 'WinniPresence',
  // Logged-in employee (demo).
  currentUser: {
    name: 'Desta Ayu Melinda',
    nip: '2024.08.0142',
    role: 'Fullstack Developer',
    department: 'Engineering',
    email: 'destaayumelinda2711@gmail.com',
    phone: '0812-3456-7890',
    status: 'Karyawan Tetap',
    avatar: 'DA',
    joinDate: '12 Agustus 2022',
  },
  // Today's attendance snapshot.
  today: {
    checkIn: '08:02',
    checkOut: '--:--',
    status: 'Hadir',
    workHours: '—',
    location: 'Kantor Pusat - Jakarta',
    shift: '08:00 - 17:00',
  },
  // Employee attendance history.
  history: [
    { date: '2026-05-29', day: 'Jumat', in: '07:58', out: '17:05', status: 'Hadir', late: false },
    { date: '2026-05-28', day: 'Kamis', in: '08:14', out: '17:02', status: 'Terlambat', late: true },
    { date: '2026-05-27', day: 'Rabu', in: '07:51', out: '17:10', status: 'Hadir', late: false },
    { date: '2026-05-26', day: 'Selasa', in: '--:--', out: '--:--', status: 'Izin', late: false },
    { date: '2026-05-25', day: 'Senin', in: '07:49', out: '17:00', status: 'Hadir', late: false },
    { date: '2026-05-23', day: 'Sabtu', in: '--:--', out: '--:--', status: 'Sakit', late: false },
    { date: '2026-05-22', day: 'Jumat', in: '08:03', out: '17:08', status: 'Hadir', late: false },
  ],
  // Leave / permission requests by the employee.
  leaves: [
    { id: 'CT-0012', type: 'Cuti Tahunan', from: '2026-06-10', to: '2026-06-12', days: 3, status: 'Menunggu', reason: 'Acara keluarga' },
    { id: 'IZ-0033', type: 'Izin', from: '2026-05-26', to: '2026-05-26', days: 1, status: 'Disetujui', reason: 'Keperluan pribadi' },
    { id: 'SK-0021', type: 'Sakit', from: '2026-05-23', to: '2026-05-23', days: 1, status: 'Disetujui', reason: 'Demam, surat dokter terlampir' },
    { id: 'CT-0009', type: 'Cuti Tahunan', from: '2026-04-02', to: '2026-04-03', days: 2, status: 'Ditolak', reason: 'Kuota cuti habis' },
  ],
  // Employees managed by HR Admin.
  employees: [
    { nip: '2024.08.0142', name: 'Desta Ayu Melinda', dept: 'Engineering', role: 'Fullstack Developer', status: 'Tetap', present: true },
    { nip: '2024.03.0098', name: 'Salsabila Putri', dept: 'Design', role: 'UI/UX Designer', status: 'Tetap', present: true },
    { nip: '2023.11.0076', name: 'Bagas Nugroho', dept: 'Engineering', role: 'Backend Developer', status: 'Tetap', present: false },
    { nip: '2025.01.0210', name: 'Citra Lestari', dept: 'Marketing', role: 'Content Strategist', status: 'Kontrak', present: true },
    { nip: '2022.06.0031', name: 'Dimas Aryo', dept: 'Finance', role: 'Accountant', status: 'Tetap', present: true },
    { nip: '2025.02.0233', name: 'Maya Anindita', dept: 'HRD', role: 'HR Generalist', status: 'Kontrak', present: false },
    { nip: '2023.09.0064', name: 'Fajar Ramadhan', dept: 'Engineering', role: 'DevOps Engineer', status: 'Tetap', present: true },
    { nip: '2024.10.0188', name: 'Intan Permata', dept: 'Design', role: 'Product Designer', status: 'Tetap', present: true },
  ],
  // HR Admin pending verification queue.
  pendingRecaps: [
    { nip: '2024.08.0142', name: 'Desta Ayu Melinda', date: '2026-05-29', in: '07:58', out: '17:05', note: 'Lokasi & wajah valid' },
    { nip: '2024.03.0098', name: 'Salsabila Putri', date: '2026-05-29', in: '08:21', out: '17:11', note: 'Terlambat 21 menit' },
    { nip: '2025.01.0210', name: 'Citra Lestari', date: '2026-05-29', in: '07:46', out: '16:58', note: 'Lokasi & wajah valid' },
  ],
  notifications: [
    { title: 'Absen masuk berhasil', desc: 'Wajah & lokasi terverifikasi pukul 08:02', time: '2 menit lalu', unread: true },
    { title: 'Pengajuan cuti diproses', desc: 'CT-0012 sedang ditinjau HR Admin', time: '1 jam lalu', unread: true },
    { title: 'Izin disetujui', desc: 'IZ-0033 telah disetujui', time: 'Kemarin', unread: false },
  ],
};

// Small formatting helpers.
function fmtDate(iso) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const d = new Date(iso + 'T00:00:00');
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function statusBadge(status) {
  const map = {
    Hadir: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    Terlambat: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    Izin: 'bg-sky-50 text-sky-700 ring-sky-600/20',
    Sakit: 'bg-violet-50 text-violet-700 ring-violet-600/20',
    Alpha: 'bg-rose-50 text-rose-700 ring-rose-600/20',
    Disetujui: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    Menunggu: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    Ditolak: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  };
  return map[status] || 'bg-slate-100 text-slate-700 ring-slate-600/20';
}
