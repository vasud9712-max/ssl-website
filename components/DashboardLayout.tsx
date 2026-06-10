import { Shield, ShoppingCart, Ticket, UserRound, Settings, LayoutDashboard, Mail, Package, Users, KeyRound } from "lucide-react";
import { SessionUser } from "@/lib/auth";

export function DashboardLayout({
  user,
  admin = false,
  children
}: {
  user: SessionUser;
  admin?: boolean;
  children: React.ReactNode;
}) {
  const links = admin
    ? [
        ["/admin", "Dashboard", LayoutDashboard],
        ["/admin/orders", "Orders", ShoppingCart],
        ["/admin/customers", "Customers", Users],
        ["/admin/products", "Products", Package],
        ["/admin/tickets", "Tickets", Ticket],
        ["/admin/contact-messages", "Contact Messages", Mail],
        ["/admin/password-resets", "Password Resets", KeyRound],
        ["/admin/email-templates", "Email", Mail]
      ]
    : [
        ["/portal", "Dashboard", LayoutDashboard],
        ["/portal/products", "SSL Products", Shield],
        ["/portal/orders", "Orders", ShoppingCart],
        ["/portal/tickets", "Tickets", Ticket],
        ["/portal/profile", "Profile", UserRound],
        ["/logout", "Logout", Settings]
      ];

  return (
    <main className="dashboard-shell">
      <div className="container dashboard">
        <aside className="sidebar">
          <div className="card" style={{ marginBottom: 12, padding: 14 }}>
            <strong>{user.name}</strong>
            <p style={{ margin: "4px 0 0", fontSize: 13 }}>{user.email}</p>
          </div>
          {links.map(([href, label, Icon]) => (
            <a key={href as string} href={href as string}>
              <Icon size={18} />
              {label as string}
            </a>
          ))}
        </aside>
        <section className="content-stack">{children}</section>
      </div>
    </main>
  );
}
