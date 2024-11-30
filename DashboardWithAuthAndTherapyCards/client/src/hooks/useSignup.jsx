import React, { useState } from 'react'
import {useAuth} from "../contexts/AuthContext";
import { message } from 'antd';


const useSignup = () => {
    const { login } = useAuth();
    const [error, setError ] = useState(null);
    const [loading, setLoading ] = useState(false);

    const registerUser = async (values) => {
        if (values.password !== values.passwordConfirm) {
            return setError('Passwords are not the same');
        }
    
        try {
            setError(null);
            setLoading(true);
            const res = await fetch('http://localhost:3000/api/auth/register', { // Change here to '/register'
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });
    
            const data = await res.json();
            if (res.status === 201) {
                message.success(data.message);
                login(data.token, data.user);
            } else if (res.status === 400) {
                setError(data.message);
            } else {
                message.error('Registration failed');
            }
    
        } catch (error) {
            message.error(error);
        } finally {
            setLoading(false);
        }
    };
  return {
    error,
    loading,
    registerUser
  }
}

export default useSignup
