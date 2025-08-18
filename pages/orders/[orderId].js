const OrderDetailsPage = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [error, setError] = useState(null);

  // Ensure hooks are always called
  useEffect(() => {
    if (orderId) {
      axios
        .get(`/api/orders/${orderId}`)
        .then((res) => {
          console.log("Order Response:", res.data);
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

  // Handle error state before rendering
  if (error) return <p>{error}</p>;
  if (!orderId) return <p>Order not available!</p>; // Early return if no orderId
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

