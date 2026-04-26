(function () {
  const countNode = document.getElementById("overview-course-total");
  const grid = document.getElementById("overview-course-grid");

  if (!grid) {
    return;
  }

  const templateCards = Array.from(grid.querySelectorAll(".course-card[data-course-id]"));
  const templateMap = new Map(
    templateCards.map((card) => [card.dataset.courseId, card.cloneNode(true)])
  );

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function renderTags(node, tags) {
    if (!node || !Array.isArray(tags)) {
      return;
    }

    node.innerHTML = tags
      .slice(0, 4)
      .map((tag) => `<span class="course-tag">${escapeHtml(tag)}</span>`)
      .join("");
  }

  function applyCoverImage(card, course) {
    const cover = card.querySelector(".course-cover");
    const scene = card.querySelector(".course-scene");

    if (!cover || !course.coverImageUrl) {
      return;
    }

    cover.style.backgroundImage = `linear-gradient(180deg, rgba(10,15,26,0.15), rgba(10,15,26,0.42)), url("${course.coverImageUrl}")`;
    cover.style.backgroundSize = "cover";
    cover.style.backgroundPosition = "center";

    if (scene) {
      scene.style.opacity = "0.16";
    }
  }

  function hydrateCard(card, course, index) {
    card.dataset.courseId = course.slug || course.id;
    card.style.order = String(index);
    card.href = course.route;
    card.hidden = false;

    const badge = card.querySelector(".course-badge");
    const stage = card.querySelector(".course-stage");
    const title = card.querySelector(".course-cover-title");
    const meta = card.querySelector(".course-cover-meta");
    const summary = card.querySelector(".course-summary");
    const tags = card.querySelector(".course-tags");
    const progressLabel = card.querySelector(".course-progress-label");
    const progressValue = card.querySelector(".course-progress-value");
    const enter = card.querySelector(".course-enter");

    if (badge) {
      badge.textContent =
        course.sourceType === "full-flow" ? "当前课程" : "内容页课程";
    }

    if (stage) {
      stage.textContent = `${course.gradeLabel || course.stage} · ${course.genre}`;
    }

    if (title) {
      title.textContent = `《${course.title}》`;
    }

    if (meta) {
      meta.textContent = `${course.author} · ${course.subtitle || course.genre}`;
    }

    if (summary) {
      summary.textContent = course.summary || "课程摘要正在补充中。";
    }

    renderTags(tags, course.tags || []);

    if (progressLabel) {
      progressLabel.textContent = course.entryLabel || "当前入口";
    }

    if (progressValue) {
      progressValue.textContent = course.entryValue || "独立课程内容页";
    }

    if (enter) {
      enter.textContent = "进入课程";
      enter.classList.toggle("secondary", course.sourceType !== "full-flow");
    }

    applyCoverImage(card, course);
  }

  function createGenericCard(course, index) {
    const anchor = document.createElement("a");
    anchor.className = "course-card animate-in";
    anchor.style.animationDelay = `${0.1 + index * 0.02}s`;
    anchor.innerHTML = `
      <div class="course-cover" style="background: linear-gradient(135deg, #173454 0%, #0f766e 100%);">
        <div class="course-cover-top">
          <span class="course-badge">内容页课程</span>
          <span class="course-stage"></span>
        </div>
        <div class="course-cover-title"></div>
        <div class="course-cover-meta"></div>
      </div>
      <div class="course-body">
        <div class="course-summary"></div>
        <div class="course-tags"></div>
        <div class="course-footer">
          <div class="course-progress">
            <span class="course-progress-label"></span>
            <span class="course-progress-value"></span>
          </div>
          <span class="course-enter secondary">进入课程</span>
        </div>
      </div>
    `;

    hydrateCard(anchor, course, index);
    return anchor;
  }

  async function loadCourses() {
    try {
      const response = await fetch("./api/courses", {
        headers: {
          accept: "application/json"
        },
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();
      const items = Array.isArray(payload.items) ? payload.items : [];
      const fragment = document.createDocumentFragment();

      items.forEach((course, index) => {
        const template = templateMap.get(course.slug || course.id);
        const card = template ? template.cloneNode(true) : createGenericCard(course, index);

        hydrateCard(card, course, index);
        fragment.appendChild(card);
      });

      grid.replaceChildren(fragment);

      if (countNode) {
        countNode.textContent = String(items.length);
      }
    } catch (error) {
      console.error("Failed to load overview courses:", error);
    }
  }

  loadCourses();
})();
