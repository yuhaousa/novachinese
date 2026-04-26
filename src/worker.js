import { courses } from "./course-data.js";

const courseSeedMap = new Map(courses.map((course) => [course.slug, course]));
const courseSeedOrder = new Map(courses.map((course, index) => [course.slug, index]));

function json(data, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("content-type", "application/json; charset=utf-8");

  return new Response(JSON.stringify(data, null, 2), {
    ...init,
    headers
  });
}

async function getDatabaseStatus(env) {
  if (!env.DB) {
    return {
      configured: false,
      connected: false,
      message: "D1 binding not configured in wrangler.jsonc yet."
    };
  }

  try {
    const result = await env.DB.prepare("SELECT COUNT(*) AS total FROM courses").first();

    return {
      configured: true,
      connected: true,
      message: "D1 connection succeeded.",
      courseCount: result?.total ?? 0
    };
  } catch (error) {
    return {
      configured: true,
      connected: false,
      message: "D1 binding exists but the schema is not ready yet.",
      error: String(error)
    };
  }
}

function enrichCourse(rawCourse, source) {
  const seed = courseSeedMap.get(rawCourse.slug) || {};
  const sourceType =
    rawCourse.sourceType ||
    (rawCourse.primaryPageType === "landing" ? "full-flow" : "content-page") ||
    seed.sourceType ||
    "content-page";
  const status = rawCourse.status || seed.status || "draft";
  const route =
    rawCourse.route ||
    seed.route ||
    (sourceType === "full-flow"
      ? "/index.html"
      : `/course-content.html?course=${rawCourse.slug}`);
  const published = status === "published";

  return {
    ...seed,
    ...rawCourse,
    route,
    sourceType,
    status,
    pageTypeLabel: sourceType === "full-flow" ? "完整学习流程" : "独立内容页",
    entryLabel:
      seed.entryLabel ||
      (sourceType === "full-flow" ? "当前演示进度" : "当前入口"),
    entryValue:
      seed.entryValue ||
      (sourceType === "full-flow" ? "完整学习流程已接入" : "独立课程内容页"),
    adminStatusLabel: published
      ? sourceType === "full-flow"
        ? "已发布"
        : "内容已接入"
      : "草稿",
    adminStatusTone: published
      ? sourceType === "full-flow"
        ? "green"
        : "blue"
      : "amber",
    dataSource: source
  };
}

async function getCourses(env) {
  if (!env.DB) {
    return {
      dataSource: "seed-fallback",
      items: courses.map((course) => enrichCourse(course, "seed-fallback"))
    };
  }

  try {
    const query = `
      SELECT
        c.slug,
        c.title,
        c.author,
        c.stage,
        c.genre,
        c.status,
        (
          SELECT cp.route_path
          FROM course_pages cp
          WHERE cp.course_id = c.id AND cp.is_published = 1
          ORDER BY cp.sort_order ASC
          LIMIT 1
        ) AS route,
        (
          SELECT cp.page_type
          FROM course_pages cp
          WHERE cp.course_id = c.id AND cp.is_published = 1
          ORDER BY cp.sort_order ASC
          LIMIT 1
        ) AS primaryPageType
      FROM courses c
    `;

    const result = await env.DB.prepare(query).all();
    const rows = Array.isArray(result.results) ? result.results : [];

    if (rows.length === 0) {
      return {
        dataSource: "seed-fallback",
        items: courses.map((course) => enrichCourse(course, "seed-fallback"))
      };
    }

    const items = rows
      .map((row) => enrichCourse(row, "d1"))
      .sort((left, right) => {
        const leftIndex = courseSeedOrder.get(left.slug) ?? Number.MAX_SAFE_INTEGER;
        const rightIndex = courseSeedOrder.get(right.slug) ?? Number.MAX_SAFE_INTEGER;

        return leftIndex - rightIndex;
      });

    return {
      dataSource: "d1",
      items
    };
  } catch {
    return {
      dataSource: "seed-fallback",
      items: courses.map((course) => enrichCourse(course, "seed-fallback"))
    };
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return json({
        ok: true,
        service: "nova-chinese",
        runtime: "cloudflare-workers",
        now: new Date().toISOString()
      });
    }

    if (url.pathname === "/api/courses") {
      const courseData = await getCourses(env);

      return json({
        ok: true,
        total: courseData.items.length,
        dataSource: courseData.dataSource,
        items: courseData.items
      });
    }

    if (url.pathname === "/api/db/status") {
      const database = await getDatabaseStatus(env);

      return json({
        ok: true,
        database
      });
    }

    return env.ASSETS.fetch(request);
  }
};
