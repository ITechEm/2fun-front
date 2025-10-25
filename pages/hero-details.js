import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import Layout from "./layout";
import Center from "@/components/Center";
import ProductsGrid from "@/components/ProductsGrid";

const Section = styled.section`
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;

  img {
    width: 100%;
    max-width: 600px;
    border-radius: 12px;
    display: block;
    margin: 0 auto 40px auto;
  }

  h1 {
    font-family: 'Playfair Display', serif;
    font-size: 48px;
    text-align: center;
    margin-bottom: 20px;
  }

  p {
    font-size: 18px;
    color: #444;
    line-height: 1.6;
    text-align: center;
    max-width: 800px;
    margin: 0 auto 40px auto;
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
        <Section>
          <h1>{hero.title}</h1>
          <p>{hero.description}</p>
          {hero.image && <img src={hero.image} alt={hero.title} />}

          <h2>Suggested Products</h2>
          <ProductsGrid products={suggested} />
        </Section>
      </Center>
    </Layout>
  );
}
