import { Link } from 'react-router-dom';
import { Calendar, ClipboardList, LayoutGrid, Shield, Users, Wrench } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, children }) => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 backdrop-blur shadow-soft p-6">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white flex items-center justify-center shadow-soft">
          <Icon size={18} />
        </div>
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">{title}</div>
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

const Step = ({ index, title, children }) => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 backdrop-blur shadow-soft p-6">
      <div className="text-sm font-semibold text-indigo-600 dark:text-cyan-300">{index}</div>
      <div className="mt-2 font-semibold text-slate-900 dark:text-white">{title}</div>
      <div className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-6">{children}</div>
    </div>
  );
};

const RoleCard = ({ title, points }) => {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 backdrop-blur shadow-soft p-6">
      <div className="font-semibold text-slate-900 dark:text-white">{title}</div>
      <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
        {points.map((p) => (
          <li key={p} className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500 dark:bg-cyan-400" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="pt-6">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white/80 to-slate-50/60 dark:from-slate-950/50 dark:to-slate-900/30 backdrop-blur shadow-soft-lg p-10 md:p-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/40 px-4 py-2 text-sm text-slate-600 dark:text-slate-300">
              <Shield size={16} />
              Calm, role-based maintenance workflow
            </div>

            <h1 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white">
              Smart Maintenance. Zero Downtime.
            </h1>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 leading-7">
              Track equipment, assign maintenance teams, and manage repairs effortlessly — all in one powerful system.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/auth/register"
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-soft hover:shadow-soft-lg transition"
              >
                Get Started
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-slate-800 dark:text-slate-100 bg-white/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 hover:bg-white/80 dark:hover:bg-slate-900/60 transition"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Key Features</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Everything you need to run maintenance with clarity.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FeatureCard icon={Wrench} title="Equipment Management">
            Track machines, vehicles, and IT assets
            <br />
            Assign ownership by department or employee
            <br />
            Warranty & location tracking
          </FeatureCard>
          <FeatureCard icon={Users} title="Team-Based Maintenance">
            Specialized teams (Mechanical, Electrical, IT)
            <br />
            Controlled access — only the right technicians work on jobs
            <br />
            Clear responsibility assignment
          </FeatureCard>
          <FeatureCard icon={ClipboardList} title="Smart Maintenance Requests">
            Corrective & Preventive maintenance
            <br />
            Auto-assignment from equipment
            <br />
            Lifecycle tracking from New → Repaired
          </FeatureCard>
          <FeatureCard icon={LayoutGrid} title="Visual Workflows">
            Kanban boards for technicians
            <br />
            Calendar view for preventive jobs
            <br />
            Reports for managers
          </FeatureCard>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How It Works</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">A simple 3-step loop that scales with your organization.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Step index="1️⃣" title="Add Equipment">Register assets and assign teams</Step>
          <Step index="2️⃣" title="Create Requests">Breakdowns or scheduled maintenance</Step>
          <Step index="3️⃣" title="Fix & Track">Technicians resolve issues, managers monitor progress</Step>
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Role-Based</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Clean separation of concerns for real-world maintenance teams.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <RoleCard
            title="👤 For Employees"
            points={["Report issues in seconds", "Track request status"]}
          />
          <RoleCard
            title="🧑‍💼 For Managers"
            points={["Schedule maintenance", "Assign technicians", "View reports"]}
          />
          <RoleCard
            title="👨‍🔧 For Technicians"
            points={["Kanban-based work", "Calendar view", "Clear priorities"]}
          />
        </div>
      </section>

      <section className="pb-6">
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 backdrop-blur shadow-soft-lg p-10 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Ready to eliminate maintenance chaos?</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Start managing maintenance today with Mainteno.</p>
          </div>
          <Link
            to="/auth/register"
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-soft hover:shadow-soft-lg transition"
          >
            Start Managing Maintenance Today
          </Link>
        </div>
      </section>
    </div>
  );
}
