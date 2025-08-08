import Layout from "./layout2";
import styled from "styled-components";
import Center from "@/components/Center";
import Button from "@/components/Button";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";
import Table from "@/components/Table";
import Input from "@/components/Input";
import { RevealWrapper } from "next-reveal";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';  // <-- Added this import

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr .8fr;
  }
  gap: 40px;
  margin-top: 40px;
  margin-bottom: 40px;
  table thead tr th:nth-child(3),
  table tbody tr td:nth-child(3),
  table tbody tr.subtotal td:nth-child(2){
    text-align: right;
  }
  table tr.subtotal td{
    padding: 15px 0;
  }
  table tbody tr.subtotal td:nth-child(2){
    font-size: 1.4rem;
  }
  tr.total td{
    font-weight: bold;
  }
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
  button{padding:0 !important;}
`;

const ProductImageBox = styled.div`
  width: 70px;
  height: 100px;
  padding: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display:flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img{
    max-width: 60px;
    max-height: 60px;
  }
  @media screen and (min-width: 768px) {
    padding: 10px;
    width: 100px;
    height: 100px;
    img{
      max-width: 80px;
      max-height: 80px;
    }
  }
`;

const QuantityLabel = styled.span`
  padding: 0 15px;
  display: block;
  @media screen and (min-width: 768px) {
    display: inline-block;
    padding: 0 6px;
  }
`;

const CityHolder = styled.div`
  display:flex;
  gap: 5px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const PopupBox = styled.div`
  background: white;
  padding: 20px 30px;
  border-radius: 8px;
  max-width: 400px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  text-align: center;
`;

const CloseBtn = styled.button`
  margin-top: 15px;
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
  &:hover {
    background: #c0392b;
  }
`;

