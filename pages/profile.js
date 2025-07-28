'use client';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import WhiteBox from '@/components/WhiteBox';
import Input from '@/components/Input';
import Button from '@/components/Button';
import ProductBox from '@/components/ProductBox';
import Spinner from '@/components/Spinner';
import Tabs from '@/components/Tabs';
import SingleOrder from '@/components/SingleOrder';
import Center from '@/components/Center';
import Header from '@/components/Header';

const ColsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 40px;
  margin: 40px 0;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

const WishedProductsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Orders');
  const [orders, setOrders] = useState([]);
  const [wishedProducts, setWishedProducts] = useState([]);
  const [wishlistLoaded, setWishlistLoaded] = useState(false);
  const [orderLoaded, setOrderLoaded] = useState(false);
  const [addressLoaded, setAddressLoaded] = useState(false);

  // Address fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setphone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  // Fetch data
  useEffect(() => {
    setWishlistLoaded(false);
    setOrderLoaded(false);
    setAddressLoaded(false);

    axios.get('/api/orders').then(res => {
      setOrders(res.data);
      setOrderLoaded(true);
    });

    axios.get('/api/wishlist').then(res => {
      setWishedProducts(res.data.map(wp => wp.product));
      setWishlistLoaded(true);
    });

    axios.get('/api/address').then(res => {
      setName(res.data?.name || '');
      setEmail(res.data?.email || '');
      setphone(res.data?.phone || '');
      setStreetAddress(res.data?.streetAddress || '');
      setCity(res.data?.city || '');
      setPostalCode(res.data?.postalCode || '');
      setCountry(res.data?.country || '');
      setAddressLoaded(true);
    });
  }, []);

  function saveAddress() {
    const data = { name, email, city, phone, postalCode, country };
    axios.put('/api/address', data);
  }

  function productRemovedFromWishlist(idToRemove) {
    setWishedProducts(prev => prev.filter(p => p._id !== idToRemove));
  }

  return (
    <>
      <Header />
      <Center>
        <ColsWrapper>
          <div>
            <WhiteBox>
              <Tabs
                tabs={['Orders', 'Wishlist']}
                active={activeTab}
                onChange={setActiveTab}
              />

              {/* Orders Tab */}
              {activeTab === 'Orders' && (
                <>
                  {!orderLoaded ? (
                    <Spinner fullWidth />
                  ) : (
                    <>
                      {orders.length === 0 && <p>No orders yet.</p>}
                      {orders.map(order => (
                        <SingleOrder key={order._id} {...order} />
                      ))}
                    </>
                  )}
                </>
              )}

              {/* Wishlist Tab */}
              {activeTab === 'Wishlist' && (
                <>
                  {!wishlistLoaded ? (
                    <Spinner fullWidth />
                  ) : (
                    <>
                      {wishedProducts.length === 0 && (
                        <p>Your wishlist is empty.</p>
                      )}
                      <WishedProductsGrid>
                        {wishedProducts.map(wp => (
                          <ProductBox
                            key={wp._id}
                            {...wp}
                            wished
                            onRemoveFromWishlist={productRemovedFromWishlist}
                          />
                        ))}
                      </WishedProductsGrid>
                    </>
                  )}
                </>
              )}
            </WhiteBox>
          </div>

          {/* Address Form */}
          <div>
            <WhiteBox>
              <h2>Shipping Address</h2>
              {!addressLoaded ? (
                <Spinner fullWidth />
              ) : (
                <>
                  <Input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                  <Input
                    
                    value={email}
                    disabled 
                  />
                  <Input
                    type="text"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={e => setphone(e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Street Address"
                    value={streetAddress}
                    onChange={e => setStreetAddress(e.target.value)}
                  />
                  <CityHolder>
                    <Input
                      type="text"
                      placeholder="City"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="Postal Code"
                      value={postalCode}
                      onChange={e => setPostalCode(e.target.value)}
                    />
                  </CityHolder>
                  
                  <Input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                  />
                  <Button black block onClick={saveAddress}>
                    Save
                  </Button>
                </>
              )}
            </WhiteBox>
          </div>
        </ColsWrapper>
      </Center>
    </>
  );
}
