import { List } from './ImgFinder.styled';

import { ImageGalleryitem } from './ImageGalleryItem';

export const ImageGallery = ({ images, toggleModal }) => {
  return (
    <List>
      <ImageGalleryitem images={images} toggleModal={toggleModal} />
    </List>
  );
};
