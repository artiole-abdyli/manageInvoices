"use client";

import { Button, Form, Input, Typography, message } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ import for navigation

export const LoginModal = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // ✅ initialize router

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

      router.push("/dashboard");
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        /* full-bleed image or pattern */
        background:
          "url('/images/chique_dolls_logo.svg') no-repeat center/cover",
        height: "80vh",

        /* center your form */
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
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          maxWidth: "400px",
          width: "90%",
        }}
      >
        <Typography
          style={{ color: "black", fontSize: "20px", marginBottom: 24 }}
        >
          Chique dolls exclusive
        </Typography>

        <Form
          layout="vertical"
          style={{ width: "100%" }}
          onFinish={handleLogin}
        >
          <Form.Item
            name="email"
            label={
              <span
                style={{ color: "black", fontWeight: 500, fontSize: "15px" }}
              >
                Email
              </span>
            }
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input style={{ color: "black" }} />
          </Form.Item>
          <Form.Item
            name="password"
            label={
              <span
                style={{ color: "black", fontWeight: 500, fontSize: "15px" }}
              >
                Password
              </span>
            }
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item style={{ display: "flex", justifyContent: "center" }}>
            <Button
              htmlType="submit"
              loading={loading}
              style={{ backgroundColor: "black", color: "white" }}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
