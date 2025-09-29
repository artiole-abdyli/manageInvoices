"use client";
import {
  Button,
  DatePicker,
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
import { useI18n } from "@/src/i18n/I18nProvider";
import dayjs, { Dayjs } from "dayjs";

type Contact = {
  id?: number;
  firstname: string;
  lastname: string;
  phone_number: string;
  city?: string;
  country?: string;
  created_at?: string;
};

export default function ContactsPage() {
  const { t } = useI18n();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContactCreated, setNewContactCreated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = useForm();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [createdDateRange, setCreatedDateRange] = useState<[
    Dayjs | null,
    Dayjs | null
  ]>([null, null]);

  const filteredContacts = contacts?.filter((contact) => {
    const matchesSearch = `${contact?.firstname} ${contact?.lastname} ${contact?.phone_number}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    const [startDate, endDate] = createdDateRange;
    if (startDate || endDate) {
      if (!contact?.created_at) return false;
      const created = dayjs(contact.created_at);
      if (!created.isValid()) return false;

      if (startDate && created.isBefore(startDate.startOf("day"))) return false;
      if (endDate && created.isAfter(endDate.endOf("day"))) return false;
    }

    return true;
  });
 
  const columns = [
    {name:"Id",dataIndex:"id",title:"id"},
    { name: "firstname", dataIndex: "firstname", title: t("contacts.table.firstName") },
    { name: "lastname", dataIndex: "lastname", title: t("contacts.table.lastName") },
    { name: "phone_number", dataIndex: "phone_number", title: t("contacts.table.phoneNumber") },
    { name: "city", dataIndex: "city", title: t("contacts.table.city") },
    { name: "country", dataIndex: "country", title: t("contacts.table.country") },
    {
      name: "created_at",
      dataIndex: "created_at",
      title: t("contacts.table.createdAt"),
      render: (value: string) => (value ? dayjs(value).format("DD/MM/YY") : ""),
    }
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
          {t("contacts.title")}
        </h1>

        <Button type="primary" onClick={showModal}  style={{
            marginTop: "20px",
            backgroundColor: "#001529",
            color: "white",
            marginBottom:"20px"
            
          }}>{t("contacts.create")} +</Button>
      </div>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap"}}>
        <Input.Search
          placeholder={t("contacts.searchPlaceholder")}
          allowClear
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300, marginBottom: 20 }}
        />
        <DatePicker.RangePicker
          allowClear
          onChange={(range) =>
            setCreatedDateRange(range as [Dayjs | null, Dayjs | null])
          }
          style={{ minWidth: 270, marginBottom: 20 }}
        />
           <Button
        onClick={handleDownloadPdf}
        icon={<DownloadOutlined />}
        style={{
          marginLeft: "15px",
          backgroundColor: "#001529",
          color: "white"
        }}
      >
        {t("contacts.export")}
      </Button>
      </div>
   
    
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
        title={t("contacts.create")}
        open={isModalOpen}
        onCancel={closeModal}
        onOk={() => form.submit()}
          okButtonProps={{
    style: {
          backgroundColor: "#001529",
      borderColor: "#001529",       // optional: keep border in sync
    },
  }}
        okText="Create"
        width={600}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleCreate}
          style={{ marginTop: "40px", marginBottom: "60px" }}
        >
          <Form.Item name="firstname" label={t("contacts.table.firstName")} rules={[{ required: true }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="lastname" label={t("contacts.table.lastName")} rules={[{ required: true }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="phone_number" label={t("contacts.table.phoneNumber")} rules={[{ required: true }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="city" label={t("contacts.table.city")}> 
            <Input />
          </Form.Item>
          <Form.Item name="country" label={t("contacts.table.country")}> 
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
