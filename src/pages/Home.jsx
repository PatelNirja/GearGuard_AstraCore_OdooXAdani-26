// import { Link } from 'react-router-dom';
// import { Calendar, ClipboardList, LayoutGrid, Shield, Users, Wrench } from 'lucide-react';

// const FeatureCard = ({ icon: Icon, title, children }) => {
//   return (
//     <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 backdrop-blur shadow-soft p-6">
//       <div className="flex items-start gap-3">
//         <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white flex items-center justify-center shadow-soft">
//           <Icon size={18} />
//         </div>
//         <div>
//           <div className="font-semibold text-slate-900 dark:text-white">{title}</div>
//           <div className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-6">{children}</div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Step = ({ index, title, children }) => {
//   return (
//     <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 backdrop-blur shadow-soft p-6">
//       <div className="text-sm font-semibold text-indigo-600 dark:text-cyan-300">{index}</div>
//       <div className="mt-2 font-semibold text-slate-900 dark:text-white">{title}</div>
//       <div className="mt-1 text-sm text-slate-600 dark:text-slate-300 leading-6">{children}</div>
//     </div>
//   );
// };

// const RoleCard = ({ title, points }) => {
//   return (
//     <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 backdrop-blur shadow-soft p-6">
//       <div className="font-semibold text-slate-900 dark:text-white">{title}</div>
//       <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
//         {points.map((p) => (
//           <li key={p} className="flex gap-2">
//             <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500 dark:bg-cyan-400" />
//             <span>{p}</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default function Home() {
//   return (
//     <div className="space-y-16">
//       <section className="pt-6">
//         <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white/80 to-slate-50/60 dark:from-slate-950/50 dark:to-slate-900/30 backdrop-blur shadow-soft-lg p-10 md:p-14">
//           <div className="max-w-3xl">
//             <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/40 px-4 py-2 text-sm text-slate-600 dark:text-slate-300">
//               <Shield size={16} />
//               Calm, role-based maintenance workflow
//             </div>

//             <h1 className="mt-6 text-4xl md:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white">
//               Smart Maintenance. Zero Downtime.
//             </h1>
//             <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 leading-7">
//               Track equipment, assign maintenance teams, and manage repairs effortlessly — all in one powerful system.
//             </p>

//             <div className="mt-8 flex flex-col sm:flex-row gap-3">
//               <Link
//                 to="/auth/register"
//                 className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-soft hover:shadow-soft-lg transition"
//               >
//                 Get Started
//               </Link>
//               <Link
//                 to="/about"
//                 className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-slate-800 dark:text-slate-100 bg-white/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 hover:bg-white/80 dark:hover:bg-slate-900/60 transition"
//               >
//                 View Demo
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="space-y-6">
//         <div>
//           <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Key Features</h2>
//           <p className="mt-2 text-slate-600 dark:text-slate-300">Everything you need to run maintenance with clarity.</p>
//         </div>

//         <div className="grid gap-4 md:grid-cols-2">
//           <FeatureCard icon={Wrench} title="Equipment Management">
//             Track machines, vehicles, and IT assets
//             <br />
//             Assign ownership by department or employee
//             <br />
//             Warranty & location tracking
//           </FeatureCard>
//           <FeatureCard icon={Users} title="Team-Based Maintenance">
//             Specialized teams (Mechanical, Electrical, IT)
//             <br />
//             Controlled access — only the right technicians work on jobs
//             <br />
//             Clear responsibility assignment
//           </FeatureCard>
//           <FeatureCard icon={ClipboardList} title="Smart Maintenance Requests">
//             Corrective & Preventive maintenance
//             <br />
//             Auto-assignment from equipment
//             <br />
//             Lifecycle tracking from New → Repaired
//           </FeatureCard>
//           <FeatureCard icon={LayoutGrid} title="Visual Workflows">
//             Kanban boards for technicians
//             <br />
//             Calendar view for preventive jobs
//             <br />
//             Reports for managers
//           </FeatureCard>
//         </div>
//       </section>

//       <section className="space-y-6">
//         <div>
//           <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">How It Works</h2>
//           <p className="mt-2 text-slate-600 dark:text-slate-300">A simple 3-step loop that scales with your organization.</p>
//         </div>

//         <div className="grid gap-4 md:grid-cols-3">
//           <Step index="1️⃣" title="Add Equipment">Register assets and assign teams</Step>
//           <Step index="2️⃣" title="Create Requests">Breakdowns or scheduled maintenance</Step>
//           <Step index="3️⃣" title="Fix & Track">Technicians resolve issues, managers monitor progress</Step>
//         </div>
//       </section>

