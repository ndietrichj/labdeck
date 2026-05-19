import { spawn } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

const env = { ...process.env };

if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const [key, ...rest] = line.split("=");
    env[key.trim()] = rest.join("=").trim();
  }
}

env.LABDECK_PORT = env.LABDECK_PORT || "8790";

const procs = [
  spawn("npx", ["tsx", "server/index.ts"], { stdio: "inherit", shell: true, env }),
  spawn("npm", ["run", "dev"], { stdio: "inherit", shell: true, env }),
];

function shutdown() {
  for (const p of procs) p.kill();
  process.exit();
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
