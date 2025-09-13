"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Space,
  Tag,
  message,
  Typography,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { Description } from "@headlessui/react";

type Note = {
  id?: number;
  title?: string;
  description?:string;
  date?: string; // ISO date (YYYY-MM-DD)
  created_at?: string;
  updated_at?: string;
};

const dateFmt = (d?: string) => (d ? dayjs(d).format("ddd, MMM D") : "");

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0); // 0 = current week, -1 = previous, +1 = next

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [viewNote, setViewNote] = useState<Note | null>(null);
  const [form] = Form.useForm<Note>();

  const weekStart = useMemo(() => dayjs().startOf("week").add(7 * weekOffset, "day"), [weekOffset]);
  const weekEnd = useMemo(() => weekStart.endOf("week"), [weekStart]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
    
      const res = await fetch(`http://127.0.0.1:8000/api/notes`, {
        headers: { Accept: "application/json" },
      });
      const raw = await res.json().catch(() => []);
      const data: Note[] = Array.isArray(raw) ? raw : raw.data || [];
      setNotes(data);
    } catch (e) {
      console.error(e);
      message.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekStart.valueOf(), weekEnd.valueOf()]);

  const openCreate = () => {
    setEditingNote(null);
    form.resetFields();
    form.setFieldsValue({ date: dayjs() } as any);
    setIsModalOpen(true);
  };

  const openEdit = (note: Note) => {
    setEditingNote(note);
    form.setFieldsValue({
      title: note.title,
      description: note.description,
      date: dayjs(note.date),
    } as any);
    setIsModalOpen(true);
  };

  const openView = (note: Note) => {
    setViewNote(note);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (note: Note) => {
    if (!note.id) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/notes/${note.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      message.success("Note deleted");
      fetchNotes();
    } catch (e) {
      console.error(e);
      message.error("Failed to delete note");
    }
  };

  const onSubmit = async (values: any) => {
    const payload: Note = {
      title: values.title,
      description: values.description,
      date: (values.date as Dayjs)?.format("YYYY-MM-DD") || dayjs().format("YYYY-MM-DD"),
    };
    try {
      const isEdit = Boolean(editingNote?.id);
      const url = isEdit
        ? `http://127.0.0.1:8000/api/notes/${editingNote!.id}`
        : `http://127.0.0.1:8000/api/notes`;
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      message.success(isEdit ? "Note updated" : "Note created");
      setIsModalOpen(false);
      form.resetFields();
      setEditingNote(null);
      fetchNotes();
    } catch (e) {
      console.error(e);
      message.error("Failed to save note");
    }
  };


  return (
    <>
                 <Button type="primary" icon={<PlusOutlined />} onClick={openCreate} style={{marginTop:"20px",backgroundColor:"#1677ff"}}>New Note</Button>


      {notes.length === 0 ? (
        <Empty description="No notes for this week" />
      ) : (
        <Row gutter={[16, 16]}>
          {notes.map((note) => (
            <Col key={note.id } xs={24} sm={12} md={8} lg={6}
            >
              <Card
                title={
                  <Space size={8}>
                    <Typography.Text style={{ fontWeight: 600 }}>{note.title}</Typography.Text>
                    <Tag color="purple">{dateFmt(note.date)}</Tag>
                  </Space>
                }
                bordered
                loading={loading}
                actions={[
                  <EyeOutlined key="view" onClick={() => openView(note)} />,
                  <EditOutlined key="edit" onClick={() => openEdit(note)} />,
                  <Popconfirm key="del" title="Delete this note?" onConfirm={() => handleDelete(note)}>
                    <DeleteOutlined style={{color:"red"}}/>
                  </Popconfirm>,
                ]}
                style={{ height: "100%",marginTop:"20px" }}
              >
                <Typography.Paragraph ellipsis={{ rows: 5, expandable: false }}>
                  {note?.description}
                </Typography.Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        open={isModalOpen}
        title={editingNote ? "Edit Note" : "New Note"}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingNote(null);
        }}
        onOk={() => form.submit()}
        okText={editingNote ? "Save" : "Create"}
        width={640}
     >
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: "Please enter a title" }]}>
            <Input placeholder="Note title" maxLength={120} showCount />
          </Form.Item>
          <Form.Item name="date" label="Date" rules={[{ required: true, message: "Pick a date" }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please add description" }]}>
            <Input.TextArea rows={6} placeholder="Write your note" />
          </Form.Item>
        </Form>
      </Modal>

      <Drawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={viewNote?.title}
        width={520}
      >
        <Space direction="vertical" size={8} style={{ width: "100%" }}>
          <Tag color="purple">{viewNote ? dateFmt(viewNote.date) : null}</Tag>
          <Typography.Paragraph style={{ whiteSpace: "pre-wrap" }}>
            {viewNote?.description}
          </Typography.Paragraph>
        </Space>
      </Drawer>
    </>
  );
}