export default function CartPage() {
  const { cartProducts, addProduct, removeProduct, clearCart } = useContext(CartContext);
  const { data: session } = useSession();
  const router = useRouter();  // <-- Initialize router

  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setphone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [country, setCountry] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [shippingFee, setShippingFee] = useState(null);
  const [popupMessage, setPopupMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // <-- Add error message state

  function closePopup() {
    setPopupMessage(null);
  }

  function goToProfile() {
    router.push('/profile');  // Redirect to profile page
  }

  useEffect(() => {
    if (cartProducts.length > 0) {
      axios.post('/api/cart', { ids: cartProducts })
        .then(response => {
          setProducts(response.data);
        })
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (window?.location.href.includes('success')) {
      setIsSuccess(true);
      clearCart();
    }
    axios.get('/api/settings?name=shippingFee').then(res => {
      setShippingFee(res.data.value);
    })
  }, []);

  useEffect(() => {
    if (!session) {
      return;
    }
    axios.get('/api/address').then(response => {
      setName(response.data.name);
      setEmail(response.data.email);
      setphone(response.data.phone);
      setCity(response.data.city);
      setPostalCode(response.data.postalCode);
      setStreetAddress(response.data.streetAddress);
      setCountry(response.data.country);
    });
  }, [session]);

  function moreOfThisProduct(id) {
    addProduct(id);
  }
  
  function lessOfThisProduct(id) {
    removeProduct(id);
  }

  async function goToPayment() {
    if (cartProducts.length === 0) {
      setErrorMessage("Your cart is empty. Please add items before proceeding.");
      return;
    }

    if (!name || !name.trim()) {
      setPopupMessage('The Name is required!\nPlease update your Profile');
      return;
    }
    if (!email || !email.trim()) {
      setPopupMessage('The Email is required!\nPlease update your Profile');
      return;
    }
    if (!phone || !(typeof phone === 'string' ? phone.trim() : String(phone).trim())) {
      setPopupMessage('The Phone Number is required!\nPlease update your Profile');
      return;
    }
    if (!streetAddress || !streetAddress.trim()) {
      setPopupMessage('The Street Address is required!\nPlease update your Profile');
      return;
    }
    if (!city || !city.trim()) {
      setPopupMessage('The City is required!\nPlease update your Profile');
      return;
    }
    if (!postalCode || !postalCode.trim()) {
      setPopupMessage('The Postal Code is required!\nPlease update your Profile');
      return;
    }
    if (!country || !country.trim()) {
      setPopupMessage('The Country is required!\nPlease update your Profile');
      return;
    }

    const response = await axios.post('/api/checkout', {
    name,
    email,
    city,
    phone,
    postalCode,
    streetAddress,
    country,
    cartProducts,
  });

  if (response.data.url) {
    window.location = response.data.url;
  } else {
    setPopupMessage('There was an issue with the payment process.');
  }
}

  let productsTotal = 0;
  for (const productId of cartProducts) {
    const price = products.find(p => p._id === productId)?.price || 0;
    productsTotal += price;
  }

  if (isSuccess) {
    return (
      <>
        <Layout>
        <Center>
          <ColumnsWrapper>
            <Box>
              <h1>Thanks for your order!</h1>
              <p>We will email you when your order will be sent.</p>
            </Box>
          </ColumnsWrapper>
        </Center>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Layout>
      <Center>
        <ColumnsWrapper>
          <RevealWrapper delay={0}>
            <Box>
              <h2>Cart</h2>
              {!cartProducts?.length && (
                <div>Your cart is empty</div>
              )}
              {products?.length > 0 && (
                <Table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id}>
                        <ProductInfoCell>
                          <ProductImageBox>
                            <img src={product.images[0]} alt="" />
                          </ProductImageBox>
                          {product.title}
                        </ProductInfoCell>
                        <td>
                          <Button
                            onClick={() => lessOfThisProduct(product._id)}>-</Button>
                          <QuantityLabel>
                            {cartProducts.filter(id => id === product._id).length}
                          </QuantityLabel>
                          <Button
                            onClick={() => moreOfThisProduct(product._id)}>+</Button>
                        </td>
                        <td>
                          ${cartProducts.filter(id => id === product._id).length * product.price}
                        </td>
                      </tr>
                    ))}
                    <tr className="subtotal">
                      <td colSpan={2}>Products</td>
                      <td>${productsTotal}</td>
                    </tr>
                    <tr className="subtotal">
                      <td colSpan={2}>Shipping</td>
                      <td>${shippingFee}</td>
                    </tr>
                    <tr className="subtotal total">
                      <td colSpan={2}>Total</td>
                      <td>${productsTotal + parseInt(shippingFee || 0)}</td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </Box>
          </RevealWrapper>

          {!!cartProducts?.length && (
            <RevealWrapper delay={100}>
              <Box>
                <h2>Order information</h2>
                <Input
                  value={name}
                  disabled />
                <Input
                  value={email}
                  disabled />

                <Input
                  value={phone}
                  disabled />
                <Input
                  value={streetAddress}
                  disabled />
                <CityHolder>
                  <Input
                    value={city}
                    disabled />
                  <Input
                    value={postalCode}
                    disabled />
                </CityHolder>
                <Input
                  value={country}
                  disabled />
                <Button black block
                        onClick={goToPayment}>
                  Continue to payment
                </Button>
                {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>} {/* Display error */}
              </Box>
            </RevealWrapper>
          )}
        </ColumnsWrapper>
      </Center>

      {popupMessage && (
        <Overlay>
          <PopupBox>
            <pre style={{ whiteSpace: 'pre-wrap', margin: 0, justifyContent: 'center', gap: '10px', marginTop: '15px' }}>{popupMessage}</pre>
            <CloseBtn onClick={closePopup}>Close</CloseBtn>
            <CloseBtn onClick={goToProfile} style={{ backgroundColor: '#3498db', marginLeft: '15px' }}>
              Go to Profile
            </CloseBtn>
          </PopupBox>
        </Overlay>
      )}
      </Layout>
    </>
  );
}
