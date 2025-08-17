// api/reviews.js
import { mongooseConnect } from "@/lib/mongoose";
import { Review } from "@/models/Review";
import { getSession } from "next-auth/react"; // for session management

export default async function handle(req, res) {
  await mongooseConnect();

  if (req.method === 'POST') {
    const session = await getSession({ req });
    if (!session) {
      return res.status(401).json({ message: "You must be logged in to post a review" });
    }

    const { title, description, stars, product } = req.body;

    if (!title || !description || !stars || !product) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const newReview = await Review.create({
        title,
        description,
        stars,
        product,
        user: session.user.id, // Link the review to the user
      });
      return res.status(201).json(newReview);
    } catch (error) {
      return res.status(500).json({ message: "Error creating review", error: error.message });
    }
  }

  if (req.method === 'GET') {
    const { product } = req.query;
    
    try {
      const reviews = await Review.find({ product })
        .populate("user", "name") // Populate the user with their name only
        .sort({ createdAt: -1 }); // Sort reviews by creation date
      
      return res.status(200).json(reviews);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching reviews", error: error.message });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}

