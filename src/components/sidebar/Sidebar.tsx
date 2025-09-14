"use client";
import { PropsWithChildren, useState } from "react";
import { Layout, Menu, ConfigProvider, Popconfirm, Select } from "antd";
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
  LogoutOutlined,
  DashboardOutlined,
  HighlightOutlined ,
} from "@ant-design/icons";
import { url } from "inspector";
import { useRouter } from "next/navigation";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useI18n } from "@/src/i18n/I18nProvider";

const { Sider, Header, Content } = Layout;
const SiderLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const { t, locale, setLocale } = useI18n();
  const handleLogout = () => {
    localStorage.removeItem("token");

    router.push("/login");
  };
  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#1677ff", fontFamily: "Inter, sans-serif" },

        components: { Layout: { headerBg: "#fff" } },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={220}
          breakpoint="lg"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div
            style={{
              height: 56,
              marginTop: 16,
              marginLeft: 60,
              overflow: "hidden",
              paddingTop:"20px",
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
            onClick={({ key }) => router.push(`/${key}`)}
            items={[
              {
                key: "dashboard",
                icon: <DashboardOutlined />,
                label: t("sidebar.dashboard", "Dashboard"),
              },
              {
                key: "contacts",
                icon: <UserOutlined />,
                label: t("sidebar.contacts", "Contacts"),
              },
              {
                key: "products",
                icon: <SkinOutlined />,
                label: t("sidebar.products", "Dresses"),
              },
              {
                key: "reservations",
                icon: <CalendarOutlined />,
                label: t("sidebar.reservations", "Reservations"),
              },
              {
                key:"notes",
                label: t("sidebar.notes", "Notes"),
                icon:<HighlightOutlined/>
              },
              {
                key:"mailings",
                label:t("mailings","Mailings"),
                icon:<MailOutlined/>
              }
            ]}
            style={{ flex: 1 }}
          />
             <div >
              <Select
                size="small"
                value={locale}
                style={{ width: "30%" ,marginTop:"200px",marginLeft:"30px",color:"#1677ff",borderRadius:"20px"}}
                onChange={(v) => setLocale(v as any)}
                options={[
                  { value: "en", label: "EN" },
                  { value: "al", label: "SQ" },
                ]}
              />
            </div>

          <div style={{ marginTop: "auto", padding: "16px" }}>
           
            <Popconfirm
              title="Are you sure you want to logout?"
              onConfirm={handleLogout}
              okText="Yes"
              cancelText="No"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "#fff",
                  cursor: "pointer",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  marginTop: "550px",
                  transition: "background 0.3s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#1677ff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "transparent";
                }}
              >
             
              </div>
             
            </Popconfirm>
          </div>
         
        </Sider>

        <Layout style={{ padding: "0 20px" }}>
          <Content>{children}</Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
export default SiderLayout;
