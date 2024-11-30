import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Brain,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  Shield,
  Accessibility,
  Camera
} from 'lucide-react';
import registerimg from "../assets/city1.jpg";
import useSignup from "../hooks/useSignup.jsx";

const Register = () => {
  const { loading, error, registerUser } = useSignup();

  const handleRegister = (event) => {
    event.preventDefault();
    const values = {
      name: event.target.name.value,
      email: event.target.email.value,
      password: event.target.password.value,
      passwordConfirm: event.target.passwordConfirm.value,
    };
    registerUser(values);
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const CustomInput = ({ icon: Icon, label, type, name, rules, placeholder }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="mb-6"
    >
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={type}
          name={name}
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 
            rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            transition-all duration-200 ease-in-out
            focus:shadow-lg"
          placeholder={placeholder}
          style={{ outline: 'none', transition: 'box-shadow 0.2s ease-in-out' }}
        />
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800
      flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-6xl"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row-reverse">
            {/* Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-1/2 p-12"
            >
              <div className="max-w-md mx-auto">
                <motion.div className="text-center mb-8" {...fadeIn}>
                  <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-indigo-600 
                    text-transparent bg-clip-text">
                    Create Account
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Begin your Aura+ journey today
                  </p>
                </motion.div>

                <form onSubmit={handleRegister}>
                  <CustomInput
                    icon={User}
                    label="Full Name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                  />

                  <CustomInput
                    icon={Mail}
                    label="Email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                  />

                  <CustomInput
                    icon={Lock}
                    label="Password"
                    type="password"
                    name="password"
                    placeholder="Create a password"
                  />

                  <CustomInput
                    icon={Shield}
                    label="Confirm Password"
                    type="password"
                    name="passwordConfirm"
                    placeholder="Confirm your password"
                  />

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6"
                      >
                        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 
                          px-4 py-3 rounded-xl flex items-center space-x-2">
                          <span className="text-sm">{error}</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 rounded-xl text-white font-medium mb-4
                      ${loading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:shadow-lg'
                      } transition-all duration-200 ease-in-out relative`}
                    disabled={loading}
                  >
                    <span className="flex items-center justify-center space-x-2">
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          <span>Create Account</span>
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </span>
                  </motion.button>

                  {/* Added Alternative Registration Options */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center space-x-2 w-full py-3 px-4 
                        bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition-all duration-200"
                    >
                      <Accessibility className="h-5 w-5" />
                      <span>Login for PWD</span>
                    </motion.button>
                    
                    <motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  onClick={() => window.location.href = "http://localhost:5174/"}
  className="flex items-center justify-center space-x-2 w-full py-3 px-4 
    bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all duration-200"
>
  <Camera className="h-5 w-5" />
  <span>Face Auth</span>
</motion.button>

                  </div>

                  <motion.div
                    {...fadeIn}
                    className="mt-6 text-center"
                  >
                    <p className="text-gray-600 dark:text-gray-400">
                      Already have an account?{' '}
                      <Link to="/login">
                        <motion.span
                          whileHover={{ color: '#8B5CF6' }}
                          className="text-purple-600 dark:text-purple-400 font-medium hover:underline"
                        >
                          Sign In
                        </motion.span>
                      </Link>
                    </p>
                  </motion.div>
                </form>
              </div>
            </motion.div>

            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:w-1/2 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-600/90 z-10" />
              <img
                src={registerimg}
                alt="Register"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="relative z-20 p-12 h-full flex flex-col justify-between text-white">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center space-x-3"
                >
                  <Brain className="h-8 w-8" />
                  <span className="text-2xl font-bold">Aura+</span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-3xl font-bold mb-4">Start Your Journey</h2>
                  <p className="text-lg text-white/80">
                    Join our community of mindful individuals and discover a better way to live.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-4"
                >
                  {[
                    { icon: Sparkles, text: "Personalized mindfulness experiences" },
                    { icon: Shield, text: "Secure and private environment" },
                    { icon: Brain, text: "AI-powered insights and guidance" }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.2 }}
                      className="flex items-center space-x-3"
                    >
                      <feature.icon className="h-5 w-5" />
                      <span>{feature.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;