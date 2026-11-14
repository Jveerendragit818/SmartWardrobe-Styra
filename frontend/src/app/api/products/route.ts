export async function GET() {
  const products = [
    { id: 1, name: "Cotton Shirt", price: 999, category: "Shirts", stock: 10 },
    { id: 2, name: "Denim Pant", price: 1499, category: "Pants", stock: 5 },
    { id: 3, name: "Silk Saree", price: 2999, category: "Sarees", stock: 3 },
  ];

  return Response.json(products);
}