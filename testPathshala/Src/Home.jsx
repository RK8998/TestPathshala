import { ScrollView, StatusBar, StyleSheet, TouchableOpacity,Alert, Modal, Text, Pressable, View, Dimensions, RefreshControl, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { DrawerActions, StackActions, useNavigation } from '@react-navigation/native'
import { Title, Button, Avatar, Provider, Portal } from 'react-native-paper'
import Icon from 'react-native-vector-icons/FontAwesome';
import { url } from './Services/url'

const {width,height} = Dimensions.get('screen');

const Home = ({navigation}) => {
  const Navigation = useNavigation();
  const [userData, setUserData] = useState({})
  const [token, setToken] = useState("");
  const [courses,setCourses] = useState([]);
  const [curcourses,setCurCourses] = useState([]);
  const [chapters,setChapters] = useState([]);
  const [enrolls,setEnrolls] = useState([]);
  const [results,setResults] = useState([]);
  const [refresh, setrefresh] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [cur, setCur] = useState(0);

  const OnRefresh = async() => {
    setrefresh(true)
    await fetchHomeData()
    setTimeout(() => {
      setrefresh(false);
    }, 1000);
  }

  const fetchData = async() => {
    setToken(await AsyncStorage.getItem('token'));
    setUserData(JSON.parse(await AsyncStorage.getItem('userLogin')));
  }

  const fetchHomeData = async () => {
    try {
        const user = JSON.parse(await AsyncStorage.getItem('userLogin'));
        console.log(user._id);
        
        //  fetch  courses
        const data = await fetch(`${url}/home`,{
            method:"POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              uid:user._id,
            })
        });
        const response = await data.json();
        console.log(response.chapters); 
        if(response.status == "yes"){
          setCourses(response.courses);
          setCurCourses(response.courses[0])
          setChapters(response.chapters);
          setEnrolls(response.enrolls)
          setResults(response.results)
        }  
    } catch (error) {
        console.log(error);
    }
  };

  const handleCourseClick = (index) => {
    setCurCourses(courses[index]);
  }

  const handleview = id => {
    setIsOpen(!isOpen); 
    setCur(id);
  }

  useEffect(() => {
    fetchData();
    fetchHomeData();
  },[]);

  return (
    <>
      <View style={styles.conatainer}>
        <ScrollView refreshControl={<RefreshControl refreshing={refresh} onRefresh={OnRefresh}/>}>
        {/* Courses View Start */}

        <View style={styles.courseView}>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <Title style={{fontWeight:'bold', margin: 5}}>Courses</Title>
            <Button onPress={() => navigation.dispatch(DrawerActions.jumpTo('Course'))}>See all...</Button>
          </View>
          <ScrollView horizontal={true} style={{marginBottom: 1}} showsHorizontalScrollIndicator={false}>
            {
              courses.map((course,index) => {
                return(
                  <TouchableOpacity style={[styles.courseBox, {backgroundColor:curcourses._id==course._id?"black":"white"} ]} 
                      onPress={() => handleCourseClick(index)} key={course._id}>
                    <Title style={{color:curcourses._id==course._id?"white":'black'}}>{course.cname}</Title>
                  </TouchableOpacity>
                )
              })
            }
          </ScrollView>
        </View>
        {/* Courses View End */}

        {/* Perview Start */}
        <View style={styles.perview}>
            <View style={{flexDirection:'row',justifyContent:'space-between', marginHorizontal:16}}>
              <Title style={{margin: 0, fontWeight: 'bold', marginTop: 10}}>Preview</Title>
              <Icon name={'long-arrow-right'} size={25} style={{marginTop:1}}/>
            </View>
    
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

              <View style={styles.perviewBox}>
                <View style={{flexDirection:'row',justifyContent:'space-between', marginHorizontal:20,marginTop:20}}>
                  <Title style={{fontSize: 30,fontWeight:'500', marginTop: 10, color:'white'}}>{curcourses.cname}</Title>
                  <Avatar.Image source={{uri:curcourses.img}} size={50}/>
                </View>
                <View style={{marginHorizontal:20,flexDirection:'row',}}>
                  <Icon name='star' size={18} color={'white'} />
                  <Text style={{fontWeight:'bold',color:'white'}}>  {curcourses.rate}.0</Text>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:10,marginVertical:70,backgroundColor:'#fff',borderRadius:10,padding:10}}>
                  <Title style={{fontWeight:'500'}}>{curcourses.totalChapter} Chapters</Title>
                  <Title style={{fontWeight:'500', fontSize:50}}>.</Title>
                  <Title style={{fontWeight:'500'}}>{curcourses.totalTime} : 00 min</Title>
                </View>
              </View>

              <View style={styles.perviewBox}>
                <View style={{flexDirection:'row',justifyContent:'space-between', marginHorizontal:20,marginTop:20}}>
                  <Title style={{fontSize: 20,fontWeight:'500', marginTop: 0, color:'white'}}>Chapters</Title>
                </View>

                <ScrollView showsVerticalScrollIndicator={true}>
                  {
                    chapters.map((chapter,index=no) => {
                      return(
                        <>
                          {
                            chapter.cid == curcourses._id?
                            <View style={{borderBottomWidth:1,borderBottomColor:'#fff',marginTop:5,marginBottom:7,marginLeft:10}} key={chapter._id}>
                              <Title style={{color:'#fff'}}>{chapter.chname}</Title>
                            </View>
                            : null
                          }
                        </>
                      )
                    })
                  }
                </ScrollView>

              </View>

          </ScrollView>
        </View>
        {/* Perview End */}

        {/* Your Enrolls Start */}
        <View style={styles.yourEnrolls}>
            <View style={{flexDirection:'row',justifyContent:'space-between', marginHorizontal:16}}>
              <Title style={{margin: 0, fontWeight: 'bold', marginTop: 10}}>Your Enrolls</Title>
            </View>
            <View style={{justifyContent:'center', alignItems: 'center'}}>
              
              {
                !enrolls.length ?
                <View style={{width:width-20,height:'auto',padding:20,marginVertical:10}}>
                  <Text style={{fontSize:18,textAlign: 'center'}}>Not in enroll</Text>
                  <TouchableOpacity style={{backgroundColor:'black',padding:10,marginTop:20}} onPress={() => Navigation.navigate('Course')}> 
                    <Text style={{color:'white',fontWeight:'normal',textAlign:'center'}}>Go For Enroll</Text>
                  </TouchableOpacity>
                </View>
                :
                  courses.map((course) => {
                    return(
                      enrolls.map((enroll,index) => {
                        return(
                          course._id == enroll.cid? 
                          <>
                          <ScrollView>
                          <View style={styles.enrollBox}>
                            <View style={{flexDirection:'row',justifyContent:'space-between',margin:5,marginHorizontal:15}}>
                              <Title style={{fontWeight:'500'}}>{course.cname}</Title>
                              <TouchableOpacity onPress={() => handleview(index) }>
                                <Icon name={isOpen && index == cur ? 'angle-up':'angle-down'} size={30} style={{marginTop:5,fontWeight:'bold',color:'grey'}}/>
                              </TouchableOpacity>
                            </View>
                            {
                              isOpen && index == cur ? 
                              chapters.map((chapter) => {
                                return(
                                  chapter.cid == course._id ? 
                                  <>
                                  <View>
                                    <View style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:15,}}>
                                      <Title style={{fontSize:18}}>{chapter.chname}</Title>
                                      <Text>{flag = true}</Text>
                                      {
                                        results.map((result) => {
                                          result.chid == chapter._id && userData._id == result.uid ? flag = false:null
                                        })
                                      }
                                      {
                                        flag?
                                        <Icon name='close' size={18} style={{marginTop:7,fontWeight:'bold',color:'red'}}/>
                                        :
                                        <Icon name='check' size={18} style={{marginTop:7,fontWeight:'bold',color:'green'}}/>
                                        
                                      }
                                    </View>
                                  </View>
                                  </>
                                  :null
                                )
                              })
                            
                            :null
                            }
                          </View>
                          </ScrollView>
                          </>
                          :null
                        )
                      })
                    )
                  })
                
              }

            </View>
        </View>
        {/* Your Enrolls end */}

        </ScrollView>
      </View>
    </>
  )
}

