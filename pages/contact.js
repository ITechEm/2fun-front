import { useState, useEffect } from "react";
import Layout from "./layout";
import Center from "@/components/Center";
import styled, { keyframes, css } from "styled-components";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md"; 
import { FaInstagram, FaFacebook } from "react-icons/fa";

const Container = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 2rem auto;
  font-family: 'Helvetica Neue', sans-serif;
`;

const ContactsSection = styled.div`
  margin-bottom: 2rem;
  text-align: center;

  @media (max-width: 768px) {
    margin-bottom: -40px;
  }
`;

const ContactItem = styled.li`
  margin-bottom: 0.5rem;
  line-height: 1.8;
`;

const FormCard = styled.div`
  background-color: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
`;

const FormTitle = styled.h2`
  border-bottom: 2px solid #ddd;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const shake = keyframes`
  0% { transform: translateX(0); }
  20% { transform: translateX(-5px); }
  40% { transform: translateX(5px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
  100% { transform: translateX(0); }
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  transition: border 0.2s, background 0.2s;
  ${(props) => props.error && css`
    border-color: #e53935;
    background-color: #ffe6e6;
    animation: ${shake} 0.3s;
  `}
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 1rem;
  resize: vertical;
  transition: border 0.2s, background 0.2s;
  ${(props) => props.error && css`
    border-color: #e53935;
    background-color: #ffe6e6;
    animation: ${shake} 0.3s;
  `}
`;

const Button = styled.button`
  padding: 0.75rem;
  width: 150px;
  border-radius: 5px;
  border: none;
  background-color: #333;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #777;
  }
`;

const Status = styled.p`
  margin-top: 1rem;
  font-weight: bold;
  color: ${(props) => (props.error ? "#e53935" : "#333")};
`;

const Row = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const HalfInput = styled(Input)`
  flex: 1;
  min-width: 200px;
`;

const Description = styled.p`
  margin-bottom: 2rem;
  margin-top: 2rem;
  font-size: 1.15rem;
  color: #333;      
  line-height: 1.7;   
  text-align: center;  
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  family: 'Poppins', sans-serif;
`;

const ContactsWrapper = styled.div`
  display: flex;
  gap: 4rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  justify-content: center;
`;

const SocialSection = styled.div`
  text-align: center;
`;

const SocialList = styled.p`
  list-style: none;
  padding: 0;
`;

const SocialItem = styled.li`
  margin-bottom: 0.5rem;
  justify-content: center;
  line-height: 1.8;
  a {
    text-decoration: none;
    color: #0070f3;
    font-weight: 500;
    transition: color 0.2s;
    &:hover {
      color: #005bb5;
    }
  }
`;

const Popup = styled.div`
  position: fixed;
  background-color: ${(props) => (props.type === "error" ? "#e53935" : "#4BB543")};
  color: white;
  left: 50%;
  transform: translateX(-50%);
  top: 30px;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 14px;
  z-index: 1000;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  gap: 8px;
`;

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [popup, setPopup] = useState(null);
  const [isMounted, setIsMounted] = useState(false); 

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const socials = [
    { name: "2fun.shops", url: "https://instagram.com/2fun.shops", icon: <FaInstagram /> },
    { name: "Facebook", url: "https://facebook.com/2fun.shops", icon: <FaFacebook /> },
  ];

  const contacts = [
  {  value: "support@2funshops.com", icon: <MdEmail /> },
  // {  value: "+ - - -", icon: <MdPhone /> },
  {  value: "Dortmund, Deutschland", icon: <MdLocationOn /> },
];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      if (!form[key].trim()) newErrors[key] = true;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setPopup({ message: "Please fill all required fields.", type: "error" });

    
      setTimeout(() => setPopup(null), 3000);
      return;
    }

    setStatus("Sending...");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setStatus(data.message);

      if (res.ok) {
        setForm({ name: "", email: "", subject: "", message: "" });
        setPopup({ message: "Email sent successfully!", type: "success" });
        setTimeout(() => setPopup(null), 3000);
      }
    } catch (err) {
      console.error(err);
      setPopup({ message: "Something went wrong", type: "error" });
      setTimeout(() => setPopup(null), 3000);
    }
  };

  return (
    <Layout>
      <Center>
        <Container>
          <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>Contact Us</h1>

          <Description>
            <p>We&apos;re a small handmade family, crafting each item with love and care. Every piece is unique, just like our customers. Have a question or custom request? </p>
            <p>Send us a message—we&apos;d love to hear from you!</p>
          </Description>

          <ContactsWrapper>
            <ContactsSection>
              <h2 style={{ borderBottom: "2px solid #ddd", paddingBottom: "0.5rem" }}>Our Contacts</h2>
              <p style={{ listStyle: "none", padding: 0 }}>
                {contacts.map((c, i) => (
                  <ContactItem key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {c.icon}{c.value}
                  </ContactItem>
                ))}
              </p>
            </ContactsSection>

            <SocialSection>
              <h2 style={{ borderBottom: "2px solid #ddd", paddingBottom: "0.5rem"}}>Follow Us</h2>
              <SocialList>
                {socials.map((s, i) => (
                  <SocialItem key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {s.icon} <a href={s.url} target="_blank" rel="noopener noreferrer">{s.name}</a>
                  </SocialItem>
                ))}
              </SocialList>
            </SocialSection>
          </ContactsWrapper>

          <FormCard>
            <FormTitle>Send us a message</FormTitle>
            <Form onSubmit={handleSubmit}>
              <Row>
                <HalfInput
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                  error={errors.name}
                />
                <HalfInput
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                />
              </Row>
              <Input
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
                error={errors.subject}
              />
              <Textarea
                name="message"
                placeholder="Message"
                value={form.message}
                onChange={handleChange}
                rows={6}
                error={errors.message}
              />
              <Button type="submit">Send Message</Button>
            </Form>
            {status && <Status error={Object.keys(errors).length > 0}>{status}</Status>}
          </FormCard>
          
          {isMounted && popup && (
            <Popup type={popup.type}>
              {popup.message}
            </Popup>
          )}
        </Container>
      </Center>
    </Layout>
  );
}
