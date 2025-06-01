"use client";

import {
  Card,
  Descriptions,
  Typography,
  Space,
  Button,
  Modal,
  Form,
  DatePicker,
  InputNumber,
  Input,
  message,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

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
  contact_id?: number;
  product_id?: number;
  status?: any;
};

export default function ShowReservation({ id }: Props) {
  const [reservation, setReservation] = useState<Reservation>();
  const [form] = Form.useForm();
  const [openReservationEditModal, setOpenReservationEditModal] =
    useState(false);

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
      setReservation(rawData.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateReservation = async (values: any) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/reservations/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            ...values,
            date: values.date?.format("YYYY-MM-DD"),
            returning_date: values.returning_date?.format("YYYY-MM-DD"),
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update reservation");

      const updated = await response.json();
      setReservation(updated.data);
      setOpenReservationEditModal(false);
      message.success("Reservation updated successfully");
    } catch (error) {
      console.error(error);
      message.error("Failed to update reservation");
    }
  };

  useEffect(() => {
    fetchReservationDetails(id);
  }, [id]);

  useEffect(() => {
    if (openReservationEditModal && reservation) {
      form.setFieldsValue({
        ...reservation,
        date: reservation.date ? dayjs(reservation.date) : null,
        returning_date: reservation.returning_date
          ? dayjs(reservation.returning_date)
          : null,
      });
    }
  }, [openReservationEditModal, reservation, form]);

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
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setOpenReservationEditModal(true)}
          >
            Edit
          </Button>
        </Space>
      </Space>

      <Card
        title="Reservation Details"
        style={{ marginTop: 24, width: "900px" }}
      >
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Status">
            {reservation?.status}
          </Descriptions.Item>
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

      <Modal
        title="Edit Reservation"
        open={openReservationEditModal}
        onOk={() => form.submit()}
        onCancel={() => setOpenReservationEditModal(false)}
        okText="Save"
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateReservation}>
          <Form.Item name="date" label="Date of reservation">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="returning_date" label="Returning date">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="price" label="Total price">
            <InputNumber
              name="price"
              style={{ width: "100%" }}
              placeholder="€"
            />
          </Form.Item>

          <Form.Item name="deposit" label="Deposit">
            <InputNumber
              name="deposit"
              style={{ width: "100%" }}
              placeholder="€"
            />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select placeholder="Select status">
              <Select.Option value="on_time">On Time</Select.Option>
              <Select.Option value="overdue">Overdue</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="remaining_payment" label="Remaining payment">
            <InputNumber
              name="remaining_payment"
              style={{ width: "100%" }}
              placeholder="€"
            />
          </Form.Item>

          <Form.Item name="extra_requirement" label="Extra requirement">
            <Input.TextArea
              rows={4}
              placeholder="Enter extra requirements here..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