//       <section className="space-y-6">
//         <div>
//           <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Role-Based</h2>
//           <p className="mt-2 text-slate-600 dark:text-slate-300">Clean separation of concerns for real-world maintenance teams.</p>
//         </div>

//         <div className="grid gap-4 md:grid-cols-3">
//           <RoleCard
//             title="👤 For Employees"
//             points={["Report issues in seconds", "Track request status"]}
//           />
//           <RoleCard
//             title="🧑‍💼 For Managers"
//             points={["Schedule maintenance", "Assign technicians", "View reports"]}
//           />
//           <RoleCard
//             title="👨‍🔧 For Technicians"
//             points={["Kanban-based work", "Calendar view", "Clear priorities"]}
//           />
//         </div>
//       </section>

//       <section className="pb-6">
//         <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 backdrop-blur shadow-soft-lg p-10 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
//           <div>
//             <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">Ready to eliminate maintenance chaos?</h3>
//             <p className="mt-2 text-slate-600 dark:text-slate-300">Start managing maintenance today with Mainteno.</p>
//           </div>
//           <Link
//             to="/auth/register"
//             className="inline-flex items-center justify-center rounded-xl px-6 py-3 font-semibold text-white bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-soft hover:shadow-soft-lg transition"
//           >
//             Start Managing Maintenance Today
//           </Link>
//         </div>
//       </section>
//     </div>
//   );
// }
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Search,
  Filter,
  Shield,
  Database,
  Activity,
  BarChart2,
  Zap,
  Clock,
  Users
} from 'lucide-react';

// Images
import equipmentListImg from '../assets/equipment-list.png';
import equipmentDetailImg from '../assets/equipment-detail.png';
import landingBg from '../assets/landing-bg.png';

