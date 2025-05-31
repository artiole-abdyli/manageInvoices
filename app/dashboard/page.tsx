"use client";
import React from "react";
import {
  Layout,
  Menu,
  Avatar,
  Input,
  Card,
  Table,
  Badge,
  Button,
  Calendar,
  Row,
  Col,
  Space,
  Typography,
} from "antd";
import {
  DashboardOutlined,
  ShoppingOutlined,
  CalendarOutlined,
  ContactsOutlined,
  BarChartOutlined,
  SettingOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function DressesDashboard() {
  const dressData = [
    {
      key: "1",
      name: "Fieral Maxi Dress",
      size: "S, M, L",
      status: "Available",
    },
    {
      key: "2",
      name: "Off Shoulder Gown",
      size: "XS, S",
      status: "Reserved",
    },
    {
      key: "3",
      name: "Sequin Evening",
      size: "M, L",
      status: "Available",
    },
    {
      key: "4",
      name: "Pleated Midi Dress",
      size: "S, L",
      status: "Out for Cleaning",
    },
  ];

  const dressColumns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Size",
      dataIndex: "size",
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   render: (status: any) => {
    //     let color = "green";
    //     if (status === "Reserved") color = "orange";
    //     else if (status === "Out for Cleaning") color = "red";
    //     return <Badge color={color} text={status} />;
    //   },
    // },
    {
      title: "Action",
      render: () => <Button type="link">Edit</Button>,
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Content style={{ margin: "24px 16px" }}>
          <Title level={2}>Dresses Management Dashboard</Title>

          {/* Stats Cards */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card>
                <Text>Total Dresses</Text>
                <Title level={3}>120</Title>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Text>Active Reservations</Text>
                <Title level={3}>8</Title>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Text>Upcoming Reservations</Text>
                <Title level={3}>5</Title>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Text>Contacts</Text>
                <Title level={3}>1,540</Title>
              </Card>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={16}>
              <Card title="Dresses Inventory">
                <Table
                  dataSource={dressData}
                  columns={dressColumns}
                  pagination={false}
                />
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
}
