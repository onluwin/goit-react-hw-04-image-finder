import { Component } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay, ModalContent, ModalImage } from './ImgFinder.styled';

const modalRef = document.querySelector('#modal-root');
export class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keyup', this.checkTargetAndCloseModal);
  }
  componentWillUnmount() {
    window.removeEventListener('keyup', this.checkTargetAndCloseModal);
  }

  checkTargetAndCloseModal = e => {
    const { toggleModal } = this.props;
    e.code === 'Escape' && toggleModal();
    e.currentTarget === e.target && toggleModal();
  };

  render() {
    const { largeImageURL } = this.props;
    return createPortal(
      <ModalOverlay onClick={this.checkTargetAndCloseModal}>
        <ModalContent>
          <ModalImage src={largeImageURL} alt="" />
        </ModalContent>
      </ModalOverlay>,
      modalRef
    );
  }
}
