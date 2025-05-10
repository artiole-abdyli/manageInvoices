"use client";
import { Button, Form, Input, Modal, Table } from "antd";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";

export default function ContactsPage() {
  const columns = [
    {
      name: "firstname",
      dataIndex: "firstname",
      title: "First name",
    },
    {
      name: "lastname",
      dataIndex: "lastname",
      title: "Last name",
    },
    {
      name: "phone_number",
      dataIndex: "phone_number",
      title: "Phone number",
    },
    {
      name: "city",
      dataIndex: "city",
      title: "City",
    },
    { name: "country", dataIndex: "country", title: "Country" },
  ];
  const showModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const form = useForm();

  return (
    <>
      <Button
        type="primary"
        style={{
          marginTop: "20px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "flex-end",
        }}
        onClick={showModal}
      >
        Create +
      </Button>
      <Table columns={columns}></Table>

      <Modal
        title="Create Contact"
        open={isModalOpen}
        // onOk={handleOk}
        onCancel={closeModal}
        okText="Create"
      >
        <Form layout="vertical">
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
