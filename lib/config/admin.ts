/**
 * Admin dashboard and panel configuration.
 * Used by AdminDashboard, admin layout, and nav.
 */

export const ADMIN_BASE = "/admin" as const;
export const ADMIN_LOGIN = `${ADMIN_BASE}/login` as const;

export const adminNavItems = [
  { href: ADMIN_BASE, label: "Dashboard" },
  { href: `${ADMIN_BASE}/victims`, label: "Victims" },
  { href: `${ADMIN_BASE}/news`, label: "News" },
  { href: `${ADMIN_BASE}/statements`, label: "Statements" },
  { href: `${ADMIN_BASE}/media`, label: "Media" },
] as const;

export const adminDashboardCards = [
  {
    href: `${ADMIN_BASE}/victims`,
    title: "Victims",
    description: "Manage victim entries",
  },
  {
    href: `${ADMIN_BASE}/news`,
    title: "News",
    description: "Manage news articles",
  },
  {
    href: `${ADMIN_BASE}/statements`,
    title: "Statements",
    description: "Manage official statements",
  },
  {
    href: `${ADMIN_BASE}/media`,
    title: "Media",
    description: "Manage photos and videos",
  },
] as const;

export const adminConfig = {
  basePath: ADMIN_BASE,
  loginPath: ADMIN_LOGIN,
  title: "Admin Panel",
  dashboardTitle: "Admin Dashboard",
  navItems: adminNavItems,
  dashboardCards: adminDashboardCards,
} as const;
