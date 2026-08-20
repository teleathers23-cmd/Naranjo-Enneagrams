import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

export function TesterNameModal({
  onConfirm,
}: {
  onConfirm: (name: string) => void;
}) {
  const [name, setName] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onConfirm(name.trim() || "匿名");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/70 px-4 backdrop-blur-[2px]">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-sm"
      >
        <p className="text-xs tracking-[0.18em] text-muted">TESTER</p>
        <h2 className="mt-1 font-display text-2xl font-medium">测试者姓名</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          会出现在结果和导出的 PDF 上。可以填真实姓名，也可以填匿名。
        </p>
        <label className="mt-5 block text-sm">
          <span className="text-muted">名字</span>
          <input
            autoFocus
            className="mt-1 w-full rounded-xl border border-border bg-bg px-3 py-2.5 outline-none focus:border-border-strong"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：西羽，或匿名"
            maxLength={40}
          />
        </label>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Button type="submit" className="flex-1">
            开始作答
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => onConfirm("匿名")}
          >
            以匿名继续
          </Button>
        </div>
      </form>
    </div>
  );
}
