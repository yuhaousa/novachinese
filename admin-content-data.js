(function () {
  const courseSelect = document.getElementById("content-course-select");
  const form = document.getElementById("content-block-form");
  const statusNote = document.getElementById("content-page-status");
  const formStatus = document.getElementById("content-form-status");
  const previewLink = document.getElementById("content-preview-link");

  if (!courseSelect || !form) {
    return;
  }

  const fields = {
    slug: document.getElementById("content-course-slug"),
    summary: document.getElementById("content-summary"),
    subtitle: document.getElementById("content-subtitle"),
    tags: document.getElementById("content-tags"),
    entryLabel: document.getElementById("content-entry-label"),
    entryValue: document.getElementById("content-entry-value"),
    coverImageUrl: document.getElementById("content-cover-url")
  };

  let courses = [];
  let selectedSlug = "";

  function setFormStatus(message, tone) {
    if (!formStatus) {
      return;
    }

    formStatus.textContent = message;
    formStatus.dataset.tone = tone || "neutral";
  }

  function setPageStatus(message) {
    if (statusNote) {
      statusNote.textContent = message;
    }
  }

  async function loadCourseOptions() {
    const response = await fetch("./api/admin/courses", {
      headers: { accept: "application/json" }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const payload = await response.json();
    courses = Array.isArray(payload.items) ? payload.items : [];
    courseSelect.innerHTML = courses
      .map(
        (course) =>
          `<option value="${course.slug}">《${course.title}》 · ${course.gradeLabel || course.stage}</option>`
      )
      .join("");

    return payload;
  }

  async function loadContent(slug) {
    const response = await fetch(`./api/admin/content/${encodeURIComponent(slug)}`, {
      headers: { accept: "application/json" }
    });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => null);
      throw new Error(errorPayload?.error || `HTTP ${response.status}`);
    }

    const payload = await response.json();
    const item = payload.item;

    selectedSlug = item.slug;
    fields.slug.value = item.slug;
    fields.summary.value = item.summary || "";
    fields.subtitle.value = item.subtitle || "";
    fields.tags.value = Array.isArray(item.tags) ? item.tags.join(", ") : "";
    fields.entryLabel.value = item.entryLabel || "";
    fields.entryValue.value = item.entryValue || "";
    fields.coverImageUrl.value = item.coverImageUrl || "";
    previewLink.href = item.route;
    previewLink.textContent = `预览《${item.title}》`;
    setFormStatus(`已载入《${item.title}》内容块。`, "neutral");
  }

  courseSelect.addEventListener("change", async () => {
    try {
      await loadContent(courseSelect.value);
    } catch (error) {
      console.error("Failed to load course content:", error);
      setFormStatus(`读取失败：${error.message}`, "error");
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!selectedSlug) {
      setFormStatus("请先选择课程。", "error");
      return;
    }

    const payload = {
      summary: fields.summary.value,
      subtitle: fields.subtitle.value,
      tags: fields.tags.value,
      entryLabel: fields.entryLabel.value,
      entryValue: fields.entryValue.value
    };

    setFormStatus("正在保存内容块...", "neutral");

    try {
      const response = await fetch(`./api/admin/content/${encodeURIComponent(selectedSlug)}`, {
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

      await loadContent(selectedSlug);
      setFormStatus(`《${result.item.title}》内容块已保存。`, "success");
    } catch (error) {
      console.error("Failed to save content:", error);
      setFormStatus(`保存失败：${error.message}`, "error");
    }
  });

  async function init() {
    try {
      const payload = await loadCourseOptions();
      setPageStatus(
        payload.dataSource === "d1"
          ? "内容中心已连接 D1，可直接编辑课程内容块。"
          : "当前使用静态回退数据，待 D1 连通后可持久化。"
      );

      if (courses.length > 0) {
        await loadContent(courses[0].slug);
      }
    } catch (error) {
      console.error("Failed to initialize content editor:", error);
      setPageStatus(`初始化失败：${error.message}`);
      setFormStatus("内容中心暂时不可用。", "error");
    }
  }

  init();
})();
