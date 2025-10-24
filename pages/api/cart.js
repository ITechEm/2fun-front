import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { ObjectId } from 'mongodb'; 

export default async function handle(req, res) {
  try {
    console.log('Request Body:', req.body);
    await mongooseConnect();

    const ids = req.body.ids;
    if (!Array.isArray(ids) || ids.length === 0) {
      console.log('No product IDs provided');
      return res.status(400).json({ message: 'No product IDs provided' });
    }
    const validIds = ids.filter(id => ObjectId.isValid(id));
    
    if (validIds.length === 0) {
      console.log('No valid product IDs');
      return res.status(400).json({ message: 'No valid product IDs' });
    }

    console.log('Valid IDs:', validIds);

    const products = await Product.find({ _id: { $in: validIds } });

    if (products.length === 0) {
      console.log('No products found for the provided IDs');
      return res.status(404).json({ message: 'No products found for the provided IDs' });
    }

    console.log('Found products:', products);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}