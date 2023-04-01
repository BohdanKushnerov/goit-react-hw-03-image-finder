import { Component } from 'react';
import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';
import { Loader } from 'components/Loader/Loader';
// import { Modal } from 'components/Modal/Modal';
import { fetchImg } from 'components/Api/Api';
import { ImageGalleryList, ButtonLoadMore } from './ImageGallery.styled';

export class ImageGallery extends Component {
  state = {
    images: [],
    error: null,
    status: 'idle',
    page: null,
    // showModal: false,
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.imgTheme && prevProps.imgTheme !== this.props.imgTheme) {
      try {
        this.setState({
          images: [],
          page: 1,
        });

        this.loadImg();
      } catch (error) {
        this.setState({ error, status: 'rejected' });
      }
    }
  }

  loadImg = async () => {
    this.setState({ status: 'pending' });

    try {
      const images = await fetchImg(this.props.imgTheme, this.state.page);

      this.setState(prevState => {
        return {
          page: prevState.page + 1,
          images: prevState.images
            ? [...prevState.images, ...images]
            : [...images],
          status: 'resolved',
        };
      });
    } catch (error) {
      this.setState({ error, status: 'rejected' });
    }
  };

  // toggleModal = () => {
  //   this.setState(({ showModal }) => ({
  //     showModal: !showModal,
  //   }));
  // };

  render() {
    const { status, images } = this.state;

    return (
      <>
        {images.length > 0 && (
          <ImageGalleryList className="gallery">
            {this.state.images.map(image => {
              return <ImageGalleryItem key={image.id} image={image} />;
            })}
          </ImageGalleryList>
        )}
        {status === 'resolved' && (
          <ButtonLoadMore type="button" onClick={() => this.loadImg()}>
            Load More
          </ButtonLoadMore>
        )}
        {/* {status === 'resolved' && <Loader />} */}
        {status === 'pending' && <Loader />}
        {/* {showModal && <Modal onClose={this.toggleModal} />} */}
      </>
    );
  }
}