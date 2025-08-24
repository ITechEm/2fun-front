import styled from 'styled-components';
import Button from '@/components/Button';
import { useState, useEffect } from 'react';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 10vh;
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

// ✨ Main Component
export default function ConfirmModal({
  visible,
  type,
  onCancel,
  onConfirmDelete,
}) {
  const [step, setStep] = useState(1);

  // Prevent scroll behind modal
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setStep(1); // Reset to step 1 when closing
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <ModalOverlay>
      <ModalBox>
        {step === 1 ? (
          <>
            <h3>Are you sure?</h3>
            <p>
              {type === 'account'
                ? 'This will permanently delete your account and all data.'
                : 'This will permanently delete your saved shipping address.'}
            </p>
            <ModalButtons>
              <Button
                onClick={() => {
                  if (type === 'account') {
                    setStep(2);
                  } else {
                    onConfirmDelete(); // Directly delete address
                  }
                }}
                style={{ backgroundColor: '', color: '#d32f2f' }}
              >
                Confirm
              </Button>
              <Button onClick={onCancel} style={{ backgroundColor: '', color: '#000' }}>
                Cancel
              </Button>
            </ModalButtons>
          </>
        ) : (
          <>
            <h3>Sorry to see you go 😢</h3>
            <p>Your account and all related data will be permanently deleted.</p>
            <ModalButtons>
              <Button
                onClick={onConfirmDelete} style={{ backgroundColor: '', color: '#d32f2f' }}
                red
              >
                Delete Account
              </Button>
              <Button
                onClick={onCancel}
                style={{ backgroundColor: '', color: '#000' }}
              >
                Cancel
              </Button>
            </ModalButtons>
          </>
        )}
      </ModalBox>
    </ModalOverlay>
  );
}
