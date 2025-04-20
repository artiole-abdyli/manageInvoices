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

const { Sider } = Layout;
const columns = [
  {
    title: "Company name",
    dataIndex: "company_name",
    key: "company_name",
  },
  {
    title: "Company email",
    dataIndex: "company_email",
    key: "company_email",
  },
  {
    title: "Company employees",
    dataIndex: "company_employees",
    key: "company_employees",
  },
];

export default function DashboardPage() {
  const [form] = Form.useForm();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user, isLoading } = useAuth();
  console.log("user", user);
  // console.log("role", role);
  const openModal = () => setIsCreateModalOpen(true);
  const closeModal = () => {
    form.resetFields();
    setIsCreateModalOpen(false);
  };

  const handleSubmit = (values: any) => {
    console.log("New company:", values);
    closeModal();
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={300} style={{ backgroundColor: "#4A90E2" }}>
        <Menu mode="inline" defaultSelectedKeys={["1"]} theme="dark"></Menu>
      </Sider>

      <Layout>
        <Modal
          title={<Typography.Title level={4}>Create Company</Typography.Title>}
          centered
          width={600}
          open={isCreateModalOpen}
          onCancel={closeModal}
          okText="Create"
          cancelText="Cancel"
          onOk={() => form.submit()}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            requiredMark={false}
          >
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Form.Item
                name="company_name"
                label="Company Name"
                rules={[{ required: true, message: "Please enter a name" }]}
              >
                <Input placeholder="e.g. Acme Corp" />
              </Form.Item>

              <Form.Item
                name="company_email"
                label="Email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Enter a valid email",
                  },
                ]}
              >
                <Input placeholder="e.g. contact@acme.com" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Please set a password" }]}
              >
                <Input.Password placeholder="••••••••" />
              </Form.Item>

              <Form.Item
                name="company_employees"
                label="Number of Employees"
                rules={[
                  { required: true, message: "Please specify employee count" },
                ]}
              >
                <Input type="number" placeholder="e.g. 50" />
              </Form.Item>
            </Space>
          </Form>
        </Modal>

        <Content style={{ padding: 30 }}>
          <Table
            title={() => (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Companies</span>
                <Button type="primary" onClick={openModal}>
                  +
                </Button>
              </div>
            )}
            dataSource={[]}
            columns={columns}
            rowKey="company_name"
          />
        </Content>
      </Layout>
    </Layout>
  );
}
