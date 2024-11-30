import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation, useSpring, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { 
  User, LogOut, Activity, DollarSign, Users, TrendingUp,
  BarChart2, PieChart, Calendar
} from "lucide-react";

const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 5000 },
  { name: 'Apr', value: 4500 },
  { name: 'May', value: 6000 },
  { name: 'Jun', value: 5500 },
];

const StatCard = ({ icon: Icon, title, value, trend }) => (
  <motion.div 
    className="bg-white/10 backdrop-blur-lg rounded-xl p-6 flex items-center justify-between"
    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
  >
    <div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
      </p>
    </div>
    <Icon size={40} className="text-blue-400" />
  </motion.div>
);

const AnimatedCounter = ({ value, duration = 1 }) => {
  const counterRef = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = 0;
    const end = parseInt(value);
    const range = end - start;
    let current = start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));

    const timer = setInterval(() => {
      current += increment;
      setCount(current);
      if (current === end) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span ref={counterRef}>{count.toLocaleString()}</span>;
};

function Protected() {
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (!localStorage.getItem("faceAuth")) {
      navigate("/login");
    }
    const { account } = JSON.parse(localStorage.getItem("faceAuth"));
    setAccount(account);

    if (inView) {
      controls.start("visible");
    }
  }, [inView, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("faceAuth");
    navigate("/");
  };

  const scrollYProgress = useSpring(0);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  if (!account) return null;

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="fixed inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1080&q=80')] bg-cover bg-center"
        style={{ scale }}
      />
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      <motion.div 
        className="relative z-10 container mx-auto px-4 py-16"
        ref={ref}
        initial="hidden"
        animate={controls}
      >
        <motion.header 
          className="flex justify-between items-center mb-16"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-4">
            <motion.img
              src={account?.type === "CUSTOM" ? account.picture : `/temp-accounts/${account.picture}`}
              alt={account.fullName}
              className="w-16 h-16 rounded-full border-2 border-blue-400"
              whileHover={{ scale: 1.1, rotate: 10 }}
            />
            <div>
              <h2 className="text-2xl font-bold">{account.fullName}</h2>
              <p className="text-blue-400">Dashboard</p>
            </div>
          </div>
          <motion.button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </motion.button>
        </motion.header>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          <StatCard icon={Activity} title="Active Users" value={<AnimatedCounter value="15234" />} trend={2.5} />
          <StatCard icon={DollarSign} title="Revenue" value={<AnimatedCounter value="684250" />} trend={-1.8} />
          <StatCard icon={Users} title="New Clients" value={<AnimatedCounter value="384" />} trend={5.2} />
          <StatCard icon={TrendingUp} title="Growth" value="12.5%" trend={3.1} />
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-xl font-bold mb-4">Revenue Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ background: '#111827', border: 'none' }} />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-xl font-bold mb-4">User Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ background: '#111827', border: 'none' }} />
                <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 col-span-2"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="flex items-center justify-between bg-white/5 p-3 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-semibold">John Doe</p>
                      <p className="text-sm text-gray-400">2 minutes ago</p>
                    </div>
                  </div>
                  <p className="font-bold">$250.00</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: BarChart2, label: 'Analytics' },
                { icon: PieChart, label: 'Reports' },
                { icon: Users, label: 'Team' },
                { icon: Calendar, label: 'Schedule' }
              ].map((item, i) => (
                <motion.button
                  key={i}
                  className="flex flex-col items-center justify-center bg-white/5 p-4 rounded-lg"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon size={24} className="mb-2" />
                  <span>{item.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Protected;