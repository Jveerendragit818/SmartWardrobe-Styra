export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <div style={{ width: "220px", background: "#111827", color: "white", padding: "20px", position: "fixed", top: 0, left: 0, bottom: 0, overflowY: "auto" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>SmartWardrobe</h2>
        <p style={{ fontSize: "12px", color: "#9ca3af", marginBottom: "15px" }}>ADMIN MENU</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <a href="/admin" style={{ color: "white", textDecoration: "none" }}>Dashboard</a>
          <a href="/admin/users" style={{ color: "white", textDecoration: "none" }}>Users</a>
          <a href="/admin/ai-monitoring" style={{ color: "white", textDecoration: "none" }}>AI Monitoring</a>
          <a href="/admin/categories" style={{ color: "white", textDecoration: "none" }}>Categories</a>
          <a href="/admin/clothing" style={{ color: "white", textDecoration: "none" }}>Clothing</a>
          <a href="/admin/consultations" style={{ color: "white", textDecoration: "none" }}>Consultations</a>
          <a href="/admin/events" style={{ color: "white", textDecoration: "none" }}>Events</a>
          <a href="/admin/feedback" style={{ color: "white", textDecoration: "none" }}>Feedback</a>
          <a href="/admin/notifications" style={{ color: "white", textDecoration: "none" }}>Notifications</a>
          <a href="/admin/recommendations" style={{ color: "white", textDecoration: "none" }}>Recommendations</a>
          <a href="/admin/reports" style={{ color: "white", textDecoration: "none" }}>Reports</a>
          <a href="/admin/services" style={{ color: "white", textDecoration: "none" }}>Services</a>
          <a href="/admin/settings" style={{ color: "white", textDecoration: "none" }}>Settings</a>
        </div>
      </div>
      <div style={{ marginLeft: "220px", padding: "20px", color: "#111827", background: "white", minHeight: "100vh" }}>{children}</div>
    </div>
  );
}