// Day 9 - M2 - Admin Settings with API
"use client";
import { useState } from "react";
import { saveAdminSettings } from "@/app/lib/api";

export default function SettingsPage() {
  const [siteName, setSiteName] = useState("StyleMate");
  const [maintenance, setMaintenance] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      await saveAdminSettings({ siteName, maintenance });
      setMessage("✅ Settings saved successfully via API!");
    } catch {
      setMessage("❌ Failed to save. Try again.");
    }
    setSaving(false);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", color: "black", maxWidth: "600px" }}>
      <h1 style={{ color: "white" }}>Admin Settings</h1>
      <p style={{ color: "#d1d5db" }}>Manage platform settings</p>
      <div style={{ background: "white", padding: "20px", borderRadius: "12px", border: "1px solid #ddd", marginTop: "20px" }}>
        <label style={{ color: "black", fontWeight: "bold" }}>Site Name</label>
        <input value={siteName} onChange={(e) => setSiteName(e.target.value)} style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ddd", background: "white", color: "black", marginTop: "8px" }} />
        <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <input type="checkbox" checked={maintenance} onChange={(e) => setMaintenance(e.target.checked)} style={{ width: "20px", height: "20px" }} />
          <span style={{ color: "black" }}>Maintenance Mode</span>
        </div>
        <button onClick={handleSave} disabled={saving} style={{ marginTop: "20px", width: "100%", padding: "14px", background: "#4f46e5", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
          {saving ? "Saving..." : "Save Settings"}
        </button>
        {message && <p style={{ color: "black", marginTop: "15px", background: "#dcfce7", padding: "12px", borderRadius: "8px" }}>{message}</p>}
      </div>
    </div>
  );
}