const Home = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const floatingAnimation = {
    animate: { y: [0, -10, 0] },
    transition: { duration: 4, repeat: Infinity }
  };

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden font-sans">

      {/* Hero Section */}
      <section className="min-h-[calc(100vh-80px)] flex items-center justify-center text-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10">
          {/* Gradient backgrounds */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-200 via-blue-200 to-transparent dark:from-indigo-900/20 dark:via-blue-900/20 dark:to-transparent rounded-full blur-3xl opacity-40 dark:opacity-30" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-tl from-cyan-200 via-blue-200 to-transparent dark:from-cyan-900/20 dark:via-blue-900/20 dark:to-transparent rounded-full blur-3xl opacity-40 dark:opacity-30" />
          
          {/* Background image overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-5 dark:opacity-10"
            style={{ backgroundImage: `url(${landingBg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/30 to-white dark:from-slate-950/0 dark:via-slate-950/50 dark:to-slate-950" />
        </div>

        <div className="relative z-10 px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-block"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-300 dark:border-cyan-500/30 bg-indigo-50 dark:bg-cyan-950/30 px-4 py-2 backdrop-blur">
              <Zap size={16} className="text-indigo-600 dark:text-cyan-400" />
              <span className="text-sm font-semibold text-indigo-700 dark:text-cyan-300">Smart Maintenance Management</span>
            </div>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            GearGuard
          </motion.h1>

          <motion.p
            className="text-lg md:text-2xl text-slate-700 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            The Ultimate Maintenance Tracker & Asset Management Solution
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(79, 70, 229, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/auth/register')}
            className="bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white px-10 py-4 rounded-full font-bold flex items-center gap-3 mx-auto shadow-lg transition-all"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Get Started <ArrowRight size={20} />
          </motion.button>
        </div>
      </section>

      {/* Equipment Management */}
      <section className="py-32 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/30 dark:to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-bl from-blue-200/30 to-transparent dark:from-blue-900/20 dark:to-transparent rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-sm font-semibold text-indigo-600 dark:text-cyan-400 mb-4">FEATURES</span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-6 text-slate-900 dark:text-white"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Equipment Management
          </motion.h2>
          
          <motion.p
            className="text-center text-slate-600 dark:text-slate-400 text-lg mb-20 max-w-2xl mx-auto"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Powerful tools to track and manage your assets efficiently
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Database size={40} />,
                title: 'Asset Tracking',
                desc: 'Centralized asset database with complete visibility'
              },
              {
                icon: <Activity size={40} />,
                title: 'Quick Access',
                desc: 'Search and filter equipment instantly'
              },
              {
                icon: <BarChart2 size={40} />,
                title: 'Maintenance Insights',
                desc: 'Full service history and analytics'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
                className="bg-white dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-cyan-500/50 transition-all group"
              >
                <div className="text-indigo-500 dark:text-cyan-400 mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment List */}
      <section className="py-32 bg-white dark:bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-gradient-to-r from-cyan-200/20 to-transparent dark:from-cyan-900/20 dark:to-transparent rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-10 text-slate-900 dark:text-white">
                Equipment List
              </h2>
              <ul className="space-y-6">
                <li className="flex items-center gap-4 text-slate-700 dark:text-slate-300 group cursor-pointer">
                  <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-all">
                    <Search className="text-indigo-600 dark:text-cyan-400" size={24} />
                  </div>
                  <span className="text-lg font-medium">Search by name and specifications</span>
                </li>
                <li className="flex items-center gap-4 text-slate-700 dark:text-slate-300 group cursor-pointer">
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-all">
                    <Filter className="text-blue-600 dark:text-cyan-400" size={24} />
                  </div>
                  <span className="text-lg font-medium">Filter by department and status</span>
                </li>
                <li className="flex items-center gap-4 text-slate-700 dark:text-slate-300 group cursor-pointer">
                  <div className="p-3 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 group-hover:bg-cyan-200 dark:group-hover:bg-cyan-900/50 transition-all">
                    <Shield className="text-cyan-600 dark:text-cyan-400" size={24} />
                  </div>
                  <span className="text-lg font-medium">Track warranty and service status</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 hover:shadow-2xl dark:hover:shadow-xl dark:hover:shadow-cyan-900/20 transition-all"
            >
              <img
                src={equipmentListImg}
                alt="Equipment List"
                className="rounded-xl w-full shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Equipment Detail */}
      <section className="py-32 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/30 dark:to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute bottom-1/2 right-1/4 w-96 h-96 bg-gradient-to-tl from-indigo-200/30 to-transparent dark:from-indigo-900/20 dark:to-transparent rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 hover:shadow-2xl dark:hover:shadow-xl dark:hover:shadow-indigo-900/20 transition-all"
            >
              <img
                src={equipmentDetailImg}
                alt="Equipment Detail"
                className="rounded-xl w-full shadow-lg"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900 dark:text-white">
                Equipment Detail View
              </h2>
              <ul className="space-y-4 text-slate-700 dark:text-slate-300 text-lg">
                {[
                  'Full equipment information and specifications',
                  'Current status & team assignment',
                  'Complete maintenance history and logs',
                  'Performance metrics and analytics'
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 group"
                  >
                    <span className="text-indigo-500 dark:text-cyan-400 font-bold mt-1 group-hover:scale-125 transition-transform">✓</span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-32 bg-white dark:bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-transparent dark:from-blue-900/20 dark:to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tl from-cyan-200/30 to-transparent dark:from-cyan-900/20 dark:to-transparent rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-center mb-4 text-slate-900 dark:text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why Choose GearGuard?
          </motion.h2>
          
          <motion.p
            className="text-center text-slate-600 dark:text-slate-400 text-lg mb-20 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Designed for modern teams who demand efficiency and reliability
          </motion.p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap size={40} />,
                title: 'Lightning Fast',
                desc: 'Instant access to all your equipment data'
              },
              {
                icon: <Clock size={40} />,
                title: 'Time Saving',
                desc: 'Reduce maintenance downtime by 40%'
              },
              {
                icon: <Users size={40} />,
                title: 'Team Collaboration',
                desc: 'Seamless coordination between teams'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-800/30 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center hover:border-indigo-300 dark:hover:border-cyan-500/50 transition-all"
              >
                <div className="text-indigo-600 dark:text-cyan-400 mb-6 flex justify-center">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 dark:from-indigo-700 dark:via-blue-700 dark:to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url(${landingBg})`,
            backgroundSize: 'cover'
          }} />
        </div>

        <div className="mx-auto max-w-4xl px-4 md:px-6 text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to Take Control?
          </motion.h2>
          
          <motion.p
            className="text-lg text-white/90 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Start managing your equipment maintenance with GearGuard today. Join thousands of teams optimizing their operations.
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 30px 60px rgba(255, 255, 255, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/auth/register')}
            className="bg-white text-indigo-600 dark:text-indigo-500 hover:bg-slate-100 px-10 py-4 rounded-full font-bold flex items-center gap-3 mx-auto shadow-xl transition-all"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Start Free Trial <ArrowRight size={20} />
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default Home;

