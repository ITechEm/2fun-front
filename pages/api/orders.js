import { mongooseConnect } from "@/lib/mongoose";
import { sendNewOrderEmail } from '@/lib/sendEmail';
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
  await mongooseConnect();

  const { user } = await getServerSession(req, res, authOptions);

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const orders = await Order.find({ userEmail: user.email }).sort({ createdAt: -1 }).lean();
      return res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      return res.status(500).json({ message: "Error fetching orders" });
    }
  }

  if (req.method === "POST") {
    const { line_items, shippingFee, shippingAddress, name, email, city, postalCode, country, streetAddress } = req.body;

    if (!line_items || !shippingFee) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    try {
      const newOrder = new Order({
        userEmail: user.email,
        orderNumber,
        status: "Pending",
        line_items,
        shippingFee,
        shippingAddress,
        name,
        email,
        city,
        postalCode,
        country,
        streetAddress,
        createdAt: new Date(),
        isApproved,
      });

      await newOrder.save();

      await sendNewOrderEmail({
        to: 'admin@yourdomain.com',
        order: newOrder,
      });

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
