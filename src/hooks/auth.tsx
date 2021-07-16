import React, { createContext, ReactNode, useContext, useState,useEffect } from "react";

// import * as Google from 'expo-google-app-auth';
import * as AppleAuthentication from 'expo-apple-authentication';

import * as AuthSession from 'expo-auth-session';

const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;

import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthorizationResponse {
  params: {
    access_token: string;
  };
  type: string;
}
interface AuthProviderProps {
  children: ReactNode;
}
interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
}
interface IAuthContextData {
  user: User;
  signInWithGoogle(): Promise<void>;
  signInWithApple(): Promise<void>;
  signOut(): Promise<void>;
  userStorageLoading: boolean;
}
export const AuthContext = createContext({} as IAuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>({} as User);
  const [userStorageLoading, setUserStorageLoading] = useState(true);

  const userStorageKey = '@mycarefin:user';

  async function signInWithGoogle(){
    try {
      // 

      const RESPONSE_TYPE = 'token';
      const SCOPE = encodeURI('profile email');
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

      const { params, type } = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse;

      // const result = await Google.logInAsync({
      //   iosClientId: '661786778625-js9h4oout5bqejtcn6lgq6auigafld16.apps.googleusercontent.com',
      //   androidClientId: '661786778625-o2asthonr5s3bq6jdbghd09bpai07o4j.apps.googleusercontent.com',
      //   scopes: ['profile','email']
      // });
      console.log(params);
      if(type === 'success') {
        const response = await fetch(`https://googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
        const userInfo = await response.json();
        console.log(userInfo);
        const userLogged = {
          id: String(userInfo.id),
          email: userInfo.email,
          name: userInfo.name,
          photo: userInfo.picture
        };
        setUser(userLogged);
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
      }
    } catch (error) {
      throw new Error(error);
    }
    
  }

  async function signInWithApple() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ]
      });
      if(credential) {
        const name = credential.fullName!.givenName!;
        const photo = `https://ui-avatars.com/api/?name=${name}&length=1`;
        const userLogged = {
          id: String(credential.user),
          email: credential.email!,
          name,
          photo
        };
        setUser(userLogged);
        await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged));
      }
    } catch (error) {
      throw new Error(error); 
    }
  }

  async function signOut(){
    setUser({} as User);
    await AsyncStorage.removeItem(userStorageKey);
  }
  useEffect(() => {
    async function loadUserStorageData() {
      const userStoraged = await AsyncStorage.getItem(userStorageKey);
      if(userStoraged) {
        const userLogged = JSON.parse(userStoraged) as User;
        setUser(userLogged);
      }
      setUserStorageLoading(false);
    }
    loadUserStorageData();
  },[])
  return (
    <AuthContext.Provider value={{ 
      user,
      signInWithGoogle,
      signInWithApple,
      signOut,
      userStorageLoading
    }}>
      {children}
    </AuthContext.Provider> 
  )  
}

function useAuth(){
  const context = useContext(AuthContext);
  return context;
}
export { AuthProvider, useAuth}