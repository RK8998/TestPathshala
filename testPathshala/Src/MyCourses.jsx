import {ActivityIndicator,Alert,RefreshControl,ScrollView,StyleSheet,Text,TouchableOpacity,View} from 'react-native';
import React, {Fragment, useEffect, useState} from 'react';
import {Avatar,Button,Caption,Card,Divider,Paragraph,ProgressBar,Snackbar,Title} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { url } from './Services/url';
import Icon from 'react-native-vector-icons/FontAwesome5';

const MyCourses = (props) => {
  const [view, setView] = useState(false);
  const [id, setId] = useState(0);
  const [courses,setCourses] = useState([]);
  const [enrolls,setEnrolls] = useState([]);
  var enrCount = 0;
  const [refresh, setrefresh] = useState(false);

  const [visible, setVisible] = useState(false);
  const [msg, setMsg] = useState("");
  const showSnackBar = () => setVisible(true);
  const onDismissSnackBar = () => setVisible(false);

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

  const handleEnroll = async(cid) => {    
    try {
      const user = JSON.parse(await AsyncStorage.getItem('userLogin'));
      console.log(cid,user._id);

      const data = await fetch(`${url}/insertEnroll`,{
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
    <View style={{flex:1,justifyContent:'center'}}>
    <Snackbar visible={visible} onDismiss={onDismissSnackBar}>{msg}</Snackbar>
      <ScrollView refreshControl={<RefreshControl refreshing={refresh} onRefresh={OnRefresh}/>}>
        {
          courses.length == 0 ?
            <View>
              <ActivityIndicator size={50} color='blue' />
            </View>
          :null
        }
        {
          enrolls.length > 0 ?
            courses.map((citem,cindex) => {
              flag = 0
                enrolls.map((eitem,eindex) => {
                  return(
                    citem._id == eitem.cid ? <Text>{flag = 1}{enrCount+=1}</Text>:null
                  )
                })
              return(
                enrCount == courses.length ? 
                    <>
                      <View key={0}>
                        <Card style={{borderWidth: 0, padding: 10, margin: 15, borderRadius: 20}}>
                        <Card.Cover source={require('./Assets/cimg/alert.png')} />
                        {/* <Card.Title subtitle='go for enroll and get extra benifit with courses' /> */}
                        <Card.Content>
                          <Title>Alert</Title>
                          <Caption style={{fontSize:18,textAlign:'justify'}}>You are enroll in all course</Caption>
                        </Card.Content>
                        <Card.Actions style={{justifyContent:'flex-end'}}>
                          <Button style={{borderWidth: 2}} mode={"elevated"} onPress={()=>props.navigation.navigate("Enrolled")} >GoTo Enrolled</Button>
                        </Card.Actions>
                      </Card>
                      </View>
                    </>
                :
                flag == 0 ? 
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
                        <Button style={{borderWidth: 2}} mode={view && id==cindex ?"text":"elevated"} 
                        onPress={()=>handleEnroll(citem._id)}>Enroll</Button>
                      </Card.Actions>
                    </Card>
                    <Divider />        
                  </Fragment> 
                : null
              )
            })
          :
            courses.map((citem,cindex) => {
              return(
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
                      <Button style={{borderWidth: 2}} mode={view && id==cindex ?"text":"elevated"} 
                      onPress={()=>handleEnroll(citem._id)}>Enroll</Button>
                    </Card.Actions>
                  </Card>  
                  <Divider />      
                </Fragment> 
              )
            })
        }
      </ScrollView>
      </View>
    </>
  );
};

export default MyCourses;

const styles = StyleSheet.create({
  errBox:{
    borderWidth:1,
    padding:20,
    borderRadius:10,
    marginVertical:20
  }
});
