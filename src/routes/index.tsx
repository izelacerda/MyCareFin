import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { AuthRoutes } from './auth.routes';
import { AppRoutes } from './app.routes';

import { useAuth } from '../hooks/auth';
import SplashScreen from 'react-native-splash-screen';

export function Routes(){
  const { user } = useAuth();
  // useEffect(() => {
  //   SplashScreen.hide();
  // }, []);
  return (
    <NavigationContainer>
      { user.id ? <AppRoutes/> : <AuthRoutes/>}
    </NavigationContainer>
  )
}
