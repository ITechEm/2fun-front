import Layout from "@/pages/layout";
import HeroSection from "@/components/HeroSection";
import { mongooseConnect } from "@/lib/mongoose";
import { WishedProduct } from "@/models/WishedProduct";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import Center from "@/components/Center";
import ProductsGrid from "@/components/ProductsGrid";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Styled components for the carousel and grid layout
const CarouselContainer = styled.div`
  position: relative;
  width: 107.5%;
  overflow: hidden; /* Hide overflowing products */
  margin-top: 20px;
`;

const CarouselWrapper = styled.div`
  display: flex; /* Flex layout for mobile */
  gap: 20px;
  transition: transform 0.5s ease-in-out;
  width: 100%;

  /* Mobile view: Enable horizontal scrolling */
  @media screen and (max-width: 480px) {
    overflow-x: auto;
    scroll-snap-type: x mandatory; /* Smooth snap scroll */
    -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  }

  /* Tablet/Desktop view: Grid layout */
  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2 items per row on tablets */
  }

  @media screen and (min-width: 1024px) {
    grid-template-columns: repeat(13, 1fr); /* 3 items per row on desktops */
  }
`;

const CarouselItem = styled.div`
  padding: 15px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  scroll-snap-align: start; /* Ensure snap scroll works properly */

  &:hover {
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); /* Hover effect */
    transform: translateY(-5px);
  }
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  ${(props) => (props.left ? "left: 20px;" : "right: 20px;")}
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 50%;
  font-size: 30px;
  z-index: 20; /* Make sure it is on top of other elements */
  transform: translateY(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease;

  /* Hide arrow buttons on mobile */
  @media screen and (max-width: 480px) {
    display: none;
  }
`;

const SectionHeading = styled.h2`
  text-align: center;
  font-size: 2rem;
  margin-bottom: 30px;
  margin-top: 50px;
  color: #333;
`;

const RightArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" />
</svg>

);

const LeftArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
</svg>

);

export default function HomePage({ featuredProduct, wishedNewProducts }) {
  const [suggested, setSuggested] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const productsPerPage = 3; // Number of products per page to display (3 for desktop)

  // Fetch suggested products from the settings
  useEffect(() => {
    async function fetchSuggestedProducts() {
      try {
        const suggestedRes = await axios.get("/api/settings?name=homeSuggestedProducts");
        const ids = JSON.parse(suggestedRes.data?.value || "[]");

        if (ids.length) {
          const { data: products } = await axios.post("/api/products/by-ids", { ids });
          setSuggested(products);
        }
      } catch (err) {
        console.error("Error fetching suggested products:", err);
      }
    }

    fetchSuggestedProducts();
  }, []);

  // Handle carousel navigation
  const goToNext = () => {
    if (currentIndex + productsPerPage < suggested.length) {
      setCurrentIndex(currentIndex + productsPerPage);
    }
  };

  const goToPrev = () => {
    if (currentIndex - productsPerPage >= 0) {
      setCurrentIndex(currentIndex - productsPerPage);
    }
  };

  // The "visible" products are the ones in the range determined by currentIndex
  const visibleProducts = suggested.slice(currentIndex, currentIndex + productsPerPage);

  // Conditionally hide arrow buttons if we don't need to navigate
  const shouldShowArrows =
    suggested.length > productsPerPage; // Show arrows if there are more than 3 items

  return (
    <div>
      <Layout>
        {/* Hero Section */}
        <HeroSection />

        <Center>
          <SectionHeading>Suggested Products</SectionHeading>

          {/* Carousel Wrapper */}
          <CarouselContainer>
            <CarouselWrapper
              style={{
                transform: `translateX(-${(100 / productsPerPage) * currentIndex}%)`,
              }}
            >
              {suggested.map((product) => (
                <CarouselItem key={product._id}>
                  <ProductsGrid products={[product]} /> {/* Assuming ProductsGrid displays a single product */}
                </CarouselItem>
              ))}
            </CarouselWrapper>

            {/* Arrow Buttons - Conditionally render based on whether navigation is needed */}
            {shouldShowArrows && (
              <>
                {/* Only show left arrow if we are not at the beginning */}
                {currentIndex > 0 && (
                  <ArrowButton left onClick={goToPrev}>
               <FaChevronLeft />
             </ArrowButton>
                )}

                {/* Only show right arrow if we are not at the end */}
                {currentIndex + productsPerPage < suggested.length && (
                  <ArrowButton onClick={goToNext}>
              <FaChevronRight />
             </ArrowButton>
                )}
              </>
            )}
          </CarouselContainer>
        </Center>
      </Layout>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  await mongooseConnect();

  // Fetch user session and wished products
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  const wishedNewProducts = session?.user
    ? await WishedProduct.find({
        userEmail: session.user.email,
      })
    : [];

  return {
    props: {
      featuredProduct: null,  // If you want to fetch featuredProduct, you can do so here
      wishedNewProducts: wishedNewProducts.map((i) => i.product.toString()),
    },
  };
}

// import Layout from "@/pages/layout";
// import HeroSection from "@/components/HeroSection";
// import { mongooseConnect } from "@/lib/mongoose";
// import { WishedProduct } from "@/models/WishedProduct";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/pages/api/auth/[...nextauth]";
// import { Setting } from "@/models/Setting";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import ProductsGrid from "@/components/ProductsGrid";
// import styled from "styled-components";
// import Center from "@/components/Center";

// // Styled component for products grid
// const StyledProductsGrid = styled.div`
//   display: grid;
//   justify-content: center;
//   grid-template-columns: 1fr 1fr;
//   gap: 20px;
//   @media screen and (min-width: 768px) {
//     grid-template-columns: 1fr 1fr 1fr 1fr;
//   }
// `;

// export default function HomePage({ featuredProduct, wishedNewProducts }) {
//   const [suggested, setSuggested] = useState([]);

//   // Fetch suggested products from the settings
//   useEffect(() => {
//     async function fetchSuggestedProducts() {
//       try {
//         // Fetching the suggested products IDs from the homeSuggestedProducts setting
//         const suggestedRes = await axios.get("/api/settings?name=homeSuggestedProducts");
//         const ids = JSON.parse(suggestedRes.data?.value || "[]");

//         if (ids.length) {
//           // Fetching the product details by IDs
//           const { data: products } = await axios.post("/api/products/by-ids", { ids });
//           setSuggested(products);
//         }
//       } catch (err) {
//         console.error("Error fetching suggested products:", err);
//       }
//     }

//     fetchSuggestedProducts();
//   }, []);

//   return (
//     <div>
//       <Layout>
//         {/* Hero Section */}
//         <HeroSection />
        
//         <Center>
//           <h2 style={{ marginBottom: 20, marginTop: 20 }}>Suggested Products</h2>
          
//           {/* Suggested Products Grid */}
//           <StyledProductsGrid>
//             <ProductsGrid products={suggested} />
//           </StyledProductsGrid>
//         </Center>
//       </Layout>
//     </div>
//   );
// }

// export async function getServerSideProps(ctx) {
//   await mongooseConnect();

//   // Fetch user session and wished products
//   const session = await getServerSession(ctx.req, ctx.res, authOptions);
//   const wishedNewProducts = session?.user
//     ? await WishedProduct.find({
//         userEmail: session.user.email,
//       })
//     : [];

//   return {
//     props: {
//       featuredProduct: null,  // If you want to fetch featuredProduct, you can do so here
//       wishedNewProducts: wishedNewProducts.map(i => i.product.toString())
//     },
//   };
// }
