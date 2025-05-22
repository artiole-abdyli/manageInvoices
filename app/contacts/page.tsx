"use client";
import {
  Button,
  Form,
  Input,
  Modal,
  Table,
  message,
  Popconfirm,
  Upload,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { DownloadOutlined } from "@ant-design/icons";

type Contact = {
  id?: number;
  firstname: string;
  lastname: string;
  phone_number: string;
  city?: string;
  country?: string;
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContactCreated, setNewContactCreated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = useForm();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const filteredContacts = contacts?.filter((contact) =>
    `${contact?.firstname} ${contact?.lastname} ${contact?.phone_number}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  const handleDelete = async (id?: number) => {
    if (!id) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/contacts/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to delete contact");

      setContacts((prev) => prev.filter((c) => c.id !== id));
      message.success("Contact deleted successfully!");
    } catch (error) {
      console.error(error);
      message.error("Failed to delete contact");
    }
  };

  const columns = [
    { name: "firstname", dataIndex: "firstname", title: "First name" },
    { name: "lastname", dataIndex: "lastname", title: "Last name" },
    { name: "phone_number", dataIndex: "phone_number", title: "Phone number" },
    { name: "city", dataIndex: "city", title: "City" },
    { name: "country", dataIndex: "country", title: "Country" },
    {
      name: "action",
      title: "Action",
      render: (_: any, record: Contact) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Popconfirm
            title="Are you sure to delete this contact?"
            onConfirm={(e) => {
              e?.stopPropagation();
              handleDelete(record.id);
            }}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined style={{ color: "red", cursor: "pointer" }} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const showModal = () => setIsModalOpen(true);
  const closeModal = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/contacts", {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch contacts");

      const rawData = await response.json();

      const contactsArray = Array.isArray(rawData) ? rawData : rawData.data;
      if (!Array.isArray(contactsArray))
        throw new Error("Contacts are not an array");

      setContacts(contactsArray);
    } catch (error) {
      console.error(error);
      message.error("Failed to load contacts");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [newContactCreated]);

  const handleCreate = async (values: Omit<Contact, "id">) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(values),
      });
      setNewContactCreated(true);
      if (!response.ok) throw new Error("Failed to create contact");

      const responseData = await response.json();

      // Use responseData.data if your Laravel returns the contact inside a `data` key
      const createdContact = responseData.data ?? responseData;

      setContacts((prev) => [...prev, createdContact]);

      message.success("Contact created successfully!");
      closeModal();
    } catch (error) {
      console.error(error);
      message.error("Failed to create contact");
    }
  };
  const handleDownloadPdf = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/contacts/download/pdf",
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
      link.setAttribute("download", "contacts-list.pdf");
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
          Contacts of Chique dolls
        </h1>

        <Button type="primary" onClick={showModal}>
          Create +
        </Button>
      </div>
      <Input.Search
        placeholder="Search contacts"
        allowClear
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: 300, marginBottom: 20 }}
      />
      <Button
        onClick={handleDownloadPdf}
        icon={<DownloadOutlined />}
        style={{
          marginLeft: "10px",
          backgroundColor: "#001529",
          color: "white",
        }}
      >
        Export PDF
      </Button>
      <Upload
        name="file"
        accept=".pdf,.xlsx,.xls"
        showUploadList={false}
        customRequest={async ({ file, onSuccess, onError }) => {
          const formData = new FormData();
          formData.append("file", file);

          try {
            const response = await fetch(
              "http://127.0.0.1:8000/api/contacts/import",
              {
                method: "POST",
                body: formData,
              }
            );

            if (!response.ok) throw new Error("Failed to import contacts");

            message.success("Contacts imported successfully!");
            fetchContacts();
            onSuccess?.(response);
          } catch (err) {
            console.error(err);
            message.error("Failed to import contacts");
          }
        }}
      >
        <Button
          icon={<ImportOutlined />}
          style={{ marginLeft: 10, backgroundColor: "#001529", color: "white" }}
        >
          Import PDF / Excel
        </Button>
      </Upload>

      <Table
        columns={columns}
        dataSource={filteredContacts}
        rowKey="id"
        onRow={(record) => {
          return {
            onClick: () => {
              router.push(`/contacts/${record.id}`);
            },
            style: { cursor: "pointer" },
          };
        }}
      />

      <Modal
        title="Create Contact"
        open={isModalOpen}
        onCancel={closeModal}
        onOk={() => form.submit()}
        okText="Create"
        width={600}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleCreate}
          style={{ marginTop: "40px", marginBottom: "60px" }}
        >
          <Form.Item
            name="firstname"
            label="First name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastname"
            label="Last name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone_number"
            label="Phone number"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="city" label="City">
            <Input />
          </Form.Item>
          <Form.Item name="country" label="Country">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
