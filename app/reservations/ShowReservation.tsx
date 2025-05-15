"use client";

import { Card, Descriptions, Typography, Space, Button } from "antd";
import { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

type Props = {
  id: string;
};

type Reservation = {
  id?: number;
  date?: string;
  returning_date?: string;
  contact: any;
  deposit?: number;
  price?: number;
  product?: any;
  extra_requirement?: string;
  remaining_payment?: number;
  contact_id?: number; // You can replace this with full contact info
  product_id?: number;
};

export default function ShowReservation({ id }: Props) {
  const [reservation, setReservation] = useState<Reservation>();

  const fetchReservationDetails = async (id: string) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/reservation/${id}`,
        {
          headers: { Accept: "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch reservation");
      const rawData = await response.json();
      console.log("rawDataa:", rawData);

      setReservation(rawData.data);
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
        <Typography.Title level={2}>Reservation #{id}</Typography.Title>

        <Space>
          <Button type="primary" icon={<EditOutlined />}>
            Edit
          </Button>
        </Space>
      </Space>

      <Card
        title="Reservation Details"
        style={{ marginTop: 24, width: "900px" }}
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Start Date">
            {reservation?.date}
          </Descriptions.Item>
          <Descriptions.Item label="Return Date">
            {reservation?.returning_date}
          </Descriptions.Item>
          <Descriptions.Item label="Contact">
            {reservation?.contact?.firstname} {reservation?.contact?.lastname}
          </Descriptions.Item>
          <Descriptions.Item label="Product">
            {reservation?.product?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Price">
            €{reservation?.price}
          </Descriptions.Item>
          <Descriptions.Item label="Deposit">
            €{reservation?.deposit}
          </Descriptions.Item>
          <Descriptions.Item label="Remaining Payment">
            €{reservation?.remaining_payment}
          </Descriptions.Item>
          <Descriptions.Item label="Extra Requirement">
            {reservation?.extra_requirement || "None"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
