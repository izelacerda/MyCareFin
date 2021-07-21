import React from 'react';
// import { Button, StyleSheet, Dimensions } from 'react-native';
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import Animated, { 
  useSharedValue, 
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS
} from 'react-native-reanimated';

import BrandSvg from '../../assets/brand2.svg';
import LogoSvg from '../../assets/logo2.svg';
import { timeout } from '../../utils/geral';
import { Container } from './styles';

// const WIDTH = Dimensions.get('window').width;

export function  Splash() {
  const splashAnimation = useSharedValue(0);
  const navigation = useNavigation();

  const brandStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(splashAnimation.value, [0, 50], [1, 0]),
      transform: [
        {
          translateX: interpolate(splashAnimation.value,
            [0, 50],
            [0, -50]
          )
        }
      ]
    }
  });
  const logoStyle = useAnimatedStyle(()=> {
    return {
      opacity: interpolate(splashAnimation.value, [0, 25, 50], [0, .3, 1]),
      transform: [
        {
          translateX: interpolate(splashAnimation.value,
            [0, 50],
            [-50, 0],
            Extrapolate.CLAMP
          )
        }
      ]
    }
  });
  async function startApp() {
    await timeout(1000);
    navigation.navigate('SignIn');
  }
  useEffect(() => {
    splashAnimation.value = withTiming(
      50, 
      { 
        duration: 2000 
      },
      () => {
        'worklet'
        runOnJS(startApp)();
      }
    );
  },[]);

  // const animation = useSharedValue(0);
  // const animatedStyles = useAnimatedStyle(() => {
  //   return {
  //     transform: [
  //       { 
  //         translateX: withTiming(animation.value, {
  //           duration: 500,
  //           easing: Easing.bezier(.1,.8,.27,.93)
  //         })
  //       }
  //     ]
  //   }
  // });

  // function handleAnimationPosition() {
  //   animation.value = Math.random() * ( WIDTH - 100);
  // };

  return (
    <Container>
      <Animated.View style={[brandStyle, { position: 'absolute'}]}>
        <BrandSvg width={80} height={50} />
      </Animated.View>
      <Animated.View style={[logoStyle, { position: 'absolute'}]}>
        <LogoSvg width={180} height={20} />
      </Animated.View>

      {/* <Animated.View style={[styles.box, animatedStyles]} />
      <Button title='Mover' onPress={handleAnimationPosition} /> */}
    </Container>
  );
}

// const styles = StyleSheet.create({
//   box: {
//     width: 100,
//     height: 100,
//     backgroundColor: 'red'
//   }
// });
