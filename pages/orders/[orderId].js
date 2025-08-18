import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import styled from "styled-components";
import Layout from "../layout";

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

  padding: 5px 30px;
 
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
    default:
      return "#d1d5db"; 
  }
};

const OrderDetailsPage = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [error, setError] = useState(null);

 useEffect(() => {
  if (orderId) {
    axios
      .get(`/api/orders/${orderId}`)
      .then((res) => {
        console.log("Order Response:", res.data); // Ensure that orderNumber is in the response
        setOrder(res.data);
      })
      .catch((error) => {
        console.error("Error fetching order:", error);
        setError("Failed to fetch order details");
      });
  }
}, [orderId]);

  useEffect(() => {
    if (orderId) {
      axios
        .get(`/api/address`)
        .then((res) => {
          console.log("Shipping Address:", res.data);
          setShippingAddress(res.data);
        })
        .catch((error) => {
          console.error("Error fetching shipping address:", error);
          setError("Failed to fetch shipping address");
        });
    }
  }, [orderId]);

  if (error) return <p>{error}</p>;
  if (!orderId) return <p>Order not available!</p>;
  if (!order || !shippingAddress) return <p>Loading...</p>;

  const itemTotal = order.line_items.reduce((acc, item) => {
    return acc + item.quantity * (item.price_data.unit_amount / 100);
  }, 0);

  const shippingCost = order.shippingAmount ? order.shippingAmount / 100 : 0;
  const totalAmount = itemTotal + shippingCost;

  return (
    <Layout>
      <ColsWrapper>
        <Container>
          <OrderDetailContainer>
            <h2 style={{ marginBottom: "10px" }}>Order Details</h2>
            <p style={{ marginBottom: "10px" }}>
              <strong>Order Number: </strong>{order.orderNumber}
            </p>
            <p style={{ marginBottom: "10px" }}>
              <strong>Status: </strong>
              <StatusBadge style={{ color: getStatusColor(order.status) }}>
                {order.status}
              </StatusBadge>
            </p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Total items:</strong> {totalAmount.toFixed(2)} €</p>
            <p style={{ marginBottom: "20px" }}><strong>Shipping:</strong> 6,99 €</p>
            <h3>Items:</h3>
            <div>
              {order.line_items.map((item) => (
                <div
                  key={item.id}
                  style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
                >
                  <p>
                    {item.quantity} x {item.price_data.product_data.name} -{" "}
                    {item.price_data.unit_amount / 100} €
                  </p>
                </div>
              ))}
            </div>
          </OrderDetailContainer>

          <ShippingAddressContainer>
            <h2 style={{ marginBottom: "10px" }}>Shipping Address:</h2>
            {shippingAddress ? (
              <>
                <ShippingAddressField>
                  <label>Name</label>
                  <input type="text" value={shippingAddress.name} readOnly />
                </ShippingAddressField>
                <ShippingAddressField>
                  <label>Email</label>
                  <input type="text" value={shippingAddress.email} readOnly />
                </ShippingAddressField>
                <ShippingAddressField>
                  <label>Phone</label>
                  <input type="text" value={shippingAddress.phone} readOnly />
                </ShippingAddressField>
                <ShippingAddressField>
                  <label>Street Address</label>
                  <input type="text" value={shippingAddress.streetAddress} readOnly />
                </ShippingAddressField>
                <ShippingAddressField>
                  <label>City</label>
                  <input type="text" value={shippingAddress.city} readOnly />
                </ShippingAddressField>
                <ShippingAddressField>
                  <label>Postal Code</label>
                  <input type="text" value={shippingAddress.postalCode} readOnly />
                </ShippingAddressField>
                <ShippingAddressField>
                  <label>Country</label>
                  <input type="text" value={shippingAddress.country} readOnly />
                </ShippingAddressField>
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