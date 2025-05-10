"use client";
import { Button, Form, Input, Modal, Table, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";

// ID is optional because we don't send it when creating
type Contact = {
  id?: number;
  firstname: string;
  lastname: string;
  phone_number: string;
  city?: string;
  country?: string;
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = useForm();

  const columns = [
    { name: "firstname", dataIndex: "firstname", title: "First name" },
    { name: "lastname", dataIndex: "lastname", title: "Last name" },
    { name: "phone_number", dataIndex: "phone_number", title: "Phone number" },
    { name: "city", dataIndex: "city", title: "City" },
    { name: "country", dataIndex: "country", title: "Country" },
  ];

  const showModal = () => setIsModalOpen(true);
  const closeModal = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleCreate = async (values: Omit<Contact, "id">) => {
    try {
      // convert form values to query string
      const queryParams = new URLSearchParams(values as any).toString();

      const response = await fetch(
        `http://127.0.0.1:8000/api/contacts?${queryParams}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to create contact");

      const createdContact: Contact = await response.json();
      setContacts((prev) => [...prev, createdContact]); // ✅ this is OK now
      message.success("Contact created successfully!");
      closeModal();
    } catch (error) {
      console.error(error);
      message.error("Failed to create contact");
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <Button type="primary" onClick={showModal}>
          Create +
        </Button>
      </div>

      <Table columns={columns} dataSource={contacts} rowKey="id" />

      <Modal
        title="Create Contact"
        open={isModalOpen}
        onCancel={closeModal}
        onOk={() => form.submit()}
        okText="Create"
      >
        <Form layout="vertical" form={form} onFinish={handleCreate}>
          <Form.Item
            name="firstname"
            label="First name"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastname"
            label="Last name"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone_number"
            label="Phone number"
            rules={[{ required: true, message: "Please enter phone number" }]}
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
    </>
  );
}
