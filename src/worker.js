import { courses } from "./course-data.js";

const courseSeedMap = new Map(courses.map((course) => [course.slug, course]));
const courseSeedOrder = new Map(courses.map((course, index) => [course.slug, index]));
const textEncoder = new TextEncoder();

const ADMIN_COOKIE_NAME = "nova_admin_session";
const ADMIN_SESSION_MAX_AGE = 60 * 60 * 12;
const PUBLIC_BLOCK_KEYS = ["subtitle", "tags", "entryLabel", "entryValue"];

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

function parseCookies(headerValue) {
  return String(headerValue || "")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((accumulator, item) => {
      const separator = item.indexOf("=");

      if (separator === -1) {
        return accumulator;
      }

      const key = item.slice(0, separator).trim();
      const value = item.slice(separator + 1).trim();
      accumulator[key] = value;
      return accumulator;
    }, {});
}

function bytesToBase64Url(bytes) {
  let binary = "";

  bytes.forEach((value) => {
    binary += String.fromCharCode(value);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4 || 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

async function signValue(value, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, textEncoder.encode(value));
  return bytesToBase64Url(new Uint8Array(signature));
}

async function createAdminSession(secret, username = "admin") {
  const payload = {
    username,
    expiresAt: Date.now() + ADMIN_SESSION_MAX_AGE * 1000
  };
  const encodedPayload = bytesToBase64Url(textEncoder.encode(JSON.stringify(payload)));
  const signature = await signValue(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

async function verifyAdminSession(token, secret) {
  if (!token || !secret || !token.includes(".")) {
    return false;
  }

  const [encodedPayload, providedSignature] = token.split(".");

  if (!encodedPayload || !providedSignature) {
    return false;
  }

  const expectedSignature = await signValue(encodedPayload, secret);

  if (expectedSignature !== providedSignature) {
    return false;
  }

  try {
    const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(encodedPayload)));
    return typeof payload.expiresAt === "number" && payload.expiresAt > Date.now();
  } catch {
    return false;
  }
}

function buildSessionCookie(token) {
  return `${ADMIN_COOKIE_NAME}=${token}; Max-Age=${ADMIN_SESSION_MAX_AGE}; Path=/; HttpOnly; Secure; SameSite=Lax`;
}

function buildExpiredSessionCookie() {
  return `${ADMIN_COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax`;
}

function isAdminPagePath(pathname) {
  return /^\/admin(?:-[^/]+)?\.html$/.test(pathname) && pathname !== "/admin-login.html";
}

function isAdminApiPath(pathname) {
  return pathname.startsWith("/api/admin");
}

function sanitizeAdminPath(candidate) {
  return /^\/admin(?:-[^/]+)?\.html(?:\?.*)?$/.test(candidate || "")
    ? candidate
    : "/admin.html";
}

function safeSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

function toTextBlockValue(contentJson) {
  try {
    const parsed = JSON.parse(contentJson);

    if (typeof parsed === "string") {
      return parsed;
    }

    if (typeof parsed?.text === "string") {
      return parsed.text;
    }
  } catch {
    return "";
  }

  return "";
}

function toTagsBlockValue(contentJson) {
  try {
    const parsed = JSON.parse(contentJson);

    if (Array.isArray(parsed)) {
      return parsed;
    }

    if (Array.isArray(parsed?.items)) {
      return parsed.items;
    }
  } catch {
    return [];
  }

  return [];
}

function serializeBlockValue(blockKey, value) {
  if (blockKey === "tags") {
    const items = Array.isArray(value)
      ? value
      : String(value || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
    return JSON.stringify({ items });
  }

  return JSON.stringify({ text: String(value || "").trim() });
}

function normalizeAdminPayload(slug, body, isCreate = false) {
  if (!body || typeof body !== "object") {
    return { error: "Request body must be valid JSON." };
  }

  const normalizedSlug = safeSlug(isCreate ? body.slug : slug);
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const author = typeof body.author === "string" ? body.author.trim() : "";
  const stage = typeof body.stage === "string" ? body.stage.trim() : "";
  const genre = typeof body.genre === "string" ? body.genre.trim() : "";
  const sourceType =
    body.sourceType === "full-flow" ? "full-flow" : "content-page";
  const status = body.status === "draft" ? "draft" : "published";

  if (!normalizedSlug) {
    return { error: "Slug is required and must use letters, numbers, or hyphens." };
  }

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
    slug: normalizedSlug,
    title,
    author,
    stage,
    genre,
    sourceType,
    status,
    route: normalizeRoute(body.route, normalizedSlug, sourceType)
  };
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
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

function deriveGradeLabel(seed, rawCourse) {
  return seed.gradeLabel || rawCourse.gradeLabel || rawCourse.stage || rawCourse.stageLabel || "";
}

function enrichCourse(rawCourse, source, blocks = {}) {
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
    summary: rawCourse.summary || seed.summary || "",
    subtitle: blocks.subtitle || seed.subtitle || "",
    tags: blocks.tags || seed.tags || [],
    entryLabel: blocks.entryLabel || seed.entryLabel || (sourceType === "full-flow" ? "当前演示进度" : "当前入口"),
    entryValue: blocks.entryValue || seed.entryValue || (sourceType === "full-flow" ? "完整学习流程已接入" : "独立课程内容页"),
    coverImageUrl: rawCourse.cover_image_url || rawCourse.coverImageUrl || seed.coverImageUrl || "",
    gradeLabel: deriveGradeLabel(seed, rawCourse),
    pageTypeLabel: sourceType === "full-flow" ? "完整学习流程" : "独立内容页",
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

async function getLatestPublicBlocks(env) {
  if (!env.DB) {
    return new Map();
  }

  const placeholders = PUBLIC_BLOCK_KEYS.map(() => "?").join(", ");
  const result = await env.DB.prepare(
    `
      SELECT course_id, block_key, content_json, version
      FROM content_blocks
      WHERE locale = 'zh-CN' AND block_key IN (${placeholders})
      ORDER BY course_id ASC, block_key ASC, version DESC
    `
  )
    .bind(...PUBLIC_BLOCK_KEYS)
    .all();

  const rows = Array.isArray(result.results) ? result.results : [];
  const blockMap = new Map();

  for (const row of rows) {
    const mapKey = `${row.course_id}:${row.block_key}`;

    if (blockMap.has(mapKey)) {
      continue;
    }

    const courseBlocks = blockMap.get(row.course_id) || {};

    if (row.block_key === "tags") {
      courseBlocks.tags = toTagsBlockValue(row.content_json);
    } else {
      courseBlocks[row.block_key] = toTextBlockValue(row.content_json);
    }

    blockMap.set(row.course_id, courseBlocks);
    blockMap.set(mapKey, true);
  }

  const compactMap = new Map();

  for (const [key, value] of blockMap.entries()) {
    if (!key.includes(":")) {
      compactMap.set(key, value);
    }
  }

  return compactMap;
}

async function getCourses(env) {
  if (!env.DB) {
    return {
      dataSource: "seed-fallback",
      items: courses.map((course) => enrichCourse(course, "seed-fallback"))
    };
  }

  try {
    const [courseResult, blockMap] = await Promise.all([
      env.DB.prepare(
        `
          SELECT
            c.id,
            c.slug,
            c.title,
            c.author,
            c.stage,
            c.genre,
            c.summary,
            c.cover_image_url,
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
        `
      ).all(),
      getLatestPublicBlocks(env)
    ]);

    const rows = Array.isArray(courseResult.results) ? courseResult.results : [];

    if (rows.length === 0) {
      return {
        dataSource: "seed-fallback",
        items: courses.map((course) => enrichCourse(course, "seed-fallback"))
      };
    }

    const items = rows
      .map((row) => enrichCourse(row, "d1", blockMap.get(row.id)))
      .sort((left, right) => {
        const leftIndex = courseSeedOrder.get(left.slug) ?? Number.MAX_SAFE_INTEGER;
        const rightIndex = courseSeedOrder.get(right.slug) ?? Number.MAX_SAFE_INTEGER;

        if (leftIndex === rightIndex) {
          return left.title.localeCompare(right.title, "zh-CN");
        }

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

  return env.DB.prepare(
    `
      SELECT
        c.id,
        c.slug,
        c.title,
        c.author,
        c.stage,
        c.genre,
        c.summary,
        c.cover_image_url,
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
    `
  )
    .bind(slug)
    .first();
}

async function getCourseBlocksForCourse(env, courseId) {
  const result = await env.DB.prepare(
    `
      SELECT id, block_key, title, content_json, version
      FROM content_blocks
      WHERE course_id = ? AND locale = 'zh-CN'
      ORDER BY block_key ASC, version DESC
    `
  )
    .bind(courseId)
    .all();

  const rows = Array.isArray(result.results) ? result.results : [];
  const blocks = {};
  const rowsByKey = {};

  for (const row of rows) {
    if (rowsByKey[row.block_key]) {
      continue;
    }

    rowsByKey[row.block_key] = row;

    if (row.block_key === "tags") {
      blocks.tags = toTagsBlockValue(row.content_json);
    } else {
      blocks[row.block_key] = toTextBlockValue(row.content_json);
    }
  }

  return {
    blocks,
    rowsByKey
  };
}

async function getCourseContent(env, slug) {
  const course = await getCourseRecord(env, slug);

  if (!course) {
    return null;
  }

  const { blocks } = await getCourseBlocksForCourse(env, course.id);
  return enrichCourse(course, "d1", blocks);
}

async function upsertContentBlock(env, courseId, blockKey, title, value) {
  const latest = await env.DB.prepare(
    `
      SELECT id
      FROM content_blocks
      WHERE course_id = ? AND block_key = ? AND locale = 'zh-CN'
      ORDER BY version DESC
      LIMIT 1
    `
  )
    .bind(courseId, blockKey)
    .first();

  const contentJson = serializeBlockValue(blockKey, value);

  if (latest?.id) {
    await env.DB.prepare(
      `
        UPDATE content_blocks
        SET
          title = ?,
          content_json = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `
    )
      .bind(title, contentJson, latest.id)
      .run();
    return;
  }

  await env.DB.prepare(
    `
      INSERT INTO content_blocks (
        id,
        course_id,
        block_key,
        block_type,
        title,
        content_json,
        locale,
        version,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, 'zh-CN', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `
  )
    .bind(
      crypto.randomUUID(),
      courseId,
      blockKey,
      blockKey === "tags" ? "list" : "text",
      title,
      contentJson
    )
    .run();
}

async function saveCourseContent(env, slug, body) {
  const course = await getCourseRecord(env, slug);

  if (!course) {
    return { error: "Course not found.", status: 404 };
  }

  await env.DB.prepare(
    `
      UPDATE courses
      SET
        summary = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `
  )
    .bind(String(body.summary || "").trim(), course.id)
    .run();

  await Promise.all([
    upsertContentBlock(env, course.id, "subtitle", "课程副标题", body.subtitle),
    upsertContentBlock(env, course.id, "tags", "课程标签", body.tags),
    upsertContentBlock(env, course.id, "entryLabel", "入口标签", body.entryLabel),
    upsertContentBlock(env, course.id, "entryValue", "入口说明", body.entryValue)
  ]);

  return {
    item: await getCourseContent(env, slug)
  };
}

async function createCourse(env, payload) {
  const existing = await getCourseRecord(env, payload.slug);

  if (existing) {
    return { error: "A course with this slug already exists.", status: 409 };
  }

  const courseId = `course-${payload.slug}`;
  const pageId = `page-${payload.slug}-primary`;
  const pageType = payload.sourceType === "full-flow" ? "landing" : "content";

  await env.DB.prepare(
    `
      INSERT INTO courses (
        id,
        slug,
        title,
        author,
        stage,
        genre,
        status,
        created_at,
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `
  )
    .bind(courseId, payload.slug, payload.title, payload.author, payload.stage, payload.genre, payload.status)
    .run();

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
    .bind(pageId, courseId, pageType, payload.route)
    .run();

  return {
    item: await getCourseContent(env, payload.slug)
  };
}

async function updateCourse(env, slug, payload) {
  const course = await getCourseRecord(env, slug);

  if (!course) {
    return { error: "Course not found.", status: 404 };
  }

  if (payload.slug !== slug) {
    const duplicate = await getCourseRecord(env, payload.slug);

    if (duplicate) {
      return { error: "Target slug already exists.", status: 409 };
    }
  }

  const pageType = payload.sourceType === "full-flow" ? "landing" : "content";

  await env.DB.prepare(
    `
      UPDATE courses
      SET
        slug = ?,
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
      payload.slug,
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
      .bind(`page-${payload.slug}-primary`, course.id, pageType, payload.route)
      .run();
  }

  return {
    item: await getCourseContent(env, payload.slug)
  };
}

async function deleteCourse(env, slug) {
  const course = await getCourseRecord(env, slug);

  if (!course) {
    return { error: "Course not found.", status: 404 };
  }

  await env.DB.prepare("DELETE FROM content_blocks WHERE course_id = ?").bind(course.id).run();
  await env.DB.prepare("DELETE FROM course_pages WHERE course_id = ?").bind(course.id).run();
  await env.DB.prepare("DELETE FROM courses WHERE id = ?").bind(course.id).run();
  await env.DB.prepare("DELETE FROM assets WHERE object_key LIKE ?").bind(`covers/${slug}/%`).run();

  return { ok: true };
}

async function uploadCourseCover(env, request) {
  if (!env.COURSE_ASSETS) {
    return { error: "R2 bucket binding is not configured yet.", status: 503 };
  }

  const formData = await request.formData();
  const slug = safeSlug(formData.get("slug"));
  const file = formData.get("file");

  if (!slug) {
    return { error: "Course slug is required for cover upload.", status: 400 };
  }

  if (!(file instanceof File)) {
    return { error: "A file is required.", status: 400 };
  }

  const course = await getCourseRecord(env, slug);

  if (!course) {
    return { error: "Course not found.", status: 404 };
  }

  const safeName = String(file.name || "cover")
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const objectKey = `covers/${slug}/${Date.now()}-${safeName || "cover-image"}`;

  await env.COURSE_ASSETS.put(objectKey, await file.arrayBuffer(), {
    httpMetadata: {
      contentType: file.type || "application/octet-stream"
    }
  });

  const publicUrl = `/uploads/${objectKey}`;

  await env.DB.prepare(
    `
      UPDATE courses
      SET
        cover_image_url = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `
  )
    .bind(publicUrl, course.id)
    .run();

  await env.DB.prepare(
    `
      INSERT INTO assets (
        id,
        bucket_name,
        object_key,
        public_url,
        mime_type,
        file_size,
        created_at
      )
      VALUES (?, 'nova-chinese-assets', ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `
  )
    .bind(crypto.randomUUID(), objectKey, publicUrl, file.type || "application/octet-stream", file.size || 0)
    .run();

  return {
    item: await getCourseContent(env, slug)
  };
}

async function serveUpload(env, pathname) {
  if (!env.COURSE_ASSETS) {
    return new Response("Not found", { status: 404 });
  }

  const objectKey = pathname.replace(/^\/uploads\//, "");
  const object = await env.COURSE_ASSETS.get(objectKey);

  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();

  if (object.httpMetadata?.contentType) {
    headers.set("content-type", object.httpMetadata.contentType);
  }

  headers.set("cache-control", "public, max-age=3600");
  return new Response(object.body, { headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (pathname.startsWith("/uploads/")) {
      return serveUpload(env, pathname);
    }

    if (pathname === "/api/admin/login") {
      if (request.method !== "POST") {
        return errorResponse(405, "Method not allowed.");
      }

      if (!env.ADMIN_PASSWORD || !env.ADMIN_SESSION_SECRET) {
        return errorResponse(503, "Admin secrets are not configured yet.");
      }

      const body = await readJson(request);
      const password = typeof body?.password === "string" ? body.password : "";

      if (password !== env.ADMIN_PASSWORD) {
        return errorResponse(401, "Incorrect admin password.");
      }

      const token = await createAdminSession(env.ADMIN_SESSION_SECRET);
      const redirectTo = sanitizeAdminPath(body?.next);

      return json(
        {
          ok: true,
          redirectTo
        },
        {
          headers: {
            "set-cookie": buildSessionCookie(token)
          }
        }
      );
    }

    if (pathname === "/api/admin/logout") {
      return json(
        { ok: true },
        {
          headers: {
            "set-cookie": buildExpiredSessionCookie()
          }
        }
      );
    }

    const cookies = parseCookies(request.headers.get("cookie"));
    const isAdminAuthenticated = await verifyAdminSession(
      cookies[ADMIN_COOKIE_NAME],
      env.ADMIN_SESSION_SECRET
    );

    if (isAdminPagePath(pathname) && !isAdminAuthenticated) {
      const next = encodeURIComponent(`${pathname}${url.search}`);
      return Response.redirect(`${url.origin}/admin-login.html?next=${next}`, 302);
    }

    if (isAdminApiPath(pathname) && pathname !== "/api/admin/login" && pathname !== "/api/admin/logout" && !isAdminAuthenticated) {
      return errorResponse(401, "Admin login required.");
    }

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

    if (pathname.startsWith("/api/course-content/")) {
      const slug = safeSlug(pathname.replace("/api/course-content/", ""));

      if (!slug) {
        return errorResponse(400, "Course slug is required.");
      }

      const item = env.DB ? await getCourseContent(env, slug) : null;

      if (!item) {
        return errorResponse(404, "Course not found.");
      }

      return json({ ok: true, item });
    }

    if (pathname === "/api/admin/courses") {
      if (!env.DB) {
        return errorResponse(503, "D1 is not configured for admin operations.");
      }

      if (request.method === "GET") {
        const courseData = await getCourses(env);

        return json({
          ok: true,
          total: courseData.items.length,
          dataSource: courseData.dataSource,
          items: courseData.items
        });
      }

      if (request.method === "POST") {
        const body = await readJson(request);
        const payload = normalizeAdminPayload("", body, true);

        if (payload.error) {
          return errorResponse(400, payload.error);
        }

        const result = await createCourse(env, payload);

        if (result.error) {
          return errorResponse(result.status || 500, result.error);
        }

        return json({ ok: true, item: result.item });
      }

      return errorResponse(405, "Method not allowed.");
    }

    if (pathname.startsWith("/api/admin/courses/")) {
      if (!env.DB) {
        return errorResponse(503, "D1 is not configured for admin operations.");
      }

      const slug = safeSlug(pathname.replace("/api/admin/courses/", ""));

      if (!slug) {
        return errorResponse(400, "Course slug is required.");
      }

      if (request.method === "POST") {
        const body = await readJson(request);
        const payload = normalizeAdminPayload(slug, body);

        if (payload.error) {
          return errorResponse(400, payload.error);
        }

        const result = await updateCourse(env, slug, payload);

        if (result.error) {
          return errorResponse(result.status || 500, result.error);
        }

        return json({ ok: true, item: result.item });
      }

      if (request.method === "DELETE") {
        const result = await deleteCourse(env, slug);

        if (result.error) {
          return errorResponse(result.status || 500, result.error);
        }

        return json({ ok: true });
      }

      return errorResponse(405, "Method not allowed.");
    }

    if (pathname.startsWith("/api/admin/content/")) {
      if (!env.DB) {
        return errorResponse(503, "D1 is not configured for content editing.");
      }

      const slug = safeSlug(pathname.replace("/api/admin/content/", ""));

      if (!slug) {
        return errorResponse(400, "Course slug is required.");
      }

      if (request.method === "GET") {
        const item = await getCourseContent(env, slug);

        if (!item) {
          return errorResponse(404, "Course not found.");
        }

        return json({ ok: true, item });
      }

      if (request.method === "POST") {
        const body = await readJson(request);
        const result = await saveCourseContent(env, slug, body || {});

        if (result.error) {
          return errorResponse(result.status || 500, result.error);
        }

        return json({ ok: true, item: result.item });
      }

      return errorResponse(405, "Method not allowed.");
    }

    if (pathname === "/api/admin/assets/upload") {
      if (!env.DB) {
        return errorResponse(503, "D1 is not configured for uploads.");
      }

      if (request.method !== "POST") {
        return errorResponse(405, "Method not allowed.");
      }

      const result = await uploadCourseCover(env, request);

      if (result.error) {
        return errorResponse(result.status || 500, result.error);
      }

      return json({ ok: true, item: result.item });
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
