import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
  await mongooseConnect();

  const { user } = await getServerSession(req, res, authOptions);

  if (req.method === "GET") {
    const orders = await Order.find({ userEmail: user.email });
    return res.json(orders);
  }

  if (req.method === "POST") {
    const { line_items, shippingAmount } = req.body;


    if (!line_items || !shippingAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    await db.collection("orders").insertOne({ orderNumber, ...otherOrderData });

    try {
      const newOrder = new Order({
        userEmail: user.email,
        orderNumber: orderNumber,
        status: "Pending",
        line_items: line_items,
        shippingAmount: shippingAmount,
        createdAt: new Date(),
      });

      await newOrder.save();

      return res.status(201).json(newOrder);
    } catch (error) {
      console.error("Error creating order:", error);
      return res.status(500).json({ message: "Error creating order", error: error.message });
    }
  }

  if (req.method === "PUT") {
    const { id } = req.query;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      return res.status(200).json(updatedOrder);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error updating status" });
    }
  }

  res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}