import styled from "styled-components";
import ButtonLink from "@/components/ButtonLink";
import { RevealWrapper } from "next-reveal";
import axios from "axios";
import { useEffect, useState } from "react";

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
    flex-direction: column; /* Stack text and image vertically */
    text-align: center;      /* Center text and image */
    gap: 30px;               /* Add some spacing between text and image */
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
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;  
    overflow: hidden;
    text-overflow: ellipsis;
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

const ImageWrapper = styled.div`
  flex: 1;
  min-width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    max-width: 400px;        /* Reduce max-width for mobile */
    height: auto;
    object-fit: contain;
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    order: -1;  /* Make image appear first on mobile */
  }
`;

export default function HeroSection() {
  const [hero, setHero] = useState({
    title: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    async function fetchHero() {
      try {
        const [titleRes, descRes, imageRes] = await Promise.all([
          axios.get("/api/settings?name=heroTitle"),
          axios.get("/api/settings?name=heroDescription"),
          axios.get("/api/settings?name=heroImage"),
        ]);
        setHero({
          title: titleRes.data?.value || "",
          description: descRes.data?.value || "",
          image: imageRes.data?.value || "",
        });
      } catch (err) {
        console.error("Failed to load hero data:", err);
      }
    }
    fetchHero();
  }, []);

  if (!hero.title && !hero.image) return null;
  return (
    <Section>
      <WideCenter>
        <ContentWrapper>
          <TextContent>
            <RevealWrapper origin="left" delay={0}>
              <h1>{hero.title}</h1>
              <p>{hero.description}</p>
              <Buttons>
                <PurpleButton href="/hero-details" outline>
                  Read more
                </PurpleButton>
              </Buttons>
            </RevealWrapper>
          </TextContent>

          <ImageWrapper>
            <RevealWrapper delay={0}>
              <img src={hero.image} alt={hero.title || "Hero image"} />
            </RevealWrapper>
          </ImageWrapper>
        </ContentWrapper>
      </WideCenter>
    </Section>
  );
}
