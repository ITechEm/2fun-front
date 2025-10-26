import { useState, useContext } from "react";
import styled from "styled-components";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import Center from "@/components/Center";
import Header from "@/components/Header";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import WhiteBox from "@/components/WhiteBox";
import ProductImages from "@/components/ProductImages";
import ProductReviews from "@/components/ProductReviews";
import Layout from "../layout";
import { CartContext } from "@/components/CartContext";

// Styled components
const ColWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 0.8fr 1.2fr;
  }
  gap: 40px;
  margin: 40px 0;
`;

const DescriptionSection = styled.div`
  margin-top: 40px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const DescriptionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
`;

const DescriptionText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #555;
  margin-bottom: 20px;
`;

const ProductDetails = styled.div`
  margin-top: 10px;
  background-color: #f1f1f1;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
`;

const ProductDetailsText = styled.p`
  font-size: 1rem;
  color: #555;
  margin: 5px 0;
`;

const PriceBox = styled(WhiteBox)`
  margin-top: 30px;
  padding: 20px;
  text-align: center;
`;

const Price = styled.div`
  font-size: 1.8rem;
  color: #e60000;
  font-weight: 700;
  margin-bottom: 5px;
`;

const MonthlyRate = styled.div`
  font-size: 1rem;
  color: #333;
  margin-bottom: 15px;
  span {
    font-weight: 600;
    font-size: 1.1rem;
  }
`;

const TitleProduct = styled.h1`
  margin-top: 20px;
  font-size: 1.5em;
`;

const ButtonsRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;

  & > button {
    flex: 1 1 0;
    min-width: 0;
    text-align: center;
  }
`;

const AddToFavoriteButton = styled.button`
  border: 2px solid #777;
  background: white;
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: #777;
    color: white;
  }

  @media screen and (max-width: 480px) {
    font-size: 0.85rem;
    padding: 10px;
  }
`;

const ButtonWrapper = styled.div`
  position: relative;
  flex: 1;

  button {
    width: 100%;
    border-radius: 8px;
    padding: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    border: 2px solid #888;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: transform 0.2s, font-size 0.2s, background 0.3s, color 0.3s;

    &.clicked {
      animation: pop 0.3s ease-in-out;
    }

    @media screen and (max-width: 480px) {
      font-size: 0.8rem;
      padding: 10px;
    }
  }

  .popup {
    position: absolute;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #74f199ff;
    color: white;
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 0.9rem;
    opacity: 0;
    transition: opacity 0.3s, transform 0.3s;
    pointer-events: none;

    @media screen and (max-width: 480px) {
      font-size: 0.5rem;
      padding: 4px 10px;
    }
  }

  .popup.show {
    opacity: 1;
    transform: translateX(-50%) translateY(-10px);
  }

  @keyframes pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.15); }
    100% { transform: scale(1); }
  }
`;

function AddToCartButton({ _id, children }) {
  const { addProduct } = useContext(CartContext);
  const [added, setAdded] = useState(false);
  const [clicked, setClicked] = useState(false);

  function handleClick() {
    addProduct(_id);
    setClicked(true);
    setAdded(true);

    // Green flash for 0.3s
    setTimeout(() => setClicked(false), 2000);

    // Revert text and background after 3 seconds
    setTimeout(() => setAdded(false), 2000);
  }
  return (
    <ButtonWrapper>
      <button
        onClick={handleClick}
        className={clicked ? "clicked" : ""}
        style={{
          background: added ? "#4CAF50" : "linear-gradient(to right, #333, #777)",
          color: "white",
        }}
      >
        <FaShoppingCart style={{ marginRight: "6px" }} />
        {added ? "Added to cart" : children || "Add to cart"}
      </button>
    </ButtonWrapper>
  );
}

// Main ProductPage Component
export default function ProductPage({ product }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const toggleFavorite = () => setIsFavorite(!isFavorite);

  return (
    <Layout>
      <Center>
        <TitleProduct>{product.title}</TitleProduct>
        <ColWrapper>
          <WhiteBox>
            <ProductImages images={product.images} />
          </WhiteBox>

          <div>
            <PriceBox>
              <Price>{product.price.toFixed(2)}€</Price>
              <MonthlyRate>
                Reduced from <span>4€</span>
              </MonthlyRate>

              <ButtonsRow>
                <AddToCartButton _id={product._id}>
                  Add to cart
                </AddToCartButton>

                <AddToFavoriteButton onClick={toggleFavorite}>
                  <FaHeart color={isFavorite ? "red" : "inherit"} />
                  {isFavorite ? "Added" : "Favorite"}
                </AddToFavoriteButton>
              </ButtonsRow>
            </PriceBox>

            <DescriptionSection>
              {product.descriptionTitle && (
                <DescriptionTitle>{product.descriptionTitle}</DescriptionTitle>
              )}
              {product.descriptionText && (
                <DescriptionText>{product.descriptionText}</DescriptionText>
              )}
              {product.descriptionProductDetails && (
                <div>
                  <h4>Product Details</h4>
                  <DescriptionText>
                    {product.descriptionProductDetails}
                  </DescriptionText>
                </div>
              )}
            </DescriptionSection>

            <ProductDetails>
              <ProductDetailsText>
                <strong>Weight:</strong> {product.weight} kg
              </ProductDetailsText>
              <ProductDetailsText>
                <strong>In Stock:</strong> {product.inStock ? "Yes" : "No"}
              </ProductDetailsText>
            </ProductDetails>
          </div>
        </ColWrapper>

        <ProductReviews product={product} />
      </Center>
    </Layout>
  );
}

// Server-side fetching
export async function getServerSideProps(context) {
  await mongooseConnect();
  const { id } = context.query;
  const product = await Product.findById(id);

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  };
}










// import Center from "@/components/Center";
// import Header from "@/components/Header";
// import { mongooseConnect } from "@/lib/mongoose";
// import { Product } from "@/models/Product";
// import styled from "styled-components";
// import WhiteBox from "@/components/WhiteBox";
// import ProductImages from "@/components/ProductImages";
// import FlyingButton from "@/components/FlyingButton";
// import ProductReviews from "@/components/ProductReviews";
// import Layout from "../layout";

// const ColWrapper = styled.div`
//   display: grid;
//   grid-template-columns: 1fr;
//   @media screen and (min-width: 768px) {
//     grid-template-columns: .8fr 1.2fr;
//   }
//   gap: 40px;
//   margin: 40px 0;
// `;

