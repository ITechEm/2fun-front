import { ObjectId } from "mongodb";
import { connectToDatabase } from "../../../lib/connectToDatabase";

export default async function handler(req, res) {
  const { orderId } = req.query;

  if (req.method === "GET") {
    try {
      const { db } = await connectToDatabase();
      const orderObjectId = new ObjectId(orderId);
      
      // Fetch the order from the database
      const order = await db.collection("orders").findOne({ _id: orderObjectId });

      // Check if the order exists
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Ensure `isApproved` is part of the response
      if (typeof order.isApproved === "undefined") {
        // If `isApproved` is missing, set it to `false` by default
        order.isApproved = false;
      }

      console.log("Fetched Order:", order);

      return res.status(200).json(order);  // Send the full order object, including `isApproved`
    } catch (error) {
      console.error("Error fetching order:", error);
      return res.status(500).json({ message: "Failed to fetch order details", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }

  
}
