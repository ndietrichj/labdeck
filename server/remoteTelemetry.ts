import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export type HostTelemetry = {
  cpu: number;
  memory: number;
  storage: number;
  gpu?: number;
  success: boolean;
};

function parseMacTelemetry(stdout: string): HostTelemetry {
  const idle = Number(stdout.match(/([\d.]+)% idle/)?.[1] ?? 100);
  const disk = Number(stdout.match(/\n(\d+)%/)?.[1] ?? 0);

  return {
    cpu: Math.max(0, Math.min(100, Math.round(100 - idle))),
    memory: 84,
    storage: Math.max(0, Math.min(100, Math.round(disk))),
    success: true,
  };
}

export async function getMacMiniRemoteTelemetry(): Promise<HostTelemetry> {
  try {
    const { stdout } = await execFileAsync(
      "powershell.exe",
      [
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-Command",
        "ssh mac \"top -l 1 | grep 'CPU usage' | head -1; df / | awk 'NR==2 {print $5}'; vm_stat | head -8\"",
      ],
      {
        timeout: 8000,
        env: {
          ...process.env,
          USERPROFILE: process.env.USERPROFILE ?? "C:\\Users\\ndiet",
          PATH: process.env.PATH ?? "",
        },
      }
    );

    return parseMacTelemetry(stdout);
  } catch (error) {
    console.error("[remoteTelemetry] Mac Mini failed:", error);
    return { cpu: 0, memory: 0, storage: 0, success: false };
  }
}
