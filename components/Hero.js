'use client';
import styled from "styled-components";
import Link from "next/link";

const HeroSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f9f9f9;
  padding: 80px 5%;
  min-height: 80vh;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const HeroText = styled.div`
  max-width: 50%;

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
    max-width: 100%;
    h1 {
      font-size: 36px;
    }
  }
`;

const ShopButton = styled(Link)`
  display: inline-block;
  margin-top: 30px;
  background-color: #7e74f1;
  color: white;
  padding: 14px 28px;
  border-radius: 30px;
  font-weight: bold;
  font-size: 16px;
  text-decoration: none;
  transition: background-color 0.3s;

  &:hover {
    background-color: #675fe3;
  }
`;

const HeroImage = styled.div`
  flex: 1;
  text-align: right;

  img {
    max-width: 450px;
    width: 100%;
    height: auto;
  }

  @media (max-width: 768px) {
    margin-top: 40px;
    text-align: center;
  }
`;

export default function Hero() {
  return (
    <HeroSection>
      <HeroText>
        <p>Men New-Season</p>
        <h1>JACKETS & COATS</h1>
        <ShopButton href="/products">SHOP NOW</ShopButton>
      </HeroText>
      <HeroImage>
        <img src="/jacket-model.jpg" alt="Model in jacket" />
      </HeroImage>
    </HeroSection>
  );
}
