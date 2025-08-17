import styled from "styled-components";
import Link from 'next/link'; // Import Link for navigation

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

const StyledOrder = styled.div`
  margin: 10px 0;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between; /* Button on the right */
  align-items: flex-start; /* Align items to the start for better spacing */
  gap: 20px;
`;

const ProductRow = styled.div`
  span {
    color: #aaa;
  }
`;

const Address = styled.div`
  font-size: 0.8rem;
  line-height: 1rem;
  margin-top: 5px;
  color: #888;
`;

const StatusBadge = styled.span`
  margin-bottom: 10px;
  font-weight: bold;
  border-radius: 5px;
  display: inline-block;
  color: #eb0909ff;
`;

const OrderDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column; /* Stack status and date vertically */
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

// Styled components for the profile header
const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #d1d5db;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: white;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.p`
  font-weight: bold;
  margin: 0;
`;

const UserEmail = styled.p`
  font-size: 0.9rem;
  color: #888;
`;

// Container for profile information
const ProfileContainer = styled.div`
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
`;

export default function SingleOrder({ line_items, createdAt, _id, ...rest }) {
  // Debugging: Check the status and its color class
  const statusClass = getStatusColor(rest.status);

  return (
    
    <StyledOrder>
      <div>
        {/* Wrapper to stack status and date */}
        <OrderDetailsWrapper>
          <StatusBadge className={statusClass}>
            {rest.status}
          </StatusBadge>
          <time>{new Date(createdAt).toLocaleString('RO')}</time>
        </OrderDetailsWrapper>
       
      </div>

      {/* Show Order Button on the right */}
      <Link href={`/orders/${_id}`}>
        <ShowOrderButton>Show Order</ShowOrderButton>
      </Link>
    </StyledOrder>
  );
}



// import styled from "styled-components";

// // Status color mapping function
// const getStatusColor = (status) => {
//   switch (status) {
//     case "Cancelled":
//       return "bg-red-500 text-white"; // red for cancelled
//     case "Pending":
//       return "bg-yellow-400 text-black"; // yellow for pending
//     case "In Progress":
//       return "bg-blue-400 text-white"; // blue for in progress
//     case "Ready for Delivery":
//       return "bg-green-300 text-black"; // light green for ready
//     case "In Delivery":
//       return "bg-green-400 text-black"; // green for delivery
//     case "Delivered":
//       return "bg-green-700 text-white"; // dark green for delivered
//     default:
//       return "bg-gray-200 text-black"; // gray for unknown
//   }
// };

// const StyledOrder = styled.div`
//   margin: 10px 0;
//   padding: 10px 0;
//   border-bottom: 1px solid #ddd;
//   display: flex;
//   gap: 20px;
//   align-items: center;
//   time {
//     font-size: 1rem;
//     color: #555;
//   }
// `;

// const ProductRow = styled.div`
//   span {
//     color: #aaa;
//   }
// `;

// const Address = styled.div`
//   font-size: 0.8rem;
//   line-height: 1rem;
//   margin-top: 5px;
//   color: #888;
// `;


// const StatusBadge = styled.span`
//   margin-bottom: 10px;
//   font-weight: bold;
//   border-radius: 5px;
//   display: inline-block;
//   color: #eb0909ff;
// `;

// export default function SingleOrder({ line_items, createdAt, ...rest }) {
//   // Debugging: Check the status and its color class
//   const statusClass = getStatusColor(rest.status);

//   console.log("Status: ", rest.status); // Check status value
//   console.log("Status Class: ", statusClass); // Check the applied class

//   return (
//     <StyledOrder>
//       <div>
//         <time>{new Date(createdAt).toLocaleString('sv-SE')}</time>
//         <Address>
//           {rest.status ? (
//             <StatusBadge className={statusClass}>
//               {rest.status}
//             </StatusBadge>
//           ) : (
//             ""
//           )}
//           <br />
//           {rest.name}
//           <br />
//           {rest.email}
//           <br />
//           {rest.phone}
//           <br />
//           {rest.streetAddress}
//           <br />
//           {rest.postalCode} {rest.city}, {rest.country}
//         </Address>
//       </div>
//       <div>
//         {line_items.map((item) => (
//           <ProductRow key={item.id}>
//             <span>{item.quantity} x </span>
//             {item.price_data.product_data.name}
//           </ProductRow>
//         ))}
//       </div>
//     </StyledOrder>
//   );
// }
