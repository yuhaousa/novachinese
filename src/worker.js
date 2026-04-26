import { courses } from "./course-data.js";

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
      return json({
        ok: true,
        total: courses.length,
        items: courses
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
