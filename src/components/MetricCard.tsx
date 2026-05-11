export function MetricCard({ label, value, subtext }: { label: string; value: string | number; subtext?: string }) {
  return (
    <article className="metric-card">
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
      {subtext ? <p className="metric-subtext">{subtext}</p> : null}
    </article>
  );
}
