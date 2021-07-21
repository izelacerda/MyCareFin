import React from 'react';
import LottieView from 'lottie-react-native';
import loadingLottie from '../../assets/grocerie.json';

import { 
  Container 
} from './styles';

export function  LoadAnimation() {
  return (
    <Container>
      <LottieView
        source={loadingLottie}
        style={{ height: 100}}
        resizeMode="contain"
        autoPlay
        loop
      />

    </Container>
    );
}