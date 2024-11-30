import React, { useState } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3); // Initial unread count for demo
  const [notificationsList, setNotificationsList] = useState([
    {
      id: 1,
      text: "New message from John Doe",
      time: "2 minutes ago",
      read: false,
    },
    {
      id: 2,
      text: "Your report has been processed",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      text: "Meeting reminder: Team sync at 2 PM",
      time: "3 hours ago",
      read: false,
    },
  ]);

  const markAsRead = (id) => {
    setNotificationsList((prevList) =>
      prevList.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    setUnreadCount((prevCount) => Math.max(0, prevCount - 1));
  };

  const markAllAsRead = () => {
    setNotificationsList((prevList) =>
      prevList.map((notification) => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="relative cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full 
                      text-xs flex items-center justify-center text-white"
          >
            {unreadCount}
          </motion.span>
        )}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200"
          >
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-blue-500 font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notificationsList.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-3 border-b border-gray-100 cursor-pointer 
                            hover:bg-gray-50 transition-colors duration-200
                            ${notification.read ? "bg-white" : "bg-blue-50"}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start">
                    <p className="text-blue-500 text-sm">{notification.text}</p>
                    {!notification.read && (
                      <span className="h-2 w-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                  <p className="text-blue-500 text-xs mt-1">
                    {notification.time}
                  </p>
                </motion.div>
              ))}
              {notificationsList.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
