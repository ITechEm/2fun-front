import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../lib/connectToDatabase";

export default async function handler(req, res) {
  const { orderId } = req.query;

  if (req.method === "GET") {
    try {
      const { db } = await connectToDatabase();
      const orderObjectId = new ObjectId(orderId);

      const order = await db.collection("orders").findOne({ _id: orderObjectId });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      console.log("Fetched Order:", order);
      res.status(200).json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order details", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

