import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import Login from './Src/Login';
import Register from './Src/Register';
import SplashScreen from './Src/SplashScreen';
import Login2 from './Src/Login2';
// import Home from './Src/Home';
import DrawerNavigation from './Src/DrawerNavigation';
import Chapter from './Src/Chapter';
import Test from './Src/Test';

const Stack = createNativeStackNavigator();

import { LogBox } from 'react-native';
import ForgotPassword from './Src/ForgotPassword';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

const App = () => {

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="SplashScreen" component={SplashScreen} options={{headerShown:false}} /> 
          <Stack.Screen name="Login" component={Login2} options={{headerShown:false}} />
          <Stack.Screen name="Register" component={Register} options={{headerShown:false}} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{headerShown:false}} />
          <Stack.Screen name="Drawer" component={DrawerNavigation} options={{headerShown:false}} />
          {/* <Stack.Screen name="Chapter" component={Chapter} options={{headerShown:true}} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
