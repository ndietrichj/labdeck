import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const SSH_TARGET = process.env.LABDECK_MAC_SSH_TARGET || "mac";

export type RemoteTelemetryResult = {
  cpu: number;
  memory: number;
  storage: number;
  success: boolean;
  error?: string;
};

export async function getMacMiniRemoteTelemetry(): Promise<RemoteTelemetryResult> {
  return getRemoteTelemetry(SSH_TARGET);
}

export async function getRemoteTelemetry(sshTarget: string = SSH_TARGET): Promise<RemoteTelemetryResult> {
  try {
    const { stdout, stderr } = await execFileAsync("ssh", [
      "-o", "BatchMode=yes",
      "-o", "ConnectTimeout=3",
      sshTarget,
      "top -l 1 | grep 'CPU usage' | head -1; df / | awk 'NR==2 {print $5}'; vm_stat | head -8"
    ], { timeout: 5000 });

    if (stderr?.trim()) {
      console.warn(`[remoteTelemetry] stderr: ${stderr.trim()}`);
    }

    console.log("[remoteTelemetry] raw Mac stdout:", JSON.stringify(stdout));

    const cpuMatch = stdout.match(/CPU usage:\s*([0-9.]+)% user,\s*([0-9.]+)% sys/);
    const storageMatch = stdout.match(/\n\s*(\d+)%\s*\n/);

    const freeMatch = stdout.match(/Pages free:\s+([0-9.]+)/);
    const activeMatch = stdout.match(/Pages active:\s+([0-9.]+)/);
    const inactiveMatch = stdout.match(/Pages inactive:\s+([0-9.]+)/);
    const wiredMatch = stdout.match(/Pages wired down:\s+([0-9.]+)/);

    const cpu = cpuMatch ? Math.round(Number(cpuMatch[1]) + Number(cpuMatch[2])) : 0;
    const storage = storageMatch ? Number(storageMatch[1]) : 0;

    const free = freeMatch ? Number(freeMatch[1]) : 0;
    const active = activeMatch ? Number(activeMatch[1]) : 0;
    const inactive = inactiveMatch ? Number(inactiveMatch[1]) : 0;
    const wired = wiredMatch ? Number(wiredMatch[1]) : 0;

    const totalPages = free + active + inactive + wired;
    const usedPages = active + inactive + wired;
    const memory = totalPages > 0 ? Math.round((usedPages / totalPages) * 100) : 0;

    const result = {
      cpu: clampPercent(cpu),
      memory: clampPercent(memory),
      storage: clampPercent(storage),
      success: cpu > 0 || memory > 0 || storage > 0,
    };

    console.log("[remoteTelemetry] Mac Mini result:", result);
    return result;
  } catch (error: any) {
    const message = error?.message ?? String(error);
    console.warn(`[remoteTelemetry] SSH failed for ${sshTarget}: ${message}`);
    return { cpu: 0, memory: 0, storage: 0, success: false, error: message };
  }
}

export const MAC_SSH_TARGET = SSH_TARGET;

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}


