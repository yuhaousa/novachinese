(function () {
  const form = document.getElementById("admin-course-form");
  const previewLink = document.getElementById("admin-course-preview");
  const contentLink = document.getElementById("admin-course-content-link");
  const saveButton = document.getElementById("admin-course-save");
  const resetButton = document.getElementById("admin-course-reset");
  const deleteButton = document.getElementById("admin-course-delete");
  const uploadButton = document.getElementById("admin-cover-upload");
  const coverFileInput = document.getElementById("course-cover-file");
  const coverPreview = document.getElementById("course-cover-preview");
  const formStatus = document.getElementById("admin-course-form-status");
  const modeBadge = document.getElementById("admin-course-mode");

  if (!form) {
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

  const requestedSlug = new URLSearchParams(window.location.search).get("course") || "";
  let course = null;
  let selectedCoverPreviewUrl = "";

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

  function previewSelectedCover(file) {
    if (selectedCoverPreviewUrl) {
      URL.revokeObjectURL(selectedCoverPreviewUrl);
      selectedCoverPreviewUrl = "";
    }

    if (!file) {
      syncCoverPreview(course?.coverImageUrl || "");
      return;
    }

    selectedCoverPreviewUrl = URL.createObjectURL(file);
    syncCoverPreview(selectedCoverPreviewUrl);
    setFormStatus("已选择新的封面图片，点击“上传到 R2 并绑定课程”后才会同步到课程列表和课程页。", "neutral");
  }

  function syncCourseLinks(item) {
    if (previewLink) {
      previewLink.href = item ? item.route : "overview.html";
      previewLink.textContent = item ? `预览《${item.title}》` : "预览课程内容页";
    }

    if (contentLink) {
      contentLink.href = item
        ? `admin-content.html?course=${encodeURIComponent(item.slug)}`
        : "admin-content.html";
    }
  }

  function fillForm(item) {
    const normalizedItem = {
      ...item,
      coverImageUrl: item.coverImageUrl || item.cover_image_url || course?.coverImageUrl || ""
    };

    course = normalizedItem;
    fields.slug.value = normalizedItem.slug || "";
    fields.title.value = normalizedItem.title || "";
    fields.author.value = normalizedItem.author || "";
    fields.stage.value = normalizedItem.stage || normalizedItem.gradeLabel || "";
    fields.genre.value = normalizedItem.genre || "";
    fields.sourceType.value = normalizedItem.sourceType || "content-page";
    fields.route.value = normalizedItem.route || "";
    fields.status.value = normalizedItem.status || "published";
    syncCoverPreview(normalizedItem.coverImageUrl || "");
    syncCourseLinks(normalizedItem);

    if (modeBadge) {
      modeBadge.textContent = "编辑模式";
      modeBadge.className = "admin-pill slate";
    }
  }

  async function uploadSelectedCover(slug) {
    const file = coverFileInput.files?.[0];

    if (!file) {
      return null;
    }

    const formData = new FormData();
    formData.append("slug", slug);
    formData.append("file", file);

    const response = await fetch("./api/admin/assets/upload", {
      method: "POST",
      body: formData
    });
    const result = await response.json();

    if (!response.ok || !result.ok) {
      throw new Error(result.error || `HTTP ${response.status}`);
    }

    if (selectedCoverPreviewUrl) {
      URL.revokeObjectURL(selectedCoverPreviewUrl);
      selectedCoverPreviewUrl = "";
    }

    coverFileInput.value = "";
    return result.item;
  }

  async function loadCourse() {
    if (!requestedSlug) {
      setFormStatus("缺少课程标识，请从课程管理页进入。", "error");
      saveButton.disabled = true;
      resetButton.disabled = true;
      deleteButton.disabled = true;
      uploadButton.disabled = true;
      return;
    }

    try {
      const response = await fetch("./api/admin/courses", {
        headers: { accept: "application/json" },
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      const item = Array.isArray(result.items)
        ? result.items.find((entry) => entry.slug === requestedSlug)
        : null;

      if (!item) {
        throw new Error("Course not found.");
      }

      fillForm(item);
      setFormStatus(`已载入《${item.title}》用于编辑。`, "neutral");
    } catch (error) {
      console.error("Failed to load course:", error);
      setFormStatus(`课程读取失败：${error.message}`, "error");
    }
  }

  fields.sourceType.addEventListener("change", () => {
    if (fields.sourceType.value === "full-flow" && !fields.route.value.trim()) {
      fields.route.value = "/index.html";
    }

    if (
      fields.sourceType.value === "content-page" &&
      (!fields.route.value.trim() || fields.route.value.trim() === "/index.html")
    ) {
      fields.route.value = `/course-content.html?course=${fields.slug.value || requestedSlug || "new-course"}`;
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const slug = fields.slug.value.trim();

    if (!slug) {
      setFormStatus("课程标识不能为空。", "error");
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
    setFormStatus("正在保存到 D1...", "neutral");

    try {
      const response = await fetch(`./api/admin/courses/${encodeURIComponent(slug)}`, {
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

      let savedItem = result.item;

      if (coverFileInput.files?.[0]) {
        setFormStatus("课程信息已保存，正在上传并绑定封面...", "neutral");
        savedItem = await uploadSelectedCover(savedItem.slug || slug);
      }

      fillForm(savedItem);
      setFormStatus(`《${savedItem.title}》已保存。`, "success");
    } catch (error) {
      console.error("Failed to save course:", error);
      setFormStatus(`保存失败：${error.message}`, "error");
    } finally {
      saveButton.disabled = false;
      resetButton.disabled = false;
    }
  });

  resetButton.addEventListener("click", () => {
    if (!course) {
      return;
    }

    if (coverFileInput) {
      coverFileInput.value = "";
    }

    previewSelectedCover(null);
    fillForm(course);
    setFormStatus(`已重置为《${course.title}》当前数据。`, "neutral");
  });

  coverFileInput?.addEventListener("change", () => {
    previewSelectedCover(coverFileInput.files?.[0] || null);
  });

  deleteButton.addEventListener("click", async () => {
    if (!course?.slug) {
      setFormStatus("请先选择有效课程。", "error");
      return;
    }

    const confirmed = window.confirm(`确认删除《${course.title}》吗？此操作会删除课程配置和内容块。`);

    if (!confirmed) {
      return;
    }

    deleteButton.disabled = true;
    setFormStatus(`正在删除《${course.title}》...`, "neutral");

    try {
      const response = await fetch(`./api/admin/courses/${encodeURIComponent(course.slug)}`, {
        method: "DELETE",
        headers: { accept: "application/json" }
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      location.href = "admin-courses.html";
    } catch (error) {
      console.error("Failed to delete course:", error);
      setFormStatus(`删除失败：${error.message}`, "error");
      deleteButton.disabled = false;
    }
  });

  uploadButton.addEventListener("click", async () => {
    const slug = fields.slug.value.trim();

    if (!slug) {
      setFormStatus("请先保存课程，再上传封面。", "error");
      return;
    }

    if (!coverFileInput.files?.[0]) {
      setFormStatus("请选择一张封面图片。", "error");
      return;
    }

    uploadButton.disabled = true;
    setFormStatus("正在上传封面到 R2...", "neutral");

    try {
      const uploadedItem = await uploadSelectedCover(slug);

      fillForm(uploadedItem);
      setFormStatus(`《${uploadedItem.title}》封面已上传。`, "success");
    } catch (error) {
      console.error("Failed to upload cover:", error);
      setFormStatus(`上传失败：${error.message}`, "error");
    } finally {
      uploadButton.disabled = false;
    }
  });

  loadCourse();
})();
