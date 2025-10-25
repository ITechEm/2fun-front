import styled from "styled-components";
import { ButtonStyle } from "@/components/Button";
import { CartContext } from "@/components/CartContext";
import { useContext, useState } from "react";

const ButtonWrapper = styled.div`
  position: relative;
  button {
    ${ButtonStyle};
  }

  .popup {
    position: absolute;
    top: 0px;
    background-color: #74f199ff;
    color: white;
    padding: 5px 12px;
    border-radius: 8px;
    font-size: 0.8rem;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
    @media (max-width: 768px) {
      top: 0px;
      left: 25%;
      font-size: 0.8rem;
    }
  }

  .popup.show {
    opacity: 1;
  }
`;

export default function AddToCartButton(props) {
  const { addProduct } = useContext(CartContext);
  const [showPopup, setShowPopup] = useState(false);

  function handleClick() {
    addProduct(props._id);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 1500); // hide after 1.5s
  }

  return (
    <ButtonWrapper>
      <button onClick={handleClick}>{props.children || "Add to Cart"}</button>
      <div className={`popup ${showPopup ? "show" : ""}`}>Added to cart</div>
    </ButtonWrapper>
  );
}

// import styled from "styled-components";
// import {ButtonStyle} from "@/components/Button";
// import {primary} from "@/lib/colors";
// import {CartContext} from "@/components/CartContext";
// import {useContext, useEffect, useRef, useState} from "react";

// const FlyingButtonWrapper = styled.div`
//   button{
//     ${ButtonStyle};
    
//   }
//   @keyframes fly{
//     100%{
//       top:0;
//       top:95%;
//       opacity: 0;
//       display:none;
//       max-width: 50px;
//       max-height: 50px;
//     }
//   }
//   img{
//     display:none;
//     max-width: 100px;
//     max-height: 100px;
//     opacity: 1;
//     position: fixed;
//     z-index: 5;
//     animation: fly 1s;
//     border-radius: 10px;
//   }
// `;

// export default function FlyingButton(props) {
//   const {addProduct} = useContext(CartContext);
//   const imgRef = useRef();
//   function sendImageToCart(ev) {
//   if (!imgRef.current) return;  // <-- safety check

//   imgRef.current.style.display = 'inline-block';
//   imgRef.current.style.left = (ev.clientX - 50) + 'px';
//   imgRef.current.style.top = (ev.clientY - 50) + 'px';

//   setTimeout(() => {
//     if (imgRef.current) {  // <-- another safety check inside timeout
//       imgRef.current.style.display = 'none';
//     }
//   }, 1000);
// }
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const reveal = imgRef.current?.closest('div[data-sr-id]');
//       if (reveal?.style.opacity === '1') {
//         // visible
//         reveal.style.transform = 'none';
//       }
//     }, 100);

//     return () => clearInterval(interval);
//   }, []);
//   return (
//     <>
//       <FlyingButtonWrapper
//         white={props.white}
//         main={props.main}
//         onClick={() => addProduct(props._id)}>
//         <img src={props.src} alt="" ref={imgRef} />
//         <button onClick={ev => sendImageToCart(ev)} {...props} />
//       </FlyingButtonWrapper>
//     </>
//   );
// }
