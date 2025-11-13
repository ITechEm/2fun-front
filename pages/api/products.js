import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import mongoose from "mongoose";

export default async function handle(req, res) {
  await mongooseConnect();

  const { limit, categories, sort, phrase, ...filters } = req.query;
  let [sortField, sortOrder] = (sort || "_id-desc").split("-");
  const sortOptions = { [sortField]: sortOrder === "asc" ? 1 : -1 };

  try {
    // 🧠 1️⃣ Find all visible categories
    const visibleCategories = await Category.find({ visible: true }).select("_id");
    const visibleCategoryIds = visibleCategories.map((cat) => new mongoose.Types.ObjectId(cat._id));

    // 🧠 2️⃣ Build product query
    const productsQuery = {};

    // Show only products whose category is visible
    productsQuery.category = { $in: visibleCategoryIds };

    // If user filters by category, include only visible ones from that selection
    if (categories) {
      const selectedCategories = categories.split(",").map((id) => new mongoose.Types.ObjectId(id));
      const allowedCategories = selectedCategories.filter((id) =>
        visibleCategoryIds.some((visibleId) => visibleId.equals(id))
      );
      productsQuery.category = { $in: allowedCategories };
    }

    if (phrase) {
      productsQuery["$or"] = [
        { title: { $regex: phrase, $options: "i" } },
        { description: { $regex: phrase, $options: "i" } },
      ];
    }

    if (Object.keys(filters).length > 0) {
      Object.keys(filters).forEach((filterName) => {
        productsQuery[`properties.${filterName}`] = filters[filterName];
      });
    }

    // 🧠 3️⃣ Fetch filtered products
    const products = await Product.find(productsQuery, null, {
      sort: sortOptions,
      limit: limit ? parseInt(limit) : 0,
    });

    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
}
