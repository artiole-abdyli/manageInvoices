"use client";
import React, { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Modal, Popconfirm, Table, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, MailOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { useI18n } from "@/src/i18n/I18nProvider";
import RichEditor from "@/src/components/ui/RichEditor";

type Mailing = {
  id?: number;
  from: string;
  to: string;
  title: string;
  subject: string;
  date: string; // ISO string (YYYY-MM-DD or datetime)
  message?: string;
};

export default function MailingsPage() {
  const { t } = useI18n();
  const [data, setData] = useState<Mailing[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Mailing | null>(null);
  const [form] = Form.useForm<Mailing & { date: Dayjs }>();
    const [searchTerm, setSearchTerm] = useState("");
 const searchedFilters = data?.filter((data) =>
    `${data?.title} ${data?.subject} ${data?.message} ${data?.from} ${data?.to}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
console.log("DATA:",data);
  const fetchMailings = async () => {
    setLoading(true);
    try {
    const res = await fetch(`http://127.0.0.1:8000/api/mailings`, {
        headers: { Accept: "application/json" },
      });
      const raw = await res.json().catch(() => []);
      const rows: Mailing[] = Array.isArray(raw) ? raw : raw.data || [];
      setData(rows);
    } catch (e) {
      console.error(e);
      message.error(t("mailings.errors.load", "Failed to load mailings"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMailings(); }, []);

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEdit = (row: Mailing) => {
    setEditing(row);
    form.setFieldsValue({ ...row, date: dayjs(row.date) } as any);
    setIsModalOpen(true);
  };

  const handleDelete = async (row: Mailing) => {
    if (!row.id) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/mailings/${row.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      message.success(t("mailings.messages.deleted", "Mailing deleted"));
      fetchMailings();
    } catch (e) {
      console.error(e);
      message.error(t("mailings.errors.delete", "Failed to delete mailing"));
    }
  };

  const onSubmit = async (values: any) => {
    const payload: Mailing = {
      from: values.from,
      to: values.to,
      title: values.title,
      subject: values.subject,
      date: (values.date as Dayjs)?.format("YYYY-MM-DD") || dayjs().format("YYYY-MM-DD"),
      message: values.message || "",
    };
    const isEdit = Boolean(editing?.id);
    const url = isEdit ? `http://127.0.0.1:8000/api/mailings/${editing!.id}` : `http://127.0.0.1:8000/api/mailings`;
    const method = isEdit ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      message.success(isEdit ? t("mailings.messages.updated", "Mailing updated") : t("mailings.messages.created", "Mailing created"));
      setIsModalOpen(false);
      setEditing(null);
      form.resetFields();
      fetchMailings();
    } catch (e) {
      console.error(e);
      message.error(isEdit ? t("mailings.errors.update", "Failed to update mailing") : t("mailings.errors.create", "Failed to create mailing"));
    }
  };

  const columns = [
    {title:"Id",dataIndex:"id",key:"id"},
    { title: t("mailings.from", "From"), dataIndex: "from", key: "from" },
    { title: t("mailings.to", "To"), dataIndex: "to", key: "to" },
    { title: t("mailings.title", "Title"), dataIndex: "title", key: "title" },
    { title: t("mailings.subject", "Subject"), dataIndex: "subject", key: "subject" },
    { title: t("mailings.date", "Date"), dataIndex: "date", key: "date", render: (d: string) => (d ? dayjs(d).format("YYYY-MM-DD") : "") },
    {
      title: t("mailings.action", "Action"),
      key: "action",
      render: (_: any, record: Mailing) => (
        <>
          {/* <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(record)} /> */}
          <Popconfirm title={t("mailings.confirmDelete", "Delete this mailing?")} onConfirm={() => handleDelete(record)}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
    <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "16px", // spacing between button and search
    marginTop: "20px",
    marginBottom: "20px",
  }}
>
  <Button
    style={{
      backgroundColor: "#001529",
      color: "white",
    }}
    icon={<MailOutlined />}
    onClick={openCreate}
  >
    {t("mailings.create")} +
  </Button>

  <Input.Search
    placeholder={t("products.searchPlaceholder")}
    allowClear
    onChange={(e) => setSearchTerm(e.target.value)}
    style={{ width: 300 }}
  />
</div>

         
      <Table
        columns={columns as any}
        dataSource={searchedFilters}
        loading={loading}
        rowKey={(r) => String(r.id ?? `${r.from}-${r.to}-${r.date}`)}
      />

      <Modal
        open={isModalOpen}
        title={editing ? t("mailings.edit", "Edit Mailing") : t("mailings.new", "New Mailing")}
        onCancel={() => { setIsModalOpen(false); setEditing(null); }}
        onOk={() => form.submit()}
        okText={editing ? t("actions.save", "Save") : t("actions.create", "Create")}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Form.Item name="from" label={t("mailings.from", "From")} rules={[{ required: true }]}>
            <Input placeholder="sender@example.com" />
          </Form.Item>
          <Form.Item name="to" label={t("mailings.to", "To")} rules={[{ required: true }]}>
            <Input placeholder="recipient@example.com" />
          </Form.Item>
          <Form.Item name="title" label={t("mailings.title", "Title")} rules={[{ required: true }]}>
            <Input placeholder={t("mailings.title", "Title")} />
          </Form.Item>
          <Form.Item name="subject" label={t("mailings.subject", "Subject")} rules={[{ required: true }]}>
            <Input placeholder={t("mailings.subject", "Subject")} />
          </Form.Item>
          <Form.Item name="message" label={t("mailings.content", "Content")} rules={[{ required: true }]}>
            <RichEditor placeholder={t("mailings.content", "Content")} />
          </Form.Item>
          <Form.Item name="date" label={t("mailings.date", "Date")} rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
