// layout.js - Generates global layout, Desktop Header & Mobile Bottom Nav dynamically

// Map to handle SVG icons simply
const ICONS = {
  dashboard: '<svg viewBox="0 0 24 24"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>',
  tracker: '<svg viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>',
  attendance: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>',
  approvals: '<svg viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>',
  reports: '<svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>',
  team: '<svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>',
  users: '<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>',
};

const MENU = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard/index.html', icon: 'dashboard', roles: ['admin', 'manager'] }, // Add engineer if Dashboard is for everyone
  { id: 'tracker', label: 'Tracker', path: '/tracker/index.html', icon: 'tracker', roles: ['admin', 'manager', 'engineer'] },
  { id: 'attendance', label: 'Attendance', path: '/attendance/index.html', icon: 'attendance', roles: ['admin', 'manager', 'engineer'] },
  { id: 'approvals', label: 'Approvals', path: '/approvals/index.html', icon: 'approvals', roles: ['admin', 'manager', 'engineer'] },
  { id: 'team', label: 'Team', path: '/team/index.html', icon: 'team', roles: ['manager', 'admin'] },
  { id: 'users', label: 'Users', path: '/admin/users.html', icon: 'users', roles: ['admin'] },
  { id: 'reports', label: 'Reports', path: '/reports/index.html', icon: 'reports', roles: ['admin'] }
];

function generateLayout() {
  if (!window.portalState || !window.portalState.isLoaded) return;
  const profile = window.portalState.Profile;
  const currentPath = window.location.pathname;

  // Render logic based on roles
  const visibleMenu = MENU.filter(m => m.roles.includes(profile.role));

  // --- Header Construction ---
  let headerHtml = `
    <a href="/dashboard/index.html" class="logo-area">
      <div class="logo-mark">PM</div>
      <div class="logo-text">Power<em>matix</em></div>
    </a>
    <div class="nav-links">
      ${visibleMenu.map(m => `
        <a href="${m.path}" class="nav-link ${currentPath.includes(m.path) ? 'active' : ''}">
          ${m.label}
        </a>
      `).join('')}
    </div>
    <div class="user-area">
      <div class="user-info-text">
        <span class="user-name">${profile.full_name || 'User'}</span>
        <span class="user-role">${profile.role}</span>
      </div>
      <div class="avatar">${(profile.full_name || 'U')[0].toUpperCase()}</div>
      <button class="btn-logout" onclick="window.db.auth.signOut().then(() => window.location.href='/index.html')">Logout</button>
    </div>
  `;
  const headerEl = document.createElement('header');
  headerEl.id = 'app-header';
  headerEl.innerHTML = headerHtml;

  // --- Mobile Nav Construction ---
  let navHtml = visibleMenu.map(m => `
    <a href="${m.path}" class="mob-link ${currentPath.includes(m.path) ? 'active' : ''}">
      ${ICONS[m.icon]}
      <span>${m.label}</span>
    </a>
  `).join('');
  const mobileNavEl = document.createElement('nav');
  mobileNavEl.id = 'app-mobile-nav';
  mobileNavEl.innerHTML = navHtml;

  // Append elements
  document.body.prepend(headerEl);
  document.body.appendChild(mobileNavEl);
}

// Hook into portal load event
window.addEventListener('portalStateLoaded', generateLayout);
