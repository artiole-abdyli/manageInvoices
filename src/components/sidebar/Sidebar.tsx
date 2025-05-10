"use client";
import { PropsWithChildren, useState } from "react";
import { Layout, Menu, ConfigProvider } from "antd";
import {
  HomeOutlined,
  MoneyCollectOutlined,
  MailOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SkinOutlined,
  UserOutlined,
  CalendarOutlined,
  OrderedListOutlined,
  ReconciliationOutlined,
} from "@ant-design/icons";
import { url } from "inspector";
import { useRouter } from "next/navigation";

const { Sider, Header, Content } = Layout;
const SiderLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#1677ff" },
        components: { Layout: { headerBg: "#fff" } },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={220}
          breakpoint="lg"
          zeroWidthTriggerStyle={{ top: 12 }}
        >
          <div
            style={{
              height: 56,
              marginTop: 16,
              borderRadius: "10px",
              marginLeft: 36,
              overflow: "hidden",
              marginBottom: "50px",
              backgroundImage: `url('/images/chique_dolls_logo.png')`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "left",
            }}
          ></div>

          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["dashboard"]}
            onClick={({ key }) => {
              router.push(`/${key}`);
            }}
            items={[
              {
                key: "contacts",
                icon: <UserOutlined />,
                label: "Contacts",
              },
              {
                key: "products",
                icon: <SkinOutlined />,
                label: "Dresses",
              },

              {
                key: "reservations",
                icon: <CalendarOutlined />,
                label: "Reservations",
              },
              {
                key: "invoices",
                icon: <ReconciliationOutlined />,
                label: "Invoices",
              },
            ]}
          />
        </Sider>
        <Layout style={{ padding: "0 20px" }}>
          <Content>{children}</Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
export default SiderLayout;
