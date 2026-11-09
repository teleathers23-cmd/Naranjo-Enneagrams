const BODY = `<!doctype html>
<html lang="zh-CN">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>本站已关闭</title>
<body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#f4f0e6;color:#1c1915;font-family:Georgia,'Noto Serif SC',serif">
<main style="text-align:center;padding:2rem">
<p style="letter-spacing:.2em;font-size:.75rem">二十七副型</p>
<h1 style="font-weight:500;font-size:1.75rem;margin:.5rem 0">本站已关闭</h1>
<p style="color:#6b645b">测验与百科已停止开放。</p>
</main>
</body>
</html>`;

export default function siteClosed() {
  return new Response(BODY, {
    status: 410,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
      "x-robots-tag": "noindex",
    },
  });
}
