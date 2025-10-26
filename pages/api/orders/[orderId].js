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

      if (typeof order.isApproved === "undefined") {
        order.isApproved = false;
      }

      console.log("Fetched Order:", order);
      return res.status(200).json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      return res.status(500).json({ message: "Failed to fetch order details", error: error.message });
    }
  }

  if (req.method === "PUT") {
    try {
      const { db } = await connectToDatabase();
      const orderObjectId = new ObjectId(orderId);
      const { status } = req.body;
      const order = await db.collection("orders").findOne({ _id: orderObjectId });

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (order.status !== "Pending") {
        return res.status(400).json({
          message: "Order cannot be cancelled because it's not in a 'Pending' state",
        });
      }

      const updatedOrder = await db.collection("orders").findOneAndUpdate(
        { _id: orderObjectId },
        { $set: { status: "Cancelled" } },
        { returnDocument: "after" } // To get the updated document after the change
      );

      if (!updatedOrder.value) {
        return res.status(404).json({ message: "Failed to update the order" });
      }

      console.log("Order successfully updated:", updatedOrder.value);
      return res.status(200).json(updatedOrder.value);
    } catch (error) {
      console.error("Error updating order:", error);
      return res.status(500).json({ message: "Failed to update order status", error: error.message });
    }
  }
  
  return res.status(405).json({ message: "Method not allowed" });
}