// const DescriptionSection = styled.div`
//   margin-top: 40px;
//   padding: 20px;
//   background-color: #f9f9f9;
//   border-radius: 10px;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
// `;

// const DescriptionTitle = styled.h3`
//   font-size: 1.5rem;
//   font-weight: bold;
//   color: #333;
//   margin-bottom: 15px;
// `;

// const DescriptionText = styled.p`
//   font-size: 1rem;
//   line-height: 1.6;
//   color: #555;
//   margin-bottom: 20px;
// `;

// const ProductDetails = styled.div`
//   margin-top: 10px;
//   background-color: #f1f1f1;
//   padding: 15px;
//   border-radius: 8px;
//   box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
// `;

// const ProductDetailsText = styled.p`
//   font-size: 1rem;
//   color: #555;
//   margin: 5px 0;
// `;

// const PriceBox = styled(WhiteBox)`
//   margin-top: 30px;
//   padding: 20px;
// `;

// const Price = styled.span`
//   font-size: 1.4rem;
//   color: #e94e77;
//   font-weight: bold;
// `;

// const TitleProduct = styled.h1`
//   margin-top: 20px;
//   font-size: 1.5em;
// `;

// export default function ProductPage({ product }) {
//   return (
//     <Layout>
//       <Center>
//         <TitleProduct>{product.title}</TitleProduct>
//         <ColWrapper>
//           {/* Product Images */}
//           <WhiteBox>
//             <ProductImages images={product.images} />
//           </WhiteBox>

//           <div>
//             {/* Product Description Section */}
//             <DescriptionSection>
//               {product.descriptionTitle && (
//                 <DescriptionTitle>{product.descriptionTitle}</DescriptionTitle>
//               )}
//               {product.descriptionText && (
//                 <DescriptionText>{product.descriptionText}</DescriptionText>
//               )}
//               {product.descriptionProductDetails && (
//                 <div>
//                   <h4>Product Details</h4>
//                   <DescriptionText>{product.descriptionProductDetails}</DescriptionText>
//                 </div>
//               )}
//             </DescriptionSection>

//             {/* Product Weight & Stock */}
//             <ProductDetails>
//               <ProductDetailsText>
//                 <strong>Weight:</strong> {product.weight} kg
//               </ProductDetailsText>
//               <ProductDetailsText>
//                 <strong>In Stock:</strong> {product.inStock ? "Yes" : "No"}
//               </ProductDetailsText>
//             </ProductDetails>

//             {/* Price & Add to Cart */}
//             <PriceBox>
//               <Price>€{product.price}</Price>
//               <FlyingButton main _id={product._id} src={product.images?.[0]}>
//                 Add to cart
//               </FlyingButton>
//             </PriceBox>
//           </div>
//         </ColWrapper>

//         {/* Product Reviews */}
//         <ProductReviews product={product} />
//       </Center>
//     </Layout>
//   );
// }

// export async function getServerSideProps(context) {
//   await mongooseConnect();
//   const { id } = context.query;
//   const product = await Product.findById(id);

//   return {
//     props: {
//       product: JSON.parse(JSON.stringify(product)), // Convert to plain object
//     },
//   };
// }





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