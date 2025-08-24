import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styled from "styled-components";
import Layout from "../layout";
import Spinner from "@/components/Spinner";

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
  padding: 5px ;
`;
const TrackingInfo = styled.div`
  color: #555;
`;

const getStatusColor = (status) => {
  switch (status) {
    case "Cancelled": return "#f87171";
    case "Pending": return "#fbbf24";
    case "In Progress": return "#3b82f6";
    case "Ready for Delivery": return "#34d399";
    case "In Delivery": return "#10b981";
    case "Delivered": return "#16a34a";
    default: return "#d1d5db";
  }
};

const OrderDetailsPage = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clientNumber, setClientNumber] = useState('');

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
        setError("Failed to fetch order details");
        setIsLoading(false);
      });
  }
}, [orderId]);

  useEffect(() => {
    if (orderId) {
      axios
        .get(`/api/address`)
        .then((res) => {
          setClientNumber(res.data?.clientNumber || '');
          setShippingAddress(res.data)})
        .catch((err) => {
          console.error("Error fetching shipping address:", err);
          setError("Failed to fetch shipping address");
        });
    }
  }, [orderId]);

  if (error) return <p>{error}</p>;
  if (!orderId) return <p>Order not available!</p>;
  if (isLoading) return <Spinner fullWidth />;

  const itemTotal = order.line_items.reduce((acc, item) => {
    return acc + item.quantity * (item.price_data.unit_amount / 100);
  }, 0);

  const shippingCost = order.shippingAmount ? order.shippingAmount / 100 : 6.99;
  const totalAmount = itemTotal + shippingCost;

  const renderTrackingInfo = () => {
    if (order.trackOrder) {
      if (order.trackOrder.startsWith("http")) {
        return (
          <a href={order.trackOrder} target="_blank" rel="noopener noreferrer">
            Track your order here
          </a>
        );
      }
      return order.trackOrder;
    }
    return <TrackingInfo>
    <span>Tracking info will be available</span>
    <br />
    <span>after your order is shipped.</span>
  </TrackingInfo>;
  };

  return (
    <Layout>
      <ColsWrapper>
        <Container>
          <OrderDetailContainer>
            <h2 style={{ marginBottom: "10px" }}>Order Details</h2>
            <p><strong>Client Number: </strong>{clientNumber || "N/A"}</p>
            <p><strong>Order Number:</strong> {order.orderNumber}</p>
            <p style={{ marginBottom: "10px" }}><strong>Date:</strong> {new Date(order.createdAt).toLocaleString('RO')}</p>
            <p><strong>Status:</strong>{" "}
              <StatusBadge style={{ color: getStatusColor(order.status) }}>
                {order.status}
              </StatusBadge>
            </p>
            <p><strong>Tracking Info:</strong></p>
            <p style={{ minHeight: "40px", whiteSpace: "pre-wrap", color: "#333", marginBottom: "10px" }}>
              {renderTrackingInfo()}
            </p>
            <p><strong>Total Payment:</strong> {totalAmount.toFixed(2)} €</p>
            <p><strong>Shipping:</strong> {shippingCost.toFixed(2)} €</p>
            <h3>Items:</h3>
            <div>
              {order.line_items.map((item, index) => (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
                >
                  <p>
                    {item.quantity} x {item.price_data.product_data.name} -{" "}
                    {(item.price_data.unit_amount / 100).toFixed(2)} €
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