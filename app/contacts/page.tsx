"use client";
import { Button, Form, Input, Modal, Table, message, Popconfirm } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Router } from "next/router";
import { useRouter } from "next/navigation";

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
  const [newContactCreated, setNewContactCreated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = useForm();
  const router = useRouter();

  const handleDelete = async (id?: number) => {
    if (!id) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/contacts/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to delete contact");

      setContacts((prev) => prev.filter((c) => c.id !== id));
      message.success("Contact deleted successfully!");
    } catch (error) {
      console.error(error);
      message.error("Failed to delete contact");
    }
  };

  const columns = [
    { name: "firstname", dataIndex: "firstname", title: "First name" },
    { name: "lastname", dataIndex: "lastname", title: "Last name" },
    { name: "phone_number", dataIndex: "phone_number", title: "Phone number" },
    { name: "city", dataIndex: "city", title: "City" },
    { name: "country", dataIndex: "country", title: "Country" },
    {
      name: "action",
      title: "Action",
      render: (_: any, record: Contact) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <EditOutlined style={{ cursor: "pointer" }} />

          <Popconfirm
            title="Are you sure to delete this contact?"
            onConfirm={(e) => {
              e?.stopPropagation();
              handleDelete(record.id);
            }}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const showModal = () => setIsModalOpen(true);
  const closeModal = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/contacts", {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch contacts");

      const rawData = await response.json();

      const contactsArray = Array.isArray(rawData) ? rawData : rawData.data;
      if (!Array.isArray(contactsArray))
        throw new Error("Contacts are not an array");

      setContacts(contactsArray);
    } catch (error) {
      console.error(error);
      message.error("Failed to load contacts");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [newContactCreated]);

  const handleCreate = async (values: Omit<Contact, "id">) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(values),
      });
      setNewContactCreated(true);
      if (!response.ok) throw new Error("Failed to create contact");

      const responseData = await response.json();

      // Use responseData.data if your Laravel returns the contact inside a `data` key
      const createdContact = responseData.data ?? responseData;

      setContacts((prev) => [...prev, createdContact]);

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
          justifyContent: "space-between",
          alignItems: "center",
          margin: "20px 0",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "500" }}>
          Contacts of Chique dolls
        </h1>

        <Button type="primary" onClick={showModal}>
          Create +
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={contacts}
        rowKey="id"
        onRow={(record) => {
          return {
            onClick: () => {
              router.push(`/contacts/${record.id}`);
            },
            style: { cursor: "pointer" }, // optional: visual cue
          };
        }}
      />

      <Modal
        title="Create Contact"
        open={isModalOpen}
        onCancel={closeModal}
        onOk={() => form.submit()}
        okText="Create"
        width={600}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleCreate}
          style={{ marginTop: "40px", marginBottom: "60px" }}
        >
          <Form.Item
            name="firstname"
            label="First name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastname"
            label="Last name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone_number"
            label="Phone number"
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
    </>
  );
}
