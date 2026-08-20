# 纳兰霍二十七副型测验

严格依照 Claudio Naranjo 原典（情欲 / 固着 / 本能副型，含反型）编写的两步测验站。

## 本地运行

需要 [Node.js 22](https://nodejs.org/)。

```bash
npm install
npm run dev
```

浏览器打开终端里提示的地址（默认 `http://localhost:8080`）。

## 目录

| 路径 | 内容 |
|---|---|
| `src/lib/naranjo/questions.ts` | **题库**：第一步 45 题 + 第二步 81 题 |
| `src/lib/naranjo/catalog.ts` | 九型情欲、二十七副型原典画像 |
| `src/lib/naranjo/scoring.ts` | 计分 |
| `src/lib/naranjo/store.ts` | 作答进度（localStorage） |
| `src/routes/` | 页面：首页、测验、结果、百科、登录、历史 |
| `migrations/` | 数据库表（登录后存结果） |

## 脚本

```bash
npm run dev        # 开发
npm run build      # 生产构建
npm run typecheck  # 类型检查
```

未配置 `DATABASE_URL` 时使用本地 PGLite；部署到带 Postgres 的环境后会自动切到真实数据库。登录为 Google / X，属可选。
