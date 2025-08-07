// components/ConfirmModal.js
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const ModalBox = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  max-width: 400px;
  text-align: center;
`;

const ModalButtons = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
`;

export default function ConfirmModal({ visible, onConfirm, onCancel, message }) {
  if (!visible) return null;
  return (
    <ModalOverlay>
      <ModalBox>
        <h3>Are you sure?</h3>
        <p>{message}</p>
        <ModalButtons>
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm} style={{ background: 'red', color: 'white' }}>
            Confirm
          </button>
        </ModalButtons>
      </ModalBox>
    </ModalOverlay>
  );
}
