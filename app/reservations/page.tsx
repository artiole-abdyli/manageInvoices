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
  Tag,
} from "antd";
import dayjs, { Dayjs } from "dayjs";

import { DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useForm } from "antd/es/form/Form";
import { useRouter } from "next/navigation";
type Reservation = {
  contact: any;
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
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);

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
    {
      title: "Contact",
      key: "contact",
      render: (_: any, record: Reservation) => {
        const contact = record?.contact;
        return contact ? `${contact.firstname} ${contact.lastname} ` : "-";
      },
    },

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
      title: "Status",
      key: "status",
      render: (_: any, record: Reservation) => {
        if (
          record.returning_date &&
          dayjs(record.returning_date).isBefore(dayjs(), "day")
        ) {
          return <Tag color="red">Overdue</Tag>;
        }
        return <Tag color="green">On Time</Tag>;
      },
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
          <Popconfirm
            title="Are you sure to delete this reservation?"
            onConfirm={(e) => {
              e?.stopPropagation();
              handleDelete(record.id);
            }}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined
              onClick={(e) => e.stopPropagation()}
              style={{ color: "red", cursor: "pointer" }}
            />
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

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server returned error:", errorData);

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
  const handleDownloadPdf = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/reservations/download/pdf",
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "reservations-list.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error(error);
      message.error("Failed to export PDF");
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
          Reservations
        </h1>

        <Button type="primary" onClick={handleOpen}>
          Create +
        </Button>
      </div>
      <div style={{ marginBottom: 16 }}>
        <DatePicker.RangePicker
          onChange={(dates) =>
            setDateRange(dates as [Dayjs | null, Dayjs | null])
          }
          allowClear
        />
        <Select
          style={{ width: 200, marginLeft: 16 }}
          placeholder="Filter by Status"
          onChange={(value) => setStatusFilter(value)}
          allowClear
          options={[
            { label: "Overdue", value: "overdue" },
            { label: "On Time", value: "on_time" },
          ]}
        />
        <Button
          style={{
            marginLeft: "10px",
            backgroundColor: "#001529",
            color: "white",
          }}
          onClick={handleDownloadPdf}
          icon={<DownloadOutlined />}
        >
          Export as pdf
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={reservations.filter((res) => {
          if (dateRange?.[0] && dateRange?.[1]) {
            const reservationDate = dayjs(res.date);
            if (
              !reservationDate?.isAfter(dateRange?.[0].startOf("day")) ||
              !reservationDate?.isBefore(dateRange?.[1].endOf("day"))
            ) {
              return false;
            }
          }

          const isOverdue =
            res.returning_date &&
            dayjs(res.returning_date).isBefore(dayjs(), "day");

          if (statusFilter === "overdue" && !isOverdue) return false;
          if (statusFilter === "on_time" && isOverdue) return false;

          return true;
        })}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => {
            router.push(`/reservations/${record.id}`);
          },
          style: { cursor: "pointer" },
        })}
      />

<Modal
  open={isModalOpen}
  onCancel={handleClose}
  width={1000}
  title="Create New Reservation"
  onOk={() => form.submit()}
  okText="Create"
>
  <Form
    form={form}
    onFinish={handleCreate}
    layout="vertical"
    style={{ paddingTop: 20 }}
  >
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          name="date"
          label="Reservation Date"
          rules={[{ required: true, message: "Please select the reservation date" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name="returning_date"
          label="Returning Date"
          rules={[{ required: true, message: "Please select the returning date" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          name="product_id"
          label="Product"
          rules={[{ required: true, message: "Please select a product" }]}
        >
          <Select
            options={productsOptions}
            placeholder="Select a product"
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name="contact_id"
          label="Client"
          rules={[{ required: true, message: "Please select a client" }]}
        >
          <Select
            options={contactsOptions}
            placeholder="Select a contact"
            style={{ width: "100%" }}
          />
        </Form.Item>
      </Col>
    </Row>

    <Row gutter={16}>
      <Col span={8}>
        <Form.Item name="price" label="Total Price (€)">
          <InputNumber style={{ width: "100%" }} placeholder="€" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="deposit" label="Deposit (€)">
          <InputNumber style={{ width: "100%" }} placeholder="€" />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item name="remaining_payment" label="Remaining Payment (€)">
          <InputNumber style={{ width: "100%" }} placeholder="€" />
        </Form.Item>
      </Col>
    </Row>

    <Form.Item name="extra_requirement" label="Extra Requirement">
      <Input.TextArea
        rows={3}
        placeholder="Enter extra requirements (optional)"
      />
    </Form.Item>
  </Form>
</Modal>

    </>
  );
}
