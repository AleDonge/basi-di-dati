// Disable Next.js CLI telemetry for every project command, including fresh installs.
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const result = spawnSync(process.execPath, [require.resolve("next/dist/bin/next"), ...process.argv.slice(2)], {
  stdio: "inherit", env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
});
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
