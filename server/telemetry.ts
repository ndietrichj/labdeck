export type LocalTelemetry = {
  cpu: number;
  memory: number;
  storage: number;
  gpu: number;
};

export async function getLocalHostTelemetry(): Promise<LocalTelemetry> {
  return {
    cpu: 31,
    memory: 52,
    storage: 94,
    gpu: 0,
  };
}
