"use client";
import { Button, Form, Input, Modal, Popconfirm, Table, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

type Product = {
  id?: number;
  name?: any;
  price?: number;
  deposit?: number;
  description?: any;
  number_of_reservation?: any;
};

export default function ProductsPage() {
  const [form] = useForm();
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProductCreated, setNewProductCreated] = useState(false);
  const [productDeleted, setProductDeleted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredProducts = products?.filter((product) =>
    `${product?.name} ${product?.price} ${product?.deposit} ${product?.description}`
      .toLowerCase()
      .includes(searchTerm.toLocaleLowerCase())
  );
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/products", {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch products");

      const rawData = await response.json(); // ✅ only call this once
      console.log("product json data", rawData.data);

      const productsArray = Array.isArray(rawData) ? rawData : rawData.data;
      if (!Array.isArray(productsArray)) {
        throw new Error("Products are not an array");
      }

      setProducts(productsArray);
    } catch (error) {
      console.error(error);
      message.error("Failed to load products");
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });
      setProductDeleted(true);

      if (!response.ok) throw new Error("Failed to delete product");

      message.success("Product deleted successfully!");
    } catch (error) {
      console.error(error);
      message.error("Failed to delete product");
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [newProductCreated, productDeleted]);
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
    {
      name: "action",
      title: "Action",
      render: (_: any, record: Product) => (
        <div>
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
          </Popconfirm>
        </div>
      ),
    },
  ];
  const handleCreate = async (values: Omit<Product, "id">) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(values),
      });
      setNewProductCreated(true);
      if (!response.ok) throw new Error("Failed to create product");

      message.success("Product created successfully!");
      handleCloseModal();
    } catch (error) {
      console.error(error);
      message.error("Failed to create product");
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
      <Input.Search
        placeholder="Search products"
        allowClear
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: 300, marginBottom: 20 }}
      />
      <Table columns={columns} dataSource={filteredProducts}></Table>
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        title="Create product"
        onOk={() => form.submit()}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleCreate}
          style={{ paddingTop: "20px", paddingBottom: "20px" }}
        >
          <Form.Item name="name" label="Name">
            <Input name="name" />
          </Form.Item>
          <Form.Item name="price" label="Price">
            <Input name="price" />
          </Form.Item>
          <Form.Item name="description" label="Short description">
            <Input name="description" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
