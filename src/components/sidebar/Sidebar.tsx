"use client";
import { PropsWithChildren, useState } from "react";
import type { MenuProps } from "antd";
import { Layout, Menu, ConfigProvider, Popconfirm, Dropdown, Button } from "antd";
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
  HighlightOutlined,
  GlobalOutlined,
  DownOutlined,
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
  const languageOptions = [
    { key: "en", label: "English", shortLabel: "EN" },
    { key: "al", label: "Shqip", shortLabel: "SQ" },
  ];
  const handleLogout = () => {
    localStorage.removeItem("token");

    router.push("/login");
  };
  const currentLanguage =
    languageOptions.find((lang) => lang.key === locale) ?? languageOptions[0];

  const languageMenu: MenuProps["items"] = languageOptions.map((lang) => ({
    key: lang.key,
    label: (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 5,
        }}
      >
        <span>{lang.label}</span>
        <span style={{ fontSize: 5, color: "rgba(0,0,0,0.45)" }}>
          {lang.shortLabel}
        </span>
      </div>
    ),
  }));

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
          <div style={{ padding: "0 24px", marginBottom: 24 }}>
            <Dropdown
              trigger={["click"]}
              menu={{
                items: languageMenu,
                selectable: true,
                selectedKeys: [String(locale)],
                onClick: ({ key }) => setLocale(key as any),
              }}
            >
              <Button
                type="primary"
                shape="round"
                size="small"
                icon={<GlobalOutlined />}
                style={{
                  width: "65%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  background: "rgba(255, 255, 255, 0.12)",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  color: "#fff",
                  paddingInline: 10,
                }}
              >
                <span style={{ fontWeight: 600 }}>{currentLanguage.label}</span>
                <DownOutlined style={{ fontSize: 12 }} />
              </Button>
            </Dropdown>
          </div>
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
