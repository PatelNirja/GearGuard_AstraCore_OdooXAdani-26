import { Link } from 'react-router-dom';

export default function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-soft">
                🛠
              </span>
              <span>Mainteno</span>
            </div>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Smart maintenance made simple.</p>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">Quick Links</div>
            <div className="mt-3 grid gap-2 text-sm">
              <Link className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white" to="/">
                Home
              </Link>
              <Link className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white" to="/about">
                About
              </Link>
              <Link className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white" to="/contact">
                Contact
              </Link>
              <Link className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white" to="/auth/login">
                Login
              </Link>
              <Link className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white" to="/auth/register">
                Register
              </Link>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">Resources</div>
            <div className="mt-3 grid gap-2 text-sm">
              <a className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white" href="#">
                Documentation
              </a>
              <a className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white" href="#">
                Support
              </a>
              <a className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white" href="#">
                Privacy Policy
              </a>
              <a className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white" href="#">
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 dark:border-slate-800 pt-6 text-sm text-slate-500 dark:text-slate-400">
          © 2025 Mainteno. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
