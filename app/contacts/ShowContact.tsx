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
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
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
  created_at?: string;
};

export default function ShowContact({ id }: Props) {
  const [contact, setContact] = useState<Contact>();
  const [openContactModal, setOpenContactModal] = useState(false);
  const [form] = Form.useForm<Contact>();

  const fetchReservationDetails = async (id: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/contact/${id}`, {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch contact");
      const rawData = await response.json();
      setContact(rawData.data as Contact);
      form.setFieldsValue(rawData.data); // Ensure form gets updated
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReservationDetails(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleDelete = async (deleteId?: number) => {
    if (!deleteId) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/contacts/${deleteId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to delete contact");

      message.success("Contact deleted successfully!");
      // TODO: navigate away (e.g., router.push("/contacts"))
    } catch (error) {
      console.error(error);
      message.error("Failed to delete contact");
    }
  };

  const confirmDelete = () => {
    Modal.confirm({
      title: "Delete this contact?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okButtonProps: { danger: true },
      onOk: () => handleDelete(contact?.id),
    });
  };

  return (
    <div style={{ padding: "24px", maxWidth: 1000, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: 24,
        }}
      >
        {/* Left side: Contact name */}
        <Typography.Title level={1} style={{ margin: 0, fontSize: "20px" }}>
          Contact: {contact?.firstname} {contact?.lastname}
        </Typography.Title>

        <Space>
          <Button icon={<EditOutlined />} onClick={() => setOpenContactModal(true)}>
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={confirmDelete}
            aria-label="Delete contact"
          />
        </Space>
      </div>

      <Card title="Contact Details" bordered>
        <Descriptions column={1} labelStyle={{ fontWeight: 500 }}>
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
          <Descriptions.Item label="Created At">
            {contact?.created_at
              ? new Date(contact.created_at).toLocaleDateString("en-GB") // DD/MM/YYYY
              : "-"}
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
        width="50%"
      >
        <Form form={form} layout="vertical" onFinish={handleEditContact} style={{ marginTop: 16 }}>
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

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="phone_number"
                label="Phone Number"
                rules={[{ required: true, message: "Phone number is required" }]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
          </Row>

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
