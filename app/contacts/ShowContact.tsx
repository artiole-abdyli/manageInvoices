"use client";

import { Card, Descriptions, Typography, Space, Button, Modal } from "antd";
import { useEffect, useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Form, Input, message } from "antd";

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
  const [openContactModal, setOpenContactModal] = useState(false);
  const [form] = Form.useForm();

  const handleClose = () => {
    setOpenContactModal(false);
  };
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
  const handleEditContact = async (values: Contact) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/contacts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Failed to update contact");

      message.success("Contact updated successfully");
      setOpenContactModal(false);
      fetchReservationDetails(id); // refresh data
    } catch (error) {
      console.error(error);
      message.error("Failed to update contact");
    }
  };

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
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setOpenContactModal(true)}
          >
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
      <Modal
        title="Edit Contact"
        open={openContactModal}
        onCancel={handleClose}
        onOk={() => form.submit()}
        okText="Save"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={contact}
          onFinish={handleEditContact}
        >
          <Form.Item
            name="firstname"
            label="Firstname"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="lastname"
            label="Lastname"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone_number"
            label="Phone Number"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="city" label="City">
            <Input />
          </Form.Item>

          <Form.Item name="country" label="Country">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
