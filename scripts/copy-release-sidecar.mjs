import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname } from "node:path";

const source = "src-tauri/binaries/labdeck-backend-x86_64-pc-windows-msvc.exe";
const target = "src-tauri/target/release/labdeck-backend.exe";

if (!existsSync(source)) {
  throw new Error(`Missing backend sidecar source: ${source}`);
}

mkdirSync(dirname(target), { recursive: true });
copyFileSync(source, target);

console.log(`Copied backend sidecar: ${source} -> ${target}`);
