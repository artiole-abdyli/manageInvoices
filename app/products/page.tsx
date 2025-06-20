"use client";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Table,
  Upload,
  message,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import TextArea from "antd/es/input/TextArea";
type Product = {
  id?: number;
  name?: any;
  price?: number;
  deposit?: number;
  status?: string;
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
 
  const [minPrice, setMinPrice] = useState<number | undefined>();
const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const router = useRouter();
  const searchedFilters = products?.filter((product) =>
    `${product?.name} ${product?.price} ${product?.deposit} ${product?.description}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  
  const filteredProducts = searchedFilters?.filter((product) => {
    const matchesPriceRange =
      (minPrice === undefined || product.price! >= minPrice) &&
      (maxPrice === undefined || product.price! <= maxPrice);
    return matchesPriceRange;
  });
  
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
  const handleStatusToggle = async (product: Product) => {
    const newStatus =
      product?.status === "available" ? "out of stock" : "available";

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/products/${product.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ ...product, status: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status");

      message.success("Status updated successfully");
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error(error);
      message.error("Failed to update status");
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [newProductCreated, productDeleted]);
  const columns = [
    {
      title: "Image",
      dataIndex: "image_full_url", // updated field
      render: (url: string) =>
        url ? (
          <img
            src={url}
            style={{ width: 30, height: 30, objectFit: "cover" }}
          />
        ) : (
          "No image"
        ),
    },
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
      title: "Status",
      dataIndex: "status",
      name: "status",
      // render: (_: any, record: Product) => (
      //   <Button
      //     type="link"
      //     onClick={() => handleStatusToggle(record)}
      //     style={{
      //       color: record.status === "available" ? "green" : "red",
      //       padding: 0,
      //     }}
      //   >
      //     {record.status === "available" ? "Available" : "Out of stock"}
      //   </Button>
      // ),
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
  const handleCreate = async (values: any) => {
    try {
      const formData = new FormData();

      // Append text fields
      formData.append("name", values.name);
      formData.append("price", values.price);
      formData.append("description", values.description || "");

      // Append image file
      if (values.image && values.image[0]) {
        formData.append("image", values.image[0].originFileObj);
      }

      const response = await fetch("http://127.0.0.1:8000/api/products", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to create product");

      message.success("Product created successfully!");
      setNewProductCreated(true);
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
      <div style={{ display: "flex", gap: "1rem", marginBottom: 20 }}>
  <InputNumber
    placeholder="Min Price"
    style={{ width: 150 }}
    value={minPrice}
    onChange={(value) => setMinPrice(value ?? undefined)}
    />
  <InputNumber
    placeholder="Max Price"
    style={{ width: 150 }}
    value={maxPrice}
    onChange={(value) => setMaxPrice(value ?? undefined)}
    />
</div>
      <Table
        columns={columns}
        dataSource={filteredProducts}
        onRow={(record) => {
          return {
            onClick: () => {
              router.push(`/products/${record.id}`);
            },
            style: { cursor: "pointer" },
          };
        }}
      ></Table>
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
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input name="name" required />
          </Form.Item>
          <Form.Item
            name="image"
            label="Product Image"
            valuePropName="file"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
          >
            <Upload
              listType="picture-card"
              beforeUpload={() => false} // prevents auto upload
              accept="image/*"
              maxCount={1}
            >
              + Upload
            </Upload>
          </Form.Item>
          <Form.Item name="price" label="Price">
            <InputNumber name="price" />
          </Form.Item>
          <Form.Item name="description" label="Short description">
            <TextArea name="description" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
