"use client";

import {
  Button,
  Form,
  Input,
  Layout,
  Menu,
  Modal,
  Space,
  Table,
  Typography,
} from "antd";
import { UsergroupAddOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Content } from "antd/es/layout/layout";
import { useAuth } from "../context/AppContext";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [form] = Form.useForm();
  const { Sider } = Layout;
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const openModal = () => setIsCreateModalOpen(true);
  const closeModal = () => {
    form.resetFields();
    setIsCreateModalOpen(false);
  };

  const handleSubmit = (values: any) => {
    closeModal();
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={300} style={{ backgroundColor: "#4A90E2" }}>
        <Menu mode="inline" defaultSelectedKeys={["1"]} theme="dark">
          <Menu.Item key="1" icon={<UsergroupAddOutlined />}>
            Clients
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<UsergroupAddOutlined />}
            onClick={() => router.push("/products")}
          >
            Dresses
          </Menu.Item>
          <Menu.Item key="3" icon={<UsergroupAddOutlined />}>
            Reservations
          </Menu.Item>
          <Menu.Item key="4" icon={<UsergroupAddOutlined />}>
            Invoices
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Content style={{ padding: 30 }}></Content>
      </Layout>
    </Layout>
  );
}
