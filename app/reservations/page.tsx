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
} from "antd";
import { useEffect, useState } from "react";
type Reservation = {
  date?: any;
  returning_date?: any;
  desposit?: number;
  price?: number;
  extra_requirement?: string;
  remaining_payment?: number;
  contact_id?: any; //qeto duhesh me ndryshu
  product_id?: any; //edhe qeto
};

export default function ReservationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [newReservationCreated, setNewReservationCreated] = useState(false);
  const columns = [
    {
      name: "date",
      dataIndex: "date",
      title: "Date",
    },
    {
      name: "date of returning",
      dataIndex: "date_of_returning",
      title: "Date of returning",
    },
    { name: "contact_id", dataIndex: "contact_id", title: "Contact" },
    {
      name: "number_of_dresses",
      dataIndex: "number_of_dresses",
      title: "Number of dresses",
    },
    {
      name: "extra_requirement",
      title: "Extra requirement",
      dataIndex: "extra_requirement",
    },
  ];
  const handleOpen = () => {
    setIsModalOpen(true);
  };
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
  }, [newReservationCreated]);
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
      >
        <Form style={{ paddingTop: "30px", paddingBottom: "30px" }}>
          <Form.Item name="date" label="Date of reservation">
            <DatePicker />
          </Form.Item>
          <Form.Item name="returning_date" label="Returning date">
            <DatePicker />
          </Form.Item>
          <Form.Item name="product_id" label="Product">
            <Select placeholder="Select a product">
              <Select.Option value={1}>Wedding Dress</Select.Option>
              <Select.Option value={2}>Evening Gown</Select.Option>
              <Select.Option value={3}>Bridesmaid Dress</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="contact_id" label="Client">
            <Select placeholder="Select a contact">
              <Select.Option value={1}>Anna Smith</Select.Option>
              <Select.Option value={2}>John Doe</Select.Option>
              <Select.Option value={3}>Elira Morina</Select.Option>
            </Select>
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
