// admin-shell.js - inject admin sidebar and topbar
(function () {
  const navItems = [
    { id: 'dashboard', icon: 'grid', label: '管理看板', href: 'admin.html' },
    { id: 'courses', icon: 'book', label: '课程管理', href: 'admin-courses.html' },
    { id: 'content', icon: 'file', label: '内容中心', href: 'admin-content.html' },
    { id: 'users', icon: 'users', label: '用户管理', href: 'admin-users.html' },
    { id: 'ai', icon: 'activity', label: 'AI策略', href: 'admin-ai.html' },
    { id: 'settings', icon: 'settings', label: '后台设置', href: 'admin-settings.html' },
  ];

  const icons = {
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  };

  function getActiveId() {
    const path = location.pathname.split('/').pop() || 'admin.html';
    if (path === 'admin.html') return 'dashboard';
    if (path === 'admin-courses.html' || path === 'admin-course-create.html' || path === 'admin-course-edit.html') return 'courses';
    if (path === 'admin-content.html') return 'content';
    if (path === 'admin-users.html') return 'users';
    if (path === 'admin-ai.html') return 'ai';
    if (path === 'admin-settings.html') return 'settings';
    return 'dashboard';
  }

  function buildSidebar() {
    const activeId = getActiveId();
    const items = navItems
      .map(function (item) {
        return (
          '<a href="' +
          item.href +
          '" class="nav-item ' +
          (item.id === activeId ? 'active' : '') +
          '">' +
          icons[item.icon] +
          '<span>' +
          item.label +
          '</span></a>'
        );
      })
      .join('');

    return `
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-logo">${icons.shield}</div>
          <div class="brand-text">NovaRead Admin</div>
        </div>
        <nav class="nav">
          ${items}
          <div class="nav-divider"></div>
          <a href="index.html" class="nav-item">
            ${icons.home}
            <span>返回前台</span>
          </a>
        </nav>
        <div class="sidebar-footer">
          <div class="sidebar-footer-title">管理模式</div>
          <div class="sidebar-footer-tagline">课程、内容、班级、AI 策略统一管理</div>
        </div>
      </aside>`;
  }

  function buildTopbar() {
    return `
      <header class="topbar">
        <div class="topbar-product">
          <div class="topbar-product-logo">${icons.shield}</div>
          <div class="topbar-product-name">NovaRead<span>Admin Mode</span></div>
        </div>
        <div class="topbar-right">
          <a href="overview.html" class="topbar-vip">${icons.book}<span>查看课程站点</span></a>
          <button type="button" class="topbar-vip topbar-logout" id="admin-logout">${icons.shield}<span>退出登录</span></button>
          <div class="topbar-user">
            <div class="topbar-user-avatar">管</div>
            <span class="topbar-user-name">管理员</span>
            ${icons.chevron.replace('viewBox', 'class="topbar-user-chevron" viewBox')}
          </div>
        </div>
      </header>`;
  }

  function mountShell() {
    const app = document.getElementById('app');
    if (!app) return;
    if (app.dataset.adminShellMounted === 'true') return;

    app.insertAdjacentHTML('afterbegin', buildSidebar());
    app.dataset.adminShellMounted = 'true';

    const main = document.getElementById('main');
    if (main) {
      main.insertAdjacentHTML('afterbegin', buildTopbar());
    }

    const logoutButton = document.getElementById('admin-logout');
    if (logoutButton) {
      logoutButton.addEventListener('click', async function () {
        try {
          await fetch('./api/admin/logout', {
            method: 'POST',
            headers: { accept: 'application/json' }
          });
        } catch (error) {
          console.error('Admin logout failed:', error);
        } finally {
          location.href = 'admin-login.html';
        }
      });
    }
  }

  if (document.getElementById('app')) {
    mountShell();
  } else {
    document.addEventListener('DOMContentLoaded', mountShell, { once: true });
  }
})();
