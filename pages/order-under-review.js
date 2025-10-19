import Layout from "./layout";
import Center from "@/components/Center";
import { useRouter } from 'next/router';

export default function OrderUnderReviewPage() {
  const router = useRouter();
  const { orderNumber } = router.query;
  const goToOrders = () => {
    router.push("/profile"); // Update this to the correct path for the orders page
  };

  return (
    <Layout>
      <Center>
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop:20,
            marginLeft: "auto",
            padding: 30,
            background: "white",
            borderRadius: 8,
            textAlign: "center",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Optional: add shadow for a more polished look
          }}
        >
          <h1>Thank you for your order!</h1>
          {orderNumber && (
            <h2 style={{marginTop:10}}>
              <strong>{orderNumber}</strong>
            </h2>
          )}
          <p style={{marginTop:20}}>Your order is currently under review by our team.</p>
          
          <p>Once <strong>approved</strong>, you will be able to complete your payment from your order details page.</p>

          {/* Go to Orders Button */}
          <div style={{ marginTop: 20 }}>
            <button
              onClick={goToOrders} // Change function name here
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#6a5acd", // Blue color for the button
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = "#6a5acd"} // Darker blue on hover
              onMouseOut={(e) => e.target.style.backgroundColor = "#6a5acd"} // Revert to original blue
            >
              Go to Orders
            </button>
          </div>
        </div>
      </Center>
    </Layout>
  );
}
