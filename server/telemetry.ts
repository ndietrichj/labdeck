import { execFile } from "node:child_process";
import os from "node:os";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export type HostTelemetry = {
  cpu: number;
  memory: number;
  storage: number;
  gpu?: number;
};

function clampPct(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

async function sampleCpuPct(delayMs = 500): Promise<number> {
  const start = os.cpus();

  await new Promise((resolve) => setTimeout(resolve, delayMs));

  const end = os.cpus();

  let idleDelta = 0;
  let totalDelta = 0;

  for (let i = 0; i < end.length; i += 1) {
    const s = start[i].times;
    const e = end[i].times;

    const startIdle = s.idle;
    const endIdle = e.idle;

    const startTotal = s.user + s.nice + s.sys + s.idle + s.irq;
    const endTotal = e.user + e.nice + e.sys + e.idle + e.irq;

    idleDelta += endIdle - startIdle;
    totalDelta += endTotal - startTotal;
  }

  if (totalDelta <= 0) return 0;
  return clampPct((1 - idleDelta / totalDelta) * 100);
}

function memoryPct(): number {
  const total = os.totalmem();
  const free = os.freemem();

  if (total <= 0) return 0;
  return clampPct(((total - free) / total) * 100);
}

async function windowsDiskPct(): Promise<number> {
  if (process.platform !== "win32") return 0;

  try {
    const { stdout } = await execFileAsync(
      "powershell.exe",
      [
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-Command",
        "(Get-CimInstance Win32_LogicalDisk -Filter \"DeviceID='C:'\" | ForEach-Object { [math]::Round((($_.Size - $_.FreeSpace) / $_.Size) * 100) })",
      ],
      { timeout: 5000 }
    );

    return clampPct(Number(stdout.trim()));
  } catch {
    return 0;
  }
}

async function nvidiaGpuPct(): Promise<number | undefined> {
  try {
    const { stdout } = await execFileAsync(
      "nvidia-smi",
      ["--query-gpu=utilization.gpu", "--format=csv,noheader,nounits"],
      { timeout: 5000 }
    );

    const first = stdout
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find(Boolean);

    if (!first) return undefined;
    return clampPct(Number(first));
  } catch {
    return undefined;
  }
}

export async function getLocalHostTelemetry(): Promise<HostTelemetry> {
  const [cpu, storage, gpu] = await Promise.all([
    sampleCpuPct(),
    windowsDiskPct(),
    nvidiaGpuPct(),
  ]);

  return {
    cpu,
    memory: memoryPct(),
    storage,
    ...(gpu === undefined ? {} : { gpu }),
  };
}
