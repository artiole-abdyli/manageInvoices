"use client";
import React, { useEffect, useState } from "react";
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
  BarChartOutlined,
  SettingOutlined,
  SearchOutlined,
  UserOutlined,
  ScheduleOutlined,
  ContactsOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function DressesDashboard() {
  const [numberOfProducts, setNumberOfProducts] = useState<any>();
  const [numberOfReservations, setNumberOfReservations] = useState<any>();
  const [numberOfContacts, setNumberOfContacts] = useState<any>();
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
  const fetchProductsNumber = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/number-of-products`,
        {
          headers: { Accept: "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch contact");
      const rawData = await response.json();
      setNumberOfProducts(rawData?.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchReservationsNumber = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/reservations-number`,
        {
          headers: { Accept: "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch contact");
      const rawData = await response.json();
      setNumberOfReservations(rawData?.numberOfReservations);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchContactsNumber = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/contacts-number`,
        {
          headers: { Accept: "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch contact");
      const rawData = await response.json();
      setNumberOfContacts(rawData?.contactsNumber);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchProductsNumber();
  }, []);
  useEffect(() => {
    fetchReservationsNumber();
  });
  useEffect(() => {
    fetchContactsNumber();
  });

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
                <ShoppingOutlined
                  style={{
                    fontSize: 28,
                    color: "#1890ff",
                    marginRight: "10px",
                  }}
                />

                <Text>Total Dresses</Text>
                <Title level={3} style={{ marginLeft: "40px" }}>
                  {numberOfProducts}
                </Title>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <ScheduleOutlined
                  style={{
                    fontSize: 28,
                    color: "#1890ff",
                    marginRight: "10px",
                  }}
                />

                <Text>Active Reservations</Text>
                <Title level={3} style={{ marginLeft: "40px" }}>
                  {numberOfReservations}
                </Title>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <ContactsOutlined
                  style={{
                    fontSize: 28,
                    color: "#1890ff",
                    marginRight: "10px",
                  }}
                />

                <Text>Contacts</Text>
                <Title level={3} style={{ marginLeft: "40px" }}>
                  {numberOfContacts}
                </Title>
              </Card>
            </Col>

            {/* <Col span={6}>
              <Card>
                <Text>Contacts</Text>
                <Title level={3}>1,540</Title>
              </Card>
            </Col> */}
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
