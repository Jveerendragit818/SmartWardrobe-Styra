// Day 9 - M2 - Admin API
export async function getAdminReports() {
  await new Promise((r) => setTimeout(r, 1000));
  return [
    { id: 1, title: "Total Users", value: "125", change: "+12 this week", type: "Users" },
    { id: 2, title: "Total Outfits", value: "340", change: "+45 this week", type: "Outfits" },
    { id: 3, title: "AI Suggestions Used", value: "890", change: "+120 this week", type: "AI" },
    { id: 4, title: "Trip Plans Created", value: "56", change: "+8 this week", type: "Trips" },
  ];
}

export async function getAdminUsers() {
  await new Promise((r) => setTimeout(r, 800));
  return [
    { id: 1, name: "Priya Sharma", email: "priya@gmail.com", status: "Active" },
    { id: 2, name: "Rahul Verma", email: "rahul@gmail.com", status: "Active" },
    { id: 3, name: "Ananya Rao", email: "ananya@gmail.com", status: "Blocked" },
  ];
}

export async function saveAdminSettings(data: any) {
  await new Promise((r) => setTimeout(r, 500));
  console.log("Settings saved to API:", data);
  return { success: true };
}