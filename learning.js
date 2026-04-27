(function () {
  const recentList = document.getElementById("recent-course-list");
  const timeline = document.getElementById("learning-timeline");
  const totalMinutesNode = document.getElementById("total-minutes");
  const recentCountNode = document.getElementById("recent-count");
  const avgProgressNode = document.getElementById("avg-progress");

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function metricFor(course, index) {
    const seed = Array.from(String(course.slug || course.id || index)).reduce(
      (sum, char) => sum + char.charCodeAt(0),
      0
    );

    return {
      minutes: 18 + (seed % 54),
      progress: 36 + (seed % 57),
      lastLabel: index === 0 ? "今天" : index === 1 ? "昨天" : `${index + 1} 天前`
    };
  }

  function courseHref(course) {
    return course.route || `course-content.html?course=${encodeURIComponent(course.slug || "")}`;
  }

  function renderCourse(course, index) {
    const metric = metricFor(course, index);
    const cover = course.coverImageUrl
      ? `<img src="${escapeHtml(course.coverImageUrl)}" alt="${escapeHtml(course.title)}" />`
      : `《${escapeHtml(course.title || "课程").slice(1, 3)}》`;

    return `
      <article class="recent-course">
        <a class="recent-cover" href="${escapeHtml(courseHref(course))}">${cover}</a>
        <div>
          <a class="recent-title" href="${escapeHtml(courseHref(course))}">《${escapeHtml(course.title)}》</a>
          <div class="recent-meta">${escapeHtml(course.author || "作者待补充")} · ${escapeHtml(course.stage || course.gradeLabel || "初中语文")} · 学习 ${metric.minutes} min · ${metric.lastLabel}</div>
          <div class="recent-progress" aria-label="完成度 ${metric.progress}%"><span style="width:${metric.progress}%"></span></div>
        </div>
        <a class="recent-action" href="${escapeHtml(courseHref(course))}">继续学习</a>
      </article>`;
  }

  function renderTimeline(courses) {
    const items = courses.slice(0, 4).map((course, index) => {
      const metric = metricFor(course, index);
      return `
        <div class="timeline-item">
          <div class="timeline-dot">${index + 1}</div>
          <div>
            <div class="timeline-title">学习《${escapeHtml(course.title)}》</div>
            <div class="timeline-meta">${metric.lastLabel} · ${metric.minutes} min · 完成度 ${metric.progress}%</div>
          </div>
        </div>`;
    });

    timeline.innerHTML = items.join("");
  }

  async function loadCourses() {
    try {
      const response = await fetch("./api/courses", {
        headers: { accept: "application/json" },
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error("HTTP " + response.status);
      }

      const payload = await response.json();
      const courses = Array.isArray(payload.items) ? payload.items.slice(0, 6) : [];
      const metrics = courses.map(metricFor);
      const totalMinutes = metrics.reduce((sum, item) => sum + item.minutes, 0);
      const avgProgress = metrics.length
        ? Math.round(metrics.reduce((sum, item) => sum + item.progress, 0) / metrics.length)
        : 0;

      recentList.innerHTML = courses.map(renderCourse).join("");
      renderTimeline(courses);

      totalMinutesNode.innerHTML = `${totalMinutes}<small>min</small>`;
      recentCountNode.innerHTML = `${courses.length}<small>门</small>`;
      avgProgressNode.innerHTML = `${avgProgress}<small>%</small>`;
    } catch (error) {
      console.error("Failed to load learning data:", error);
      recentList.innerHTML = "<div class=\"recent-meta\">暂时无法加载学习记录。</div>";
      timeline.innerHTML = "";
    }
  }

  if (recentList) {
    loadCourses();
  }
})();
