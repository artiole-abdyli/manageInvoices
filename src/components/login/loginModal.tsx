"use client";

import { Button, Form, Input, Typography, message } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const LoginModal = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed.");
      }

      localStorage.setItem("token", data.token);
      message.success("Login successful!");

      router.push("/contacts");
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "url('/images/chique_dolls_logo.svg') no-repeat center/cover",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
     
      <div
        style={{
          backgroundColor: "white",
          padding: "36px 28px",
          borderRadius: "12px",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
          maxWidth: "420px",
          width: "100%",
        }}
      >
        <Typography.Title
          level={3}
          style={{
            color: "#222",
            textAlign: "center",
            marginBottom: "32px",
            fontWeight: 600,
          }}
        >
        Chique Dolls
        </Typography.Title>

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            name="email"
            label={<label style={{ fontWeight: 500 }}>Email Address</label>}
            rules={[
              { required: true, message: "Please enter your email address" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input
              style={{
                borderRadius: 8,
                padding: "10px 12px",
                fontSize: "15px",
              }}
              placeholder="you@example.com"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<label style={{ fontWeight: 500 }}>Password</label>}
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              style={{
                borderRadius: 8,
                padding: "10px 12px",
                fontSize: "15px",
              }}
              placeholder="Enter your password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              htmlType="submit"
              loading={loading}
              block
              style={{
                backgroundColor: "#000",
                color: "#fff",
                padding: "12px",
                fontSize: "16px",
                borderRadius: "8px",
                fontWeight: "500",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.opacity = "1";
              }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
