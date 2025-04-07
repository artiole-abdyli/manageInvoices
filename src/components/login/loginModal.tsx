'use client';

import { Button, Form, Input, Typography } from 'antd';

export const LoginModal = () => {
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

        <Form layout="vertical" style={{ width: '100%' }}>
  <Form.Item
    name="email"
    label={<span style={{ color: '#4A90E2', fontWeight: 500,fontSize:"15px" }}>Email</span>}
  >
    <Input style={{ color: '#4A90E2' }} />
  </Form.Item>
  <Form.Item name="password" label={<span style={{ color: '#4A90E2', fontWeight: 500,fontSize:"15px" }}>Password</span>}>
    <Input type="password"></Input>
  </Form.Item>
  <Form.Item style={{display:"flex",justifyContent:"center"}}><Button style={{backgroundColor:"#4A90E2",color:"white"}}>Log in</Button></Form.Item>
</Form>

      </div>
    </div>
  );
};
