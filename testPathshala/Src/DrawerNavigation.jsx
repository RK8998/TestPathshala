import {Dimensions, StyleSheet, Text, View, Image} from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from './Home';
import Profile from './Profile';
import DrawerContent from './DrawerContent';
import Course from './Course';
import About from './About';
import Chapter from './Chapter';
import Test from './Test';
import CheckOutResult from './CheckOutResult';
import logo from './Assets/Logo/aboutLogo.png'
import Forums from './Forums';
import ViewAnswers from './ViewAnswers';

const {width,height} = Dimensions.get('screen');

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {

  const width = Dimensions.get('screen')
  const isLargeScreen = width >= 1008;

  return (
    // <NavigationContainer>
      <Drawer.Navigator drawerContent={(props)=><DrawerContent {...props}/>} initialRouteName="Home" style={{backgroundColor:'white'}}
       screenOptions={{ overlayColor: 'lightgrey', drawerType: "slide", 
       headerRight: () => (
        <Image source={logo} style={{width: 100,height: 50,backgroundColor:'white',padding:-10}} />
       )}} >

        <Drawer.Screen name="Home" component={Home} options={{ title:'testPathshala' }} />
        <Drawer.Screen name="Profile" component={Profile} />
        <Drawer.Screen name="Course" component={Course} options={{headerShown:true}} />
        <Drawer.Screen name="About" component={About} />
        <Drawer.Screen name="Chapter" component={Chapter} options={{headerShown:false}} />
        <Drawer.Screen name="Test" component={Test} options={{headerShown:false}} />
        <Drawer.Screen name="ViewAnswers" component={ViewAnswers} options={{headerShown:false}} />
        <Drawer.Screen name="CheckOutResult" component={CheckOutResult} options={{headerShown:false}} />
        <Drawer.Screen name="Forums" component={Forums} options={{headerShown:false}} />
      </Drawer.Navigator>
    // </NavigationContainer>
  );
};

export default DrawerNavigation;

const styles = StyleSheet.create({});
