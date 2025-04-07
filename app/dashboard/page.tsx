'use client';

import { Button, Form, Input, Layout, Menu, Modal, Table, Typography } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import Title from 'antd/es/skeleton/Title';

const { Header, Content, Footer, Sider } = Layout;
const columns=[{
    title:"Company name",dataIndex:"company_name",
    key:"company_name"
},
{
    title:"Company email",dataIndex:"company_email",key:"company_email"
},
{title:"Company employees",dataIndex:"company_employees",key:"company_employees"}];

export default function DashboardPage() {
  const [isCreateModalOpen,setIsCreateModalOpen]=useState<boolean>(false);
const addModal=()=>{
  setIsCreateModalOpen(true);
}
const closeModal=()=>{
  setIsCreateModalOpen(false);
}
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={300} style={{backgroundColor:"#4A90E2"}}>
       
        <Menu style={{backgroundColor:"#4A90E2"}} mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1" style={{fontSize:"10px",color:"white",backgroundColor:"#4A90E2"}} icon={<UsergroupAddOutlined 
             />}>
            Companies
          </Menu.Item>
         
        </Menu>
      </Sider>
      <Layout>
        <Content style={{ padding: 30 }}>
          <Table    title={() => (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>My Table Title</span>
          <Button type="primary" onClick={() => addModal()}>
           +
          </Button>
        </div>
      )}dataSource={columns} columns={columns}  />
        </Content>
      </Layout>
      <Modal open={isCreateModalOpen} onCancel={closeModal}>
        <div style={{padding:"20px"}}>
      <Typography style={{padding:"10px"}}>Create a company</Typography>
<Form>
          <Form.Item label="Company name">
<Input type="text"  />
          </Form.Item>
          <Form.Item label="Email">
<Input type="email"/>
          </Form.Item>
          <Form.Item label="Password">
            <Input type="password"/>
          </Form.Item>
          <Form.Item label="Employees number">
            <Input type="text"/>
          </Form.Item>
         </Form>
        </div>
        </Modal>
    </Layout>
  );
}
