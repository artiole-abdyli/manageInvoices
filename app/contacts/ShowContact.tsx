"use client";

import { Card, Descriptions, Typography, Space, Button } from "antd";
import { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

type Props = {
  id: string;
};

type Contact = {
  id?: number;
  firstname: string;
  lastname: string;
  phone_number: string;
  city?: string;
  country?: string;
};

export default function ShowContact({ id }: Props) {
  const [contact, setContact] = useState<Contact>();

  const fetchReservationDetails = async (id: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/contact/${id}`, {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch contact");
      const rawData = await response.json();

      setContact(rawData.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReservationDetails(id);
  }, [id]);

  return (
    <div style={{ padding: "15px" }}>
      <Space
        direction="horizontal"
        align="center"
        style={{
          justifyContent: "space-between",
          width: "900px",
          marginTop: 16,
        }}
      >
        <Typography.Title level={2}>Contact #{id}</Typography.Title>

        <Space>
          <Button type="primary" icon={<EditOutlined />}>
            Edit
          </Button>
        </Space>
      </Space>

      <Card title="Contact Details" style={{ marginTop: 24, width: "900px" }}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Firstname">
            {contact?.firstname}
          </Descriptions.Item>
          <Descriptions.Item label="Lastname">
            {contact?.lastname}
          </Descriptions.Item>
          <Descriptions.Item label="Phone number">
            {contact?.phone_number}
          </Descriptions.Item>
          <Descriptions.Item label="City">{contact?.city}</Descriptions.Item>
          <Descriptions.Item label="Country">
            {contact?.country}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
