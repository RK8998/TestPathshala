import {StyleSheet, Text, View, Image, TextInput, ScrollView, TouchableOpacity, StatusBar} from 'react-native';
import React, { useEffect, useState } from 'react'
import logo from './Assets/Logo/Logo.png'
import Icon from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo'
import { Snackbar } from 'react-native-paper';
import { url } from './Services/url';
import { StackActions, useNavigation } from '@react-navigation/native';

const ForgotPassword = () => {
  const Navigation = useNavigation();

  const [mobile, setMobile] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [user, setUser] = useState([])

  const [visible, setVisible] = useState(false);
  const [msg, setMsg] = useState("");
  const showSnackBar = () => setVisible(true);
  const onDismissSnackBar = () => setVisible(false);

  const handleConfirm = async() => {
    try {
      if(!mobile){
        setMsg("Please enter mobile number");
      }
      else if(mobile.length != 10){
        setMsg("Mobile number must be 10 digit");
      }
      else{
        const data = await fetch(`${url}/checkMobile`,{
          method:'POST',
          headers:{
            'Content-Type': 'application/json'
          },
          body:JSON.stringify({
            mobile:mobile,
          })
        });
        const response = await data.json();
        console.log(response);
        if(response.status == "yes"){
          setMsg(response.msg);
          setUser(response.user);
          setConfirm(true)
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

  const handleReset = async() => {
    console.log(password,cpassword,mobile);
    try {
      if(!password && !cpassword){
        setMsg("Please fill all the details");
      }
      else if(password != cpassword){
        setMsg("Password missmatch");
      }
      else{
        const data = await fetch(`${url}/reset`,{
          method:'PUT',
          headers:{
            'Content-Type': 'application/json'
          },
          body:JSON.stringify({
            mobile:mobile,
            password:password,
            cpassword:cpassword
          })
        });
        const response = await data.json();
        console.log(response);
        if(response.status == "yes"){
          setMsg(response.msg);
          showSnackBar()
          setTimeout(() => {
            Navigation.dispatch(StackActions.replace("Login"));
          }, 1000);
        }
        if(response.status == "no"){
          setMsg(response.msg);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if(visible){
      setTimeout(() => {
        onDismissSnackBar()
      }, 1800);
    }
  }, [visible])

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
          Forgot Password
        </Text>
      </View>

      <View style={styles.secondBlock}>
        <ScrollView>
          <View style={styles.loginBox}>
            {
              !confirm ? 
              <>
                <View style={styles.txtEmailBox}>
                  <Icon name="smartphone" size={30} color={'white'} />
                  <TextInput placeholder=' Enter Mobile Number' placeholderTextColor={'#fff'} keyboardType='numeric' style={styles.txtInput}
                    value={mobile} onChangeText={(text)=>setMobile(text)} cursorColor={'#d0dbd3'}/>
                </View>

                <TouchableOpacity style={styles.btn_login} onPress={()=>handleConfirm()}>
                  <Text style={{fontSize: 22, color: '#2C6AD5',fontWeight:'bold'}}>Confirm</Text>
                </TouchableOpacity> 
                <TouchableOpacity style={styles.btn_login} onPress={()=>Navigation.dispatch(StackActions.replace("Login"))}>
                  <Text style={{fontSize: 22, color: '#2C6AD5',fontWeight:'bold'}}>Cancel</Text>
                </TouchableOpacity>  
              </>
              : 
              <>
                <View style={styles.txtEmailBox}>
                  <Icon name="lock-open" size={30} color={'white'} />
                  <TextInput style={styles.txtInput} placeholder=" New Password" placeholderTextColor={'white'} 
                    cursorColor={'#d0dbd3'} value={password} onChangeText={(text)=>setPassword(text)} secureTextEntry={true} />
                </View>
                <View style={styles.txtEmailBox}>
                  <Icon name="lock-open" size={30} color={'white'} />
                  <TextInput style={styles.txtInput} placeholder=" Confirm Password" placeholderTextColor={'white'}
                    cursorColor={'#d0dbd3'} value={cpassword} onChangeText={(text)=>setCPassword(text)} />
                </View>

                <TouchableOpacity style={styles.btn_login} onPress={()=>handleReset()}>
                  <Text style={{fontSize: 22, color: '#2C6AD5',fontWeight:'bold'}}>Reset</Text>
                </TouchableOpacity>  
              </>
            }

          </View>
        </ScrollView>
      </View>
    </View>
    </>
  )
}

export default ForgotPassword

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
})