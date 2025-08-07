import styled from "styled-components";
import ButtonLink from "@/components/ButtonLink";
import CartIcon from "@/components/icons/CartIcon";
import FlyingButton from "@/components/FlyingButton";
import { RevealWrapper } from "next-reveal";

const Section = styled.section`
  background-color: #eae9e5;
  padding: 60px 0;
`;

const WideCenter = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  width: 100%;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const TextContent = styled.div`
  flex: 1;
  min-width: 300px;

  h1 {
    font-family: 'Playfair Display', serif;
    font-size: 48px;
    color: #222;
    margin-bottom: 20px;
  }

  p {
    font-size: 18px;
    color: #555;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 36px;
    }
  }
`;

const Buttons = styled.div`
  margin-top: 30px;
  display: flex;
  gap: 12px;
  justify-content: flex-start;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const PurpleButton = styled(ButtonLink)`
  background-color: #eae9e5 !important;
  color: black !important;
  padding: 14px 28px !important;
  border-radius: 30px !important;
  font-weight: 700 !important;
  font-size: 16px !important;
  text-decoration: none !important;
  border: none !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: background-color 0.3s ease !important;

  &:hover {
    background-color: #f9f9f9 !important;
  }

  &[outline] {
    background-color: transparent !important;
    color: #7e74f1 !important;
    border: 2px solid #7e74f1 !important;
  }
`;

const PurpleFlyingButton = styled(FlyingButton)`
  background-color: #eae9e5 !important;
  border-radius: 30px !important;
  padding: 14px 28px !important;
  font-weight: 700 !important;
  font-size: 16px !important;
  color: black !important;
  border: none !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;

  &:hover {
    background-color: #f9f9f9 !important;
  }
`;

const ImageWrapper = styled.div`
  flex: 1;
  min-width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    max-width: 500px;
    height: auto;
    object-fit: contain;
    border-radius: 10px;
  }
`;

export default function Featured({ product }) {
  return (
    <Section>
      <WideCenter>
        <ContentWrapper>
          <TextContent>
            <RevealWrapper origin="left" delay={0}>
              <h1>{product.title}</h1>
              <p>{product.description}</p>
              <Buttons>
                <PurpleButton href={`/product/${product._id}`} outline>
                  Read more
                </PurpleButton>
                <PurpleFlyingButton white _id={product._id} src={product.images?.[0]}>
                  <CartIcon />
                  Add to cart
                </PurpleFlyingButton>
              </Buttons>
            </RevealWrapper>
          </TextContent>

          <ImageWrapper>
            <RevealWrapper delay={0}>
              <img src={product.images?.[0]} alt={product.title} />
            </RevealWrapper>
          </ImageWrapper>
        </ContentWrapper>
      </WideCenter>
    </Section>
  );
}





// import Center from "@/components/Center";
// import styled from "styled-components";
// import ButtonLink from "@/components/ButtonLink";
// import CartIcon from "@/components/icons/CartIcon";
// import FlyingButton from "@/components/FlyingButton";
// import {RevealWrapper} from 'next-reveal'

// const Bg = styled.div`
//   background-color: #222;
//   color:#fff;
//   padding: 50px 0;
// `;
// const Title = styled.h1`
//   margin:0;
//   font-weight:normal;
//   font-size:1.5rem;
//   @media screen and (min-width: 768px) {
//     font-size:3rem;
//   }
// `;
// const Desc = styled.p`
//   color:#aaa;
//   font-size:.8rem;
// `;
// const ColumnsWrapper = styled.div`
//   display: grid;
//   grid-template-columns: 1fr;
//   gap: 40px;
//   img.main{
//     max-width: 100%;
//     max-height: 200px;
//     display: block;
//     margin: 0 auto;
//   }
//   div:nth-child(1) {
//     order: 2;
//     margin-left: auto;
//     margin-right: auto;
//   }
//   @media screen and (min-width: 768px) {
//     grid-template-columns: 1.1fr 0.9fr;
//     & > div:nth-child(1) {
//       order: 0;
//     }
//     img{
//       max-width: 100%;
//     }
//   }
// `;
// const Column = styled.div`
//   display: flex;
//   align-items: center;
// `;
// const ButtonsWrapper = styled.div`
//   display: flex;
//   gap:10px;
//   margin-top:25px;
// `;
// const CenterImg = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 100%;
// `;

// const ImgColumn = styled(Column)`
//   & > div{
//     width: 100%;
//   }
// `;

// const ContentWrapper = styled.div`
// `;

// export default function Featured({product}) {
//   return (
//     <Bg>
//       <Center>
//         <ColumnsWrapper>
//           <Column>
//             <div>
//               <RevealWrapper origin={'left'} delay={0}>
//                 <ContentWrapper>
//                   <Title>{product.title}</Title>
//                   <Desc>{product.description}</Desc>
//                   <ButtonsWrapper>
//                     <ButtonLink href={'/product/'+product._id} outline={1} white={1}>Read more</ButtonLink>
//                     <FlyingButton white={1} _id={product._id} src={product.images?.[0]}>
//                       <CartIcon />
//                       Add to cart
//                     </FlyingButton>
//                   </ButtonsWrapper>
//                 </ContentWrapper>
//               </RevealWrapper>
//             </div>
//           </Column>
//           <ImgColumn>
//             <RevealWrapper delay={0}>
//               <CenterImg>
//                 <img className={'main'} src={product.images?.[0]} alt=""/>
//               </CenterImg>
//             </RevealWrapper>
//           </ImgColumn>
//         </ColumnsWrapper>
//       </Center>

//     </Bg>
//   );
// }