interface StatCardProps {
  value: string | number;
  label: string;
  variant: 'primary' | 'success' | 'warning' | 'info';
}

export function StatCard({ value, label, variant }: StatCardProps) {
  return (
    <div className={`stat-card ${variant}`}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}