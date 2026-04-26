(function () {
  const tableBody = document.getElementById("admin-course-rows");
  const statusNote = document.getElementById("admin-course-status");
  const totalNode = document.getElementById("admin-course-total");

  if (!tableBody) {
    return;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function formatDateTime(value) {
    if (!value) {
      return "—";
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

  function setToolbarStatus(coursePayload, dbPayload) {
    if (!statusNote) {
      return;
    }

    const dataSourceLabel =
      coursePayload.dataSource === "d1" ? "D1 实时数据" : "静态种子回退";
    const databaseLabel = dbPayload?.database?.connected
      ? `数据库已连接，共 ${dbPayload.database.courseCount} 门课程`
      : "数据库未连接，当前展示为回退数据";

    statusNote.textContent = `当前数据来源：${dataSourceLabel}。${databaseLabel}。`;
  }

  function updateSummaryCounts(items) {
    if (totalNode) {
      totalNode.textContent = String(items.length);
    }
  }

  function renderRows(items) {
    tableBody.innerHTML = items
      .map(
        (course) => `
          <tr>
            <td>《${escapeHtml(course.title)}》</td>
            <td>${escapeHtml(formatDateTime(course.createdAt))}</td>
            <td>${escapeHtml(course.gradeLabel || course.stage || "")}</td>
            <td>${escapeHtml(course.genre)}</td>
            <td>${escapeHtml(course.pageTypeLabel)}</td>
            <td><code>${escapeHtml(course.route)}</code></td>
            <td><span class="admin-pill ${escapeHtml(course.adminStatusTone)}">${escapeHtml(course.adminStatusLabel)}</span></td>
            <td>
              <a class="admin-btn admin-btn-light admin-row-action" href="admin-course-edit.html?course=${encodeURIComponent(course.slug)}">编辑</a>
            </td>
          </tr>
        `
      )
      .join("");
  }

  async function loadCourses() {
    try {
      const [coursesResponse, databaseResponse] = await Promise.all([
        fetch("./api/admin/courses", { headers: { accept: "application/json" }, cache: "no-store" }),
        fetch("./api/db/status", { headers: { accept: "application/json" } })
      ]);

      if (!coursesResponse.ok) {
        throw new Error(`Courses HTTP ${coursesResponse.status}`);
      }

      const coursePayload = await coursesResponse.json();
      const dbPayload = databaseResponse.ok ? await databaseResponse.json() : null;
      const courses = Array.isArray(coursePayload.items) ? coursePayload.items : [];

      updateSummaryCounts(courses);
      setToolbarStatus(coursePayload, dbPayload);
      renderRows(courses);
    } catch (error) {
      console.error("Failed to load admin courses:", error);

      if (statusNote) {
        statusNote.textContent = "课程接口读取失败，当前保留静态表格内容。";
      }
    }
  }

  loadCourses();
})();
