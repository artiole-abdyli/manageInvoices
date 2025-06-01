"use client";
import React, { useEffect, useState } from "react";
import { Layout, Card, Table, Button, Row, Col, Typography } from "antd";
import {
  ShoppingOutlined,
  ScheduleOutlined,
  ContactsOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Content } = Layout;
const { Title, Text } = Typography;

export default function DressesDashboard() {
  const [numberOfProducts, setNumberOfProducts] = useState<any>();
  const [numberOfReservations, setNumberOfReservations] = useState<any>();
  const [numberOfContacts, setNumberOfContacts] = useState<any>();
  const [products, setProducts] = useState([]);
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/products", {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch products");

      const rawData = await response.json();
      const productsArray = Array.isArray(rawData) ? rawData : rawData.data;

      if (!Array.isArray(productsArray)) {
        throw new Error("Products are not an array");
      }

      setProducts(productsArray as any);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const productColumns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      render: (record: any) => (
        <Button
          type="link"
          onClick={() => router.push(`/products/${record.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

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
  const router = useRouter();

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

          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card
                onClick={() => router.push("/products")}
                hoverable
                style={{ cursor: "pointer" }}
              >
                <ShoppingOutlined
                  style={{
                    fontSize: 28,
                    color: "#1890ff",
                    marginRight: "10px",
                  }}
                />
                <Text
                  style={{
                    color: "#1677ff",
                    fontWeight: "500",
                    fontSize: "16px",
                  }}
                >
                  Total Dresses
                </Text>
                <Title level={3} style={{ marginLeft: "40px" }}>
                  {numberOfProducts}
                </Title>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                onClick={() => router.push("/reservations")}
                hoverable
                style={{ cursor: "pointer" }}
              >
                <ScheduleOutlined
                  style={{
                    fontSize: 28,
                    color: "#1890ff",
                    marginRight: "10px",
                  }}
                />

                <Text
                  style={{
                    color: "#1677ff",
                    fontWeight: "500",
                    fontSize: "16px",
                  }}
                >
                  Active Reservations
                </Text>
                <Title level={3} style={{ marginLeft: "40px" }}>
                  {numberOfReservations}
                </Title>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                onClick={() => router.push("/contacts")}
                hoverable
                style={{ cursor: "pointer" }}
              >
                <ContactsOutlined
                  style={{
                    fontSize: 28,
                    color: "#1890ff",
                    marginRight: "10px",
                  }}
                />

                <Text
                  style={{
                    color: "#1677ff",
                    fontWeight: "500",
                    fontSize: "16px",
                  }}
                >
                  Contacts
                </Text>
                <Title level={3} style={{ marginLeft: "40px" }}>
                  {numberOfContacts}
                </Title>
              </Card>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={16}>
              <Card title="Dresses Inventory">
                <Table
                  dataSource={products}
                  columns={productColumns}
                  rowKey="id"
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
