PRAGMA defer_foreign_keys = true;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  school_name TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS classes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  grade_label TEXT,
  teacher_user_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS class_members (
  id TEXT PRIMARY KEY,
  class_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role_in_class TEXT NOT NULL DEFAULT 'student',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (class_id, user_id),
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS courses (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  stage TEXT,
  genre TEXT,
  cover_image_url TEXT,
  summary TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS course_pages (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  page_type TEXT NOT NULL,
  route_path TEXT NOT NULL,
  source_template TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (course_id, page_type),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE IF NOT EXISTS content_blocks (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  block_key TEXT NOT NULL,
  block_type TEXT NOT NULL,
  title TEXT,
  content_json TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'zh-CN',
  version INTEGER NOT NULL DEFAULT 1,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (course_id, block_key, locale, version),
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS assignments (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  class_id TEXT,
  title TEXT NOT NULL,
  instructions TEXT,
  due_at TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (class_id) REFERENCES classes(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  assignment_id TEXT NOT NULL,
  course_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted',
  submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assignment_id) REFERENCES assignments(id),
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS submission_scores (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL UNIQUE,
  clarity_score REAL,
  imagery_score REAL,
  structure_score REAL,
  emotion_score REAL,
  feedback TEXT,
  model_name TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (submission_id) REFERENCES submissions(id)
);

CREATE TABLE IF NOT EXISTS ai_configs (
  id TEXT PRIMARY KEY,
  config_key TEXT NOT NULL UNIQUE,
  provider TEXT NOT NULL,
  model_name TEXT NOT NULL,
  system_prompt TEXT,
  config_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  course_id TEXT,
  conversation_type TEXT NOT NULL DEFAULT 'student-chat',
  title TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);

CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY,
  storage_provider TEXT NOT NULL DEFAULT 'r2',
  bucket_name TEXT,
  object_key TEXT NOT NULL,
  public_url TEXT,
  mime_type TEXT,
  file_size INTEGER,
  metadata_json TEXT,
  created_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor_user_id TEXT,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  detail_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (actor_user_id) REFERENCES users(id)
);

INSERT OR IGNORE INTO courses (id, slug, title, author, stage, genre, status) VALUES
  ('course-lotus', 'lotus', '荷塘月色', '朱自清', '初中语文阅读', '抒情散文', 'published'),
  ('course-back', 'back', '背影', '朱自清', '初中语文阅读', '回忆性散文', 'published'),
  ('course-baicao', 'baicao', '从百草园到三味书屋', '鲁迅', '初中语文阅读', '回忆散文', 'published'),
  ('course-wisteria', 'wisteria', '紫藤萝瀑布', '宗璞', '初中语文阅读', '抒情散文', 'published'),
  ('course-spring', 'spring', '春', '朱自清', '初中语文阅读', '写景散文', 'published'),
  ('course-winter', 'winter', '济南的冬天', '老舍', '初中语文阅读', '写景散文', 'published'),
  ('course-walk', 'walk', '散步', '莫怀戚', '初中语文阅读', '叙事散文', 'published'),
  ('course-opera', 'opera', '社戏', '鲁迅', '初中语文阅读', '小说', 'published'),
  ('course-peach', 'peach', '桃花源记', '陶渊明', '初中语文阅读', '文言文', 'published'),
  ('course-tower', 'tower', '岳阳楼记', '范仲淹', '初中语文阅读', '文言文', 'published');

INSERT OR IGNORE INTO course_pages (id, course_id, page_type, route_path, source_template, sort_order, is_published) VALUES
  ('page-lotus-home', 'course-lotus', 'landing', '/index.html', 'index.html', 10, 1),
  ('page-lotus-text', 'course-lotus', 'text', '/text.html', 'text.html', 20, 1),
  ('page-lotus-emotion', 'course-lotus', 'emotion', '/emotion.html', 'emotion.html', 30, 1),
  ('page-lotus-writing', 'course-lotus', 'writing', '/writing.html', 'writing.html', 40, 1),
  ('page-lotus-chat', 'course-lotus', 'chat', '/chat.html', 'chat.html', 50, 1),
  ('page-back-content', 'course-back', 'content', '/course-content.html?course=back', 'course-content.html', 10, 1),
  ('page-baicao-content', 'course-baicao', 'content', '/course-content.html?course=baicao', 'course-content.html', 10, 1),
  ('page-wisteria-content', 'course-wisteria', 'content', '/course-content.html?course=wisteria', 'course-content.html', 10, 1),
  ('page-spring-content', 'course-spring', 'content', '/course-content.html?course=spring', 'course-content.html', 10, 1),
  ('page-winter-content', 'course-winter', 'content', '/course-content.html?course=winter', 'course-content.html', 10, 1),
  ('page-walk-content', 'course-walk', 'content', '/course-content.html?course=walk', 'course-content.html', 10, 1),
  ('page-opera-content', 'course-opera', 'content', '/course-content.html?course=opera', 'course-content.html', 10, 1),
  ('page-peach-content', 'course-peach', 'content', '/course-content.html?course=peach', 'course-content.html', 10, 1),
  ('page-tower-content', 'course-tower', 'content', '/course-content.html?course=tower', 'course-content.html', 10, 1);
