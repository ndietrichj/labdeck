import fs from "node:fs";
import path from "node:path";

const src = "src-tauri/binaries/labdeck-backend-x86_64-pc-windows-msvc.exe";

const targets = [
  "src-tauri/target/debug/labdeck-backend.exe",
  "src-tauri/target/release/labdeck-backend.exe",
];

for (const target of targets) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(src, target);
  console.log(`Copied backend sidecar: ${src} -> ${target}`);
}
