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
  const handleLogout = () => {
    // Clear session/token/cookies
    localStorage.removeItem("token"); // Or however you're managing auth

    // Redirect to login
    router.push("/login");
  };
  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#1677ff" },
        components: { Layout: { headerBg: "#fff" } },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={220}
          breakpoint="lg"
          style={{ display: "flex", flexDirection: "column" }} // key for separation
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

          {/* TOP MENU */}
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["dashboard"]}
            onClick={({ key }) => router.push(`/${key}`)}
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
            style={{ flex: 1 }} // This ensures the top menu grows to fill space
          />

          {/* BOTTOM MENU (Logout) */}
          <Menu
            theme="dark"
            mode="inline"
            selectable={false} // prevent it from being highlighted
            onClick={({ key }) => {
              if (key === "logout") handleLogout();
            }}
            style={{ marginTop: "640px" }}
            items={[
              {
                key: "logout",
                icon: <SettingOutlined />,
                label: "Logout",
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
