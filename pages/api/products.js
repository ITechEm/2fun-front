import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";

export default async function handle(req, res) {
  await mongooseConnect();
  const {categories, sort, phrase, ...filters} = req.query;
  let [sortField, sortOrder] = (sort || '_id-desc').split('-');

  const productsQuery = {};
  if (categories) {
    productsQuery.category = categories.split(',');
  }
  if (phrase) {
    productsQuery['$or'] = [
      {title:{$regex:phrase,$options:'i'}},
      {description:{$regex:phrase,$options:'i'}},
    ];
  }
  if (Object.keys(filters).length > 0) {
    Object.keys(filters).forEach(filterName => {
      productsQuery['properties.'+filterName] = filters[filterName];
    });
  }
  console.log(productsQuery);
  res.json(await Product.find(
    productsQuery,
    null,
    {
      sort:{[sortField]:sortOrder==='asc' ? 1 : -1}
    })
  );
}


// import { mongooseConnect } from "@/lib/mongoose";
// import { Product } from "@/models/Product";

// export default async function handle(req, res) {
//   await mongooseConnect();
//   const { categories, sort, phrase, inStock, ...filters } = req.query;

//   let [sortField, sortOrder] = (sort || '_id-desc').split('-');

//   const productsQuery = {};

//   // Handle filtering by categories
//   if (categories) {
//     productsQuery.category = categories.split(',');
//   }

//   // Handle searching by phrase (title or description)
//   if (phrase) {
//     productsQuery['$or'] = [
//       { title: { $regex: phrase, $options: 'i' } },
//       { description: { $regex: phrase, $options: 'i' } },
//     ];
//   }

//   // Handle filtering by properties (e.g. product specifications)
//   if (Object.keys(filters).length > 0) {
//     Object.keys(filters).forEach((filterName) => {
//       productsQuery['properties.' + filterName] = filters[filterName];
//     });
//   }

//   // Handle filtering by inStock status (if provided)
//   if (inStock) {
//     productsQuery.inStock = inStock === 'true'; // Convert to boolean
//   }

//   console.log('Products Query:', productsQuery); // To debug and see the query being used

//   // Return products from the database with sorting and filtering
//   try {
//     const products = await Product.find(
//       productsQuery,
//       null,
//       {
//         sort: { [sortField]: sortOrder === 'asc' ? 1 : -1 }
//       }
//     );

//     res.json(products);
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).json({ error: 'Error fetching products' });
//   }
// }