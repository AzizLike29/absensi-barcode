// Builds the shared app shell (sidebar + topbar) for dashboard pages.
// Each page sets `window.PAGE = { role, active, title, subtitle }` before
// including this file, then calls renderShell().

const NAV = {
  karyawan: [
    { id: 'dashboard', label: 'Dashboard', icon: 'home', href: 'dashboard.html' },
    { id: 'absensi', label: 'Absensi', icon: 'camera', href: 'absensi.html' },
    { id: 'riwayat', label: 'Riwayat Absensi', icon: 'history', href: 'riwayat.html' },
    { id: 'cuti', label: 'Cuti & Izin', icon: 'document', href: 'cuti.html' },
    { id: 'profil', label: 'Profil', icon: 'user', href: 'profil.html' },
  ],
  admin: [
    { id: 'dashboard', label: 'Dashboard', icon: 'home', href: 'admin-dashboard.html' },
    { id: 'karyawan', label: 'Data Karyawan', icon: 'users', href: 'admin-karyawan.html' },
    { id: 'lokasi', label: 'Titik Lokasi', icon: 'pin', href: 'admin-lokasi.html' },
    { id: 'rekap', label: 'Rekap & Laporan', icon: 'chart', href: 'admin-rekap.html' },
  ],
};

function navMarkup(role, active) {
  const items = NAV[role] || NAV.karyawan;
  return items
    .map(
      (it) => `
      <a href="${it.href}" class="nav-link ${it.id === active ? 'active' : ''}">
        ${icon(it.icon, 'w-5 h-5 text-slate-400')}
        <span>${it.label}</span>
      </a>`
    )
    .join('');
}

function renderShell() {
  const page = window.PAGE || { role: 'karyawan', active: 'dashboard', title: 'Dashboard' };
  const role = page.role;
  const roleLabel = role === 'admin' ? 'HR Admin' : 'Karyawan';
  const user = role === 'admin'
    ? { name: 'Dewi Anggraini', role: 'HR Admin', avatar: 'DA' }
    : { name: APP.currentUser.name, role: APP.currentUser.role, avatar: APP.currentUser.avatar };

  const sidebar = `
    <aside
      class="fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 flex flex-col
             transition-transform duration-200 lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'">
      <div class="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
        <div class="w-9 h-9 rounded-xl bg-brand-600 grid place-items-center shadow-soft overflow-hidden"><img src="assets/icon/barcode-scan.png" alt="Logo" class="w-6 h-6 object-contain" /></div>
        <div class="leading-tight">
          <p class="font-semibold text-slate-800">${APP.appName}</p>
          <p class="text-[11px] text-slate-400">Sistem Absensi Karyawan</p>
        </div>
      </div>
      <nav class="flex-1 px-4 py-5 space-y-1 overflow-y-auto scroll-thin">
        <p class="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Menu ${roleLabel}</p>
        ${navMarkup(role, page.active)}
      </nav>
      <div class="p-4 border-t border-slate-100">
        <div class="flex items-center gap-3 px-2 py-2 rounded-xl bg-slate-50">
          <div class="w-9 h-9 rounded-full bg-brand-100 text-brand-700 grid place-items-center text-sm font-semibold">${user.avatar}</div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-slate-700 truncate">${user.name}</p>
            <p class="text-[11px] text-slate-400 truncate">${user.role}</p>
          </div>
          <a href="login.html" title="Keluar" class="text-slate-400 hover:text-rose-500">${icon('logout', 'w-5 h-5')}</a>
        </div>
      </div>
    </aside>`;

  const topbar = `
    <header class="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur border-b border-slate-200 flex items-center gap-3 px-4 sm:px-6">
      <button @click="sidebarOpen = !sidebarOpen" class="lg:hidden text-slate-500 hover:text-slate-700">
        ${icon('menu', 'w-6 h-6')}
      </button>
      <div class="flex-1 min-w-0">
        <h1 class="text-base sm:text-lg font-semibold text-slate-800 truncate">${page.title || ''}</h1>
        ${page.subtitle ? `<p class="text-xs text-slate-400 truncate">${page.subtitle}</p>` : ''}
      </div>
      <div class="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 text-slate-400 w-64">
        ${icon('search', 'w-4 h-4')}
        <input type="text" placeholder="Cari..." class="bg-transparent text-sm text-slate-600 placeholder-slate-400 focus:outline-none flex-1" />
      </div>
      <div class="relative" x-data="{ open: false }">
        <button @click="open = !open" class="relative w-10 h-10 grid place-items-center rounded-xl hover:bg-slate-100 text-slate-500">
          ${icon('bell', 'w-5 h-5')}
          <span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
        </button>
        <div x-cloak x-show="open" @click.outside="open = false"
             x-transition.origin.top.right
             class="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-soft border border-slate-100 p-2">
          <p class="px-3 py-2 text-sm font-semibold text-slate-700">Notifikasi</p>
          ${APP.notifications
            .map(
              (n) => `
            <div class="flex gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50">
              <span class="mt-1 w-2 h-2 rounded-full ${n.unread ? 'bg-brand-500' : 'bg-slate-200'}"></span>
              <div>
                <p class="text-sm font-medium text-slate-700">${n.title}</p>
                <p class="text-xs text-slate-400">${n.desc}</p>
                <p class="text-[11px] text-slate-300 mt-0.5">${n.time}</p>
              </div>
            </div>`
            )
            .join('')}
        </div>
      </div>
      <div class="w-9 h-9 rounded-full bg-brand-600 text-white grid place-items-center text-sm font-semibold">${user.avatar}</div>
    </header>`;

  const overlay = `
    <div x-cloak x-show="sidebarOpen" @click="sidebarOpen = false"
         x-transition.opacity
         class="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"></div>`;

  document.getElementById('sidebar-slot').innerHTML = sidebar;
  document.getElementById('topbar-slot').innerHTML = topbar;
  document.getElementById('overlay-slot').innerHTML = overlay;
}
