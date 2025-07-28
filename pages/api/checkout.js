import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Setting } from "@/models/Setting";
const stripe = require('stripe')(process.env.STRIPE_SK);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, city, phone, postalCode, streetAddress, country, cartProducts } = req.body;

    await mongooseConnect();

    // Fetch products from DB to build line_items
    const uniqueIds = [...new Set(cartProducts)];
    const productsInfos = await Product.find({ _id: uniqueIds });

    let line_items = [];
    for (const productId of uniqueIds) {
      const productInfo = productsInfos.find(p => p._id.toString() === productId);
      const quantity = cartProducts.filter(id => id === productId).length || 0;
      if (quantity > 0 && productInfo) {
        line_items.push({
          quantity,
          price_data: {
            currency: 'USD',
            product_data: { name: productInfo.title },
            unit_amount: Math.round(productInfo.price * 100), // price in cents
          },
        });
      }
    }

    if (line_items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const session = await getServerSession(req, res, authOptions);

    const orderDoc = await Order.create({
      line_items,
      name,
      email,
      phone,
      streetAddress,
      city,
      postalCode,
      country,
      paid: false,
      userEmail: session?.user?.email,
    });

    const shippingFeeSetting = await Setting.findOne({ name: 'shippingFee' });
    const shippingFeeCents = Number(shippingFeeSetting?.value ?? 0) * 100;

    const stripeSession = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      customer_email: email,
      success_url: (process.env.PUBLIC_URL || 'http://localhost:3000') + '/cart?success=1',
      cancel_url: (process.env.PUBLIC_URL || 'http://localhost:3000') + '/cart?canceled=1',
      metadata: { orderId: orderDoc._id.toString() },
      allow_promotion_codes: true,
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: 'shipping fee',
            type: 'fixed_amount',
            fixed_amount: { amount: shippingFeeCents, currency: 'USD' },
          },
        },
      ],
    });

    res.json({ url: stripeSession.url });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}


// import { mongooseConnect } from "@/lib/mongoose";
// import { Product } from "@/models/Product";
// import { Order } from "@/models/Order";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/pages/api/auth/[...nextauth]";
// import { Setting } from "@/models/Setting";
// const stripe = require('stripe')(process.env.STRIPE_SK);

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   try {
//     const {
//       name, email, city, phone,
//       postalCode, streetAddress, country,
//       cartProducts,
//     } = req.body;

//     if (!Array.isArray(cartProducts) || cartProducts.length === 0) {
//       return res.status(400).json({ error: 'Cart is empty or invalid' });
//     }

//     await mongooseConnect();

//     const uniqueIds = [...new Set(cartProducts)];
//     console.log('Unique product IDs:', uniqueIds);

//     const productsInfos = await Product.find({ _id: uniqueIds });
//     console.log('Products from DB:', productsInfos);

//     let line_items = [];
//     for (const productId of uniqueIds) {
//       const productInfo = productsInfos.find(p => p._id.toString() === productId);
//       const quantity = cartProducts.filter(id => id === productId).length;
//       if (quantity > 0 && productInfo) {
//         line_items.push({
//           quantity,
//           price_data: {
//             currency: 'USD',
//             product_data: { name: productInfo.title },
//             unit_amount: productInfo.price * 100, // cents per unit
//           },
//         });
//       }
//     }
//     console.log('Line items:', line_items);

//     if (line_items.length === 0) {
//       return res.status(400).json({ error: 'No valid products found in cart' });
//     }

//     const session = await getServerSession(req, res, authOptions);
//     console.log('User session:', session);

//     const orderDoc = await Order.create({
//       line_items,
//       name,
//       email,
//       phone,
//       streetAddress,
//       city,
//       postalCode,
//       country,
//       paid: false,
//       userEmail: session?.user?.email,
//     });

//     const shippingFeeSetting = await Setting.findOne({ name: 'shippingFee' });
//     const shippingFeeCents = Number(shippingFeeSetting?.value ?? 0) * 100;
//     console.log('Shipping fee cents:', shippingFeeCents);

//     const stripeSession = await stripe.checkout.sessions.create({
//       line_items,
//       mode: 'payment',
//       customer_email: email,
//       success_url: (process.env.PUBLIC_URL || '') + '/cart?success=1',
//       cancel_url: (process.env.PUBLIC_URL || '') + '/cart?canceled=1',
//       metadata: { orderId: orderDoc._id.toString() },
//       allow_promotion_codes: true,
//       shipping_options: [
//         {
//           shipping_rate_data: {
//             display_name: 'shipping fee',
//             type: 'fixed_amount',
//             fixed_amount: { amount: shippingFeeCents, currency: 'USD' },
//           },
//         },
//       ],
//     });

//     res.json({ url: stripeSession.url });

//   } catch (error) {
//     console.error('Checkout error:', error);
//     res.status(500).json({ error: error.message || 'Internal Server Error' });
//   }
// }

