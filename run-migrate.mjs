#!/usr/bin/env node
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));
const migrate = join(root, "scripts", "migrate.mjs");
if (!existsSync(migrate)) {
  console.log("[migrate] scripts/migrate.mjs not found — skip");
  process.exit(0);
}
const result = spawnSync(process.execPath, [migrate], { stdio: "inherit" });
process.exit(result.status ?? 1);
