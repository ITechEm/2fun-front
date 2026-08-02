import Layout from "./layout";
import styled from "styled-components";
import Center from "@/components/Center";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { WishedProduct } from "@/models/WishedProduct";
import "@/models/Category";


const CategorySection = styled.div`
  margin-bottom: 50px;

  h2 {
    margin-bottom: 25px;
    font-size: 1.8rem;
    font-weight: 600;
  }
`;


const MobileCarousel = styled.div`
  display: none;

  @media (max-width: 767px) {
    display: block;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    padding-bottom: 15px;

    > div {
      display: flex;
      gap: 15px;
      justify-content: flex-start;
    }

    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const DesktopProducts = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;

  @media (max-width: 767px) {
    display: none;
  }
`;



export default function ProductsPage({
  products,
  wishedProducts
}) {


  const categories = [
    ...new Map(
      products
        .filter(product => product.category)
        .map(product => [
          product.category._id,
          product.category
        ])
    ).values()
  ];



  return (
    <Layout>

      <Center>

        <Title>
          All products
        </Title>



        {categories.map(category => {


          const categoryProducts = products.filter(
            product =>
              product.category?._id === category._id
          );


          return (

            <CategorySection key={category._id}>


              <h2>
                {category.name}
              </h2>



              {/* Desktop */}
              <DesktopProducts>

                <ProductsGrid
                  products={categoryProducts}
                  wishedProducts={wishedProducts}
                />

              </DesktopProducts>



              {/* Mobile carousel */}
              <MobileCarousel>

                <div>

                  {categoryProducts.map(product => (

                    <ProductsGrid
                      key={product._id}
                      products={[product]}
                      wishedProducts={wishedProducts}
                    />

                  ))}

                </div>

              </MobileCarousel>



            </CategorySection>

          );

        })}



      </Center>

    </Layout>
  );
}




export async function getServerSideProps(ctx) {

  await mongooseConnect();


  const products = await Product.find({})
    .populate("category")
    .sort({
      _id: -1
    });



  const session = await getServerSession(
    ctx.req,
    ctx.res,
    authOptions
  );



  const wishedProducts = session?.user

    ? await WishedProduct.find({
        userEmail: session.user.email,
        product: products.map(
          p => p._id.toString()
        ),
      })

    : [];



  return {

    props: {

      products:
        JSON.parse(
          JSON.stringify(products)
        ),


      wishedProducts:
        wishedProducts.map(
          i => i.product.toString()
        ),

    },

  };

}


//last edited: 02-08-2026
// import Layout from "./layout";
// import styled from "styled-components";
// import Center from "@/components/Center";
// import {mongooseConnect} from "@/lib/mongoose";
// import {Product} from "@/models/Product";
// import ProductsGrid from "@/components/ProductsGrid";
// import Title from "@/components/Title";
// import {getServerSession} from "next-auth";
// import {authOptions} from "@/pages/api/auth/[...nextauth]";
// import {WishedProduct} from "@/models/WishedProduct";

// export default function ProductsPage({products,wishedProducts}) {
//   return (
//     <>
//       <Layout>
//       <Center>
//         <Title>All products</Title>
//         <ProductsGrid products={products} wishedProducts={wishedProducts} />
//       </Center>
//       </Layout>
//     </>
//   );
// }

// export async function getServerSideProps(ctx) {
//   await mongooseConnect();
//   const products = await Product.find({}, null, {sort:{'_id':-1}});
//   const session = await getServerSession(ctx.req, ctx.res, authOptions);
//   const wishedProducts = session?.user
//       ? await WishedProduct.find({
//           userEmail:session?.user.email,
//           product: products.map(p => p._id.toString()),
//         })
//       : [];
//   return {
//     props:{
//       products: JSON.parse(JSON.stringify(products)),
//       wishedProducts: wishedProducts.map(i => i.product.toString()),
//     }
//   };
// }