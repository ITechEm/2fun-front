import styled from "styled-components";
import Link from 'next/link';

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
      case "Pending":
      return "#fbbf24";
  }
};

const StyledOrder = styled.div`
  margin: 10px 0;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`;

const StatusBadge = styled.span`
  margin-bottom: 10px;
  font-weight: bold;
  border-radius: 5px;
  display: inline-block;
  padding: 5px 30px;
  color: white;
  background-color: ${(props) => props.bgColor || "#d1d5db"};
`;

const OrderDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ShowOrderButton = styled.button`
  padding: 8px 16px;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.5s;

  &:hover {
    background-color: #00000080;
  }
`;

function formatStatus(status) {
  if (!status) return "Pending";
  return status
    .split('-')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

export default function SingleOrder({ line_items, createdAt, _id, orderNumber, ...rest }) {
  const statusColor = getStatusColor(rest.status);

  return (
    <StyledOrder>
      <div>
        <OrderDetailsWrapper>
          <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
            {orderNumber || _id}
          </div>

          <StatusBadge bgColor={statusColor}>
            {formatStatus(rest.status)}
          </StatusBadge>

          <time>{new Date(createdAt).toLocaleString('RO')}</time>
        </OrderDetailsWrapper>
      </div>

      <Link href={`/orders/${_id}`}>
       
          <ShowOrderButton>Show Order</ShowOrderButton>
       
      </Link>
    </StyledOrder>
  );
}