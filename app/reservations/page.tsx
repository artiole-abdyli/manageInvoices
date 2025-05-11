"use client";
import { Button, DatePicker, Form, Input, Modal, Table } from "antd";
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
      <Modal open={isModalOpen} onCancel={handleClose}>
        <Form style={{ paddingTop: "30px", paddingBottom: "30px" }}>
          <Form.Item name="date" label="Date of reservation">
            <DatePicker />
          </Form.Item>
          <Form.Item name="returning_date" label="Returning date">
            <DatePicker />
          </Form.Item>
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
