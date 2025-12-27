import { useMemo, useState } from 'react';

const isValidEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase());
};

export default function Contact() {
  const [form, setForm] = useState({ fullName: '', email: '', subject: '', message: '' });
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!isValidEmail(form.email)) e.email = 'Please enter a valid email';
    if (!form.subject.trim()) e.subject = 'Subject is required';
    if (!form.message.trim()) e.message = 'Message is required';
    return e;
  }, [form]);

  const onChange = (key) => (ev) => {
    setForm((f) => ({ ...f, [key]: ev.target.value }));
  };

  const onBlur = (key) => () => {
    setTouched((t) => ({ ...t, [key]: true }));
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    setTouched({ fullName: true, email: true, subject: true, message: true });
    if (Object.keys(errors).length > 0) return;
    setSubmitted(true);
  };

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 backdrop-blur shadow-soft-lg p-10">
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 dark:text-white">Contact Us</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-300">We’d love to hear from you</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 backdrop-blur shadow-soft p-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Send a message</h2>

          {submitted ? (
            <div className="mt-4 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/70 dark:bg-emerald-950/30 p-4 text-emerald-800 dark:text-emerald-200">
              Message sent. We’ll get back to you soon.
            </div>
          ) : null}

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Full Name</label>
              <input
                value={form.fullName}
                onChange={onChange('fullName')}
                onBlur={onBlur('fullName')}
                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/40 px-4 py-3 text-slate-900 dark:text-slate-100"
                placeholder="Your name"
              />
              {touched.fullName && errors.fullName ? (
                <div className="mt-1 text-sm text-rose-600">{errors.fullName}</div>
              ) : null}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Email Address</label>
              <input
                value={form.email}
                onChange={onChange('email')}
                onBlur={onBlur('email')}
                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/40 px-4 py-3 text-slate-900 dark:text-slate-100"
                placeholder="you@example.com"
              />
              {touched.email && errors.email ? <div className="mt-1 text-sm text-rose-600">{errors.email}</div> : null}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Subject</label>
              <input
                value={form.subject}
                onChange={onChange('subject')}
                onBlur={onBlur('subject')}
                className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/40 px-4 py-3 text-slate-900 dark:text-slate-100"
                placeholder="How can we help?"
              />
              {touched.subject && errors.subject ? (
                <div className="mt-1 text-sm text-rose-600">{errors.subject}</div>
              ) : null}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Message</label>
              <textarea
                value={form.message}
                onChange={onChange('message')}
                onBlur={onBlur('message')}
                className="mt-2 w-full min-h-32 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/40 px-4 py-3 text-slate-900 dark:text-slate-100"
                placeholder="Write your message..."
              />
              {touched.message && errors.message ? (
                <div className="mt-1 text-sm text-rose-600">{errors.message}</div>
              ) : null}
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-soft hover:shadow-soft-lg transition"
            >
              Send Message
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 backdrop-blur shadow-soft p-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Contact Information</h2>
          <div className="mt-4 space-y-3 text-slate-600 dark:text-slate-300">
            <div>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</div>
              <div>support@mainteno.app</div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Phone</div>
              <div>+91 XXXXX XXXXX</div>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Address</div>
              <div>India</div>
            </div>
          </div>

          <div className="mt-6 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <iframe
              title="Mainteno Map"
              className="w-full h-56"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=India&output=embed"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
