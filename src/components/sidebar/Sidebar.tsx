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

const { Sider, Header, Content } = Layout;
const SiderLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#1677ff" }, // your brand colour
        components: { Layout: { headerBg: "#fff" } }, // example override
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={220} // full width when expanded
          breakpoint="lg" // auto-collapse on < 992 px
          zeroWidthTriggerStyle={{ top: 12 }} // icon position tweak
        >
          <div
            style={{
              height: 56,
              marginTop: 16,
              borderRadius: "10px",
              marginLeft: 36,
              overflow: "hidden", // rounds the image corners
              backgroundImage: `url('/images/chique_dolls_logo.png')`, // no “/public” prefix
              backgroundSize: "contain", // keep logo proportions
              backgroundRepeat: "no-repeat", // don’t tile
              backgroundPosition: "left", // always centered
            }}
          ></div>

          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["dashboard"]}
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
