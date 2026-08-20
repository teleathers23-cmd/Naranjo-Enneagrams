import {
  CENTER_FULL,
  CENTER_LABEL,
  INSTINCTS,
  SUBTYPE_MAP,
  TYPE_MAP,
  shortCode,
  subtypeLabel,
  triadToken,
} from "@/lib/naranjo/catalog";
import {
  FLAG_LABEL,
  INTENSITY_LABEL,
  VERIFY_LABEL,
  type Result,
  type StyleFlag,
} from "@/lib/naranjo/scoring";

export function ResultPdfDocument({
  result,
  testerName,
  exportedAt,
}: {
  result: Result;
  testerName: string;
  exportedAt: string;
}) {
  const r = result;
  return (
    <div
      id="result-pdf-root"
      style={{
        width: 794,
        background: "#ffffff",
        color: "#1c1914",
        fontFamily: '"Noto Serif SC", "Songti SC", serif',
        fontSize: 13,
        lineHeight: 1.55,
        padding: 40,
        boxSizing: "border-box",
      }}
    >
      <p style={{ letterSpacing: "0.18em", fontSize: 11, color: "#6d665c", margin: 0 }}>
        CLAUDIO NARANJO · SAT
      </p>
      <h1 style={{ fontSize: 28, fontWeight: 600, margin: "8px 0 0" }}>
        纳兰霍二十七副型测验结果
      </h1>
      <p style={{ margin: "10px 0 0", color: "#6d665c", fontSize: 13 }}>
        测试者：{testerName || "匿名"}　·　{exportedAt}
      </p>
      <p style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 600 }}>{r.triadCode}</p>
      <p style={{ margin: "4px 0 0", color: "#6d665c" }}>
        {r.triad.map((s) => CENTER_LABEL[s.center]).join(" → ")}　·　顺序按中心重视
      </p>
      <p style={{ margin: "8px 0 0", fontSize: 12, color: "#6d665c" }}>
        {r.confidence === "high" ? "倾向明确" : r.confidence === "medium" ? "中等把握" : "候选接近"}
        。{r.confidenceNote}
      </p>
      {r.style?.flags?.length ? (
        <p style={{ margin: "6px 0 0", fontSize: 12, color: "#8a6a3d" }}>
          作答风格：
          {r.style.flags.map((f) => FLAG_LABEL[f as StyleFlag] ?? f).join("、")}
        </p>
      ) : null}

      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        {r.triad.map((slot) => {
          const s = SUBTYPE_MAP[slot.subtype];
          return (
            <div
              key={slot.subtype}
              style={{
                flex: 1,
                border: "1px solid #e2d9c9",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <p style={{ margin: 0, fontSize: 11, color: "#938b80" }}>
                {slot.order === 1 ? "第一区" : slot.order === 2 ? "第二区" : "第三区"} ·{" "}
                {CENTER_LABEL[slot.center]}
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 18, fontWeight: 600 }}>
                {triadToken(slot.subtype)} {s.name}
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6d665c" }}>
                强度 {INTENSITY_LABEL[slot.intensityBand]} {slot.intensity.toFixed(0)} · 核验{" "}
                {VERIFY_LABEL[slot.verification]}
                {s.countertype ? " · 反型" : ""}
              </p>
            </div>
          );
        })}
      </div>

      {r.triad.map((slot) => {
        const s = SUBTYPE_MAP[slot.subtype];
        const t = TYPE_MAP[slot.type];
        const runT = TYPE_MAP[slot.runnerUpType];
        const runS = SUBTYPE_MAP[slot.runnerUpSubtype];
        return (
          <section
            key={slot.subtype}
            style={{ marginTop: 28, breakInside: "avoid" }}
          >
            <h2 style={{ fontSize: 18, margin: 0 }}>
              {triadToken(slot.subtype)} {subtypeLabel(slot.subtype)}
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6d665c" }}>
              {CENTER_FULL[slot.center]} · 情欲 {t.passion} · {s.nameEs}
              {s.countertype ? " · 反型" : ""}
            </p>
            <p style={{ margin: "10px 0 0" }}>{s.oneLiner}</p>
            <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "#3a342c" }}>
              {s.portrait}
            </p>
            <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "#3a342c" }}>
              <strong>神经症　</strong>
              {s.neurosis}
            </p>
            <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
              {s.markers.map((m) => (
                <li key={m} style={{ marginBottom: 4 }}>
                  {m}
                </li>
              ))}
            </ul>
            <p style={{ margin: "10px 0 0", fontSize: 12, color: "#6d665c" }}>
              情欲 {slot.typePct.toFixed(0)} · 副型专名 {slot.specPct.toFixed(0)} · 本能{" "}
              {slot.instinctPct.toFixed(0)}。核验 {VERIFY_LABEL[slot.verification]}。
              {slot.verificationNote} 次选 {slot.runnerUpType}号{runT.passion}（差{" "}
              {slot.typeGap.toFixed(1)}）；次选 {triadToken(slot.runnerUpSubtype)} {runS.name}
              （差 {slot.subtypeGap.toFixed(1)}）。
            </p>
          </section>
        );
      })}

      {r.compare && r.compare.length > 0 && (
        <section style={{ marginTop: 28 }}>
          <h2 style={{ fontSize: 18, margin: 0 }}>第三步对照</h2>
          {r.compare.map((o) => (
            <p key={o.id} style={{ margin: "8px 0 0", fontSize: 12.5 }}>
              {o.leftLabel} ↔ {o.rightLabel}：{o.note}
              <span style={{ color: "#6d665c" }}>　{o.stem}</span>
            </p>
          ))}
        </section>
      )}

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, margin: 0 }}>九型情欲</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8, fontSize: 12 }}>
          <tbody>
            {r.typeScores.map((row) => {
              const t = TYPE_MAP[row.type];
              return (
                <tr key={row.type} style={{ borderBottom: "1px solid #e2d9c9" }}>
                  <td style={{ padding: "5px 0" }}>
                    {row.type}号 {t.passion}
                    <span style={{ color: "#938b80" }}>　{CENTER_LABEL[t.center]}</span>
                  </td>
                  <td style={{ padding: "5px 0", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    {row.pct.toFixed(0)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section style={{ marginTop: 22 }}>
        <h2 style={{ fontSize: 18, margin: 0 }}>本能倾向</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8, fontSize: 12 }}>
          <tbody>
            {r.instinctScores.map((row) => {
              const inst = INSTINCTS.find((i) => i.id === row.instinct)!;
              return (
                <tr key={row.instinct} style={{ borderBottom: "1px solid #e2d9c9" }}>
                  <td style={{ padding: "5px 0" }}>{inst.name}</td>
                  <td style={{ padding: "5px 0", textAlign: "right" }}>{row.pct.toFixed(0)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section style={{ marginTop: 22 }}>
        <h2 style={{ fontSize: 18, margin: 0 }}>二十七副型剖面（前九）</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8, fontSize: 12 }}>
          <tbody>
            {r.subtypeScores.slice(0, 9).map((row, i) => {
              const s = SUBTYPE_MAP[row.id];
              return (
                <tr key={row.id} style={{ borderBottom: "1px solid #e2d9c9" }}>
                  <td style={{ padding: "5px 0", width: 28, color: "#938b80" }}>{i + 1}</td>
                  <td style={{ padding: "5px 0" }}>
                    {shortCode(row.id)} {s.name}
                  </td>
                  <td style={{ padding: "5px 0", textAlign: "right" }}>{row.pct.toFixed(0)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section style={{ marginTop: 22 }}>
        <h2 style={{ fontSize: 18, margin: 0 }}>计算说明</h2>
        <p style={{ margin: "8px 0 0", fontSize: 12, color: "#6d665c" }}>{r.formula}</p>
        {r.calculation.slice(0, 6).map((step) => (
          <div key={step.title} style={{ marginTop: 12 }}>
            <p style={{ margin: 0, fontWeight: 600 }}>{step.title}</p>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "#6d665c" }}>{step.detail}</p>
          </div>
        ))}
      </section>

      <p style={{ marginTop: 28, fontSize: 11, color: "#938b80" }}>
        本报告由纳兰霍二十七副型测验生成，只作筛选，不能替代长期自我观察。题目为独立撰写，非原文摘录。
      </p>
    </div>
  );
}
