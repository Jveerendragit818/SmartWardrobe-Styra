export async function GET() {
  return Response.json([
    { id: 1, name: "Lakki", email: "lakki@gmail.com", role: "user" },
    { id: 2, name: "Test User", email: "test@gmail.com", role: "user" },
  ])
}