import {ActivityIndicator, Alert,RefreshControl,ScrollView,StyleSheet,Text,TouchableOpacity,View} from 'react-native';
import React, {Fragment, useEffect, useState} from 'react';
import {Avatar,Button,Caption,Card,Divider,Paragraph,ProgressBar,Snackbar,Title} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { useNavigation } from '@react-navigation/native';
import { url } from './Services/url';

const Enroll = (props) => {
  const Navigation = useNavigation();
  const [view, setView] = useState(false);
  const [id, setId] = useState(0);
  const [courses,setCourses] = useState([]);
  const [enrolls,setEnrolls] = useState([]);
  const [refresh, setrefresh] = useState(false);
  var eid = 0

  const [visible, setVisible] = useState(false);
  const [msg, setMsg] = useState("");
  const showSnackBar = () => setVisible(true);
  const onDismissSnackBar = () => setVisible(false);

  const gotoChapter = (cid) => {
    Navigation.navigate("Chapter",{cid:cid})
  }
  const OnRefresh = async() => {
    setrefresh(true)
    await fetchCourses()
    setTimeout(() => {
      setrefresh(false);
    }, 1000);
  }

  const handleview = id => {
    setView(!view);
    setId(id);
  };

  const fetchCourses = async () => {
    try {
        const user = JSON.parse(await AsyncStorage.getItem('userLogin'));
        console.log(user._id);
        
        //  fetch  courses
        const data1 = await fetch(`${url}/fetchCourses`,{
            method:"GET",
        });
        const response = await data1.json();
        console.log(response); 
        if(response.status == "yes"){
          setCourses(response.course);
        }  


        // fetch enroll 
        const data2 = await fetch(`${url}/fetchEnroll`,{
          method:"POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            uid:user._id,
          })
        });
        const response2 = await data2.json();
        console.log(response2); 
        if(response2.status == "yes"){
          setEnrolls(response2.enroll);
        }  
        console.log(enrolls.length);
    } catch (error) {
        console.log(error);
    }
  };

  const handleRemove = async(cid) => {   
    try {
      const user = JSON.parse(await AsyncStorage.getItem('userLogin'));
      console.log(cid,user._id);

      const data = await fetch(`${url}/removeEnroll`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid:user._id,
          cid:cid
        })
      });
      const response = await data.json();
      console.log(response);  
      if(response.status == "yes"){
        setMsg(response.msg);
        showSnackBar()
        // Alert.alert("Success",response.msg);
        fetchCourses();
      }
      if(response.status == "no"){
        Alert.alert("Error",response.msg);
      }
    } 
    catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchCourses();
  },[]);

  return (
    <>
    {/* <Snackbar visible={visible} onDismiss={onDismissSnackBar}>{msg}</Snackbar> */}
    <ScrollView refreshControl={<RefreshControl refreshing={refresh} onRefresh={OnRefresh}/>}>
    {
      enrolls.length == 0 ? 
        <Card key={0} style={{borderWidth: 0, padding: 10, margin: 15, borderRadius: 20}}>
          {/* <Card.Cover source={require('./Assets/cimg/notification.png')} /> */}
          <Card.Cover source={require('./Assets/cimg/alert.png')} />
          <Card.Title subtitle='' />
          <Card.Content>
            <Title>Alert</Title>
            <Caption style={{fontSize:18,textAlign:'justify'}}>You are not enroll in any course</Caption>
          </Card.Content>
          <Card.Actions style={{justifyContent:'flex-end'}}>
            <Button style={{borderWidth: 2}} mode={"elevated"} onPress={()=>props.navigation.navigate("Courses")} >GoTo Courses</Button>
          </Card.Actions>
        </Card>
      :
      courses.map((citem,cindex) => {
        flag = 0
          enrolls.map((eitem,eindex) => {
            return(
              eitem.cid == citem._id ? <Text>{flag=1}{eid=eitem.cid}</Text> : null
            )
          })
          return(
            flag == 1 ? 
              <Fragment key={cindex}>
                <Card style={{borderWidth: 0, padding: 10, margin: 10, borderRadius: 20}}>
                  {view && id == cindex ? (
                    <Card.Cover source={{uri:citem.img}} />
                  ) : null}
                  <Card.Title
                    title={citem.cname}
                    left={() => (
                      <Avatar.Image
                        source={{uri:citem.img}}
                        size={50}
                      />
                    )}
                  />
                  <Card.Content>
                    {view && id == cindex ? (
                      <Paragraph style={{textAlign: 'justify'}}>{citem.description}</Paragraph>
                    ) : (
                      <Paragraph style={{textAlign: 'justify'}}>
                        {citem.description.substring(0,45)},...
                      </Paragraph>
                    )}
                    <TouchableOpacity onPress={() => handleview(cindex)}>
                      <Text style={{color: 'blue'}}>
                        {view && id == cindex ? 'view less...' : 'view more...'}
                      </Text>
                    </TouchableOpacity>

                    <View style={{marginTop: 10, marginBottom: 5}}>
                      <View style={{flexDirection:'row',justifyContent:"space-between",marginVertical:5}}>
                        <Text>Total Chapters : {citem.totalChapter}</Text>
                        <Text><Icon name='clock'/> : {citem.totalTime}</Text>
                      </View>
                      <Text style={{color: '#000', fontWeight: 'bold', fontSize: 15}}>
                        Rate {citem.rate} / 5
                      </Text>
                      <ProgressBar progress={citem.rate * 0.2} color={'#2C6AD5'} style={{width: '100%', borderRadius: 100}} />
                    </View>
                  </Card.Content>
                  <Card.Actions style={{justifyContent:'flex-end'}}>
                    <Button style={{borderWidth: 2}} mode={view && id==cindex ?"text":"elevated"} onPress={()=>
                      {
                        Alert.alert("Warning","Are you sure ?",[
                          { text:"YES",onPress:()=>  handleRemove(citem._id)  },
                          { text:"NO" }
                        ])
                      }
                    }>Remove</Button>

                    <Button style={{borderWidth: 2}} mode={view && id==cindex ?"text":"contained"} onPress={()=>gotoChapter(citem._id)} >
                      Start Learning
                    </Button>
                  </Card.Actions>
                </Card>  
                <Divider />       
              </Fragment> 
            : null
          )
      })
    }

    </ScrollView>
    </>
  )
}

export default Enroll

const styles = StyleSheet.create({})