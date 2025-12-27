export default function About() {
  return (
    <div className="bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-10">
        <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 backdrop-blur shadow-soft-lg p-10">
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white">About GearGuard</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Built to simplify maintenance operations</p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 backdrop-blur shadow-soft p-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">About the Product</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300 leading-7">
              GearGuard is a modern maintenance management system designed to connect equipment, teams, and maintenance requests
              into one seamless workflow.
            </p>
            <p className="mt-4 text-slate-600 dark:text-slate-300 leading-7">We help organizations:</p>
            <ul className="mt-3 space-y-2 text-slate-600 dark:text-slate-300">
              <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-indigo-500 dark:bg-cyan-400" />Reduce downtime</li>
              <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-indigo-500 dark:bg-cyan-400" />Improve asset lifespan</li>
              <li className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 rounded-full bg-indigo-500 dark:bg-cyan-400" />Streamline maintenance communication</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 backdrop-blur shadow-soft p-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Why GearGuard?</h2>
            <ul className="mt-4 space-y-3 text-slate-600 dark:text-slate-300">
              <li>✔ Centralized asset management</li>
              <li>✔ Team-based workflows</li>
              <li>✔ Preventive maintenance planning</li>
              <li>✔ Odoo-inspired UX</li>
              <li>✔ Scalable & secure</li>
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 backdrop-blur shadow-soft p-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Vision</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 leading-7">
            To make maintenance predictable, organized, and stress-free for every organization.
          </p>
        </section>

        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 backdrop-blur shadow-soft p-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Tech Philosophy</h2>
          <ul className="mt-4 space-y-2 text-slate-600 dark:text-slate-300">
            <li>Modular architecture</li>
            <li>Role-based access</li>
            <li>Automation-first approach</li>
            <li>Mobile-friendly design</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
