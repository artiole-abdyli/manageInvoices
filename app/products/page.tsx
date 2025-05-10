"use client";
import { Button, Form, Input, Modal, Table, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";
type Product = {
  id?: number;
  name?: string;
  price?: string;
  description?: string;
  number_of_reservation?: string;
};

export default function ProductsPage() {
  const [form] = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      name: "product name",
    },
    {
      title: "Price",
      dataIndex: "price",
      name: "price",
    },
    { title: "Description", dataIndex: "description", name: "description" },
    {
      title: "Number of reservation",
      dataIndex: "number_of_reservation",
      name: "number of reservation",
    },
  ];
  const handleCreate = async (values: Omit<[Product], "id">) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Failed to create product");

      const responseData = await response.json();

      // Use responseData.data if your Laravel returns the contact inside a `data` key
      const createdContact = responseData.data ?? responseData;

      // setContacts((prev) => [...prev, createdContact]);

      message.success("Contact created successfully!");
      // closeModal();
    } catch (error) {
      console.error(error);
      message.error("Failed to create contact");
    }
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
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
          Products of Chique dolls
        </h1>

        <Button type="primary" onClick={handleOpenModal}>
          Create +
        </Button>
      </div>{" "}
      <Table columns={columns}></Table>
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        title="Create product"
      >
        <Form
          layout="vertical"
          form={form}
          style={{ paddingTop: "20px", paddingBottom: "20px" }}
        >
          <Form.Item label="Name">
            <Input name="name" />
          </Form.Item>
          <Form.Item label="Price">
            <Input name="Price" />
          </Form.Item>
          <Form.Item label="Short description">
            <Input name="Short description" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
