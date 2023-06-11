import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React,{useState} from 'react';
import logo from '../Assets/img/Logo.png';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo'

const Login = props => {
  const handleNavigation = screen => {
    props.navigation.navigate(screen);
  };

  const [isShow, setIsShow] = useState(false);

  return (
    <>
      <View style={styles.conatainer}>
        <View style={styles.top}>
          <View style={styles.logoBox}>
            <Image source={logo} style={styles.logo} />
          </View>
          <Text
            style={{
              fontSize: 25,
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              marginTop: 10,
            }}>
            PATHSHALA
          </Text>
        </View>
            
        <View style={styles.middle}>
          <Text style={{fontSize: 25, color: 'white', fontWeight: 'normal'}}>
            LOGIN
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderColor: 'white',
              width: width - 80,
              marginVertical: 10,
            }}>
            <Icon name="smartphone" size={30} color={'white'} />
            <TextInput
              style={styles.txtInput}
              placeholder="Mobile"
              keyboardType="numeric"
              placeholderTextColor={'white'}
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
              placeholder="Password"
              placeholderTextColor={'white'}
              secureTextEntry={isShow?false:true}
            />
            <TouchableOpacity onPress={ ()=>setIsShow(!isShow) }>
              <Entypo name={isShow?"eye-with-line":"eye"} size={30} color={'white'} style={{alignItems: 'flex-end'}}/>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={{alignSelf: 'flex-end', marginRight: 40}}>
            <Text style={{color: 'white'}}>Forgot Password ?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn_login}>
            <Text style={{fontSize: 22, color: '#2C6AD5',fontWeight:'bold'}}>Sign</Text>
          </TouchableOpacity>
        </View>

        
        <View style={styles.bottom}>
          <Text style={{fontSize: 15, color: 'white'}}>New User ?</Text>
          <TouchableOpacity
            style={styles.btn_signup}
            onPress={() => handleNavigation('Register')}>
            <Text style={{fontSize: 18, color: 'white'}}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        
      </View>
    </> 
  );
};

export default Login;

const width = Dimensions.get('screen').width;

const styles = StyleSheet.create({
  conatainer: {
    flex: 1,
    backgroundColor: '#2C6AD5',
    // backgroundColor: 'white',
    justifyContent: 'space-around',
  },
  top: {
    flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'center',
  },
  middle: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  btn_signup: {
    borderWidth: 2,
    borderColor: 'white',
    paddingHorizontal: 80,
    paddingVertical: 10,
    marginVertical: 20,
    borderRadius: 50,
  },
  btn_login: {
    borderWidth: 0,
    backgroundColor: 'white',
    paddingHorizontal: 50,
    paddingVertical: 10,
    borderRadius: 50,
    marginTop: 20,
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
});
