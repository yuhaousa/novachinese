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

function errorResponse(status, message, extra = {}) {
  return json(
    {
      ok: false,
      error: message,
      ...extra
    },
    { status }
  );
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function normalizeRoute(route, slug, sourceType) {
  const fallback =
    sourceType === "full-flow"
      ? "/index.html"
      : `/course-content.html?course=${slug}`;
  const trimmed = typeof route === "string" ? route.trim() : "";

  if (!trimmed) {
    return fallback;
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function normalizeAdminPayload(slug, body) {
  if (!body || typeof body !== "object") {
    return {
      error: "Request body must be valid JSON."
    };
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const author = typeof body.author === "string" ? body.author.trim() : "";
  const stage = typeof body.stage === "string" ? body.stage.trim() : "";
  const genre = typeof body.genre === "string" ? body.genre.trim() : "";
  const sourceType =
    body.sourceType === "full-flow" ? "full-flow" : "content-page";
  const status = body.status === "draft" ? "draft" : "published";

  if (!title) {
    return { error: "Title is required." };
  }

  if (!author) {
    return { error: "Author is required." };
  }

  if (!stage) {
    return { error: "Stage is required." };
  }

  if (!genre) {
    return { error: "Genre is required." };
  }

  return {
    title,
    author,
    stage,
    genre,
    sourceType,
    status,
    route: normalizeRoute(body.route, slug, sourceType)
  };
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
          WHERE cp.course_id = c.id
          ORDER BY cp.sort_order ASC
          LIMIT 1
        ) AS route,
        (
          SELECT cp.page_type
          FROM course_pages cp
          WHERE cp.course_id = c.id
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

async function getCourseRecord(env, slug) {
  if (!env.DB) {
    return null;
  }

  const query = `
    SELECT
      c.id,
      c.slug,
      c.title,
      c.author,
      c.stage,
      c.genre,
      c.status,
      (
        SELECT cp.id
        FROM course_pages cp
        WHERE cp.course_id = c.id
        ORDER BY cp.sort_order ASC
        LIMIT 1
      ) AS pageId,
      (
        SELECT cp.route_path
        FROM course_pages cp
        WHERE cp.course_id = c.id
        ORDER BY cp.sort_order ASC
        LIMIT 1
      ) AS route,
      (
        SELECT cp.page_type
        FROM course_pages cp
        WHERE cp.course_id = c.id
        ORDER BY cp.sort_order ASC
        LIMIT 1
      ) AS primaryPageType
    FROM courses c
    WHERE c.slug = ?
    LIMIT 1
  `;

  return env.DB.prepare(query).bind(slug).first();
}

async function updateCourse(env, slug, payload) {
  const course = await getCourseRecord(env, slug);

  if (!course) {
    return {
      error: "Course not found.",
      status: 404
    };
  }

  const pageType = payload.sourceType === "full-flow" ? "landing" : "content";

  await env.DB.prepare(
    `
      UPDATE courses
      SET
        title = ?,
        author = ?,
        stage = ?,
        genre = ?,
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `
  )
    .bind(
      payload.title,
      payload.author,
      payload.stage,
      payload.genre,
      payload.status,
      course.id
    )
    .run();

  if (course.pageId) {
    await env.DB.prepare(
      `
        UPDATE course_pages
        SET
          page_type = ?,
          route_path = ?,
          is_published = 1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `
    )
      .bind(pageType, payload.route, course.pageId)
      .run();
  } else {
    const pageId = `page-${slug}-${Date.now().toString(36)}`;

    await env.DB.prepare(
      `
        INSERT INTO course_pages (
          id,
          course_id,
          page_type,
          route_path,
          sort_order,
          is_published,
          created_at,
          updated_at
        )
        VALUES (?, ?, ?, ?, 10, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `
    )
      .bind(pageId, course.id, pageType, payload.route)
      .run();
  }

  const courseData = await getCourses(env);
  const updated = courseData.items.find((item) => item.slug === slug) || null;

  return {
    item: updated
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (pathname === "/api/health") {
      return json({
        ok: true,
        service: "nova-chinese",
        runtime: "cloudflare-workers",
        now: new Date().toISOString()
      });
    }

    if (pathname === "/api/courses") {
      const courseData = await getCourses(env);

      return json({
        ok: true,
        total: courseData.items.length,
        dataSource: courseData.dataSource,
        items: courseData.items
      });
    }

    if (pathname === "/api/admin/courses") {
      const courseData = await getCourses(env);

      return json({
        ok: true,
        total: courseData.items.length,
        dataSource: courseData.dataSource,
        items: courseData.items
      });
    }

    if (pathname.startsWith("/api/admin/courses/")) {
      if (!env.DB) {
        return errorResponse(503, "D1 is not configured for admin updates.");
      }

      const slug = decodeURIComponent(pathname.replace("/api/admin/courses/", "").trim());

      if (!slug) {
        return errorResponse(400, "Course slug is required.");
      }

      if (request.method !== "POST") {
        return errorResponse(405, "Method not allowed.");
      }

      const body = await readJson(request);
      const payload = normalizeAdminPayload(slug, body);

      if (payload.error) {
        return errorResponse(400, payload.error);
      }

      const result = await updateCourse(env, slug, payload);

      if (result.error) {
        return errorResponse(result.status || 500, result.error);
      }

      return json({
        ok: true,
        item: result.item
      });
    }

    if (pathname === "/api/db/status") {
      const database = await getDatabaseStatus(env);

      return json({
        ok: true,
        database
      });
    }

    return env.ASSETS.fetch(request);
  }
};
