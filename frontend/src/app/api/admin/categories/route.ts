export async function GET() {
  return Response.json([
    { id: 1, name: "Shirts", slug: "shirts" },
    { id: 2, name: "Pants", slug: "pants" },
    { id: 3, name: "Sarees", slug: "sarees" },
  ])
}