import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const SSH_TARGET = process.env.LABDECK_MAC_SSH_TARGET || "mac";
const SSH_TIMEOUT_MS = Number(process.env.LABDECK_SSH_TIMEOUT_MS || "3000");

const MACOS_TELEMETRY_COMMAND = [
  "cpu_line=$(top -l 1 | grep 'CPU usage' | head -1)",
  "cpu_user=$(printf '%s\\n' \"$cpu_line\" | sed -E 's/.*CPU usage: ([0-9.]+)% user.*/\\1/')",
  "cpu_sys=$(printf '%s\\n' \"$cpu_line\" | sed -E 's/.*user, ([0-9.]+)% sys.*/\\1/')",
  "cpu=$(awk -v u=\"$cpu_user\" -v s=\"$cpu_sys\" 'BEGIN { printf \"%d\", u + s }')",
  "storage=$(df / | awk 'NR==2 { gsub(/%/, \"\", $5); print $5 }')",
  "page_size=$(pagesize 2>/dev/null || echo 4096)",
  "vm=$(vm_stat)",
  "free=$(printf '%s\\n' \"$vm\" | awk '/Pages free/ { gsub(/\\./, \"\", $3); print $3 }')",
  "inactive=$(printf '%s\\n' \"$vm\" | awk '/Pages inactive/ { gsub(/\\./, \"\", $3); print $3 }')",
  "speculative=$(printf '%s\\n' \"$vm\" | awk '/Pages speculative/ { gsub(/\\./, \"\", $3); print $3 }')",
  "wired=$(printf '%s\\n' \"$vm\" | awk '/Pages wired down/ { gsub(/\\./, \"\", $4); print $4 }')",
  "active=$(printf '%s\\n' \"$vm\" | awk '/Pages active/ { gsub(/\\./, \"\", $3); print $3 }')",
  "compressed=$(printf '%s\\n' \"$vm\" | awk '/Pages occupied by compressor/ { gsub(/\\./, \"\", $5); print $5 }')",
  "free=${free:-0}; inactive=${inactive:-0}; speculative=${speculative:-0}; wired=${wired:-0}; active=${active:-0}; compressed=${compressed:-0}",
  "used_pages=$((wired + active + compressed))",
  "total_pages=$((used_pages + inactive + speculative + free))",
  "memory=$(awk -v used=\"$used_pages\" -v total=\"$total_pages\" 'BEGIN { if (total > 0) printf \"%d\", (used / total) * 100; else printf \"0\" }')",
  "printf '{\"cpu\":%s,\"memory\":%s,\"storage\":%s}\\n' \"${cpu:-0}\" \"${memory:-0}\" \"${storage:-0}\"",
].join("; ");

type RemoteTelemetryResult = {
  cpu: number;
  memory: number;
  storage: number;
  success: boolean;
  error?: string;
};

export async function getRemoteTelemetry(
  sshTarget: string = SSH_TARGET
): Promise<RemoteTelemetryResult> {
  const args = [
    "-o",
    "BatchMode=yes",
    "-o",
    "ConnectTimeout=3",
    sshTarget,
    MACOS_TELEMETRY_COMMAND,
  ];

  try {
    const { stdout, stderr } = await execFileAsync("ssh", args, {
      timeout: SSH_TIMEOUT_MS,
      maxBuffer: 1024 * 64,
    });

    if (stderr?.trim()) {
      console.warn(`[remoteTelemetry] SSH stderr for ${sshTarget}: ${stderr.trim()}`);
    }

    const telemetry = parseTelemetryJson(stdout);

    return {
      ...telemetry,
      success: true,
    };
  } catch (error: any) {
    const message = error?.message ?? String(error);

    if (error?.code === "ETIMEDOUT" || message.includes("timed out")) {
      console.warn(`[remoteTelemetry] SSH timeout for ${sshTarget}`);
    } else if (error?.code === 255 || message.includes("Permission denied")) {
      console.warn(`[remoteTelemetry] SSH authentication/connection failed for ${sshTarget}`);
    } else {
      console.warn(`[remoteTelemetry] SSH failed for ${sshTarget}: ${message}`);
    }

    return {
      cpu: 0,
      memory: 0,
      storage: 0,
      success: false,
      error: message,
    };
  }
}

export async function getMacMiniRemoteTelemetry(): Promise<RemoteTelemetryResult> {
  return getRemoteTelemetry(SSH_TARGET);
}

export const MAC_SSH_TARGET = SSH_TARGET;

function parseTelemetryJson(output: string): Pick<RemoteTelemetryResult, "cpu" | "memory" | "storage"> {
  try {
    const data = JSON.parse(output.trim());

    if (
      typeof data.cpu !== "number" ||
      typeof data.memory !== "number" ||
      typeof data.storage !== "number"
    ) {
      throw new Error("Invalid telemetry structure");
    }

    return {
      cpu: clampPercent(data.cpu),
      memory: clampPercent(data.memory),
      storage: clampPercent(data.storage),
    };
  } catch {
    return {
      cpu: 0,
      memory: 0,
      storage: 0,
    };
  }
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}
