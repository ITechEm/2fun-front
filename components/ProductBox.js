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
  background-color: #c29898;
  width: 200px;
  height: 300px;
  border-radius: 10px;
  position: relative;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

const Title = styled(Link)`
  font-weight: normal;
  font-size: 1rem;
  color: inherit;
  text-decoration: none;
  margin-left: 5px;

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  text-overflow: ellipsis;
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
  top: 10px;
  right: 10px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;

  display: flex;
  align-items: center;
  justify-content: center;

  ${props =>
    props.wished
      ? `
    color:red;
  `
      : `
    color:black;
  `}

  svg {
    width: 18px;
    height: 18px;
  }
`;

const SeeButton = styled.button`
  background: linear-gradient(135deg, #7e74f1, #5b52d6);
  color: white;
  border: none;
  border-radius: 25px;

  padding: 8px 18px;
  font-size: 0.9rem;
  font-weight: 600;

  cursor: pointer;
  transition: all 0.25s ease;

  box-shadow: 0 4px 10px rgba(126,116,241,0.25);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(126,116,241,0.35);
  }

  &:active {
    transform: scale(0.96);
  }

  @media(max-width: 767px){
    padding: 7px 15px;
    font-size: 0.85rem;
  }
`;

export default function ProductBox({
  _id,
  title,
  description,
  price,
  images,
  link,
  wished = false,
  onRemoveFromWishlist = () => {},
}) {
  const { data: session } = useSession(); // Get session data
  const [isWished, setIsWished] = useState(wished);
  const SUPPORT_LINK = "https://www.instagram.com/2fun.shops/";

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
  {session && (
    <WishlistButton wished={isWished} onClick={addToWishlist}>
      {isWished ? <HeartSolidIcon /> : <HeartOutlineIcon />}
    </WishlistButton>
  )}

  <img src={images?.[0]} alt={title} />
</WhiteBox>
      <Title href={`/product/${_id}`}>{title}</Title>
      <ProductInfoBox>
        <PriceRow>
          <Price>€{price}</Price>
          <a
          href={link || SUPPORT_LINK}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SeeButton>
            {link ? "See on Etsy" : "Ask"}
          </SeeButton>
        </a>
          {/* <FlyingButton _id={_id} src={images?.[0]}>
            Add to cart
          </FlyingButton> */}
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