// shell.js - inject shared sidebar, topbar, and course-level navigation
(function () {
  const navItems = [
    { id: "home", icon: "home", label: "首页", href: "index.html" },
    { id: "course", icon: "book", label: "课程", href: "overview.html" }
  ];

  const courseNavItems = [
    { id: "home", icon: "home", label: "课程首页", href: "index.html", desc: "目标与入口" },
    { id: "text", icon: "file", label: "文本分析", href: "text.html", desc: "精读与意境" },
    { id: "emotion", icon: "activity", label: "情感曲线", href: "emotion.html", desc: "结构与情绪" },
    { id: "writing", icon: "edit", label: "仿写训练", href: "writing.html", desc: "迁移表达" },
    { id: "chat", icon: "chat", label: "AI 对话", href: "chat.html", desc: "伴学问答" }
  ];

  const icons = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>',
    activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4z"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    crown: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 1l3.09 6.26L22 8.27l-5 4.87 1.18 6.88L12 16.77l-6.18 3.25L7 13.14 2 8.27l6.91-1.01L12 1z"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>'
  };

  const bambooLogo = `
    <svg viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#10b981"/>
          <stop offset="100%" stop-color="#059669"/>
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#bg-grad)"/>
      <path d="M11 7v18M11 12h4M11 17h4M11 22h4" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M19 9c2 1.5 3 3.5 3 6s-1 4.5-3 6" stroke="#fff" stroke-width="1.6" stroke-linecap="round" fill="none" opacity="0.7"/>
      <circle cx="20.5" cy="11" r="1.2" fill="#fff" opacity="0.85"/>
      <circle cx="22" cy="15" r="1.5" fill="#fff" opacity="0.7"/>
      <circle cx="20.5" cy="19" r="1.2" fill="#fff" opacity="0.85"/>
    </svg>`;

  const novaLogo = `
    <svg viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="nova-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6366f1"/>
          <stop offset="100%" stop-color="#10b981"/>
        </linearGradient>
      </defs>
      <path d="M6 26V6l20 20V6" stroke="url(#nova-grad)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <circle cx="26" cy="6" r="2" fill="#10b981"/>
      <circle cx="6" cy="26" r="2" fill="#6366f1"/>
    </svg>`;

  function getPath() {
    return location.pathname.split("/").pop() || "index.html";
  }

  function isCourseLearningPath(path) {
    return ["index.html", "text.html", "emotion.html", "writing.html", "chat.html", ""].includes(path);
  }

  function getActiveId() {
    const path = getPath();
    if (path === "overview.html" || path === "course-content.html" || isCourseLearningPath(path)) return "course";
    if (path === "settings.html") return "settings";
    return "";
  }

  function getCourseActiveId() {
    const path = getPath();
    if (path === "index.html" || path === "") return "home";
    if (path === "text.html") return "text";
    if (path === "emotion.html") return "emotion";
    if (path === "writing.html") return "writing";
    if (path === "chat.html") return "chat";
    return "";
  }

  function getCourseTitle() {
    const match = document.title.match(/《(.+?)》/);
    return match ? match[1] : "荷塘月色";
  }

  function withCurrentCourseQuery(href) {
    const course = new URLSearchParams(location.search).get("course");
    return course ? href + "?course=" + encodeURIComponent(course) : href;
  }

  function buildSidebar() {
    const activeId = getActiveId();
    const settingsActive = activeId === "settings";
    const items = navItems
      .map(function (item) {
        return (
          '<a href="' +
          item.href +
          '" class="nav-item ' +
          (item.id === activeId ? "active" : "") +
          '">' +
          icons[item.icon] +
          "<span>" +
          item.label +
          "</span></a>"
        );
      })
      .join("");

    return `
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-logo">${bambooLogo}</div>
          <div class="brand-text">BambooCloud</div>
        </div>
        <nav class="nav">
          ${items}
          <div class="nav-divider"></div>
          <a href="settings.html" class="nav-item ${settingsActive ? "active" : ""}">
            ${icons.settings}
            <span>设置</span>
          </a>
        </nav>
        <div class="sidebar-footer">
          <div class="sidebar-footer-brand">
            ${icons.cloud}
            <span>BambooCloud</span>
          </div>
          <div class="sidebar-footer-title">教育 x AI x 内容</div>
          <div class="sidebar-footer-tagline">让每一次阅读都有回响</div>
          <div class="sidebar-bamboo">竹</div>
        </div>
      </aside>`;
  }

  function buildCourseSubnav() {
    const activeId = getCourseActiveId();
    const items = courseNavItems
      .map(function (item) {
        return (
          '<a href="' +
          withCurrentCourseQuery(item.href) +
          '" class="course-subnav-item ' +
          (item.id === activeId ? "active" : "") +
          '">' +
          icons[item.icon] +
          "<span><strong>" +
          item.label +
          "</strong><small>" +
          item.desc +
          "</small></span></a>"
        );
      })
      .join("");

    return `
      <aside class="course-subnav" aria-label="课程学习导航">
        <div class="course-subnav-head">
          <div class="course-subnav-kicker">当前课程</div>
          <div class="course-subnav-title">《${getCourseTitle()}》</div>
        </div>
        <nav class="course-subnav-list">${items}</nav>
        <a class="course-subnav-back" href="overview.html">${icons.book}<span>返回课程目录</span></a>
      </aside>`;
  }

  function buildTopbar() {
    return `
      <header class="topbar">
        <div class="topbar-product">
          <div class="topbar-product-logo">${novaLogo}</div>
          <div class="topbar-product-name">NovaRead<span>AI语文</span></div>
        </div>
        <div class="topbar-right">
          <a href="admin.html" class="topbar-vip">${icons.shield}<span>后台管理</span></a>
          <button class="topbar-vip">${icons.crown}<span>会员中心</span></button>
          <button class="topbar-icon-btn" aria-label="通知">${icons.bell}<span class="badge"></span></button>
          <div class="topbar-user">
            <div class="topbar-user-avatar">林</div>
            <span class="topbar-user-name">林同学</span>
            ${icons.chevron.replace("viewBox", 'class="topbar-user-chevron" viewBox')}
          </div>
        </div>
      </header>`;
  }

  function mountCourseSubnav() {
    if (!isCourseLearningPath(getPath())) {
      return;
    }

    const content = document.querySelector(".main > .content");

    if (!content || content.dataset.courseSubnavMounted === "true") {
      return;
    }

    const body = document.createElement("div");
    body.className = "course-learning-body";

    while (content.firstChild) {
      body.appendChild(content.firstChild);
    }

    const layout = document.createElement("div");
    layout.className = "course-learning-layout";
    layout.insertAdjacentHTML("afterbegin", buildCourseSubnav());
    layout.appendChild(body);
    content.appendChild(layout);
    content.dataset.courseSubnavMounted = "true";
  }

  function mountShell() {
    const app = document.getElementById("app");
    if (!app) return;
    if (app.dataset.shellMounted === "true") return;

    app.insertAdjacentHTML("afterbegin", buildSidebar());
    app.dataset.shellMounted = "true";

    const main = document.getElementById("main");
    if (main) {
      main.insertAdjacentHTML("afterbegin", buildTopbar());
    }

    mountCourseSubnav();
  }

  if (document.getElementById("app")) {
    mountShell();
  } else {
    document.addEventListener("DOMContentLoaded", mountShell, { once: true });
  }
})();
