import styled from "styled-components";
import ProductBox from "@/components/ProductBox";
import { RevealWrapper } from 'next-reveal';
import { useState } from "react";

const StyledProductsGrid = styled.div`
  display: grid;
  justify-content: center;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
`;

const ViewMoreButton = styled.button`
  background-color: ${props => props.disabled ? "#ccc" : "#7e74f1 "};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 30px;
  cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${props => (props.disabled ? 0.5 : 1)};
  margin-top: 20px;
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

export default function ProductsGrid({ products, wishedProducts = [] }) {
  const [visibleProducts, setVisibleProducts] = useState(8);

  const handleViewMore = () => {
    setVisibleProducts(prev => prev + 8);
  };

  return (
    <>
      <StyledProductsGrid interval={100}>
        {products?.length > 0 &&
          products.slice(0, visibleProducts).map((product, index) => (
            <RevealWrapper key={product._id} delay={index * 50}>
              <ProductBox {...product} wished={wishedProducts.includes(product._id)} />
            </RevealWrapper>
          ))}
      </StyledProductsGrid>

      
      {products?.length > visibleProducts && (
        <ViewMoreButton onClick={handleViewMore}>
          View More
        </ViewMoreButton>
      )}
    </>
  );
}


// import styled from "styled-components";
// import ProductBox from "@/components/ProductBox";
// import {RevealWrapper} from 'next-reveal'

// const StyledProductsGrid = styled.div`
//   display: grid;
//   justify-content: center;
//   grid-template-columns: 1fr 1fr;
//   gap: 20px;
//   @media screen and (min-width: 768px) {
//     grid-template-columns: 1fr 1fr 1fr 1fr;
 
//   }
// `;

// export default function ProductsGrid({products,wishedProducts=[]}) {
//   return (
//     <StyledProductsGrid interval={100}>
//       {products?.length > 0 && products.map((product,index) => (
//         <RevealWrapper key={product._id} delay={index*50}>
//           <ProductBox {...product}
//                       wished={wishedProducts.includes(product._id)} />
//         </RevealWrapper>
//       ))}
//     </StyledProductsGrid>
//   );
// }