import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styled from "styled-components";
import Layout from "../layout2";
import Spinner from "@/components/Spinner";
import { useSession } from "next-auth/react";


const OrderDetailContainer = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const Container = styled.div`
  display: grid;
  max-width: 900px;
  justify-content: center;
  gap: 20px;
  grid-template-columns: 1fr 1fr;

  @media screen and (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const ColsWrapper = styled.div`
  display: grid;
  padding: 40px;
  justify-content: center;
  max-width: auto;
`;

const ShippingAddressContainer = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  font-size: 0.9rem;
`;

const ShippingAddressField = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;

  label {
    font-weight: bold;
    margin-bottom: 5px;
  }

  input {
    padding: 8px;
    font-size: 0.9rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f0f0f0;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

const StatusBadge = styled.span`
  font-weight: bold;
  padding: 5px;
`;

const TrackingInfo = styled.div`
  color: #555;
  font-style: italic;
`;

const ShippingPrice = styled.div`
  color: #555;
  font-style: italic;
`;

const PayButton = styled.button`
  background-color: #fbbf24; /* yellow */
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 5px;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2563eb; /* darker blue */
  }

  &:disabled {
    background-color: #16a34a; /* gray */
    cursor: not-allowed;
  }
`;

const getStatusColor = (status) => {
  switch (status) {
    case "Cancelled":
      return "#f87171";
    case "Pending":
      return "#fbbf24";
    case "In Progress":
      return "#3b82f6";
    case "Ready for Delivery":
      return "#34d399";
    case "In Delivery":
      return "#10b981";
    case "Delivered":
      return "#16a34a";
    case "Paid":
      return "#16a34a";
    default:
      return "#d1d5db";
  }
};

const CancelButton = styled.button`
  background-color: #ef4444; /* Red */
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 5px;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f87171; /* Darker Red */
  }

  &:disabled {
    background-color: #d1d5db; /* Gray */
    cursor: not-allowed;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  max-width: 400px;
`;

const ModalButton = styled.button`
  margin-top: 20px;
  background-color: #45a049;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background-color: #4CAF50;
  }
`;

const ModalButtonDanger = styled(ModalButton)`
  background-color: #ef4444;
  margin-right: 10px;
  
  &:hover {
    background-color: #f87171;
  }
`;

const OrderDetailsPage = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const { data: session, status } = useSession();
  

  const [order, setOrder] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clientNumber, setClientNumber] = useState("");

  const [isPaid, setIsPaid] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false); 

    useEffect(() => {
    // Check if session is still loading
    if (status === "loading") {
      return; // Do nothing, wait for session to finish loading
    }

    // If user is not authenticated (session is null or unauthenticated), redirect to homepage
    if (status === "unauthenticated") {
      router.push("/");  // Redirect to homepage
    }
  }, [status, router]);

  useEffect(() => {
    if (orderId) {
      setIsLoading(true);
      axios
        .get(`/api/orders/${orderId}`)
        .then((res) => {
          setOrder(res.data);
          setShippingAddress(res.data.shippingAddress);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching order:", err);
          setIsLoading(false);
        });
    }
  }, [orderId]);

useEffect(() => {
  if (orderId) {
    setIsLoading(true);
    axios
      .get(`/api/address`)
      .then((res) => {
        console.log("Fetched Shipping Address:", res.data);
        setClientNumber(res.data?.clientNumber || "");
        setShippingAddress(res.data);  // Set address data here
        setIsLoading(false);  // Stop loading once data is set
      })
      .catch((err) => {
        console.error("Error fetching shipping address:", err);
        setError("Failed to fetch shipping address");
        setIsLoading(false);  // Stop loading on error
      });
  }
}, [orderId]); 

  const cancelOrder = async () => {
    try {
      const response = await axios.put(`/api/orders/${orderId}`, {
        status: "Cancelled",
      });

      if (response.status === 200) {
        setOrder((prevOrder) => ({
          ...prevOrder,
          status: "Cancelled",
        }));
        setModalVisible(false);
      }
    } catch (error) {
      setError("Failed to cancel the order.");
    }
  };

  const handleCancelClick = () => {
    setModalVisible(true);
    setConfirmCancel(false);
  };

  const handleConfirmCancel = () => {
    setConfirmCancel(true);
    cancelOrder();
  };

  const handleCancelClose = () => {
    setModalVisible(false);
    setConfirmCancel(false);
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!orderId) return <p>Order not available!</p>;
  if (isLoading) return <Spinner fullWidth />;



if (isLoading || !order) {
  return <Spinner fullWidth />;  // Or any other loading indicator
}

