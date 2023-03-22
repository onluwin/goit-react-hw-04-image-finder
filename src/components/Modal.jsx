import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay, ModalContent, ModalImage } from './ImgFinder.styled';

const modalRef = document.querySelector('#modal-root');

export const Modal = ({ largeImageURL, toggleModal }) => {
  useEffect(() => {
    window.addEventListener('keyup', checkTargetAndCloseModal);
    return () => window.removeEventListener('keyup', checkTargetAndCloseModal);
  });

  const checkTargetAndCloseModal = e => {
    e.code === 'Escape' && toggleModal();
    e.currentTarget === e.target && toggleModal();
  };

  return createPortal(
    <ModalOverlay onClick={checkTargetAndCloseModal}>
      <ModalContent>
        <ModalImage src={largeImageURL} alt="" />
      </ModalContent>
    </ModalOverlay>,
    modalRef
  );
};
