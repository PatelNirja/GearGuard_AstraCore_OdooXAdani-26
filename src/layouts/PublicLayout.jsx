import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

export default function PublicLayout({ theme, onToggleTheme }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <PublicNavbar theme={theme} onToggleTheme={onToggleTheme} />
      <main>
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
