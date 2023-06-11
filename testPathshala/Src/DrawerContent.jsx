import {Share, StyleSheet, Text, View} from 'react-native';
import React, { useEffect, useState } from 'react';
import { DrawerContentScrollView} from '@react-navigation/drawer';
import { Avatar,Title,Drawer,Switch } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackActions, useNavigation } from '@react-navigation/native';

const DrawerContent = (props) => {
  const Navigation = useNavigation();
  const [active, setActive] = useState('');
  const [user, setUser] = useState({})
  const [token, setToken] = useState("");

  const handleClick = value => {
    setActive(value);
    props.navigation.navigate(value);
  }
  const handleLogout = async() => {
    await AsyncStorage.clear();
    Navigation.dispatch(StackActions.replace('Login'));
  }

  const fetchData = async() => {
    setToken(await AsyncStorage.getItem('token'));
    setUser(JSON.parse(await AsyncStorage.getItem('userLogin')));
  }

  const ShareMessage = () => {
    Share.share({
        message: `Download Test Pathshala. \n\nApp Link: https://drive.google.com/file/d/13KA_2raZNcUmwSz6kJm7sJr5XNEQVrLl/view?usp=sharing 
        \n\nTest Pathshala is a mobile application developed by SCET Student to provide online video learning services to the student. The core idea of this app is to engage student in learning by themselves. The distance learning app is the most convenient type of personal learning. The online courses are already created. So, one can start using them almost right away. You can learn at your own pace and at your convenience. It is one of the significant advantages of this app. 
        \n\nDeveloped by: Krushang Rathod | Jay Virani | Saloni Tailor  
        \nEmail: testpathshala@gmail.com`,

        url:"../Assets/Logo/Logo.png"
        // url: 'https://drive.google.com/file/d/1CH0AuHqCbooV2hJxrL3HOVSKmmuDAmac/view?usp=sharing',

    })
    .then((result) => console.log(result))
    .catch((errorMsg) => console.log(errorMsg));
}


  useEffect(() => {
    fetchData();
  },[]);

  return (
    <View style={styles.container}>
      <View style={{ flex: 0.53,backgroundColor: '#2C6AD5',borderBottomRightRadius: 20,borderBottomLeftRadius: 20}}>
        <View style={{ paddingTop: 25,justifyContent: 'space-between',marginHorizontal: 20,flexDirection:'row' }}>
          {
            user.gender == "M" ? 
            <Avatar.Image size={100} source={require('./Assets/img/male.jpeg')} />
            :
            <Avatar.Image size={100} source={require('./Assets/img/female.jpeg')} />
          }
          <Text style={{fontSize:30,color:'#fff',marginHorizontal:30,marginVertical:30,borderBottomColor:'#fff',borderBottomWidth:2}}>
            {user.education}
          </Text>
        </View>
        <View style={{ paddingVertical: 20,justifyContent: 'flex-start',marginHorizontal: 20 }}>
          {
            user.name == "" ? 
            <Title style={{color: 'lightgray', fontSize: 25}}>Your Name</Title> 
            : 
            <Title style={{color: '#fff', fontSize: 25}}>{user.name}</Title> 
          }
          <Title style={{color: '#fff', fontSize: 15,paddingLeft:1}}>{user.email}</Title>
        </View>
      </View>

      <DrawerContentScrollView>
        <Drawer.Section>
          <Drawer.Item
            label="Profile"
            style={{paddingLeft: 5}}
            active={active === 'Profile'}
            onPress={() => handleClick('Profile')}
            icon={() => <Icon name="user-graduate" size={25} />}
          />
          <Drawer.Item
            label="Home"
            active={active === 'Home'}
            onPress={() => handleClick('Home')}
            icon={() => <Icon name="home" size={25} />}
          />
          <Drawer.Item
            label="Course"
            active={active === 'Course'}
            onPress={() => handleClick('Course')}
            icon={() => <Icon name="graduation-cap" size={25} />}
          />
          <Drawer.Item
            label="About us"
            style={{paddingLeft: 5}}
            active={active === 'About'}
            onPress={() => handleClick('About')}
            icon={() => <Icon name="info-circle" size={25} />}
          />
        </Drawer.Section>
      </DrawerContentScrollView>

      <Drawer.Section>
        <Drawer.Item
          label="Query Solver"
          onPress={() => handleClick('Forums')}
          icon={() => <Icon name="comment-dots" size={20} />}
        />
        <Drawer.Item
          label="Share"
          onPress={() =>ShareMessage()}
          icon={() => <Icon name="share-alt" size={20} />}
        />
        <Drawer.Item
          label="Logout"
          onPress={() => handleLogout()}
          icon={() => <Icon name="sign-out-alt" size={20} />}
        />
      </Drawer.Section>
    </View>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor:'red'
  },
});
