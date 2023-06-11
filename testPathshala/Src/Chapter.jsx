import {Alert, Dimensions, Modal, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View, Pressable, Image,} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import YoutubePlayer from 'react-native-youtube-iframe';
import { ActivityIndicator, Appbar, Avatar, Button, Caption, Card, Paragraph, Title } from 'react-native-paper';
import ReanimatedBottomsheet from 'react-native-reanimated-bottomsheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import { StackActions, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from './Services/url';

const {height, width} = Dimensions.get('screen');

const Chapter = (props) => {
  const Navigation = useNavigation();
  // for course id
  const cid = props.route.params.cid;
  console.log(cid);
  // for video 
  const [playing, setPlaying] = useState(false);
  // for chapters
  const [course, setCourse] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chno, setchno] = useState(1);
  const [ChapterWiseResult,setChapterWiseResult] = useState([]);
  // for bottom sheet
  const bottomSheetRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // for modal
  const [modalVisible, setModalVisible] = useState(false);

  // for test data
  const [test, setTest] = useState([]);

  const fetchChapters = async() => {
    try {
      const data = await fetch(`${url}/fetchChapters`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cid:cid
        })
      });
      const response = await data.json();
      console.log(response);  
      if(response.status == "yes"){
        setCourse(response.course);
        setChapters(response.chapters)
        setCurrentChapter(response.chapters[0]);
        setCurrentIndex(0);
        fetchChapterWiseResult();
      }
      if(response.status == "no"){
        Alert.alert("Error",response.msg);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onStateChange = state => {
    if (state === 'ended') {
      setPlaying(false);
      handleTestButton();  
    }
    // if (state === 'playing') {
    //   setPlaying(true);
    // }
  };

  
  const handleBottomSheet = (snap,bool) => {
    bottomSheetRef.current.snapTo(snap);
    setIsOpen(bool);
  }
  
  const handleChangeChapter = (i) => {
    console.log(chapters[i]);
    setCurrentChapter(chapters[i]);
    setCurrentIndex(i);
    setchno(i+1);
    setPlaying(true);
  }

  const [refresh, setrefresh] = useState(false);

  const OnRefresh = async() => {
    setrefresh(true)
    await fetchChapters();
    setTimeout(() => {
      setrefresh(false);
    }, 1000);
  }

  const handleStartTest = ()=>{
    setModalVisible(!modalVisible);
    Navigation.navigate('Test',{cid:cid,chid:currentChapter._id,chno:chno});
  }

  const handleTestButton = async() => {
    setModalVisible(true);
    console.log("cid : "+cid);
    console.log("chid : "+currentChapter._id);
    try {
      const data = await fetch(`${url}/getTest`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cid:cid,
          chid:currentChapter._id
        })
      });
      const response = await data.json();
      console.log(response.test[0]);  
      if(response.status == "yes"){
        setTest(response.test[0]);
      }
      if(response.status == "no"){
        Alert.alert("Error",response.msg);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchChapterWiseResult = async() => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('userLogin'));
      console.log(user._id);

      const data = await fetch(`${url}/fetchChapterWiseResult`,{
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
      console.log(response.data);  
      if(response.status == "yes"){
        setChapterWiseResult(response.data)
      }
      if(response.status == "no"){
        Alert.alert("Error",response.msg);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchChapters();
    fetchChapterWiseResult();
  },[cid]);

  return (
    <>
      <View style={styles.container}>
        <View>
          <Modal animationType="slide" transparent={true} visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Avatar.Image source={require("./Assets/img/pencile_boy.jpg")} size={175} />
                <Title style={styles.modalText}>{test.tname}</Title>
                <View style={{marginVertical: 10}}>
                  <Caption style={{fontSize: 18,fontWeight: 'bold'}}>Time : {test.totaltime} Minutes</Caption>
                  <Caption style={{fontSize: 18,fontWeight: 'bold'}}>Total Marks : {test.totalmarks}</Caption>
                </View>
                <Pressable style={[styles.button, styles.buttonClose]} onPress={() => handleStartTest()}>
                  <Text style={styles.textStyle}>START</Text>
                </Pressable>
                <Pressable style={[styles.button, styles.buttonClose, {backgroundColor: 'black'}]} onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>CANCLE</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </View>
        {
          course.length == 0 ? null :
          <Appbar.Header>
            <Appbar.BackAction onPress={() => Navigation.navigate("Enrolled")} />
            <Appbar.Content title={course[0].cname} style={{color:'black',fontWeight:'bold'}} />
            <TouchableOpacity style={{backgroundColor:'#BCCEF8',marginHorizontal:5,paddingVertical:5,paddingHorizontal:5,borderRadius:3}}
            onPress={()=>Navigation.navigate("CheckOutResult",{cid:cid})}>
              <Icon name='list' size={20} />
              <Text style={{fontSize:10,color:'black'}}>Result</Text>
            </TouchableOpacity>
          </Appbar.Header>
        }
        {/* <ScrollView> */}
          {
            currentChapter?
            <>
              <View>
                <YoutubePlayer
                  height={230}
                  play={playing}
                  videoId={currentChapter.link}
                  useLocalHTML={true}
                  playbackRate={1}
                  onChangeState={onStateChange}
                />
              </View>
              <View style={styles.ContentBox}>
                <Card style={{borderWidth: 0, padding: 0, borderRadius: 20}}>
                  <Card.Content>
                    <Title style={{fontWeight:'bold',marginBottom:10}}>Chapter {chno} | {currentChapter.chname}</Title>
                    <Paragraph style={{textAlign:"left",fontWeight:'500'}}>{currentChapter.title}</Paragraph>
                    <Paragraph style={{textAlign:'justify'}}>{currentChapter.description}</Paragraph>
                  </Card.Content>
                  <Card.Actions>
                  <Text>{flag = true}</Text>
                    {
                      ChapterWiseResult.map((row)=>{
                        currentChapter._id === row.chid ? flag = false : null     
                      })
                    }
                    {
                      flag ? <Button icon={'pen'} mode={'outlined'} onPress={()=>handleTestButton()}>Start Test</Button> : 
                      <Button mode={'text'} >You Already give test</Button>
                    }
                  </Card.Actions>
                </Card>
              </View>
              </>
            :
            null
          }
        
        {/* </ScrollView> */}
        
        <ReanimatedBottomsheet
          ref={bottomSheetRef}
          enabledGestureInteraction={true}
          snapPoints={[40, 180, height-330 ,height-100]}
          initialSnap={1}
          renderHeader={() => {
            return (
              <View style={{alignItems: 'center',backgroundColor: 'black',paddingVertical: 0,borderTopLeftRadius:15,borderTopRightRadius:15}}>
                <View>
                  <TouchableOpacity style={{backgroundColor:'black',paddingHorizontal:30}} onPress={() => {
                      !isOpen ? handleBottomSheet(2,true) : handleBottomSheet(1,false) }} >
                    <Icon name={isOpen ? "caret-down" : "caret-up"} color={'white'} size={30}/>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          renderContent={() => {
            return(
              <View style={{backgroundColor:'black',height:'100%',flex:1}}>
                <ScrollView refreshControl={<RefreshControl refreshing={refresh} onRefresh={OnRefresh}/>}>
                {
                  chapters.map((item,index) => {
                    return(
                      <TouchableOpacity style={{flexDirection:'row',borderWidth:2,borderColor:'#fff',
                        padding:15,marginHorizontal:5,marginVertical:10,borderRadius:15}} key={index} onPress={()=>handleChangeChapter(index)}>
                        <View style={{width:'50%'}}>
                          <YoutubePlayer height={100} play={false} videoId={item.link} useLocalHTML={true} playbackRate={1} />  
                        </View>
                        <View style={{width:'60%'}}>
                          <Text style={{color:'#fff',fontSize:18,marginLeft:10}}>Chapter {index+1} |</Text>
                          <Text style={{color:'#fff',fontSize:18,marginLeft:10}}>{item.chname}</Text>
                        </View>
                      </TouchableOpacity>
                    )
                  })
                }
                </ScrollView>       
              </View>
            )
          }}
        />
      </View>
    </>
  );
};

export default Chapter;

const styles = StyleSheet.create({
  container:{
    flex:1,
    // backgroundColor: 'transparent'
  },
  ContentBox:{
    marginHorizontal:8,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingHorizontal:20
  },
  button: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 10,
    marginTop:10
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: 'bold',
    color: 'black',
    borderBottomWidth: 2,
    borderRadius: 75,
  }
});
