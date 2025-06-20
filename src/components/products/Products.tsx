"use client";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Table,
  Typography,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
type Props = {
  id?: any;
  name?: any;
};
import { useRouter } from "next/navigation";

type Reservation = {
  id: string;
  date?: string;
  returning_date?: string;
  extra_requirement?: string;
  price?: number;
  deposit?: number;
  remaining_payment?: number;
  // Add other fields if needed
};
export default function ProductShowPage({ id }: Props) {
  const [product, setProduct] = useState<any>();
  const [reservation, setReservation] = useState<Reservation[]>([]);
  const [openProductEditModal, setOpenProductEditModal] =
    useState<boolean>(false);
  const [form] = Form.useForm();
  const router = useRouter();

  const handleOpenProductEditModal = () => {
    setOpenProductEditModal(true);
  };
  const handleCloseProductEditModal = () => {
    setOpenProductEditModal(false);
  };
  const fetchProductDetail = async (id: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/products/${id}`, {
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch product");
      const rawData = await response.json();
      setProduct(rawData.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProductReservation = async (id: string) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/product/${id}/reservations`,
        {
          headers: { Accept: "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch reservation");
      const rawData = await response.json();

      const reservationData = Array.isArray(rawData.data)
        ? rawData.data
        : rawData.data
        ? [rawData.data]
        : [];

      setReservation(reservationData);
    } catch (error) {
      console.error(error);
      setReservation([]);
    }
  };
  useEffect(() => {
    if (openProductEditModal) {
      form.setFieldsValue({
        name: product?.name ?? "",
        price: product?.price,
        description: product?.description,
      });
    }
  }, [openProductEditModal, product, form]);
  console.log("Product:", product);
  useEffect(() => {
    if (id) {
      fetchProductDetail(id);
      fetchProductReservation(id);
    }
  }, [id]);
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Returning Date",
      dataIndex: "returning_date",
      key: "returning_date",
    },
    {
      title: "Extra Requirement",
      dataIndex: "extra_requirement",
      key: "extra_requirement",
    },
    {
      title: "Price (€)",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Deposit (€)",
      dataIndex: "deposit",
      key: "deposit",
    },
    {
      title: "Remaining Payment (€)",
      dataIndex: "remaining_payment",
      key: "remaining_payment",
    },
  ];
  const handleUpdateProduct = async (values: any) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/products/update/${id}`,
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

      if (!response.ok) throw new Error("Failed to update product");

      const result = await response.json();
      console.log("Updated:", result);
      fetchProductDetail(id); // refresh the product info
      setOpenProductEditModal(false); // close modal
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "24px",
        padding: "40px",
      }}
    >
      <div
        style={{
          flex: "0 0 40%",
          border: "1px solid #E0E0E0",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <Typography
            style={{
              fontSize: "25px",
              fontWeight: "400",
              margin: 0,
            }}
          >
            {product?.name}
          </Typography>

          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={handleOpenProductEditModal}
          >
            Edit
          </Button>
        </div>

        <div
          style={{
            marginTop: "20px",
            border: "1px solid #E0E0E0",
            display: "flex",
            justifyContent: "center",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <img
            src={product?.image_full_url}
            alt="Product"
            style={{
              width: "100%",
              maxWidth: "250px",
              height: "250px",
              objectFit: "cover",
            }}
          />
        </div>

        <Typography
          style={{ marginTop: "20px", fontSize: "22px", color: "#333" }}
        >
          €{product?.price}
        </Typography>

        <Typography
          style={{ marginTop: "20px", fontSize: "16px", color: "#666" }}
        >
          {product?.description}
        </Typography>
      </div>

      <div
        style={{
          flex: "1",
          border: "1px solid #E0E0E0",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <Typography
          style={{ fontSize: "22px", fontWeight: "500", marginBottom: "12px" }}
        >
          Reservations for this product
        </Typography>
        <Table
  dataSource={reservation}
  columns={columns}
  rowKey="id"
  onRow={(record) => ({
    onClick: () => {
      if (record.id) {
        router.push(`/reservations/${record.id}`);
      }
    },
    style: { cursor: "pointer" }, // Show hand cursor on hover
  })}
/>        <Modal
  title="Edit Product"
  open={openProductEditModal}
  onCancel={handleCloseProductEditModal}
  onOk={() => form.submit()}
  width={600}
  destroyOnClose
  okText="Save Changes"
>
  <Form
    form={form}
    layout="vertical"
    onFinish={handleUpdateProduct}
    style={{ paddingTop: "10px" }}
  >
    <Form.Item
      name="name"
      label="Product Name"
      rules={[{ required: true, message: "Please enter the product name" }]}
    >
      <Input placeholder="Enter product name" />
    </Form.Item>

    <Form.Item
      name="price"
      label="Price (€)"
      rules={[{ required: true, message: "Please enter a valid price" }]}
    >
      <InputNumber
        placeholder="Enter price"
        style={{ width: "100%" }}
        min={0}
        step={0.01}
      />
    </Form.Item>

    <Form.Item name="description" label="Description">
      <TextArea
        placeholder="Enter product description"
        rows={4}
        style={{ resize: "vertical" }}
      />
    </Form.Item>

    {/* Optional: You can later add image upload if needed */}
    {/* <Form.Item name="image" label="Product Image">
      <Upload beforeUpload={() => false} listType="picture">
        <Button icon={<UploadOutlined />}>Upload Image</Button>
      </Upload>
    </Form.Item> */}
  </Form>
</Modal>

      </div>
    </div>
  );
}
