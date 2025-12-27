import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';

const NavItem = ({ to, children, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive
            ? 'text-slate-900 dark:text-white bg-white/70 dark:bg-slate-900/70'
            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-900/50'
        }`
      }
    >
      {children}
    </NavLink>
  );
};

export default function PublicNavbar({ theme, onToggleTheme }) {
  const [isShrunk, setIsShrunk] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setIsShrunk(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const links = useMemo(
    () => [
      { to: '/', label: 'Home' },
      { to: '/about', label: 'About' },
      { to: '/contact', label: 'Contact' },
    ],
    []
  );

  return (
    <header className="sticky top-0 z-50">
      <div
        className={`glass-effect ${
          isShrunk ? 'py-2' : 'py-4'
        } transition-all duration-300 border-b border-white/20 dark:border-white/10`}
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-soft">
                  🛠
                </span>
                <span>Mainteno</span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center justify-center gap-1">
              {links.map((l) => (
                <NavItem key={l.to} to={l.to}>
                  {l.label}
                </NavItem>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleTheme}
                className="h-10 w-10 inline-flex items-center justify-center rounded-lg text-slate-700 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <Link
                to="/auth/login"
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-soft hover:shadow-soft-lg transition"
              >
                Get Started
              </Link>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleTheme}
                className="h-10 w-10 inline-flex items-center justify-center rounded-lg text-slate-700 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="h-10 w-10 inline-flex items-center justify-center rounded-lg text-slate-700 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-900/60 transition-colors"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white dark:bg-slate-950 shadow-soft-xl border-l border-slate-200 dark:border-slate-800 p-4 animate-slide-in">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-slate-900 dark:text-white">Menu</div>
              <button
                type="button"
                className="h-10 w-10 inline-flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-4 grid gap-2">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg font-medium ${
                      isActive
                        ? 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </div>

            <div className="mt-6 grid gap-2">
              <Link
                to="/auth/login"
                className="px-4 py-3 rounded-lg font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                Login
              </Link>
              <Link
                to="/auth/register"
                className="px-4 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-soft"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
