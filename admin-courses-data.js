(function () {
  const tableBody = document.getElementById("admin-course-rows");
  const statusNote = document.getElementById("admin-course-status");
  const totalNode = document.getElementById("admin-course-total");
  const fullFlowNode = document.getElementById("admin-full-flow-count");
  const contentPageNode = document.getElementById("admin-content-page-count");

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

  function renderRows(items) {
    tableBody.innerHTML = items
      .map(
        (course) => `
          <tr>
            <td>《${escapeHtml(course.title)}》</td>
            <td>${escapeHtml(course.gradeLabel)}</td>
            <td>${escapeHtml(course.genre)}</td>
            <td>${escapeHtml(course.pageTypeLabel)}</td>
            <td><code>${escapeHtml(course.route)}</code></td>
            <td><span class="admin-pill ${escapeHtml(course.adminStatusTone)}">${escapeHtml(course.adminStatusLabel)}</span></td>
          </tr>
        `
      )
      .join("");
  }

  async function loadCourses() {
    try {
      const [coursesResponse, databaseResponse] = await Promise.all([
        fetch("./api/courses", { headers: { accept: "application/json" } }),
        fetch("./api/db/status", { headers: { accept: "application/json" } })
      ]);

      if (!coursesResponse.ok) {
        throw new Error(`Courses HTTP ${coursesResponse.status}`);
      }

      const coursePayload = await coursesResponse.json();
      const dbPayload = databaseResponse.ok ? await databaseResponse.json() : null;
      const items = Array.isArray(coursePayload.items) ? coursePayload.items : [];
      const fullFlowCount = items.filter(
        (course) => course.sourceType === "full-flow"
      ).length;
      const contentPageCount = items.length - fullFlowCount;

      renderRows(items);

      if (statusNote) {
        const dataSourceLabel =
          coursePayload.dataSource === "d1" ? "D1 实时数据" : "静态种子回退";
        const databaseLabel = dbPayload?.database?.connected
          ? `数据库已连接，共 ${dbPayload.database.courseCount} 门课程`
          : "数据库未连接，当前展示为回退数据";

        statusNote.textContent = `当前数据来源：${dataSourceLabel}。${databaseLabel}。`;
      }

      if (totalNode) {
        totalNode.textContent = String(items.length);
      }

      if (fullFlowNode) {
        fullFlowNode.textContent = `${fullFlowCount} 门`;
      }

      if (contentPageNode) {
        contentPageNode.textContent = `${contentPageCount} 门`;
      }
    } catch (error) {
      console.error("Failed to load admin courses:", error);

      if (statusNote) {
        statusNote.textContent = "课程接口读取失败，当前保留静态表格内容。";
      }
    }
  }

  loadCourses();
})();
