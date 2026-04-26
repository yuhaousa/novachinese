(function () {
  const countNode = document.getElementById("overview-course-total");
  const grid = document.getElementById("overview-course-grid");

  if (!grid) {
    return;
  }

  function renderTags(node, tags) {
    if (!node || !Array.isArray(tags)) {
      return;
    }

    node.innerHTML = tags
      .slice(0, 4)
      .map((tag) => `<span class="course-tag">${tag}</span>`)
      .join("");
  }

  function hydrateCard(card, course, index) {
    card.style.order = String(index);
    card.href = course.route;

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
      stage.textContent = `${course.gradeLabel} · ${course.genre}`;
    }

    if (title) {
      title.textContent = `《${course.title}》`;
    }

    if (meta) {
      meta.textContent = `${course.author} · ${course.subtitle}`;
    }

    if (summary) {
      summary.textContent = course.summary;
    }

    renderTags(tags, course.tags);

    if (progressLabel) {
      progressLabel.textContent = course.entryLabel;
    }

    if (progressValue) {
      progressValue.textContent = course.entryValue;
    }

    if (enter) {
      enter.textContent = "进入课程";
      enter.classList.toggle("secondary", course.sourceType !== "full-flow");
    }
  }

  async function loadCourses() {
    try {
      const response = await fetch("./api/courses", {
        headers: {
          accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();
      const items = Array.isArray(payload.items) ? payload.items : [];
      const cards = Array.from(grid.querySelectorAll(".course-card[data-course-id]"));
      const cardMap = new Map(cards.map((card) => [card.dataset.courseId, card]));

      items.forEach((course, index) => {
        const card = cardMap.get(course.id || course.slug);

        if (card) {
          hydrateCard(card, course, index);
        }
      });

      cards.forEach((card) => {
        const exists = items.some(
          (course) => (course.id || course.slug) === card.dataset.courseId
        );

        card.hidden = !exists;
      });

      if (countNode) {
        countNode.textContent = String(items.length);
      }
    } catch (error) {
      console.error("Failed to load overview courses:", error);
    }
  }

  loadCourses();
})();
