(function () {
  const rowsNode = document.getElementById("admin-user-rows");
  const statusNode = document.getElementById("admin-user-status");
  const sourceNode = document.getElementById("admin-user-source");
  const totalNode = document.getElementById("admin-user-total");
  const activeNode = document.getElementById("admin-user-active");
  const loginTotalNode = document.getElementById("admin-user-login-total");
  const studentTotalNode = document.getElementById("admin-user-student-total");

  if (!rowsNode) {
    return;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function formatDateTime(value) {
    if (!value) {
      return "-";
    }

    const date = new Date(String(value).replace(" ", "T"));

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }

  function setStatus(message, tone) {
    if (!statusNode) {
      return;
    }

    statusNode.textContent = message;
    statusNode.dataset.tone = tone || "neutral";
  }

  function setText(node, value) {
    if (node) {
      node.textContent = String(value);
    }
  }

  function roleLabel(role) {
    const labels = {
      admin: "管理员",
      teacher: "教师",
      student: "学生"
    };

    return labels[role] || role || "-";
  }

  function roleTone(role) {
    if (role === "admin") return "rose";
    if (role === "teacher") return "blue";
    return "green";
  }

  function renderRows(items) {
    if (!items.length) {
      rowsNode.innerHTML = '<tr><td colspan="8">暂无用户数据。后续接入用户登录后，这里会自动显示用户邮箱、登录次数和最近登录时间。</td></tr>';
      return;
    }

    rowsNode.innerHTML = items
      .map((user) => {
        const schoolClass = [user.schoolName, user.className].filter(Boolean).join(" / ") || "-";
        const displayName = user.displayName || user.email || "未命名用户";

        return `
          <tr>
            <td>
              <div class="admin-course-title">${escapeHtml(displayName)}</div>
              <div class="admin-course-created">ID：${escapeHtml(user.id)}</div>
            </td>
            <td>${escapeHtml(user.email)}</td>
            <td><span class="admin-pill ${roleTone(user.role)}">${escapeHtml(roleLabel(user.role))}</span></td>
            <td>${escapeHtml(schoolClass)}</td>
            <td>${escapeHtml(user.loginCount || 0)}</td>
            <td>${escapeHtml(formatDateTime(user.lastLoginAt))}</td>
            <td>${escapeHtml(formatDateTime(user.createdAt))}</td>
            <td><span class="admin-pill ${user.status === "disabled" ? "rose" : "green"}">${escapeHtml(user.statusLabel || "正常")}</span></td>
          </tr>
        `;
      })
      .join("");
  }

  function updateStats(payload, items) {
    const stats = payload.stats || {};
    setText(totalNode, stats.total ?? items.length);
    setText(activeNode, stats.activeLast30Days ?? 0);
    setText(loginTotalNode, stats.loginTotal ?? 0);
    setText(studentTotalNode, stats.students ?? items.filter((user) => user.role === "student").length);

    if (sourceNode) {
      sourceNode.textContent = payload.dataSource === "d1" ? "D1 实时用户" : "回退数据";
    }
  }

  async function loadUsers() {
    try {
      const response = await fetch("./api/admin/users", {
        headers: { accept: "application/json" },
        cache: "no-store"
      });

      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || `HTTP ${response.status}`);
      }

      const items = Array.isArray(payload.items) ? payload.items : [];
      updateStats(payload, items);
      renderRows(items);
      setStatus(`已读取 ${items.length} 个用户。`, "success");
    } catch (error) {
      console.error("Failed to load admin users:", error);
      rowsNode.innerHTML = '<tr><td colspan="8">用户接口读取失败，请检查后台登录状态或 D1 数据库。</td></tr>';
      setStatus(`用户读取失败：${error.message}`, "error");
    }
  }

  loadUsers();
})();
