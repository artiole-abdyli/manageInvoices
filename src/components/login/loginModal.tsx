'use client';

import { Button, Form, Input, Typography, message } from 'antd';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ import for navigation

export const LoginModal = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // ✅ initialize router

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed.');
      }

      localStorage.setItem('token', data.token);
      message.success('Login successful!');

      // ✅ Redirect to dashboard or wherever
      router.push('/dashboard'); // or any route you want
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: 24,
          borderRadius: 15,
          maxWidth: "30%",
          width: "100%",
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Typography style={{ color: "#4A90E2", fontSize: "20px", marginBottom: 24 }}>
          Please log in to continue
        </Typography>

        <Form layout="vertical" style={{ width: '100%' }} onFinish={handleLogin}>
          <Form.Item
            name="email"
            label={<span style={{ color: '#4A90E2', fontWeight: 500, fontSize: "15px" }}>Email</span>}
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <Input style={{ color: '#4A90E2' }} />
          </Form.Item>
          <Form.Item
            name="password"
            label={<span style={{ color: '#4A90E2', fontWeight: 500, fontSize: "15px" }}>Password</span>}
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item style={{ display: "flex", justifyContent: "center" }}>
            <Button
              htmlType="submit"
              loading={loading}
              style={{ backgroundColor: "#4A90E2", color: "white" }}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
