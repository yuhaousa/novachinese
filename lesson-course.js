(function () {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("course");
  const rawPath = (window.location.pathname.split("/").pop() || "index.html").replace(/^$/, "index.html");
  const path = rawPath.includes(".") ? rawPath : rawPath + ".html";

  const moduleLabels = {
    "index.html": "AI教学 Demo",
    "text.html": "精读与内容理解",
    "emotion.html": "结构分析与情感曲线",
    "writing.html": "仿写训练",
    "chat.html": "AI 对话"
  };

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $$(selector, root) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  function text(selector, value, root) {
    const node = $(selector, root);

    if (node && value) {
      node.textContent = value;
    }
  }

  function html(selector, value, root) {
    const node = $(selector, root);

    if (node && value) {
      node.innerHTML = value;
    }
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function titleWithBook(course, suffix) {
    return "《" + course.title + "》" + (suffix ? "·" + suffix : "");
  }

  function courseTags(course) {
    return Array.isArray(course.tags) && course.tags.length > 0
      ? course.tags
      : [course.genre, course.stage, "阅读理解"].filter(Boolean);
  }

  function splitSummary(course) {
    const summary = course.summary || course.subtitle || "本课程内容正在持续完善中。";
    const parts = summary
      .split(/[。！？!?]/)
      .map((item) => item.trim())
      .filter(Boolean);

    return parts.length ? parts : [summary];
  }

  function inferTheme(course) {
    const source = [course.title, course.genre, course.summary, course.subtitle, courseTags(course).join(" ")]
      .join(" ");

    if (/春|花|草|景|自然|写景/.test(source)) {
      return {
        scene: "自然景物",
        mood: "明朗",
        method: "多感官描写",
        writing: "写一段你熟悉的季节景色",
        image: "🌿"
      };
    }

    if (/背影|散步|父|母|亲情|家庭/.test(source)) {
      return {
        scene: "生活细节",
        mood: "温情",
        method: "动作与细节描写",
        writing: "写一段家人之间的小事",
        image: "🧡"
      };
    }

    if (/童年|百草园|成长|校园/.test(source)) {
      return {
        scene: "童年空间",
        mood: "自由",
        method: "场景对比",
        writing: "写一处童年或校园空间",
        image: "🌱"
      };
    }

    if (/诗|词|古文|楼|桃花源/.test(source)) {
      return {
        scene: "文本意境",
        mood: "含蓄",
        method: "意象与主旨分析",
        writing: "写一段由景入情的文字",
        image: "📜"
      };
    }

    return {
      scene: course.genre || "文本内容",
      mood: "深入",
      method: "关键词与结构分析",
      writing: "写一段与本课主题相关的文字",
      image: "📖"
    };
  }

  function getOverview(course) {
    return [
      ["作者", course.author || "待补充"],
      ["学段", course.stage || course.gradeLabel || "初中语文阅读"],
      ["体裁", course.genre || "阅读文本"],
      ["主题", course.subtitle || course.summary || "围绕本课内容进行阅读理解与表达训练。"]
    ];
  }

  function preserveCourseQuery() {
    if (!slug) {
      return;
    }

    $$("a[href]").forEach((anchor) => {
      const raw = anchor.getAttribute("href");

      if (!raw || raw.startsWith("#") || raw.startsWith("http") || raw.startsWith("mailto:")) {
        return;
      }

      if (!/^(index|text|emotion|writing|chat|course-content)\.html(?:\?|$)/.test(raw)) {
        return;
      }

      const url = new URL(raw, window.location.href);
      url.searchParams.set("course", slug);
      anchor.setAttribute("href", url.pathname.split("/").pop() + url.search);
    });
  }

  async function loadCourse() {
    if (!slug) {
      return null;
    }

    const response = await fetch("./api/course-content/" + encodeURIComponent(slug), {
      headers: { accept: "application/json" },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }

    const payload = await response.json();
    return payload.item || null;
  }

  function applyCommon(course) {
    const suffix = moduleLabels[path] || "课程学习";
    document.title = "NovaRead AI语文 · " + titleWithBook(course, suffix);
    text(".breadcrumb span", "《" + course.title + "》");
    preserveCourseQuery();
  }

  function applyIndex(course) {
    const theme = inferTheme(course);
    text(".hero-vertical-title", course.title);
    text(".hero-stamp", course.author || "AI");
    html(".hero-content h1", "<em>《" + escapeHtml(course.title) + "》</em>" + escapeHtml(moduleLabels[path]));
    text(".hero-subtitle", course.subtitle || course.summary || "把一篇课文升级为可互动的阅读训练系统");

    const featureCards = $$(".feature-card");
    const tags = courseTags(course);
    [
      ["AI意境还原", "围绕“" + theme.scene + "”还原文本情境"],
      ["写作结构拆解", "拆解《" + course.title + "》的结构与线索"],
      ["情感曲线", "观察“" + theme.mood + "”等情感变化"],
      ["仿写反馈", "练习“" + theme.method + "”并获得反馈"],
      ["作者对话", "与" + (course.author || "作者") + "对话，走近作品思想"]
    ].forEach((item, index) => {
      const card = featureCards[index];
      if (!card) return;
      text(".feature-title", item[0], card);
      html(".feature-desc", escapeHtml(item[1]).replace(/，/g, "<br/>"));
    });

    $$(".goal-item").forEach((item, index) => {
      const tag = tags[index] || ["理解文本内容", "把握作者情感", "掌握表达手法", "完成表达迁移"][index];
      text(".goal-title", tag, item);
      text(".goal-desc", index === 3 ? theme.writing : "结合本课内容完成阅读训练", item);
    });
  }

  function applyText(course) {
    const theme = inferTheme(course);
    const parts = splitSummary(course);
    const tags = courseTags(course);

    html(".page-title", "《" + escapeHtml(course.title) + "》<span class=\"accent\">·</span>精读与内容理解");
    const readingCard = $(".reading-card");

    if (readingCard) {
      const paragraphs = [
        course.subtitle || "先从课程导语进入文本，建立整体阅读期待。",
        parts[0],
        parts[1] || "抓住作者、体裁和主题，理解文章核心内容。",
        parts[2] || "结合关键词和表达手法，分析文本如何传达情感。",
        "本课重点：" + tags.slice(0, 3).join("、")
      ].filter(Boolean);

      const labels = ["导入", theme.scene, "内容概括", theme.method, "学习重点"];
      readingCard.querySelectorAll(".paragraph").forEach((node, index) => {
        text(".paragraph-text", paragraphs[index] || paragraphs[paragraphs.length - 1], node);
        const tagNode = $(".paragraph-tags", node);
        if (tagNode) {
          tagNode.innerHTML = "<span class=\"tag " + (index === 2 ? "current" : "info") + "\">" + escapeHtml(labels[index] || "阅读") + "</span>";
        }
      });
    }

    const overview = getOverview(course);
    $$(".u-card").forEach((card, index) => {
      const item = overview[index] || overview[0];
      text(".u-head", item[0], card);
      const list = $(".u-list", card);

      if (list) {
        list.innerHTML = String(item[1])
          .split(/[，、]/)
          .slice(0, 4)
          .map((entry) => "<li>" + escapeHtml(entry.trim()) + "</li>")
          .join("");
      }

      text(".u-text", item[1], card);
    });

    $$(".question-chip-text").forEach((node, index) => {
      node.textContent = [
        "《" + course.title + "》的核心主题是什么？",
        "本课最重要的表达手法是什么？",
        "如何概括作者的情感变化？"
      ][index] || "继续提问";
    });
  }

  function applyEmotion(course) {
    const theme = inferTheme(course);
    const tags = courseTags(course);
    const parts = splitSummary(course);

    html(".page-title", "《" + escapeHtml(course.title) + "》<span class=\"accent\">·</span>结构分析与情感曲线");
    text(".page-subtitle", course.subtitle || "看见文章结构，也看见作者心境");

    const nodes = [
      ["进入文本", "先建立阅读背景"],
      ["抓住线索", course.genre || "梳理内容"],
      [course.title + "\n(核心)", theme.scene],
      ["理解情感", theme.mood + "与变化"],
      ["表达迁移", theme.method]
    ];

    $$(".struct-node").forEach((node, index) => {
      const item = nodes[index] || nodes[0];
      html(".struct-name", escapeHtml(item[0]).replace(/\n/g, "<br/>"), node);
      text(".struct-desc", item[1], node);
    });

    $$(".wc-word").forEach((node, index) => {
      node.textContent = tags[index] || [theme.mood, theme.scene, theme.method, course.genre, course.stage][index] || "阅读";
    });

    const techniqueItems = $$(".technique-item");
    tags.slice(0, 5).forEach((tag, index) => {
      const row = techniqueItems[index];
      if (!row) return;
      text(".technique-name", tag, row);
      text(".technique-detail", "结合《" + course.title + "》分析“" + tag + "”如何服务主题。", row);
    });

    text(".emotion-tooltip", "在《" + course.title + "》核心段落处\n观察情感变化");
    text(".ai-summary-text", parts.join("。") + "。");
  }

  function applyWriting(course) {
    const theme = inferTheme(course);

    html(".train-hero-title", "《" + escapeHtml(course.title) + "》<span style=\"color:#fde68a;margin:0 6px;\">·</span>仿写训练");
    text(".train-hero-subtitle", "从阅读《" + course.title + "》走向表达");
    html(".topic-pill", "<em>题目：</em>&nbsp;" + escapeHtml(theme.writing));
    text(".compose-area", "请围绕《" + course.title + "》的主题，选择一个具体场景，尝试运用“" + theme.method + "”。先写清楚你看到的细节，再写出细节背后的情感。");
    text(".example-text", "示例方向：先选择一个具体画面，再抓住颜色、声音、动作或人物细节，最后让情感自然浮现。写作时不必直接说理，而要让读者从细节中读出《" + course.title + "》带来的启发。");

    $$(".suggestion-list li").forEach((node, index) => {
      node.textContent = [
        "增加与《" + course.title + "》主题相关的具体细节，避免泛泛而谈。",
        "尝试运用“" + theme.method + "”，让表达更有层次。",
        "结尾可以呼应本课的核心情感：" + theme.mood + "。",
        "注意句式长短变化，让文字更有节奏。"
      ][index];
    });

    text(".chat-author-name", course.author || "作者");
    text(".chat-avatar.author", (course.author || "作").slice(0, 1));
    text(".chat-bubble.from-author", "写作时，可以先问自己：这篇《" + course.title + "》最打动我的是什么？把这个感受放进一个具体画面里，表达就会更真实。");
  }

  function applyChat(course) {
    const author = course.author || "作者";
    html(".page-title", "AI 对话<span class=\"accent\">·</span>与" + escapeHtml(author) + "对谈");
    text(".page-subtitle", "围绕《" + course.title + "》提问，理解作者、文本和表达方法。");
    text(".persona-name", author);
    $$(".history-time").forEach((node) => {
      node.textContent = node.textContent.replace(/朱自清/g, author);
    });
    text(".chat-header-name", author);
    html(".chat-context", "当前话题：<strong>《" + escapeHtml(course.title) + "》· " + escapeHtml(course.genre || "文本解读") + "</strong><span class=\"chat-context-close\">×</span>");
    $$(".msg:not(.from-user) .msg-name").forEach((node) => {
      node.textContent = author;
    });
    $$(".msg-avatar.bot, .chat-header-avatar").forEach((node) => {
      node.textContent = author.slice(0, 1);
    });
    const firstMessage = $(".chat-stream .msg:not(.from-user) .msg-bubble.bot");
    if (firstMessage) {
      firstMessage.innerHTML = "你好，林同学。我们现在一起阅读《" + escapeHtml(course.title) + "》。你可以问我作品内容、作者情感、写作手法，或把你不理解的句子发给我。<br/>" + escapeHtml(course.summary || course.subtitle || "");
    }
    const input = $(".chat-input-area");
    if (input) {
      input.setAttribute("placeholder", "向" + author + "提问，或粘贴一句你想讨论的原文…");
    }
    text(".author-mini-name", author);
  }

  function applyCourse(course) {
    if (!course) {
      return;
    }

    applyCommon(course);

    if (path === "index.html") applyIndex(course);
    if (path === "text.html") applyText(course);
    if (path === "emotion.html") applyEmotion(course);
    if (path === "writing.html") applyWriting(course);
    if (path === "chat.html") applyChat(course);
  }

  document.addEventListener("DOMContentLoaded", async function () {
    preserveCourseQuery();

    if (!slug || !["index.html", "text.html", "emotion.html", "writing.html", "chat.html"].includes(path)) {
      return;
    }

    try {
      applyCourse(await loadCourse());
    } catch (error) {
      console.error("Failed to apply selected course data:", error);
    }
  });
})();