// Only proceed if `order` is available
const itemTotal = order.line_items.reduce((acc, item) => {
  if (item.price_data && item.price_data.unit_amount) {
    return acc + item.quantity * (item.price_data.unit_amount);
  }
  return acc;
}, 0);

  const shippingCost = order.shippingFee ? order.shippingFee : 0;
  const totalAmount = itemTotal + shippingCost;

  const wrapTextEveryNChars = (text, n = 30) => {
    if (typeof text !== "string") return "";
    return text.replace(new RegExp(`(.{1,${n}})`, "g"), "$1\n");
  };

  const renderTrackingInfo = () => {
    if (order.trackOrder) {
      if (order.trackOrder.startsWith("http")) {
        return (
          <a href={order.trackOrder} target="_blank" rel="noopener noreferrer">
            Track your order here
          </a>
        );
      }
      return wrapTextEveryNChars(order.trackOrder, 30);
    }
    return (
      <TrackingInfo>
        <span>Tracking info will be available</span>
        <br />
        <span>after your order is shipped.</span>
      </TrackingInfo>
    );
  };

  const renderShippingPrice = () => {
    if (order.shippingFee && order.shippingFee > 0) {
      return <a>€{(order.shippingFee / 100).toFixed(2)}</a>;
    }

    return (
      <ShippingPrice>
        <span>Shipping cost will be</span>
        <br />
        <span>available after your order is reviewed.</span>
      </ShippingPrice>
    );
  };


  const handlePayClick = async () => {
    if (!session) {
      setError("You must be logged in to make a payment.");
      return;
    }

    if (!order) {
      setError("Order data not loaded.");
      return;
    }

    setIsPaying(true);
    setError(null);

    try {
      const cartProducts = order.line_items.flatMap((item) => {
  if (!item.price_data || !item.price_data.product_data) {
    console.warn(`Missing product data for item:`, item);
    return [];
  }

  const productId = item.price_data.product_data._id;
  const productName = item.price_data.product_data.name;

  if (!productId && !productName) {
    console.warn(`Item does not have valid product data (missing _id or name):`, item);
    return [];
  }

  return Array(item.quantity).fill(productId || productName);
});
      

      const response = await axios.post("/api/checkout", {
        name: shippingAddress.name,
        email: shippingAddress.email,
        city: shippingAddress.city,
        phone: shippingAddress.phone,
        postalCode: shippingAddress.postalCode,
        streetAddress: shippingAddress.streetAddress,
        country: shippingAddress.country,
        cartProducts,
      });

      if (response.data.url) {
        if (response.data.orderNumber) {
          localStorage.setItem("orderNumber", response.data.orderNumber);
        }
        window.location = response.data.url;
      } else {
        setError("Payment URL was not returned by the server.");
        setIsPaying(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError("There was an error processing your payment.");
      setIsPaying(false);
    }
  };
  
   const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <Layout>
      <ColsWrapper>
        <Container>
          <OrderDetailContainer>
            <h2 style={{ marginBottom: "10px" }}>Order Details</h2>
            <p>
              <strong>Client Number: </strong>
              {clientNumber || "N/A"}
            </p>
            <p>
              <strong>Order Number:</strong> {order.orderNumber}
            </p>
            <p style={{ marginBottom: "10px" }}>
              <strong>Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleString("RO")}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <StatusBadge style={{ color: getStatusColor(order.status) }}>
                {order.status}
              </StatusBadge>
              
            {modalVisible && !confirmCancel && (
              <ModalOverlay>
                <ModalContent>
                  <h2>Are you sure you want to cancel the order?</h2>
                  <div>
                    <ModalButtonDanger onClick={handleConfirmCancel}>Cancel Order</ModalButtonDanger>
                    <ModalButton onClick={handleCancelClose}>Keep Order</ModalButton>
                  </div>
                </ModalContent>
              </ModalOverlay>
            )}

            {modalVisible && confirmCancel && (
              <ModalOverlay>
                <ModalContent>
                  <h2>Order Canceled</h2>
                  <ModalButton onClick={handleCancelClose}>Close</ModalButton>
                </ModalContent>
              </ModalOverlay>
            )}
            </p>
            <p>
              <strong>Tracking Info:</strong>
            </p>
            <p
              style={{
                minHeight: "20px",
                whiteSpace: "pre-wrap",
                color: "#333",
              }}
            >
              {renderTrackingInfo()}
            </p>

            <p>
              <strong>Shipping: </strong>
              {renderShippingPrice()}
            </p>

            <div>
  <p>
    <strong>Total Payment: </strong>€{totalAmount.toFixed(2)}
  </p>

  {order.isApproved && !isPaid && order.status === "In Progress" && (
  <PayButton onClick={handlePayClick} disabled={isPaying}>
    {isPaying ? "Processing..." : "Pay Now"}
  </PayButton>
)}
  {order.status === "Pending" && (
              <CancelButton onClick={handleCancelClick}>
                Cancel Order
              </CancelButton>
            )}

  {isPaid && (
    <PayButton disabled>
      Paid
    </PayButton>
  )}

  {!order.isApproved && !isPaid && (
    <p style={{ color: "gray", fontStyle: "italic" }}>
      Your order is being verified. You&apos;ll be able to pay once it&apos;s approved.
    </p>
  )}

  {error && <p style={{ color: "red" }}>{error}</p>}
</div>

            <h3 style={{ marginTop: "20px" }}>Items:</h3>
            <div>
              {order.line_items.map((item, index) => (
               <div key={index} style={{ display: "flex", alignItems: "center" }}>
      <p>
  {item.quantity} x{" "}
  {item.price_data && item.price_data.product_data ? item.price_data.product_data.name : "Unknown Product"} 
  - €{" "}
  {item.price_data && item.price_data.unit_amount ? (item.price_data.unit_amount).toFixed(2) : "TBD"}
</p>
  

</div>
              ))}
            </div>
          </OrderDetailContainer>

          <ShippingAddressContainer>
            <h2 style={{ marginBottom: "10px" }}>Shipping Address:</h2>
            {shippingAddress ? (
              <>
                {[
                  { label: "Name", value: shippingAddress.name },
                  { label: "Email", value: shippingAddress.email },
                  { label: "Phone", value: shippingAddress.phone },
                  { label: "Street Address", value: shippingAddress.streetAddress },
                  { label: "City", value: shippingAddress.city },
                  { label: "Postal Code", value: shippingAddress.postalCode },
                  { label: "Country", value: shippingAddress.country },
                ].map((field, index) => (
                  <ShippingAddressField key={index}>
                    <label>{field.label}</label>
                    <input type="text" value={field.value} readOnly />
                  </ShippingAddressField>
                ))}
              </>
            ) : (
              <p>Shipping address not available.</p>
            )}
          </ShippingAddressContainer>
        </Container>
      </ColsWrapper>
    </Layout>
  );
};

export default OrderDetailsPage;