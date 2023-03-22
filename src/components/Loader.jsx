import { RotatingLines } from 'react-loader-spinner';
import { LoadingContainer } from './ImgFinder.styled';

export const Loader = () => {
  return (
    <LoadingContainer>
      <RotatingLines
        strokeColor="#3f51b5"
        strokeWidth="5"
        animationDuration="0.75"
        width="96"
        visible={true}
      />
    </LoadingContainer>
  );
};
