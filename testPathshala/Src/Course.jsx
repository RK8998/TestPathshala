import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MyCourses from './MyCourses';
import Enroll from './Enroll';
import AsyncStorage from '@react-native-async-storage/async-storage'

const Tab = createMaterialTopTabNavigator();

const Course = () => {

  return (
    <Tab.Navigator>
      <Tab.Screen name="Courses" component={MyCourses} />
      <Tab.Screen name="Enrolled" component={Enroll} />
    </Tab.Navigator>
  )
}

export default Course

const styles = StyleSheet.create({})