"use client";

import {
  Card,
  Descriptions,
  Typography,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Row,
  Col,
  message,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

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

  const fetchReservationDetails = async (id: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/contact/${id}`, {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch contact");
      const rawData = await response.json();
      setContact(rawData.data);
      form.setFieldsValue(rawData.data); // Ensure form gets updated when modal opens
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
      fetchReservationDetails(id); // refresh
    } catch (error) {
      console.error(error);
      message.error("Failed to update contact");
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: 1000, margin: "0 auto" }}>
      <Space
        direction="horizontal"
        align="center"
        style={{
          justifyContent: "space-between",
          width: "100%",
          marginBottom: 24,
        }}
      >
        <Typography.Title level={2} style={{ margin: 0 }}>
          Contact #{id}
        </Typography.Title>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => setOpenContactModal(true)}
        >
          Edit Contact
        </Button>
      </Space>

      <Card title="Contact Details" bordered>
        <Descriptions column={2} labelStyle={{ fontWeight: 500 }}>
          <Descriptions.Item label="First Name">
            {contact?.firstname || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Last Name">
            {contact?.lastname || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Phone Number">
            {contact?.phone_number || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="City">
            {contact?.city || "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Country">
            {contact?.country || "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Modal
        title="Edit Contact"
        open={openContactModal}
        onCancel={() => setOpenContactModal(false)}
        onOk={() => form.submit()}
        okText="Save Changes"
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditContact}
          style={{ marginTop: 16 }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstname"
                label="First Name"
                rules={[{ required: true, message: "First name is required" }]}
              >
                <Input placeholder="Enter first name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastname"
                label="Last Name"
                rules={[{ required: true, message: "Last name is required" }]}
              >
                <Input placeholder="Enter last name" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="phone_number"
            label="Phone Number"
            rules={[{ required: true, message: "Phone number is required" }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="city" label="City">
                <Input placeholder="Enter city" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="country" label="Country">
                <Input placeholder="Enter country" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
