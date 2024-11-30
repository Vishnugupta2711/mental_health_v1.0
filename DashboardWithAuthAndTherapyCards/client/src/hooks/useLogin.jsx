import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { message } from "antd";

const useLogin = () => {
  const { login } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const loginUser = async (values) => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();
      if (res.ok) {
        message.success(data.message);
        login(data.token, data.user);
      } else {
        setError(data.message);
        message.error(data.message);
      }
    } catch (error) {
      setError("An error occurred during login");
      message.error("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return {
    error,
    loading,
    loginUser,
  };
};

export default useLogin;
