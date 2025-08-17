'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { signOut } from 'next-auth/react';

import WhiteBox from '@/components/WhiteBox';
import Input from '@/components/Input';
import Button from '@/components/Button';
import ProductBox from '@/components/ProductBox';
import Spinner from '@/components/Spinner';
import Tabs from '@/components/Tabs';
import SingleOrder from '@/components/SingleOrder';
import Center from '@/components/Center';
import Header from '@/components/Header';
import Layout from './layout';

// ConfirmModal Component
const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: #00000080;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const ModalBox = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 400px;
  text-align: center;
`;

const ModalButtons = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
`;

function ConfirmModal({ visible, onConfirm, onCancel, message }) {
  if (!visible) return null;
  return (
    <ModalOverlay>
      <ModalBox>
        <h3>Are you sure?</h3>
        <p>{message}</p>
        <ModalButtons>
          <Button onClick={onCancel} style={{ backgroundColor: '#ccc', color: '#000' }}>
            Cancel
          </Button>
          <Button onClick={onConfirm} red>
            Confirm
          </Button>
        </ModalButtons>
      </ModalBox>
    </ModalOverlay>
  );
}

// Styles for layout
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

  // Deleting states
  const [deletingAddress, setDeletingAddress] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Confirmation modal and toast
  const [confirmModal, setConfirmModal] = useState({ visible: false, type: null });
  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }

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

  // Helper to show toast with auto-hide
  function showToast(message, type = 'error') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  }

  async function saveAddress() {
    const data = { name, email, city, phone, streetAddress, postalCode, country };
    try {
      await axios.put('/api/address', data);
      showToast('Settings saved!', 'success');
    } catch (error) {
      console.error('Failed to save address:', error);
      showToast('Failed to save address', 'error');
    }
  }

  // Show modal to confirm deletion
  function handleDelete(type) {
    setConfirmModal({ visible: true, type });
  }

  async function confirmDelete() {
    const type = confirmModal.type;
    setConfirmModal({ visible: false, type: null });

    if (type === 'address') {
      try {
        setDeletingAddress(true);
        await axios.delete('/api/delete-address');
        // Reset address fields only (keep name/email)
        setphone('');
        setStreetAddress('');
        setCity('');
        setPostalCode('');
        setCountry('');
        showToast('Address deleted successfully', 'success');
      } catch (error) {
        console.error('Delete address error:', error);
        showToast('Failed to delete address', 'error');
      } finally {
        setDeletingAddress(false);
      }
    }

    if (type === 'account') {
      try {
        setDeletingAccount(true);
        await axios.delete('/api/delete-account');
        showToast('Account deleted successfully', 'success');
        await signOut({ callbackUrl: '/' });
      } catch (error) {
        console.error('Delete account error:', error);
        showToast('Failed to delete account', 'error');
        setDeletingAccount(false);
      }
    }
  }

  function productRemovedFromWishlist(idToRemove) {
    setWishedProducts(prev => prev.filter(p => p._id !== idToRemove));
  }

  return (
    <>
      <Layout>
      <Center>
        <ColsWrapper>
          <div>
            <WhiteBox>
              <Tabs
                tabs={['Orders', 'Wishlist']}
                active={activeTab}
                onChange={setActiveTab}
              />

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

              {activeTab === 'Wishlist' && (
                <>
                  {!wishlistLoaded ? (
                    <Spinner fullWidth />
                  ) : (
                    <>
                      {wishedProducts.length === 0 && <p>Your wishlist is empty.</p>}
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
                    placeholder="(+)407xx xxx xxx"
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

                  <Button
                    red
                    block
                    onClick={() => handleDelete('address')}
                    disabled={deletingAddress}
                    style={{ marginTop: '10px' }}
                  >
                    {deletingAddress ? 'Deleting Address...' : 'Delete Address'}
                  </Button>

                  <Button
                    red
                    block
                    onClick={() => handleDelete('account')}
                    disabled={deletingAccount}
                    style={{ marginTop: '20px' }}
                  >
                    {deletingAccount ? 'Deleting Account...' : 'Delete Account'}
                  </Button>
                </>
              )}
            </WhiteBox>
          </div>
        </ColsWrapper>

        {/* Confirm delete modal */}
        <ConfirmModal
          visible={confirmModal.visible}
          message={
            confirmModal.type === 'address'
              ? 'This will permanently remove your shipping details.'
              : 'This will permanently delete your account.'
          }
          onCancel={() => setConfirmModal({ visible: false, type: null })}
          onConfirm={confirmDelete}
        />

        {/* Toast notification */}
        {toast && (
          <div
            style={{
              position: 'fixed',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: toast.type === 'success' ? '#4BB543' : '#d32f2f', // green or red
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              fontWeight: 'bold',
              zIndex: 1000,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            {toast.message}
          </div>
        )}
      </Center>
      </Layout>
    </>
  );
}





// 'use client';
// import { useState, useEffect } from 'react';
// import styled from 'styled-components';
// import axios from 'axios';

// import WhiteBox from '@/components/WhiteBox';
// import Input from '@/components/Input';
// import Button from '@/components/Button';
// import ProductBox from '@/components/ProductBox';
// import Spinner from '@/components/Spinner';
// import Tabs from '@/components/Tabs';
// import SingleOrder from '@/components/SingleOrder';
// import Center from '@/components/Center';
// import Header from '@/components/Header';

// const ColsWrapper = styled.div`
//   display: grid;
//   grid-template-columns: 1.2fr 0.8fr;
//   gap: 40px;
//   margin: 40px 0;

//   @media screen and (max-width: 768px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const CityHolder = styled.div`
//   display: flex;
//   gap: 5px;
// `;

// const WishedProductsGrid = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   gap: 40px;

//   @media screen and (max-width: 768px) {
//     grid-template-columns: 1fr;
//   }
// `;
// const PhoneInputWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   input {
//     flex: 1;
//   }
//   span {
//     background: #f0f0f0;
//     padding: 0 10px;
//     border: 1px solid #ccc;
//     border-right: none;
//     border-radius: 5px 0 0 5px;
//   }
// `;


// export default function ProfilePage() {
//   const [activeTab, setActiveTab] = useState('Orders');
//   const [orders, setOrders] = useState([]);
//   const [wishedProducts, setWishedProducts] = useState([]);
//   const [wishlistLoaded, setWishlistLoaded] = useState(false);
//   const [orderLoaded, setOrderLoaded] = useState(false);
//   const [addressLoaded, setAddressLoaded] = useState(false);

//   // Address fields
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setphone] = useState('');
//   const [streetAddress, setStreetAddress] = useState('');
//   const [city, setCity] = useState('');
//   const [postalCode, setPostalCode] = useState('');
//   const [country, setCountry] = useState('');

//   // NEW: popup state
//   const [showSavedPopup, setShowSavedPopup] = useState(false);

//   // Fetch data
//   useEffect(() => {
//     setWishlistLoaded(false);
//     setOrderLoaded(false);
//     setAddressLoaded(false);

//     axios.get('/api/orders').then(res => {
//       setOrders(res.data);
//       setOrderLoaded(true);
//     });

//     axios.get('/api/wishlist').then(res => {
//       setWishedProducts(res.data.map(wp => wp.product));
//       setWishlistLoaded(true);
//     });

//     axios.get('/api/address').then(res => {
//       setName(res.data?.name || '');
//       setEmail(res.data?.email || '');
//       setphone(res.data?.phone || '');
//       setStreetAddress(res.data?.streetAddress || '');
//       setCity(res.data?.city || '');
//       setPostalCode(res.data?.postalCode || '');
//       setCountry(res.data?.country || '');
//       setAddressLoaded(true);
//     });
//   }, []);

//   // Updated saveAddress with popup logic
//   async function saveAddress() {
//     const data = { name, email, city, phone, streetAddress, postalCode, country };
//     try {
//       await axios.put('/api/address', data);
//       setShowSavedPopup(true);
//       setTimeout(() => setShowSavedPopup(false), 3000); // Hide after 3 seconds
//     } catch (error) {
//       console.error('Failed to save address:', error);
//       // Optionally, show error message here
//     }
//   }

//   function productRemovedFromWishlist(idToRemove) {
//     setWishedProducts(prev => prev.filter(p => p._id !== idToRemove));
//   }

//   return (
//     <>
//       <Header />
//       <Center>
//         <ColsWrapper>
//           <div>
//             <WhiteBox>
//               <Tabs
//                 tabs={['Orders', 'Wishlist']}
//                 active={activeTab}
//                 onChange={setActiveTab}
//               />

//               {/* Orders Tab */}
//               {activeTab === 'Orders' && (
//                 <>
//                   {!orderLoaded ? (
//                     <Spinner fullWidth />
//                   ) : (
//                     <>
//                       {orders.length === 0 && <p>No orders yet.</p>}
//                       {orders.map(order => (
//                         <SingleOrder key={order._id} {...order} />
//                       ))}
//                     </>
//                   )}
//                 </>
//               )}

//               {/* Wishlist Tab */}
//               {activeTab === 'Wishlist' && (
//                 <>
//                   {!wishlistLoaded ? (
//                     <Spinner fullWidth />
//                   ) : (
//                     <>
//                       {wishedProducts.length === 0 && (
//                         <p>Your wishlist is empty.</p>
//                       )}
//                       <WishedProductsGrid>
//                         {wishedProducts.map(wp => (
//                           <ProductBox
//                             key={wp._id}
//                             {...wp}
//                             wished
//                             onRemoveFromWishlist={productRemovedFromWishlist}
//                           />
//                         ))}
//                       </WishedProductsGrid>
//                     </>
//                   )}
//                 </>
//               )}
//             </WhiteBox>
//           </div>

//           {/* Address Form */}
//           <div>
//             <WhiteBox>
//               <h2>Shipping Address</h2>
//               {!addressLoaded ? (
//                 <Spinner fullWidth />
//               ) : (
//                 <>
//                   <Input
//                     type="text"
//                     placeholder="Name"
//                     value={name}
//                     onChange={e => setName(e.target.value)}
//                   />
//                   <Input
//                     value={email}
//                     disabled
//                   />
//                   <Input
//                   type="text"
//                   placeholder="(+)407xx xxx xxx"
//                   value={phone}
//                   onChange={e => setphone(e.target.value)}
//                   />
//                   <Input
//                     type="text"
//                     placeholder="Street Address"
//                     value={streetAddress}
//                     onChange={e => setStreetAddress(e.target.value)}
//                   />
//                   <CityHolder>
//                     <Input
//                       type="text"
//                       placeholder="City"
//                       value={city}
//                       onChange={e => setCity(e.target.value)}
//                     />
//                     <Input
//                      type="text"
//                      placeholder="Postal Code"
//                      value={postalCode}
//                      onChange={e => setPostalCode(e.target.value)}
//                     />
//                   </CityHolder>

//                   <Input
//                     type="text"
//                     placeholder="Country"
//                     value={country}
//                     onChange={e => setCountry(e.target.value)}
//                   />
//                   <Button black block onClick={saveAddress}>
//                     Save
//                   </Button>
//                 </>
//               )}
//             </WhiteBox>
//           </div>
//         </ColsWrapper>

//         {/* Popup */}
//         {showSavedPopup && (
//   <div style={{
//     position: 'fixed',
//     top: '20px', // Move it to the top
//     left: '50%', // Position it horizontally in the center
//     transform: 'translateX(-50%)', // Adjust by 50% of its own width to truly center it
//     backgroundColor: '#4BB543',
//     color: 'white',
//     padding: '12px 24px',
//     borderRadius: '8px',
//     boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
//     fontWeight: 'bold',
//     zIndex: 1000,
//     opacity: showSavedPopup ? 1 : 0,
//     transform: showSavedPopup ? 'translateY(0) translateX(-50%)' : 'translateY(10px) translateX(-50%)', // Handle translation when showing
//     transition: 'opacity 0.3s ease, transform 0.3s ease',
//   }}>
//     Settings saved!
//   </div>
// )}
//       </Center>
//     </>
//   );
// }

