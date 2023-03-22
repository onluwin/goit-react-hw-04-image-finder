import { Item, ItemImage } from './ImgFinder.styled';

export const ImageGalleryitem = ({ images, toggleModal }) => {
  return images.map(({ id, webformatURL, largeImageURL }) => {
    return (
      <>
        <Item key={id} onClick={() => toggleModal(largeImageURL)}>
          <ItemImage src={webformatURL} alt="" />
        </Item>
      </>
    );
  });
};
