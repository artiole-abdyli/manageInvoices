"use client";
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Table,
  InputNumber,
  Row,
  Select,
  Col,
  message,
  Popconfirm,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { ExceptionMap } from "antd/es/result";
type Reservation = {
  id?: number | undefined;
  date?: any;
  returning_date?: any;
  desposit?: number;
  price?: number;
  extra_requirement?: string;
  remaining_payment?: number;
  contact_id?: any; //qeto duhesh me ndryshu
  product_id?: any; //edhe qeto
};
type Product = {
  id?: number;
  name?: any;
  price?: number;
  description?: any;
  number_of_reservation?: any;
};
type Contact = {
  id?: number;
  firstname: string;
  lastname: string;
  phone_number: string;
  city?: string;
  country?: string;
};
export default function ReservationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [newReservationCreated, setNewReservationCreated] = useState(false);
  const [deletedReservation, setDeletedReservation] = useState(false);
  const [form] = useForm();
  const handleOpen = () => {
    setIsModalOpen(true);
  };
  const [productsOptions, setProductsOptions] = useState<Product[]>([]);
  const [contactsOptions, setContactsOptions] = useState<Contact[]>();
  const handleClose = () => {
    setIsModalOpen(false);
  };

  const fetchReservations = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/reservations", {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch reservations");
      const rawData = await response.json();
      const reservationsArray = Array.isArray(rawData) ? rawData : rawData.data;
      if (!Array.isArray(reservationsArray)) {
        throw new Error("Products are not an array");
      }
      setReservations(reservationsArray);
    } catch (error) {
      console.log(error);
      message.error("Failed to load reservations");
    }
  };
  useEffect(() => {
    fetchReservations();
  }, [newReservationCreated, deletedReservation]);
  const fetchProductsOptions = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/product-options",
        {
          headers: { Accept: "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch product options");

      const rawData = await response.json();
      const optionsArray = Array.isArray(rawData.data) ? rawData.data : [];

      setProductsOptions(optionsArray);
    } catch (error) {
      console.error(error);
      message.error("Failed to load product options");
    }
  };

  const fetchContactsOptions = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/contact-options",
        {
          headers: { Accept: "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch contact options");

      const rawData = await response.json();
      const optionsArray = Array.isArray(rawData.data) ? rawData.data : [];

      setContactsOptions(optionsArray);
    } catch (error) {
      console.error(error);
      message.error("Failed to load contact options");
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/reservations/${id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }
      );
      setDeletedReservation(true);
      if (!response.ok) throw new Error("Failed to delete reservation");
    } catch (error) {
      console.error(error);
    }
  };
  const columns = [
    {
      name: "date",
      dataIndex: "date",
      title: "Date",
    },
    {
      name: "date of returning",
      dataIndex: "returning_date",
      title: "Date of returning",
    },
    { name: "contact_id", dataIndex: "contact_id", title: "Contact" },
    {
      name: "price",
      dataIndex: "price",
      title: "Price",
    },
    {
      name: "deposit",
      dataIndex: "deposit",
      title: "Deposit",
    },
    {
      name: "Remaining payment",
      dataIndex: "remaining_payment",
      title: "Remaining payment",
    },
    {
      name: "extra_requirement",
      title: "Extra requirement",
      dataIndex: "extra_requirement",
    },
    {
      name: "action",
      title: "Action",
      render: (_: any, record: Reservation) => (
        <div>
          <EditOutlined style={{ marginRight: "5px" }} />
          <Popconfirm
            title="Are you sure to delete this reservation?"
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
      // Format dates before sending
      values.date = values.date?.format("YYYY-MM-DD");
      values.returning_date = values.returning_date?.format("YYYY-MM-DD");

      const response = await fetch("http://127.0.0.1:8000/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(values),
      });

      // If there's a failure, parse and show it
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server returned error:", errorData);

        // Optional: show first validation message in UI
        const firstError = errorData?.errors
          ? Object.values(errorData.errors)[0]
          : "Unknown error";

        throw new Error();
      }

      message.success("Reservation created successfully!");
      setNewReservationCreated(true);
      handleClose();
    } catch (error: any) {
      console.error("Error creating reservation:", error);
      message.error(error.message || "Failed to create reservation");
    }
  };
  useEffect(() => {
    fetchProductsOptions();
  }, []);
  useEffect(() => {
    fetchContactsOptions();
  }, []);

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
          Reservations
        </h1>

        <Button type="primary" onClick={handleOpen}>
          Create +
        </Button>
      </div>
      <Table columns={columns} dataSource={reservations}></Table>
      <Modal
        open={isModalOpen}
        onCancel={handleClose}
        width={1000}
        height={1000}
        title="Create new reservation"
        onOk={() => form.submit()}
      >
        <Form
          onFinish={handleCreate}
          form={form}
          style={{ paddingTop: "30px", paddingBottom: "30px" }}
        >
          <Form.Item name="date" label="Date of reservation">
            <DatePicker />
          </Form.Item>
          <Form.Item name="returning_date" label="Returning date">
            <DatePicker />
          </Form.Item>
          <Form.Item name="product_id" label="Product">
            <Select
              options={productsOptions}
              placeholder="Select a product"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item name="contact_id" label="Client">
            <Select
              options={contactsOptions}
              placeholder="Select a contact"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="price" label="Total price">
                <InputNumber
                  name="price"
                  style={{ width: "100%" }}
                  placeholder="€"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="deposit" label="Deposit">
                <InputNumber
                  name="deposit"
                  style={{ width: "100%" }}
                  placeholder="€"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="remaining_payment" label="Remaining payment">
                <InputNumber
                  name="remaining_payment"
                  style={{ width: "100%" }}
                  placeholder="€"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="extra_requirement" label="Extra requirement">
            <Input.TextArea
              rows={4}
              placeholder="Enter extra requirements here..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
