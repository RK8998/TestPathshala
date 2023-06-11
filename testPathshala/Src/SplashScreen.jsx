import React, { useEffect } from 'react';
import {Image, StatusBar, StyleSheet, Text, View} from 'react-native';
import Logo from './Assets/Logo/Logo.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackActions, useNavigation} from '@react-navigation/native';

const SplashScreen = () => {
  const Navigation = useNavigation();
  useEffect(() => {
    setTimeout(async () => {
      const token = await AsyncStorage.getItem('token');
      console.log("SplashScreen");
      console.log(token);
      if (token) {
        Navigation.dispatch(StackActions.replace('Drawer'));
      } else {
        Navigation.dispatch(StackActions.replace('Login'));
      }
    }, 2000);
  }, []);
  return (
    <>
      <StatusBar hidden={true} />
      <View style={{flex: 1}}></View>
      <View style={styles.container}>
        <Image source={`${Logo}`} style={styles.logo} />
      </View>
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <Text style={styles.from}>Powered By Test-PathShala</Text>
      </View>
    </>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 450,
  },
  from: {
    textAlign: 'center',
    color: '#256D85',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'robot',
    marginBottom: 30,
  },
});
