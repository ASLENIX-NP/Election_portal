export function Card({ children, className = '' }) {
  return (
    <div className={`glass-panel ${className}`} style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      {children}
    </div>
  );
}
