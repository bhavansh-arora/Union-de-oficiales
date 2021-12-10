/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {StyleSheet, Platform} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import OneSignal from 'react-native-onesignal';
import {NavigationContainer} from '@react-navigation/native';
import AuthContext from './Context/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MenuProvider} from 'react-native-popup-menu';
import TabBar from './TabBar';

const App = () => {
  // const isDarkMode = useColorScheme() === 'dark';

  const [user, setUser] = useState();

  OneSignal.setLogLevel(6, 0);

  OneSignal.setAppId('97204d97-f2c4-4acc-938a-f82157d069db');

  if (Platform.OS == 'ios') {
    OneSignal.promptForPushNotificationsWithUserResponse(response => {
      console.log('Prompt response:', response);
    });
  }

  React.useEffect(() => {
    CheckUserData();
  }, []);

  const CheckUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      console.log('user', JSON.parse(userData));
      setUser(JSON.parse(userData));
    } catch (error) {
      console.log('error retriving data');
    } finally {
      SplashScreen.hide();
    }
  };

  return (
    <AuthContext.Provider value={{user, setUser}}>
      <MenuProvider>
        <NavigationContainer>
          <TabBar />
        </NavigationContainer>
      </MenuProvider>
    </AuthContext.Provider>
  );
};

const styles = StyleSheet.create({});

export default App;
