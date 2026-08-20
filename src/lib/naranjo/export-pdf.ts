import { createRoot } from "react-dom/client";
import { createElement } from "react";
import { ResultPdfDocument } from "@/components/result-pdf";
import type { Result } from "./scoring";

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function downloadResultPdf(opts: {
  result: Result;
  testerName: string;
}): Promise<void> {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import("jspdf"),
    import("html2canvas"),
  ]);

  const host = document.createElement("div");
  host.style.cssText =
    "position:fixed;left:-12000px;top:0;z-index:-1;width:794px;background:#fff;";
  document.body.appendChild(host);
  const root = createRoot(host);
  const exportedAt = new Date().toLocaleString("zh-CN", { hour12: false });
  root.render(
    createElement(ResultPdfDocument, {
      result: opts.result,
      testerName: opts.testerName || "匿名",
      exportedAt,
    }),
  );
  await wait(120);

  const el = host.querySelector("#result-pdf-root") as HTMLElement | null;
  if (!el) {
    root.unmount();
    host.remove();
    throw new Error("pdf-root-missing");
  }

  const canvas = await html2canvas(el, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    logging: false,
    windowWidth: 794,
  });

  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = 210;
  const pageH = 297;
  const imgW = pageW;
  const imgH = (canvas.height * imgW) / canvas.width;
  const img = canvas.toDataURL("image/jpeg", 0.92);

  let heightLeft = imgH;
  let position = 0;
  pdf.addImage(img, "JPEG", 0, position, imgW, imgH);
  heightLeft -= pageH;
  while (heightLeft > 0.5) {
    position -= pageH;
    pdf.addPage();
    pdf.addImage(img, "JPEG", 0, position, imgW, imgH);
    heightLeft -= pageH;
  }

  const who = (opts.testerName || "匿名").replace(/[\\/:*?"<>|]/g, "");
  pdf.save(`纳兰霍27副型-${who}-${opts.result.triadCode}.pdf`);
  root.unmount();
  host.remove();
}
