(function () {
  const form = document.getElementById("admin-course-create-form");
  const statusNode = document.getElementById("admin-course-create-status");
  const submitButton = document.getElementById("admin-course-create-submit");
  const resetButton = document.getElementById("admin-course-create-reset");
  const coverFileInput = document.getElementById("create-course-cover-file");
  const coverPreview = document.getElementById("create-course-cover-preview");

  if (!form) {
    return;
  }

  const fields = {
    slug: document.getElementById("create-course-slug"),
    title: document.getElementById("create-course-title"),
    author: document.getElementById("create-course-author"),
    stage: document.getElementById("create-course-stage"),
    genre: document.getElementById("create-course-genre"),
    sourceType: document.getElementById("create-course-source-type"),
    route: document.getElementById("create-course-route"),
    status: document.getElementById("create-course-status")
  };

  function syncCoverPreview(file) {
    if (!coverPreview) {
      return;
    }

    if (!file) {
      coverPreview.removeAttribute("src");
      coverPreview.style.display = "none";
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    coverPreview.src = objectUrl;
    coverPreview.style.display = "block";
  }

  function setStatus(message, tone) {
    if (!statusNode) {
      return;
    }

    statusNode.textContent = message;
    statusNode.dataset.tone = tone || "neutral";
  }

  function syncRoute() {
    const slug = fields.slug.value.trim() || "new-course";

    if (fields.sourceType.value === "full-flow") {
      fields.route.value = "/index.html";
      return;
    }

    fields.route.value = `/course-content.html?course=${slug}`;
  }

  fields.slug.addEventListener("input", () => {
    if (fields.sourceType.value === "content-page") {
      syncRoute();
    }
  });

  fields.sourceType.addEventListener("change", syncRoute);

  resetButton.addEventListener("click", () => {
    form.reset();
    fields.sourceType.value = "content-page";
    syncRoute();
    syncCoverPreview(null);
    setStatus("表单已重置。", "neutral");
    fields.slug.focus();
  });

  coverFileInput?.addEventListener("change", () => {
    syncCoverPreview(coverFileInput.files?.[0] || null);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
      slug: fields.slug.value.trim(),
      title: fields.title.value,
      author: fields.author.value,
      stage: fields.stage.value,
      genre: fields.genre.value,
      sourceType: fields.sourceType.value,
      route: fields.route.value,
      status: fields.status.value
    };

    submitButton.disabled = true;
    resetButton.disabled = true;
    setStatus("正在创建课程...", "neutral");

    try {
      const response = await fetch("./api/admin/courses", {
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

      const coverFile = coverFileInput?.files?.[0] || null;

      if (coverFile) {
        setStatus(`《${result.item.title}》已创建，正在上传封面...`, "neutral");

        const formData = new FormData();
        formData.append("slug", result.item.slug);
        formData.append("file", coverFile);

        const uploadResponse = await fetch("./api/admin/assets/upload", {
          method: "POST",
          body: formData
        });
        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadResult.ok) {
          throw new Error(uploadResult.error || `HTTP ${uploadResponse.status}`);
        }
      }

      setStatus(`《${result.item.title}》已创建，正在跳转到课程编辑页...`, "success");
      location.href = `admin-course-edit.html?course=${encodeURIComponent(result.item.slug)}`;
    } catch (error) {
      console.error("Failed to create course:", error);
      setStatus(`创建失败：${error.message}`, "error");
    } finally {
      submitButton.disabled = false;
      resetButton.disabled = false;
    }
  });

  syncRoute();
  syncCoverPreview(null);
})();
