import Center from "@/components/Center";
import Header from "@/components/Header";
import Title from "@/components/Title";
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import styled from "styled-components";
import WhiteBox from "@/components/WhiteBox";
import ProductImages from "@/components/ProductImages";
import CartIcon from "@/components/icons/CartIcon";
import FlyingButton from "@/components/FlyingButton";
import ProductReviews from "@/components/ProductReviews";
import Layout from "../layout2";

const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: .8fr 1.2fr;
  }
  gap: 40px;
  margin: 40px 0;
`;
const PriceRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;
const Price = styled.span`
  font-size: 1.4rem;
`;

export default function ProductPage({product}) {
  
  return (
    <>
      <Layout>
      <Center>
        <ColWrapper>
          <WhiteBox>
            <ProductImages images={product.images} />
          </WhiteBox>
          <div>
            <Title>{product.title}</Title>
            <p>{product.description}</p>
            <PriceRow>
              <div>
                <Price>€{product.price}</Price>
              </div>
              <div>
                <FlyingButton main _id={product._id} src={product.images?.[0]}>
                  <CartIcon />Add to cart
                </FlyingButton>
              </div>
            </PriceRow>
          </div>
        </ColWrapper>
        <ProductReviews product={product} />
      </Center>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  await mongooseConnect();
  const {id} = context.query;
  const product = await Product.findById(id);
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    }
  }
}


// In stock and out of stock function implementation

// import Center from "@/components/Center";
// import Header from "@/components/Header";
// import Title from "@/components/Title";
// import { mongooseConnect } from "@/lib/mongoose";
// import { Product } from "@/models/Product";
// import styled from "styled-components";
// import WhiteBox from "@/components/WhiteBox";
// import ProductImages from "@/components/ProductImages";
// import CartIcon from "@/components/icons/CartIcon";
// import FlyingButton from "@/components/FlyingButton";
// import ProductReviews from "@/components/ProductReviews";

// const ColWrapper = styled.div`
//   display: grid;
//   grid-template-columns: 1fr;
//   @media screen and (min-width: 768px) {
//     grid-template-columns: .8fr 1.2fr;
//   }
//   gap: 40px;
//   margin: 40px 0;
// `;

// const PriceRow = styled.div`
//   display: flex;
//   gap: 20px;
//   align-items: center;
// `;

// const Price = styled.span`
//   font-size: 1.4rem;
// `;

// const Quantity = styled.div`
//   font-size: 1rem;
//   color: #555;
//   margin-top: 10px;
// `;

// const StockStatus = styled.div`
//   font-size: 1rem;
//   color: ${props => (props.inStock ? "green" : "red")};
//   margin-top: 10px;
// `;

// const DisabledButton = styled(FlyingButton)`
//   opacity: 0.5;
//   pointer-events: none;
// `;

// export default function ProductPage({ product }) {
//   return (
//     <>
//       <Header />
//       <Center>
//         <ColWrapper>
//           <WhiteBox>
//             <ProductImages images={product.images} />
//           </WhiteBox>
//           <div>
//             <Title>{product.title}</Title>
//             <p>{product.description}</p>
//             <PriceRow>
//               <div>
//                 <Price>€{product.price}</Price>
//               </div>
//               <div>
//                 {/* Conditionally render the button based on inStock */}
//                 {product.inStock ? (
//                   <FlyingButton main _id={product._id} src={product.images?.[0]}>
//                     <CartIcon />Add to cart
//                   </FlyingButton>
//                 ) : (
//                   <DisabledButton main disabled _id={product._id} src={product.images?.[0]}>
//                     <CartIcon />Out of stock
//                   </DisabledButton>
//                 )}
//               </div>
//             </PriceRow>

//             {/* Display availability */}
//             <StockStatus inStock={product.inStock}>
//               {product.inStock ? "In Stock" : "Out of Stock"}
//             </StockStatus>

            
//           </div>
//         </ColWrapper>
//         <ProductReviews product={product} />
//       </Center>
//     </>
//   );
// }


// export async function getServerSideProps(context) {
//   await mongooseConnect();
//   const { id } = context.query;

//   // Fetch the product with the inStock status
//   const product = await Product.findById(id);

//   // Ensure inStock is included when passing to the page
//   return {
//     props: {
//       product: JSON.parse(JSON.stringify(product)), // Convert to plain JSON object
//     },
//   };
// }