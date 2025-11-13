import styled from "styled-components";
import {useState} from "react";

const Image = styled.img`
  width: 90px;
  height: 90px;
  object-fit: cover; /* ensures image fills square without distortion */
  border-radius: 10px; /* optional for smooth edges */
`;

const BigImage = styled.img`
  width: 700px;
  height: 500px;
  object-fit: cover;
  border-radius: 10px; /* optional */

   @media screen and (max-width: 480px) {
      width: 300px;
  height: 300px;
    }
  }
`;

const ImageButtons = styled.div`
  display: flex;
  gap: 10px;
  flex-grow: 0;
  margin-top: 10px;
`;

const ImageButton = styled.div`
  border: 2px solid ${props => (props.active ? '#ccc' : 'transparent')};
  height: 98px;
  padding: 2px;
  cursor: pointer;
  border-radius: 10px;
`;

const BigImageWrapper = styled.div`
  text-align: center;
 
  justify-content: center;
  align-items: center;
`;

export default function ProductImages({images}) {
  const [activeImage,setActiveImage] = useState(images?.[0]);
  return (
    <>
      <BigImageWrapper>
        <BigImage src={activeImage} />
      </BigImageWrapper>
      <ImageButtons>
        {images.map(image => (
          <ImageButton
            key={image}
            active={image===activeImage}
            onClick={() => setActiveImage(image)}>
            <Image src={image} alt=""/>
          </ImageButton>
        ))}
      </ImageButtons>
    </>
  );
}