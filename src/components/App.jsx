import { Component } from 'react';

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

export class App extends Component {
  state = {
    query: '',
    images: [],
    largeImageURL: '',
    shouldShowModal: false,
    isLoading: false,
    error: false,
    page: 1,
  };

  componentDidUpdate(_, prevState) {
    const prevQuery = prevState.query;
    const prevPage = prevState.page;
    const { query, page } = this.state;

    if (prevQuery !== query || prevPage !== page) {
      this.getImage(query);
    }
  }

  resetPage = () => this.setState({ page: 1 });
  incrementPage = () => {
    this.setState(prevState => {
      return { page: prevState.page + 1 };
    });
  };
  resetImages = () => this.setState({ images: [] });
  getImage = query => {
    const { page } = this.state;
    try {
      fetchQuery(query, page)
        .then(response => {
          const { hits, total } = response;
          if (!hits.length) {
            toast.error(
              `Ooops, there are no images with that query: ${query}`,
              { position: 'top-right' }
            );
            this.setState(prevState => {
              return { isLoading: !prevState.isLoading };
            });

            return this.resetImages();
          }
          this.setState(prevState => {
            return { isLoading: !prevState.isLoading };
          });

          calculateTotalPages(total);
          if (!isShowLoadMore(page)) {
            toast.success(
              'We are ssory, but you have reached the end of search results',
              { position: 'top-right' }
            );
          }
          this.setState(prevState => {
            return { images: [...prevState.images, ...hits] };
          });
        })
        .catch(() => this.setState({ error: true }));
    } catch {
      this.setState({ error: true });
    } finally {
      this.setState(prevState => {
        return { isLoading: !prevState.isLoading };
      });
    }
  };

  onSubmit = e => {
    e.preventDefault();

    const value = e.target.elements.query.value.trim();
    if (!value) {
      return;
    }
    this.setState(prevState => {
      if (value !== this.state.query) {
        this.resetImages();
        this.resetPage();
        resetTotalPages();
        return;
      }
    });

    this.setState({ query: value });
  };
  handleLoadMoreClick = e => {
    this.incrementPage();
  };

  toggleModal = largeImageURL => {
    this.setState(({ shouldShowModal }) => ({
      shouldShowModal: !shouldShowModal,
      largeImageURL,
    }));
  };

  render() {
    const { images, shouldShowModal, largeImageURL, isLoading, error, page } =
      this.state;
    return (
      <>
        <Searchbar onSubmit={this.onSubmit} />

        {error && <Error message={`We're sorry but something went wrong`} />}
        {images && (
          <ImageGallery images={images} toggleModal={this.toggleModal} />
        )}
        {isLoading && <Loader />}
        {!isLoading && isShowLoadMore(page) && (
          <LoadMoreBtn handleLoadMoreClick={this.handleLoadMoreClick} />
        )}
        {shouldShowModal && (
          <Modal largeImageURL={largeImageURL} toggleModal={this.toggleModal} />
        )}
        <Toaster />
      </>
    );
  }
}
