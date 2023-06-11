import {StyleSheet, Text, View, Image, TextInput, ScrollView, TouchableOpacity, StatusBar} from 'react-native';
import React,{useCallback, useEffect, useState} from 'react';
import logo from './Assets/Logo/Logo.png'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo'
import { Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions, useNavigation } from '@react-navigation/native';
import { url } from './Services/url';

const Login2 = (props) => {
  const Navigation = useNavigation();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [isShow, setIsShow] = useState(false);

  const [visible, setVisible] = useState(false);
  const [msg, setMsg] = useState("");
  const showSnackBar = () => setVisible(true);
  const onDismissSnackBar = () => setVisible(false);
  
  useEffect(() => {
    if(visible){
      setTimeout(() => {
        onDismissSnackBar()
      }, 1800);
    }
  }, [visible])
  
  
  const handleSignin = async() => {
    try {
      if(!mobile || !password){
        setMsg("Please fill all the details");
      }
      else if(mobile.length != 10){
        setMsg("Mobile number must be 10 digit");
      }
      else{
        const data = await fetch(`${url}/login`,{
          method:'POST',
          headers:{
            'Content-Type': 'application/json'
          },
          body:JSON.stringify({
            mobile:mobile,
            password:password
          })
        });
        const response = await data.json();
        console.log(response);
        if(response.status == "yes"){
          setMsg(response.msg);
          await AsyncStorage.setItem('userLogin',JSON.stringify(response.user));
          await AsyncStorage.setItem('token',response.token);
          Navigation.dispatch(StackActions.replace("Drawer"));
        }
        if(response.status == "no"){
          setMsg(response.msg);
        }
      }
      showSnackBar()
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
    <StatusBar hidden={true} />
    <View style={styles.conatainer}>
  
      <Snackbar visible={visible} onDismiss={onDismissSnackBar}>{msg}</Snackbar>
  
      <View style={styles.firstBlock}>
        <View style={styles.logoBox}>
            <Image source={logo} style={styles.logo} />
        </View>
        <Text style={{fontSize: 25,color: 'white',fontWeight: 'bold',textAlign: 'center',marginTop: 10,}}>
          PATHSHALA
        </Text>
      </View>
      
      <View style={styles.secondBlock}>
        <ScrollView>
          <View style={styles.loginBox}>
            <Text style={{fontSize: 25, color: 'white', fontWeight: 'normal'}}>LOGIN</Text>
            <View style={styles.txtEmailBox}>
              <Icon name="smartphone" size={30} color={'white'} />
              <TextInput placeholder=' Mobile' placeholderTextColor={'#fff'} keyboardType='numeric' style={styles.txtInput}
                value={mobile} onChangeText={(text)=>setMobile(text)} cursorColor={'#d0dbd3'}/>
            </View>

            <View style={styles.txtEmailBox}>
              <Icon name="lock-open" size={30} color={'white'} />
              <TextInput style={styles.txtInput} placeholder=" Password" placeholderTextColor={'white'} keyboardType={"default"}
                value={password} onChangeText={(text)=>setPassword(text)} secureTextEntry={isShow?false:true} cursorColor={'#d0dbd3'} />
              <TouchableOpacity onPress={ ()=>setIsShow(!isShow) }>
                <Entypo name={isShow?"eye-with-line":"eye"} size={30} color={'white'} style={{alignItems: 'flex-end',marginRight:10}}/>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={{alignSelf: 'flex-end', marginRight: 10}} onPress={()=> Navigation.dispatch(StackActions.replace("ForgotPassword"))}>
              <Text style={{color: 'white'}}>Forgot Password ?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn_login} onPress={()=>handleSignin()}>
              <Text style={{fontSize: 22, color: '#2C6AD5',fontWeight:'bold'}}>Sign In</Text>
            </TouchableOpacity>

          </View>
          <View style={styles.signupBox}>
            <Text style={{fontSize: 15, color: 'white'}}>New User ?</Text>
            <TouchableOpacity
              style={styles.btn_signup}
              onPress={() => props.navigation.replace('Register')}>
              <Text style={{fontSize: 18, color: 'white'}}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
    </>
  );
};

export default Login2;

const styles = StyleSheet.create({
  conatainer: {
    flex: 1,
    backgroundColor: '#2C6AD5',
    // backgroundColor: 'white',
    // justifyContent: 'space-around',
  },
  firstBlock:{
    flex:1,
    // backgroundColor:"red"
  },
  secondBlock:{
    flex:3,
    // backgroundColor:'green',
    marginVertical:10,
  },
  logoBox: {
    borderWidth: 0,
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 100,
    alignSelf: 'flex-end',
    marginVertical: 25,
    marginRight: 15,
  },
  logo: {
    textAlign: 'center',
    width: 50,
    height: 50,
    paddingTop: 20,
    // marginTop: 5,
    // padding: 5,
  },

  // ====================================
  loginBox:{
    flex:1,
    // backgroundColor:'red',
    alignItems:'center',
    padding:10,
    margin:10,
    justifyContent:'space-between'
  },
  signupBox:{
    flex:0.3,
    // backgroundColor:'yellow',
    alignItems:'center',
    padding:10,
    marginHorizontal:10,
    marginTop:50
  },
  // ==================================== 

  txtEmailBox:{
    borderBottomWidth:2,
    borderColor:'#fff',
    width:'100%',
    borderRadius:10,
    flexDirection:'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  txtInput: {
    // borderBottomWidth: 1,
    // borderColor: 'white',
    // width: width-80,
    flex:1,
    textAlign: 'left',
    color: 'white',
    fontSize: 18,
    marginVertical: 10,
    paddingLeft: 20,
  },

  btn_login: {
    borderWidth: 0,
    backgroundColor: 'white',
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderRadius: 50,
    marginTop: 20,
  },
  btn_signup: {
    borderWidth: 2,
    borderColor: 'white',
    paddingHorizontal: 80,
    paddingVertical: 10,
    marginVertical: 20,
    borderRadius: 50,
  },
  // ==================================== 


});
