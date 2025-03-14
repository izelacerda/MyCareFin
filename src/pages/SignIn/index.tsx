import React, { useState, useEffect} from 'react';
import { ActivityIndicator, Alert, Platform, BackHandler } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';

import { useAuth } from '../../hooks/auth';
import { SignInSocialButton } from '../../components/SignInSocialButton';
import { LoadAnimation } from '../../components/LoadAnimation';

import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper
} from './styles'

export function SignIn() {
  const [ isLoading, setIsLoading] = useState(false);
  const { user, signInWithGoogle, signInWithApple } = useAuth();
  const  theme = useTheme();
  async function handleSignInWithGoogle(){
    try {
      setIsLoading(true);
      return await signInWithGoogle();
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível conectar a conta Google!')
      setIsLoading(false);
    }
  }
  async function handleSignInWithApple(){
    try {
      setIsLoading(true);
      return await signInWithApple();
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível conectar a conta Apple!')
      setIsLoading(false);
    }
  }
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => { return true})
  },[])
  return (
    <Container>
      <Header>
        <LoadAnimation/>
        {/* <TitleWrapper>
          <LogoSvg 
            width={RFValue(120)}
            height={RFValue(68)}
          />
        </TitleWrapper> */}
        <Title>
          Controle suas {'\n'}
          finanças de forma {'\n'}
          muito simples
        </Title>
        <SignInTitle>
          Faça seu login com {'\n'}
          uma das contas abaixo
        </SignInTitle>
      </Header>
      <Footer>
        <FooterWrapper>
          { Platform.OS === 'ios' && 
            <SignInSocialButton 
              title="Iniciar sessão com a Apple"
              svg={AppleSvg}
              onPress={handleSignInWithApple}
            />
          }
          <SignInSocialButton 
            title="Iniciar sessão com Google"
            svg={GoogleSvg}
            onPress={handleSignInWithGoogle}
          />
        </FooterWrapper>
        { isLoading && 
          <ActivityIndicator 
            color={theme.colors.shape}
            style={{ margin: 18}}
          />
        }
      </Footer>

    </Container>
  )
}