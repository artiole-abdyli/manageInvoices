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
} from "antd";
import { useState } from "react";
export default function ReservationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      <Table columns={columns}></Table>
      <Modal
        open={isModalOpen}
        onCancel={handleClose}
        width={700}
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

          <Form.Item name="contact_id" label="Contact">
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
