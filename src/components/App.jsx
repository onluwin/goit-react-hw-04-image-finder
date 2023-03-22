import { useState, useEffect } from 'react';

import toast, { Toaster } from 'react-hot-toast';

import { Searchbar } from './Searchbar';
import { ImageGallery } from './ImageGallery';
import { LoadMoreBtn } from './Button';
import { Modal } from './Modal';

import {
  isShowLoadMore,
  calculateTotalPages,
  resetTotalPages,
  fetchQuery,
} from 'API/fetchAPI';

// STYLED COMPONENTS
import { Error } from './Error';
import { Loader } from './Loader';

export const App = () => {
  const [query, setQuery] = useState('');
  const [images, setImages] = useState([]);
  const [largeImageURL, setLargeImageURL] = useState('');
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!query) {
      return;
    }
    const getImage = query => {
      try {
        fetchQuery(query, page)
          .then(response => {
            const { hits, total } = response;
            if (!hits.length) {
              toast.error(
                `Ooops, there are no images with that query: ${query}`,
                { position: 'top-right' }
              );
              setIsLoading(prevLoading => !prevLoading);

              return resetImages();
            }
            setIsLoading(prevLoading => !prevLoading);

            calculateTotalPages(total);
            if (!isShowLoadMore(page)) {
              toast.success(
                'We are ssory, but you have reached the end of search results',
                { position: 'top-right' }
              );
            }
            setImages(prevImages => [...prevImages, ...hits]);
          })
          .catch(() => setError(true));
      } catch {
        setError(true);
      } finally {
        setIsLoading(prevLoading => !prevLoading);
      }
    };
    getImage(query);
  }, [query, page]);

  const resetPage = () => setPage(1);
  const incrementPage = () => setPage(prevPage => prevPage + 1);
  const resetImages = () => setImages([]);

  const onSubmit = e => {
    e.preventDefault();

    const value = e.target.elements.query.value.trim();
    if (!value) {
      return;
    }
    if (value !== query) {
      resetImages();
      resetPage();
      resetTotalPages();
      setQuery(value);
    }
  };
  const handleLoadMoreClick = () => incrementPage();

  const toggleModal = largeImageURL => {
    setShouldShowModal(prevShowModal => !prevShowModal);
    setLargeImageURL(largeImageURL);
  };

  return (
    <>
      <Searchbar onSubmit={onSubmit} />

      {error && <Error message={`We're sorry but something went wrong`} />}
      {images && <ImageGallery images={images} toggleModal={toggleModal} />}
      {isLoading && <Loader />}
      {!isLoading && isShowLoadMore(page) && (
        <LoadMoreBtn handleLoadMoreClick={handleLoadMoreClick} />
      )}
      {shouldShowModal && (
        <Modal largeImageURL={largeImageURL} toggleModal={toggleModal} />
      )}
      <Toaster />
    </>
  );
};
