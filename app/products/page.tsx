import { Button, Table } from "antd";

export default function ProductsPage() {
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

        <Button type="primary">Create +</Button>
      </div>{" "}
      <Table columns={columns}></Table>
    </>
  );
}
