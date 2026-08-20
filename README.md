# 纳兰霍二十七副型测验

请先打开 **`00-请先看这个.txt`**，里面是零基础上传到 Vercel 的步骤。

严格依照 Claudio Naranjo 原典（情欲 / 固着 / 本能副型，含反型）的两步测验站。

- 第一步：45 题，筛九种情欲
- 第二步：按分数靠前的类型出示副型题（题库含全部 27 副型 × 3 题）
- 作答进度存在浏览器本地

独立部署到 Vercel 时默认关闭登录；测验、百科、结果页可直接使用。

## 目录

| 路径 | 内容 |
|---|---|
| `src/lib/naranjo/questions.ts` | 题库 |
| `src/lib/naranjo/catalog.ts` | 九型情欲与二十七副型画像 |
| `src/lib/naranjo/scoring.ts` | 计分 |
| `src/routes/` | 页面 |

## 本地运行（可选）

需要 Node.js 22。

```bash
npm install
npm run dev
```
