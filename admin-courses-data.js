(function () {
  const tableBody = document.getElementById("admin-course-rows");
  const statusNote = document.getElementById("admin-course-status");
  const totalNode = document.getElementById("admin-course-total");
  const fullFlowNode = document.getElementById("admin-full-flow-count");
  const contentPageNode = document.getElementById("admin-content-page-count");
  const form = document.getElementById("admin-course-form");
  const previewLink = document.getElementById("admin-course-preview");
  const saveButton = document.getElementById("admin-course-save");
  const resetButton = document.getElementById("admin-course-reset");
  const deleteButton = document.getElementById("admin-course-delete");
  const createButton = document.getElementById("admin-create-course");
  const uploadButton = document.getElementById("admin-cover-upload");
  const coverFileInput = document.getElementById("course-cover-file");
  const coverPreview = document.getElementById("course-cover-preview");
  const formStatus = document.getElementById("admin-course-form-status");

  if (!tableBody || !form) {
    return;
  }

  const fields = {
    slug: document.getElementById("course-slug"),
    title: document.getElementById("course-title"),
    author: document.getElementById("course-author"),
    stage: document.getElementById("course-stage"),
    genre: document.getElementById("course-genre"),
    sourceType: document.getElementById("course-source-type"),
    route: document.getElementById("course-route"),
    status: document.getElementById("course-status")
  };

  let courses = [];
  let selectedSlug = "";
  let mode = "edit";

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function setFormStatus(message, tone) {
    if (!formStatus) {
      return;
    }

    formStatus.textContent = message;
    formStatus.dataset.tone = tone || "neutral";
  }

  function syncCoverPreview(url) {
    if (!coverPreview) {
      return;
    }

    if (url) {
      coverPreview.src = url;
      coverPreview.style.display = "block";
      return;
    }

    coverPreview.removeAttribute("src");
    coverPreview.style.display = "none";
  }

  function syncPreviewLink(course) {
    if (!previewLink) {
      return;
    }

    if (!course) {
      previewLink.href = "overview.html";
      previewLink.textContent = "预览课程内容页";
      return;
    }

    previewLink.href = course.route;
    previewLink.textContent = `预览《${course.title}》`;
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
    const fullFlowCount = items.filter(
      (course) => course.sourceType === "full-flow"
    ).length;
    const contentPageCount = items.length - fullFlowCount;

    if (totalNode) {
      totalNode.textContent = String(items.length);
    }

    if (fullFlowNode) {
      fullFlowNode.textContent = `${fullFlowCount} 门`;
    }

    if (contentPageNode) {
      contentPageNode.textContent = `${contentPageCount} 门`;
    }
  }

  function renderRows(items) {
    tableBody.innerHTML = items
      .map(
        (course) => `
          <tr data-course-slug="${escapeHtml(course.slug)}" ${course.slug === selectedSlug ? 'class="admin-table-selected"' : ""}>
            <td>《${escapeHtml(course.title)}》</td>
            <td>${escapeHtml(course.gradeLabel || course.stage || "")}</td>
            <td>${escapeHtml(course.genre)}</td>
            <td>${escapeHtml(course.pageTypeLabel)}</td>
            <td><code>${escapeHtml(course.route)}</code></td>
            <td><span class="admin-pill ${escapeHtml(course.adminStatusTone)}">${escapeHtml(course.adminStatusLabel)}</span></td>
            <td>
              <button type="button" class="admin-btn admin-btn-light admin-row-action" data-course-slug="${escapeHtml(course.slug)}">
                编辑
              </button>
            </td>
          </tr>
        `
      )
      .join("");
  }

  function getCourseBySlug(slug) {
    return courses.find((course) => course.slug === slug) || null;
  }

  function toggleEditMode(editMode) {
    mode = editMode ? "edit" : "create";
    fields.slug.readOnly = editMode;
    deleteButton.disabled = !editMode;

    if (!editMode) {
      syncCoverPreview("");
      syncPreviewLink(null);
      coverFileInput.value = "";
      uploadButton.disabled = true;
    } else {
      uploadButton.disabled = false;
    }
  }

  function fillForm(course) {
    if (!course) {
      return;
    }

    toggleEditMode(true);
    selectedSlug = course.slug;
    fields.slug.value = course.slug;
    fields.title.value = course.title || "";
    fields.author.value = course.author || "";
    fields.stage.value = course.stage || course.gradeLabel || "";
    fields.genre.value = course.genre || "";
    fields.sourceType.value = course.sourceType || "content-page";
    fields.route.value = course.route || "";
    fields.status.value = course.status || "published";
    syncPreviewLink(course);
    syncCoverPreview(course.coverImageUrl || "");
    renderRows(courses);
  }

  function blankCreateForm() {
    toggleEditMode(false);
    selectedSlug = "";
    fields.slug.value = "";
    fields.title.value = "";
    fields.author.value = "";
    fields.stage.value = "";
    fields.genre.value = "";
    fields.sourceType.value = "content-page";
    fields.route.value = "";
    fields.status.value = "published";
    renderRows(courses);
    setFormStatus("请输入新课程信息，然后保存。", "neutral");
  }

  async function loadCourses(preferredSlug) {
    try {
      const [coursesResponse, databaseResponse] = await Promise.all([
        fetch("./api/admin/courses", { headers: { accept: "application/json" } }),
        fetch("./api/db/status", { headers: { accept: "application/json" } })
      ]);

      if (!coursesResponse.ok) {
        throw new Error(`Courses HTTP ${coursesResponse.status}`);
      }

      const coursePayload = await coursesResponse.json();
      const dbPayload = databaseResponse.ok ? await databaseResponse.json() : null;
      courses = Array.isArray(coursePayload.items) ? coursePayload.items : [];

      updateSummaryCounts(courses);
      setToolbarStatus(coursePayload, dbPayload);

      const nextCourse =
        getCourseBySlug(preferredSlug) ||
        getCourseBySlug(selectedSlug) ||
        courses[0] ||
        null;

      if (mode === "create" && !preferredSlug) {
        renderRows(courses);
        return;
      }

      if (nextCourse) {
        fillForm(nextCourse);
      } else {
        blankCreateForm();
      }
    } catch (error) {
      console.error("Failed to load admin courses:", error);
      setFormStatus("课程接口读取失败。", "error");

      if (statusNote) {
        statusNote.textContent = "课程接口读取失败，当前保留静态表格内容。";
      }
    }
  }

  tableBody.addEventListener("click", (event) => {
    const button = event.target.closest("[data-course-slug]");

    if (!button) {
      return;
    }

    const course = getCourseBySlug(button.dataset.courseSlug);

    if (course) {
      fillForm(course);
      setFormStatus(`已载入《${course.title}》用于编辑。`, "neutral");
    }
  });

  createButton.addEventListener("click", () => {
    blankCreateForm();
  });

  fields.sourceType.addEventListener("change", () => {
    if (fields.sourceType.value === "full-flow" && !fields.route.value.trim()) {
      fields.route.value = "/index.html";
    }

    if (
      fields.sourceType.value === "content-page" &&
      (!fields.route.value.trim() || fields.route.value.trim() === "/index.html")
    ) {
      fields.route.value = `/course-content.html?course=${fields.slug.value || "new-course"}`;
    }
  });

  fields.slug.addEventListener("input", () => {
    if (mode === "create" && fields.sourceType.value === "content-page") {
      fields.route.value = `/course-content.html?course=${fields.slug.value || "new-course"}`;
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const slug = fields.slug.value.trim();

    if (!slug) {
      setFormStatus("请填写课程标识。", "error");
      return;
    }

    const payload = {
      slug,
      title: fields.title.value,
      author: fields.author.value,
      stage: fields.stage.value,
      genre: fields.genre.value,
      sourceType: fields.sourceType.value,
      route: fields.route.value,
      status: fields.status.value
    };

    saveButton.disabled = true;
    resetButton.disabled = true;
    setFormStatus(mode === "create" ? "正在创建课程..." : "正在保存到 D1...", "neutral");

    try {
      const endpoint =
        mode === "create"
          ? "./api/admin/courses"
          : `./api/admin/courses/${encodeURIComponent(selectedSlug)}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      setFormStatus(
        mode === "create"
          ? `《${result.item.title}》已创建。`
          : `《${result.item.title}》已保存。`,
        "success"
      );
      await loadCourses(result.item.slug);
    } catch (error) {
      console.error("Failed to save course:", error);
      setFormStatus(`保存失败：${error.message}`, "error");
    } finally {
      saveButton.disabled = false;
      resetButton.disabled = false;
    }
  });

  resetButton.addEventListener("click", () => {
    if (mode === "create") {
      blankCreateForm();
      return;
    }

    const course = getCourseBySlug(selectedSlug);

    if (course) {
      fillForm(course);
      setFormStatus(`已重置为《${course.title}》当前数据。`, "neutral");
    }
  });

  deleteButton.addEventListener("click", async () => {
    if (mode !== "edit" || !selectedSlug) {
      setFormStatus("请先选择要删除的课程。", "error");
      return;
    }

    const course = getCourseBySlug(selectedSlug);

    if (!course) {
      return;
    }

    const confirmed = window.confirm(`确认删除《${course.title}》吗？此操作会删除课程配置和内容块。`);

    if (!confirmed) {
      return;
    }

    deleteButton.disabled = true;
    setFormStatus(`正在删除《${course.title}》...`, "neutral");

    try {
      const response = await fetch(`./api/admin/courses/${encodeURIComponent(selectedSlug)}`, {
        method: "DELETE",
        headers: {
          accept: "application/json"
        }
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      setFormStatus(`《${course.title}》已删除。`, "success");
      await loadCourses();
    } catch (error) {
      console.error("Failed to delete course:", error);
      setFormStatus(`删除失败：${error.message}`, "error");
    } finally {
      deleteButton.disabled = false;
    }
  });

  uploadButton.addEventListener("click", async () => {
    if (mode !== "edit" || !selectedSlug) {
      setFormStatus("请先保存课程，再上传封面。", "error");
      return;
    }

    const file = coverFileInput.files?.[0];

    if (!file) {
      setFormStatus("请选择一张封面图片。", "error");
      return;
    }

    const formData = new FormData();
    formData.append("slug", selectedSlug);
    formData.append("file", file);
    uploadButton.disabled = true;
    setFormStatus("正在上传封面到 R2...", "neutral");

    try {
      const response = await fetch("./api/admin/assets/upload", {
        method: "POST",
        body: formData
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      syncCoverPreview(result.item.coverImageUrl);
      setFormStatus(`《${result.item.title}》封面已上传。`, "success");
      await loadCourses(result.item.slug);
    } catch (error) {
      console.error("Failed to upload cover:", error);
      setFormStatus(`上传失败：${error.message}`, "error");
    } finally {
      uploadButton.disabled = false;
    }
  });

  loadCourses();
})();
