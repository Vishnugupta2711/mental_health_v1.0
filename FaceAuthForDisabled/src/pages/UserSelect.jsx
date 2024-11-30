import React, { useState, useEffect } from "react";
import User from "../components/User";
import { RadioGroup } from "@headlessui/react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const accounts = [
  {
    id: "374ed1e4-481b-4074-a26e-6137657c6e35",
    fullName: "Akshat baranwal",
    picture: "374ed1e4-481b-4074-a26e-6137657c6e35/1.jpg",
  },
  {
    id: "43332f46-89a4-435c-880e-4d72bb51149a",
    fullName: "Akshit bhatt",
    picture: "43332f46-89a4-435c-880e-4d72bb51149a/2.jpg",
  },
  {
    id: "88421e2c-ca7a-4332-815f-6e12824e2d05",
    fullName: "Abhay Kumar",
    picture: "/88421e2c-ca7a-4332-815f-6e12824e2d05/4.jpg",
  },
  {
    id: "0c2f5599-9296-4f94-97d5-e773043188ae",
    fullName: "Vishnu Gupta",
    picture: "/0c2f5599-9296-4f94-97d5-e773043188ae/5.jpg",
  },
];

function UserSelect() {
  const [selected, setSelected] = useState(accounts[0]);
  const [customUser, setCustomUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  useEffect(() => {
    // Simulating loading state
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex flex-col items-center justify-center gap-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute inset-0 bg-noise-pattern opacity-5"></div>
      
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex flex-col items-center justify-center"
        >
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-xl font-semibold">Loading...</p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md p-6 bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-center"
          >
            Select a Dummy User to Log In
          </motion.h1>
          
          <motion.div variants={itemVariants} className="w-full">
            <RadioGroup value={selected} onChange={setSelected}>
              <RadioGroup.Label className="sr-only">Select User</RadioGroup.Label>
              <div className="space-y-2">
                <AnimatePresence>
                  {accounts.map((account) => (
                    <motion.div
                      key={account.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <User user={account} />
                    </motion.div>
                  ))}
                  {customUser && (
                    <motion.div
                      className="relative"
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <User key={customUser.id} user={customUser} type="CUSTOM" />
                      <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="text-indigo-800 w-6 h-6 absolute top-1/2 -translate-y-1/2 right-[-32px] cursor-pointer"
                        onClick={() => {
                          setCustomUser(null);
                          selected?.type === "CUSTOM" && setSelected(accounts[0]);
                        }}
                        whileHover={{ scale: 1.2, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </motion.svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </RadioGroup>

            {!customUser && (
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center justify-center w-full mt-3"
              >
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:border-indigo-200 hover:bg-gray-100 transition duration-300"
                >
                  <div className="flex flex-col items-center justify-center py-4">
                    <motion.svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 text-indigo-500 mb-2"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                      />
                    </motion.svg>
                    <p className="font-semibold mb-2 text-sm text-gray-500 dark:text-gray-400">
                      Click to upload referral image
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG or JPEG
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    className="hidden"
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (files == null || files.length === 0) {
                        setErrorMessage("No files wait for import.");
                        return;
                      }
                      let file = files[0];
                      let name = file.name;
                      let suffixArr = name.split("."),
                        suffix = suffixArr[suffixArr.length - 1];
                      if (suffix !== "png" && suffix !== "jpg" && suffix !== "jpeg") {
                        setErrorMessage("Only support png jpg or jpeg files.");
                        return;
                      }

                      const base64 = await convertBase64(file);
                      const user = {
                        id: "custom",
                        fullName: name,
                        type: "CUSTOM",
                        picture: base64,
                      };

                      setCustomUser(user);
                      setSelected(user);
                    }}
                  />
                </label>
                <AnimatePresence>
                  {errorMessage && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-xs mt-2"
                    >
                      {errorMessage}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
            <motion.div
              variants={itemVariants}
              className="mt-4 flex justify-center"
            >
              <Link
                to="/login"
                state={{ account: selected }}
                className="inline-flex items-center rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition duration-300 transform hover:scale-105"
              >
                <motion.span
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Continue
                </motion.span>
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="ml-1.5 h-5 w-5"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                  />
                </motion.svg>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      <style jsx>{`
        h1 {
          background-size: 200% 200%;
          animation: gradientFlow 5s ease infinite;
        }
        @keyframes gradientFlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .bg-grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .bg-noise-pattern {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}

export default UserSelect;