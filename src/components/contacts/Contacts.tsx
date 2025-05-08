import { Layout, Table } from "antd";

export default function Contacts() {
  const columns = [
    {
      title: "first name",
      dataIndex: "first_name",
    },
    {
      title: "last name",
      dataIndex: "last_name",
    },
  ];
  return <Table columns={columns}></Table>;
}
3;
