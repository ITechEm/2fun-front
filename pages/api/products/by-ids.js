import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) return res.status(400).json({ error: "Invalid IDs" });

    const client = await clientPromise;
    const db = client.db();
    const products = await db
      .collection("products")
      .find({ _id: { $in: ids.map(id => new ObjectId(id)) } })
      .toArray();

    res.json(products);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
