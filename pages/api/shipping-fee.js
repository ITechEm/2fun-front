import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default async function handler(req, res) {
  await mongooseConnect();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { cartProducts } = req.body;

    if (!cartProducts || !Array.isArray(cartProducts)) {
      return res.status(400).json({ error: "cartProducts is required" });
    }
    const uniqueIds = [...new Set(cartProducts)];
    const products = await Product.find({ _id: { $in: uniqueIds } });

    let totalWeight = 0;
    for (const id of cartProducts) {
      const product = products.find((p) => p._id.toString() === id);
      if (product && product.weight) {
        totalWeight += product.weight;
      }
    }

    let shippingFee = 0;
    if (totalWeight <= 2) shippingFee = 4;      
    else if (totalWeight <= 5) shippingFee = 7;
    else if (totalWeight <= 10) shippingFee = 12;
    else shippingFee = 25;

    res.json({ shippingFee, totalWeight });
  } catch (error) {
    console.error("Shipping fee error:", error);
    res.status(500).json({ error: "Failed to calculate shipping fee" });
  }
}