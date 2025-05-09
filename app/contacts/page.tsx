import { Button, Table } from "antd";

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
      >
        Create +
      </Button>
      <Table columns={columns}></Table>
    </>
  );
}
