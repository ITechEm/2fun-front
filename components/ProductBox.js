import styled from "styled-components";
import Button, { ButtonStyle } from "@/components/Button";
import CartIcon from "@/components/icons/CartIcon";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import { primary } from "@/lib/colors";
import FlyingButton from "@/components/FlyingButton";
import HeartOutlineIcon from "@/components/icons/HeartOutlineIcon";
import HeartSolidIcon from "@/components/icons/HeartSolidIcon";
import axios from "axios";
import { useSession } from "next-auth/react"; 

const ProductWrapper = styled.div`
  button {
    width: 100%;
    text-align: center;
    justify-content: center;
  }
`;

const WhiteBox = styled(Link)`
  background-color: #fff;
  padding: 20px;
  height: 300px;
  width: 200px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  position: relative;
  img {
    max-width: 100%;
    max-height: 100;
  }
`;

const Title = styled(Link)`
  font-weight: normal;
  font-size: 1rem;
  color: inherit;
  text-decoration: none;
  margin-left: 5px;
`;

const ProductInfoBox = styled.div`
  margin-top: 10px;
`;

const PriceRow = styled.div`
  display: block;
  @media screen and (min-width: 768px) {
    display: flex;
    gap: 5px;
  }
  align-items: center;
  justify-content: space-between;
  margin-top: 2px;
`;

const Price = styled.div`
  font-size: 1rem;
  font-weight: 400;
  text-align: right;
  @media screen and (min-width: 768px) {
    font-size: 1.2rem;
    font-weight: 600;
    text-align: left;
  }
`;

const WishlistButton = styled.button`
  border: 0;
  width: 40px !important;
  height: 40px;
  padding: 10px;
  position: absolute;
  top: 0;
  right: 0;
  background: transparent;
  cursor: pointer;
  ${props =>
    props.wished
      ? `
    color:red;
  `
      : `
    color:black;
  `}
  svg {
    width: 16px;
  }
`;

export default function ProductBox({
  _id,
  title,
  description,
  price,
  images,
  wished = false,
  onRemoveFromWishlist = () => {},
}) {
  const { data: session } = useSession(); // Get session data
  const [isWished, setIsWished] = useState(wished);

  function addToWishlist(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    const nextValue = !isWished;
    if (nextValue === false && onRemoveFromWishlist) {
      onRemoveFromWishlist(_id);
    }
    axios
      .post("/api/wishlist", {
        product: _id,
      })
      .then(() => {});
    setIsWished(nextValue);
  }

  return (
    <ProductWrapper>
      <WhiteBox href={`/product/${_id}`}>
        <div>
          {/* Only render the Wishlist Button if the user is logged in */}
          {session && (
            <WishlistButton wished={isWished} onClick={addToWishlist}>
              {isWished ? <HeartSolidIcon /> : <HeartOutlineIcon />}
            </WishlistButton>
          )}
          <img src={images?.[0]} alt={title} />
        </div>
      </WhiteBox>
      <Title href={`/product/${_id}`}>{title}</Title>
      <ProductInfoBox>
        <PriceRow>
          <Price>€{price}</Price>
          <FlyingButton _id={_id} src={images?.[0]}>
            Add to cart
          </FlyingButton>
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  );
}


// import styled from "styled-components";
// import Button, { ButtonStyle } from "@/components/Button";
// import CartIcon from "@/components/icons/CartIcon";
// import Link from "next/link";
// import { useContext, useEffect, useState } from "react";
// import { CartContext } from "@/components/CartContext";
// import { primary } from "@/lib/colors";
// import FlyingButton from "@/components/FlyingButton";
// import HeartOutlineIcon from "@/components/icons/HeartOutlineIcon";
// import HeartSolidIcon from "@/components/icons/HeartSolidIcon";
// import axios from "axios";

// // Wrapper for the product display grid
// const StyledProductsGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(2, 1fr);
//   gap: 20px;
//   margin-top: 20px;

//   /* For larger screens */
//   @media screen and (min-width: 768px) {
//     grid-template-columns: repeat(4, 1fr);
//   }
//   @media screen and (min-width: 1200px) {
//     gap: 30px;
//   }
// `;

// // Styled individual product box
// const ProductWrapper = styled.div`
//   background-color: #fff;
//   padding: 20px;
//   border-radius: 20px;
//   box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//   position: relative;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   height: 100%;
//   transition: all 0.3s ease;

//   &:hover {
//     box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
//     transform: translateY(-5px);
//   }
// `;

// // Product image section
// const ProductImageBox = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   height: 250px;

//   img {
//     max-width: 100%;
//     max-height: 100%;
//     object-fit: contain;
//   }
// `;

// // Product info section
// const ProductInfoBox = styled.div`
//   margin-top: 10px;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
// `;

// // Product title (name)
// const Title = styled(Link)`
//   font-weight: normal;
//   font-size: 1rem;
//   color: inherit;
//   text-decoration: none;
//   margin: 0;
//   font-weight: 500;
//   text-align: center;
//   display: block;
//   padding: 5px;
// `;

// // Price and Wishlist button row
// const PriceRow = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-top: 10px;
//   gap: 10px;
// `;

// // Price styling
// const Price = styled.div`
//   font-size: 1rem;
//   font-weight: 600;
//   color: #7e74f1;
//   text-align: left;
// `;

// // Wishlist button
// const WishlistButton = styled.button`
//   border: 0;
//   width: 40px !important;
//   height: 40px;
//   padding: 10px;
//   position: absolute;
//   top: 10px;
//   right: 10px;
//   background: transparent;
//   cursor: pointer;

//   ${props => props.wished && `
//     color: red;
//   `}

//   svg {
//     width: 20px;
//   }
// `;

// export default function ProductBox({
//   _id,
//   title,
//   description,
//   price,
//   images,
//   wished = false,
//   onRemoveFromWishlist = () => {},
// }) {
//   const url = '/product/' + _id;
//   const [isWished, setIsWished] = useState(wished);

//   function addToWishlist(ev) {
//     ev.preventDefault();
//     ev.stopPropagation();
//     const nextValue = !isWished;
//     if (nextValue === false && onRemoveFromWishlist) {
//       onRemoveFromWishlist(_id);
//     }
//     axios.post('/api/wishlist', { product: _id }).then(() => {});
//     setIsWished(nextValue);
//   }

//   return (
//     <ProductWrapper>
//       {/* Product Image Section */}
//       <ProductImageBox>
//         <WishlistButton wished={isWished} onClick={addToWishlist}>
//           {isWished ? <HeartSolidIcon /> : <HeartOutlineIcon />}
//         </WishlistButton>
//         <img src={images?.[0]} alt={title} />
//       </ProductImageBox>

//       {/* Product Info Section */}
//       <ProductInfoBox>
//         <Title href={url}>{title}</Title>
//         <PriceRow>
//           <Price>€{price}</Price>
//           <FlyingButton _id={_id} src={images?.[0]}>
//             Add to Cart
//           </FlyingButton>
//         </PriceRow>
//       </ProductInfoBox>
//     </ProductWrapper>
//   );
// }

// // A wrapper component to display the grid
// export function ProductsGrid({ products, wishedProducts = [] }) {
//   return (
//     <StyledProductsGrid>
//       {products?.length > 0 && products.map((product, index) => (
//         <ProductBox
//           key={product._id}
//           _id={product._id}
//           title={product.title}
//           price={product.price}
//           images={product.images}
//           wished={wishedProducts.includes(product._id)}
//         />
//       ))}
//     </StyledProductsGrid>
//   );
// }