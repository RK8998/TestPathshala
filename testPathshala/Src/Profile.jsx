import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, StackActions } from '@react-navigation/native';
import { Avatar,TextInput,Button, Snackbar,Switch } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from './Services/url';

const Profile = (props) => {
  const Navigation = useNavigation();
  const [isSwitch, setisSwitch] = useState(false);

  const [id, setID] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [education, setEducation] = useState("");
  const [gender, setGender] = useState("");
  
  const [visible, setVisible] = useState(false);
  const [msg, setMsg] = useState("");
  const showSnackBar = () => setVisible(true);
  const onDismissSnackBar = () => setVisible(false);

  const fetchData = async() => {
    const user = JSON.parse(await AsyncStorage.getItem('userLogin'));
    setID(user._id);
    setName(user.name);
    setEmail(user.email);
    setMobile(JSON.stringify(user.mobile));
    setEducation(user.education);
    setGender(user.gender);
  }

  const handleUpdateProfile = async() => {
    console.log(id,name,email,mobile,education);
    
    let regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    try {
      if(!name || !email || !mobile || !education){
        setMsg("Please fill all the details");
        showSnackBar()
      }
      else if(regEmail.test(email) === false){
        setMsg("Please enter valid email");
        showSnackBar()
      }
      else if(mobile.length != 10){
        setMsg("Mobile number must be 10 digit");
        showSnackBar()
      }
      else{
        Alert.alert("Warning","Are you sure ?",[
          
          {
            text:"Yes",
            onPress:async()=>{
                const data = await fetch(`${url}/updateProfile`,{
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  id:id,
                  name:name,
                  email:email,
                  mobile:mobile,
                  education:education
                })
              });
              const response = await data.json();
              console.log(response);  
              if(response.status == "yes"){
                setMsg(response.msg);
                Alert.alert('Success',response.msg+`\n[You have to login again]`,[
                  { text:"OK", 
                    onPress:()=>{
                      Navigation.dispatch(StackActions.replace("Login"));
                    }
                  }
                ]);
              }
              if(response.status == "no"){
                setMsg(response.msg);
                showSnackBar()
              }
            }
          },
          {
            text:"No",
          }
        ])
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  },[]);

  useEffect(() => {
    if(visible){
      setTimeout(() => {
        onDismissSnackBar()
      }, 1800);
    }
  }, [visible])
  return (
    <>
    <View style={styles.conatainer}>
      <View style={{flex:0.3,justifyContent: 'center',alignItems:'center',backgroundColor:'#fff'}}>
        <View style={{}}>
            {
              gender == "M" ? 
              <Avatar.Image size={185} source={require('./Assets/img/male.jpeg')} />
              : null
            }{
              gender == "F" ?
              <Avatar.Image size={185} source={require('./Assets/img/female.jpeg')} />
              : null
            }
          </View>
      </View>
      <View style={{flex:0.7, backgroundColor:'#fff'}}>
      <Snackbar visible={visible} onDismiss={onDismissSnackBar}>{msg}</Snackbar>
        <ScrollView>
          <View style={{marginHorizontal:10,marginVertical:15}}>
            <Switch value={isSwitch} onChange={()=>setisSwitch(!isSwitch)}/>
          </View>
          <View style={{marginHorizontal:20,marginVertical:15}}>
            <TextInput label="Name" mode="outlined" value={name} onChangeText={(text)=>setName(text)} disabled={isSwitch ? false : true} />
          </View>
          <View style={{marginHorizontal:20,marginVertical:15}}>
            <TextInput label="Education" mode="outlined" value={education} onChangeText={(text)=>setEducation(text)} disabled={isSwitch ? false : true} />
          </View>
          <View style={{marginHorizontal:20,marginVertical:15}}>
            <TextInput label="Email" mode="outlined" value={email} onChangeText={(text)=>setEmail(text)} disabled={isSwitch ? false : true} />
          </View>
          <View style={{marginHorizontal:20,marginVertical:15}}>
            <TextInput label="Contact" mode="outlined" keyboardType='numeric' value={mobile} onChangeText={(text)=>setMobile(text)} disabled={isSwitch ? false : true} />
          </View>
          
          <View style={{margin:20}}>
            <Button icon="pen" mode="text" onPress={()=>handleUpdateProfile()} disabled={isSwitch ? false : true}>UPDATE PROFILE</Button>
          </View>
        </ScrollView>
      </View>
    </View>
    </>
  )
}

export default Profile

const styles = StyleSheet.create({
    conatainer: {
      flex: 1,
      // backgroundColor: '#2C6AD5',
      // backgroundColor: 'white',
      // justifyContent: 'space-around',
    },
})