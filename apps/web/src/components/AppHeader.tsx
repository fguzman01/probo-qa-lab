import { Link, NavLink } from 'react-router';
import { useAuth } from '../auth/AuthContext';
import { Logo } from './Logo';

export function AppHeader() {
  const { user } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-surface px-8">
      <div className="flex items-center gap-8">
        <Link to="/historias" className="flex items-center gap-2.5 text-ink no-underline">
          <Logo />
          <span className="text-lg font-bold">Probo</span>
        </Link>
        <nav aria-label="Principal">
          <NavLink
            to="/historias"
            className={({ isActive }) =>
              `py-5 text-[15px] font-semibold text-ink no-underline ${isActive ? 'border-b-2 border-primary' : ''}`
            }
          >
            Historias
          </NavLink>
        </nav>
      </div>
      {user && (
        <span className="text-sm text-muted" data-testid="user-email">
          {user.email}
        </span>
      )}
    </header>
  );
}
