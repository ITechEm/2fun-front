import { BounceLoader } from "react-spinners";
import styled from "styled-components";

const Wrapper = styled.div`
  ${({ fullWidth }) =>
    fullWidth
      ? `
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh; /* Adjust as needed for vertical centering */
    width: 100%;
  `
      : `
    display: inline-block;
  `}
`;

export default function Spinner({ fullWidth = false }) {
  return (
    <Wrapper fullWidth={fullWidth}>
      <BounceLoader speedMultiplier={3} color={'#555'} />
    </Wrapper>
  );
}
