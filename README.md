# NovaChinese

这是一个面向初中语文阅读教学的演示项目，当前同时包含：

- 前台学习站点
- 课程目录与课程内容页
- 后台管理模式原型
- Cloudflare 部署与 D1 数据库接入骨架

## 当前文件结构

```text
NovaChinese/
├── index.html
├── overview.html
├── text.html
├── emotion.html
├── writing.html
├── chat.html
├── settings.html
├── course-content.html
├── course-content.js
├── styles.css
├── shell.js
├── page-behaviors.js
├── admin.html
├── admin-courses.html
├── admin-content.html
├── admin-users.html
├── admin-ai.html
├── admin-settings.html
├── admin.css
├── admin-shell.js
├── src/
│   ├── course-data.js
│   └── worker.js
├── scripts/
│   └── prepare-static.mjs
├── migrations/
│   └── 0001_initial.sql
├── wrangler.jsonc
├── package.json
└── novaread-spa.html
```

## 页面关系

- `overview.html` 是课程总览页，展示 10 门课程
- `index.html -> text.html -> emotion.html -> writing.html -> chat.html` 是《荷塘月色》的完整学习流程
- 其他 9 门课程统一进入 `course-content.html?course=...`
- 前台顶部可以进入 `admin.html` 后台管理模式

## Cloudflare 结构

当前仓库已经补成适合 Cloudflare Workers 部署的结构：

- `dist/`
  由构建脚本生成，存放真正上传到 Cloudflare 的静态站点文件
- `src/worker.js`
  Worker 入口，负责 API 和静态资源兜底
- `wrangler.jsonc`
  Cloudflare Worker 配置
- `migrations/0001_initial.sql`
  第一版 D1 表结构和课程种子数据

当前已提供的 API：

- `/api/health`
- `/api/courses`
- `/api/db/status`

当前线上地址：

- [nova-chinese.yuhaousa.workers.dev](https://nova-chinese.yuhaousa.workers.dev)

## 本地开发

先安装依赖：

```bash
npm install
```

构建静态发布目录：

```bash
npm run build
```

本地启动 Cloudflare Worker：

```bash
npm run cf:dev
```

部署到 Cloudflare：

```bash
npm run cf:deploy
```

## D1 数据库接入

当前已经完成：

- D1 数据库 `nova_chinese` 已创建
- `wrangler.jsonc` 已绑定真实 `database_id`
- 初始 migration 已写好，等待执行或继续演进

下一步接入流程：

1. 应用 `migrations/0001_initial.sql`
2. 验证 `/api/db/status`
3. 把后台课程管理接到真实查询和保存
4. 再补 R2 封面图上传

建议命名：

- Worker 名称：`nova-chinese`
- D1 名称：`nova_chinese`
- R2 Bucket 名称：`nova-chinese-assets`

## 当前状态

已经完成：

- 前台多页面拆分
- 10 门课程目录
- 9 门课程独立内容页
- 后台管理原型
- Cloudflare Worker 部署骨架
- D1 初始数据库设计

尚未完成：

- 真正的登录与权限系统
- 后台表单保存到数据库
- R2 图片上传
- AI 能力的真实后端接入
- 生产域名、Access、Turnstile 配置

## 推荐下一步

最稳的推进顺序是：

1. 先把当前静态站部署到 Cloudflare
2. 创建 D1 并接入课程数据
3. 把后台课程管理做成真实可编辑
4. 接入 Cloudflare Access 保护后台
5. 再补 R2、AI、用户体系
