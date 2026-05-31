# WinniPresence — Wireframe Sistem Absensi Karyawan

Wireframe & prototipe UI untuk **Sistem Informasi Absensi Karyawan PT Winnicode Garuda Teknologi**.
Dibuat dengan **HTML + Tailwind CSS (Play CDN) + Alpine.js**. Tidak ada backend — seluruh data bersifat dummy/mock di sisi front-end.

Alur dan fitur mengikuti diagram `Use case KP.drawio` (use case, flowchart, dan ERD).

## Menjalankan

Karena memakai CDN, cukup buka file di browser. Disarankan lewat server statis agar path antar-file rapi:

```bash
# Opsi 1: VS Code Live Server (klik kanan index.html -> Open with Live Server)

# Opsi 2: Node (jika tersedia)
npx http-server -p 5500

# Opsi 3: Python
python -m http.server 5500
```

Lalu buka `http://localhost:5500`.

## Alur Demo

1. **index.html** — landing page, pilih portal.
2. **login.html** — pilih peran (Karyawan / HR Admin).
   - Karyawan → **otp.html** (kode demo: `123456`) → dashboard.
   - HR Admin → langsung ke dashboard admin.

## Struktur Halaman

### Portal Karyawan
| Halaman | File | Keterangan |
|---|---|---|
| Dashboard | `dashboard.html` | Ringkasan kehadiran, jam digital, status hari ini |
| Absensi | `absensi.html` | Simulasi Face Recognition + validasi GPS & data |
| Riwayat | `riwayat.html` | Tabel riwayat absensi + filter & ekspor |
| Cuti & Izin | `cuti.html` | Form pengajuan + daftar status |
| Profil | `profil.html` | Data pribadi & keamanan akun |

### Portal HR Admin
| Halaman | File | Keterangan |
|---|---|---|
| Dashboard HR | `admin-dashboard.html` | KPI, grafik kehadiran, antrian verifikasi |
| Data Karyawan | `admin-karyawan.html` | CRUD karyawan + cari/filter |
| Titik Lokasi | `admin-lokasi.html` | Tentukan titik & radius absensi di peta |
| Rekap & Laporan | `admin-rekap.html` | Rekap per karyawan + cetak laporan |

## Struktur Berkas

```
assets/
  css/app.css            # helper styling tambahan
  js/tailwind-config.js  # konfigurasi tema Tailwind (warna brand, dll)
  js/icons.js            # set ikon SVG inline
  js/data.js             # data dummy + helper format
  js/layout.js           # shell bersama (sidebar + topbar)
*.html                   # halaman-halaman aplikasi
```

## Catatan
- Semua interaksi (login, OTP, scan wajah, verifikasi) adalah **simulasi front-end** untuk keperluan wireframe.
- Tema warna dapat diubah lewat `assets/js/tailwind-config.js`.
