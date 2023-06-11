import { StyleSheet, Text, View, Image, Dimensions, TextInput, TouchableOpacity, ScrollView, Alert, StatusBar } from 'react-native'
import React,{useEffect, useState} from 'react'
import logo from './Assets/Logo/Logo.png';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo'
import { Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions, useNavigation } from '@react-navigation/native';
import { url } from './Services/url';

const Register = (props) => {
  const Navigation = useNavigation();
  const [isShow, setIsShow] = useState(false);
  const [isShowC, setIsShowC] = useState(false);

  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("");
  const [education, setEducation] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");

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

  const handleSignup = async() => {
    console.log(gender.toString());
    let regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    try {
      if(!email || !mobile || !gender || !education || !password || !cpassword){
        setMsg("Please fill all the details");
      }
      else if(regEmail.test(email) === false){
        setMsg("Please enter valid email");
      }
      else if(gender.length > 1){
        setMsg("Please enter valid Gender (M/F)");
      }
      else if(mobile.length != 10){
        setMsg("Mobile number must be 10 digit");
      }
      else if(password !== cpassword){
        setMsg("Confirm Password miss match");
      }
      else{
        const data = await fetch(`${url}/register`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email:email,
            mobile:mobile,
            gender:gender.toUpperCase(),
            education:education,
            password:password,
            cpassword:cpassword
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
        {/* <View style={styles.top}> */}
        <Snackbar visible={visible} onDismiss={onDismissSnackBar}>{msg}</Snackbar>

          <View style={styles.logoBox}>
            <Image source={logo} style={styles.logo} />
          </View>
        {/* </View> */}

        <ScrollView>
        <View style={styles.regBox}>
          <View
            style={styles.txtInputBox}>
            <Icon name="email" size={30} color={'white'} />
            <TextInput
              style={styles.txtInput}
              placeholder=" Email"
              keyboardType="numbers-and-punctuation"
              placeholderTextColor={'white'}
              value={email}
              onChangeText={(text)=>setEmail(text)}
              cursorColor={'#d0dbd3'}
            />
          </View>
          <View
            style={styles.txtInputBox}>
            <Icon name="smartphone" size={30} color={'white'} />
            <TextInput
              style={styles.txtInput}
              placeholder=" Mobile"
              keyboardType="numeric"
              placeholderTextColor={'white'}
              value={mobile}
              onChangeText={(text)=>setMobile(text)}
              cursorColor={'#d0dbd3'}
            />
          </View>
          <View
            style={styles.txtInputBox}>
            <Icon name="people" size={30} color={'white'} />
            <TextInput
              style={styles.txtInput}
              placeholder=" Gender (M/F)"
              placeholderTextColor={'white'}
              value={gender}
              onChangeText={(text)=>setGender(text)}
              cursorColor={'#d0dbd3'}
            />
          </View>
          <View
            style={styles.txtInputBox}>
            <Icon name="school" size={30} color={'white'} />
            <TextInput
              style={styles.txtInput}
              placeholder=" Education"
              keyboardType="default"
              placeholderTextColor={'white'}
              value={education}
              onChangeText={(text)=>setEducation(text)}
              cursorColor={'#d0dbd3'}
            />  
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderColor: 'white',
              width: width - 80,
              marginVertical: 10,
            }}>
            <Icon name="lock-open" size={30} color={'white'} />
            <TextInput
              style={styles.txtInput}
              placeholder=" Password"
              placeholderTextColor={'white'}
              secureTextEntry={isShow?false:true}
              value={password}
              onChangeText={(text)=>setPassword(text)}
              cursorColor={'#d0dbd3'}
            />
            {/* <Icon name="remove-red-eye" size={30} color={'white'} style={{alignItems: 'flex-end'}}/> */}
            {/* <TouchableOpacity onPress={ ()=>setIsShow(!isShow) }>
              <Entypo name={isShow?"eye-with-line":"eye"} size={30} color={'white'} style={{alignItems: 'flex-end'}}/>
            </TouchableOpacity> */}
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderColor: 'white',
              width: width - 80,
              marginVertical: 10,
            }}>
            <Icon name="lock" size={30} color={'white'} />
            <TextInput
              style={styles.txtInput}
              placeholder=" Confirm Password"
              placeholderTextColor={'white'}
              secureTextEntry={isShowC?false:true}
              value={cpassword}
              onChangeText={(text)=>setCpassword(text)}
              cursorColor={'#d0dbd3'}
            />
            {/* <Icon name="remove-red-eye" size={30} color={'white'} style={{alignItems: 'flex-end'}}/> */}
            <TouchableOpacity onPress={ ()=>setIsShowC(!isShowC) }>
              <Entypo name={isShowC?"eye-with-line":"eye"} size={30} color={'white'} style={{alignItems: 'flex-end'}}/>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.btn_signup} onPress={()=>handleSignup()}>
            <Text style={{fontSize: 22, color: '#2C6AD5',fontWeight:'bold'}}>Sign Up</Text>
          </TouchableOpacity>
          
          <View style={styles.bottom}>
            <Text style={{fontSize:18,fontWeight:'bold'}}> Already user ?  </Text>
            <TouchableOpacity onPress={()=>props.navigation.replace("Login")}>
              <Text 
                style={{
                  color:"white",
                  fontSize:18,
                  fontWeight:'bold',
                  borderBottomWidth:1,
                  borderColor:"white",
                  paddingBottom:5}}>
                    Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
    </View>
    </>
  )
}

export default Register

const width = Dimensions.get('screen').width;

const styles = StyleSheet.create({
  conatainer: {
    flex: 1,
    backgroundColor: '#2C6AD5',
    // backgroundColor: 'white',
    justifyContent: 'space-around',
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
  regBox: {
    flex:1,
    // backgroundColor:"red",
    justifyContent:'flex-start',
    alignItems:'center'
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
  txtInputBox:{
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'white',
    width: width - 80,
    marginVertical: 10,
  },
  btn_signup: {
    borderWidth: 0,
    backgroundColor: 'white',
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderRadius: 50,
    marginTop: 20,
  },
  bottom:{
    flex:1,
    flexDirection:'row',
    paddingHorizontal:40,
    alignItems:'center',
    marginVertical:20
  }
})