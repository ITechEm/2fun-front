import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Layout from "./layout";
import Center from "@/components/Center";
import ProductsGrid from "@/components/ProductsGrid";

const HeroSection = styled.section`
  display: flex;
  flex-direction: row;
  gap: 2rem;  
  align-items: flex-start;
  margin-bottom: 5rem;
  margin-top: 4rem;

  h1, p {
    flex: 1;
  }

  img {
    max-width: 100%;
    height: auto;
    width: 50%; 
    object-fit: cover;
    box-shadow: 0 15px 15px rgba(0,0,0,0.1);
    border-radius: 10px;
  }

  
  @media (max-width: 768px) {
    flex-direction: column; 
    align-items: flex-start;

    img {
      width: 100%;
    }
  }
`;


export default function HeroDetailsPage() {
  const [hero, setHero] = useState({ title: "", description: "", image: "" });
  const [suggested, setSuggested] = useState([]);

  useEffect(() => {
    async function fetchData() {
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

        const suggestedRes = await axios.get("/api/settings?name=heroSuggestedProducts");
        const ids = JSON.parse(suggestedRes.data?.value || "[]");

        if (ids.length) {
          const { data: products } = await axios.post("/api/products/by-ids", { ids });
          setSuggested(products);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

    fetchData();
  }, []);

  return (
    <Layout>
      <Center>
         <div>
      <HeroSection>
        <img src={hero.image} alt={hero.title} />
        <div>
          <h1>{hero.title}</h1>
          <p>{hero.description}</p>
        </div>
      </HeroSection>
      <h2 style={{ marginBottom: 20 }}>Suggested Products</h2>
      <ProductsGrid products={suggested} />
    </div>
      </Center>
    </Layout>
  );
}
