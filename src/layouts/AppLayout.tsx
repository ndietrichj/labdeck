import type { ReactNode } from 'react';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>LabDeck</h1>
        <p>Homelab Operations Center</p>
      </aside>
      <main className="main-content">{children}</main>
    </div>
  );
}