export default Home

const styles = StyleSheet.create({
  conatainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  rotateBox:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  courseView: {
    flex: 0.12,
    backgroundColor: 'white',
    marginHorizontal: 5,
    marginVertical: 0,
    paddingHorizontal: 5,
  },
  courseBox: {
    borderWidth: 1,
    marginHorizontal: 5,
    paddingHorizontal: 7,
    borderRadius: 7,
    marginVertical: 3,
    height: 38,
  },
  perview: {
    flex: 0.45,
    backgroundColor: 'white',
    marginTop:10,
    // justifyContent: 'center'
  },
  perviewBox: {
    // flex: 1,
    height:250,
    width:width - 35,
    borderWidth: 0,
    borderRadius: 20,
    backgroundColor: '#2C6AD5',
    margin: 18,
    paddingHorizontal: 10,
    borderRightWidth: 8,
    borderLeftWidth:1,borderBottomWidth: 8,borderColor: '#224294',elevation:30,shadowColor: 'rgba(0, 0, 0, 0.4)',
                  shadowOpacity: 0.8,elevation: 30,shadowRadius: 30,shadowOffset : { width: 20, height: 70}
  },
  yourEnrolls: {
    flex: 0.43,
    backgroundColor: 'white',
    marginTop:10,
  },
  enrollBox: {
    backgroundColor: 'white',width:width-20,height:'auto',borderRadius:10,borderWidth:1,marginVertical:10
  },
})