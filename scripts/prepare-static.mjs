import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const distDir = path.join(rootDir, "dist");
const checkOnly = process.argv.includes("--check");

const staticEntries = [
  "index.html",
  "overview.html",
  "admin-login.html",
  "admin-course-create.html",
  "admin-course-edit.html",
  "text.html",
  "emotion.html",
  "writing.html",
  "chat.html",
  "settings.html",
  "course-content.html",
  "course-content.js",
  "lesson-course.js",
  "overview-courses.js",
  "admin-courses-data.js",
  "styles.css",
  "shell.js",
  "page-behaviors.js",
  "admin.html",
  "admin-courses.html",
  "admin-content.html",
  "admin-content-data.js",
  "admin-course-create.js",
  "admin-course-edit.js",
  "admin-users.html",
  "admin-ai.html",
  "admin-settings.html",
  "admin-login.js",
  "admin.css",
  "admin-shell.js"
];

async function ensureEntriesExist() {
  const missing = [];

  for (const entry of staticEntries) {
    const absolutePath = path.join(rootDir, entry);

    try {
      await stat(absolutePath);
    } catch {
      missing.push(entry);
    }
  }

  if (missing.length > 0) {
    throw new Error(`Missing static entries: ${missing.join(", ")}`);
  }
}

async function collectDistEntries() {
  try {
    return await readdir(distDir);
  } catch {
    return [];
  }
}

await ensureEntriesExist();

if (checkOnly) {
  const distEntries = await collectDistEntries();
  const expected = new Set(staticEntries);
  const missing = staticEntries.filter((entry) => !distEntries.includes(entry));

  if (missing.length > 0) {
    throw new Error(`dist is out of date. Missing copies: ${missing.join(", ")}`);
  }

  console.log(`dist check passed with ${expected.size} static files.`);
  process.exit(0);
}

await rm(distDir, { force: true, recursive: true });
await mkdir(distDir, { recursive: true });

for (const entry of staticEntries) {
  await cp(path.join(rootDir, entry), path.join(distDir, entry), {
    force: true,
    recursive: true
  });
}

console.log(`Prepared ${staticEntries.length} static files in ${distDir}`);
