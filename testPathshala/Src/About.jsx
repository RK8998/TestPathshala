import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';

import logo from '../Src/Assets/Logo/aboutLogo.png';
import { Title,Avatar, Caption } from 'react-native-paper';

const About = () => {
  return (
    <> 
    <View style={{marginTop:5}}></View> 
    <ScrollView style={styles.maincontainer}>
    <View style={styles.container1}>
      <View style={{alignItems:'center', marginHorizontal:30}}>
        <Image source={logo} style={styles.logo} /> 
        <Title>Version 1.0</Title>
      </View>
      <View>
        <Text style={{textAlign:'justify',marginHorizontal:20}}>   Test Pathshala is a mobile application developed by SCET Students to provide online video learning services to students. The core idea of this app is to engage student in learning by themselves. The distance learning app is the most convenient type of personal learning. The online courses are already created.</Text>
        <Text style={{textAlign:'justify',marginHorizontal:20}}> So, one can start using them almost right away. You can learn at your own space and at your convenience. It is one of the significant advantages of this app.</Text>
      </View>
      <View style={styles.separator}></View>
      
      <View style={{marginHorizontal:30,paddingTop:10}}>
        <Title style={{textAlign:'center'}}>Developed by...</Title>
        <View style={{flexDirection:'row',justifyContent:"space-between"}}>
          <View>
            <Avatar.Image source={require('./Assets/team/jay.jpg')} size={90} />
            <Caption style={{textAlign:"center"}}>Jay</Caption>
          </View>
          <View>
            <Avatar.Image source={require('./Assets/team/saloni.jpg')} size={90} />
            <Caption style={{textAlign:"center"}}>Saloni</Caption>
          </View>
          <View>
            <Avatar.Image source={require('./Assets/team/rk1.jpg')} size={90} />
            <Caption style={{textAlign:"center"}}>Krushang</Caption>
          </View>
        </View>
      </View>
      {/* <View style={{marginHorizontal:30,paddingTop:10}}>
        <Text>Backend Coding and Server Handaling by: Krushang Rathod</Text>
        <View style={{flexDirection:'row',marginTop:5}}>
          <Icon name="user-graduate" size={20} color='#2C6AD5'/> 
          <Text style={styles.texticon}> View Profile</Text>
        </View>
      </View>
      
      <View style={styles.separator}></View>
      <View style={{marginHorizontal:30,paddingTop:10}}>
        <Text>Backend Coding and Server Handaling by: Saloni Tailor</Text>
        <View style={{flexDirection:'row',marginTop:5}}>
          <Icon name="user-graduate" size={20} color='#2C6AD5'/> 
          <Text style={styles.texticon}> View Profile</Text>
        </View>
      </View>

      <View style={styles.separator}></View>
      <View style={{marginHorizontal:30,paddingTop:10}}>
        <Text>Backend Coding and Server Handaling by: Jay Virani</Text>
        <View style={{flexDirection:'row',marginTop:5}}>
          <Icon name="user-graduate" size={20} color='#2C6AD5'/> 
          <Text style={styles.texticon}> View Profile</Text>
        </View>
      </View> */}

      <View style={styles.separator}></View>
      <View style={{marginHorizontal:30,paddingTop:10}}>
        <Text>Under the Guidence of : Zankhana Vaishnav</Text>
        <View style={{flexDirection:'row',marginTop:5}}>
          <Icon name="user-graduate" size={20} color='#2C6AD5'/> 
          <Text style={styles.texticon}> View Profile</Text>
        </View>
      </View>
      <View style={styles.separator}></View>
      <View style={{marginHorizontal:30,paddingTop:10}}>
        <View style={{flexDirection:'row',marginTop:5}}>
          <Icon name="phone" size={20} color='#2C6AD5'/> 
          <Text style={styles.texticon}> 9879854706</Text>
        </View>
      </View>
      <View style={styles.separator}></View>
        <Text style={{marginHorizontal:30}}>@2022 Test Pathshala. All rights Reserved</Text>
      </View>

      <View style={{marginTop:10}}></View>
      <View style={styles.container2}>
        <View style = {{marginHorizontal : 30,paddingVertical:5}}>
          <Text style={{fontSize:20,fontWeight:'bold'}}>Project Details</Text>
          <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:10}}>
            <Text style={{fontWeight:'800'}}>Front-End : </Text>
            <Text>React Native vnsi he 0.70.0</Text>
          </View>
          <View style={{flexDirection:'row',justifyContent:"space-between",marginVertical:10}}>
            <Text style={{fontWeight:'800'}}>Back-End : </Text>
            <Text>Node js + MongoDB</Text>
          </View>
        </View>
      </View>
      <View style={{marginTop:10}}></View>
      {/* <View style={styles.container3}>
        <View style = {{marginHorizontal : 30}}>
          <Text style={{fontSize:20}}>Advice Copyright</Text>
          <Text></Text> 
        </View>
      </View> */}
      </ScrollView>
    </>
  )
}

export default About

const styles = StyleSheet.create({
  maincontainer :{
    flex : 1
  },

  container1 : {
    height : 'auto',
    width : 350,
    backgroundColor : '#fff',
    marginLeft : 20,
    borderRadius : 20,
    paddingVertical:10
  },

  container2 : {
    height : 'auto',
    width : 350,
    backgroundColor : '#fff',
    marginLeft : 20,
    borderRadius : 20
  },

  container3 :{
    height : 50,
    width : 350,
    backgroundColor : '#fff',
    marginLeft : 20,
    borderRadius : 20,
    marginBottom:10
  },

  logo: {
    textAlign: 'center',
    width: 300,
    height: 160,
    paddingTop: 0,
    alignContent:'center'
    // marginTop: 5,
    // padding: 5,
  },

  version : {
    marginTop:0,
    fontSize:18,
    fontWeight:'bold',
  },
  separator:{
    height:2,
    backgroundColor:"#eeeeee",
    marginTop:10,
    marginHorizontal:30
  },
  texticon : {
    fontSize:15,
    color:'#2C6AD5',
  }
})