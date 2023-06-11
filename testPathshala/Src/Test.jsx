import {Alert,Dimensions,Image,StatusBar,StyleSheet,View,BackHandler, ScrollView, TouchableOpacity, Pressable} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import { Modal, Portal, Text, Button, Provider, Avatar, Title, Caption, RadioButton, ActivityIndicator } from 'react-native-paper';
import ReanimatedBottomsheet from 'react-native-reanimated-bottomsheet';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { url } from './Services/url';
import { StackActions, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BackgroundTimer from "react-native-background-timer"

const {height,width} = Dimensions.get('screen');

const Test = (props) => {
  const Navigation = useNavigation();

  const cid = props.route.params.cid;
  const chid = props.route.params.chid;
  const chno = props.route.params.chno;
  // console.log("cid : "+cid);
  // console.log("chid : "+chid);
  // console.log("chno : "+chno);

  const [IsRotate, setIsRotate] = useState(false);
  const [value, setValue] = React.useState('');
  const bottomSheetRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // for modal
  const [modalVisible, setModalVisible] = useState(true);

// -------------------------------------------------------------------------------------------------

  // for test data
  const [test, setTest] = useState([]);
  const [question, setQuestion] = useState([]);
  const [curQuestion, setCurQuestion] = useState([]);
  const [curIndex, setCurIndex] = useState(0);
  const [storeAnswer,setStoreAnswer] = useState([]);
  const [isFinalSubmit, setisFinalSubmit] = useState(false);
  const [obtainedMarks, setObtainedMarks] = useState(0)
  const [percentage, setPercentage] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(1200);
  const [timerOn, setTimerOn] = useState(false);

  const fetchTestData = async() => {
    try {
      const data = await fetch(`${url}/getTest`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cid:cid,
          chid:chid
        })
      });
      const response = await data.json();
      // console.log(response.test[0]);  
      if(response.status == "yes"){
        setTest(response.test[0]);
        var sec = response.test[0].totaltime * 60
        setSecondsLeft(sec);       
      }
      if(response.status == "no"){
        Alert.alert("Error",response.msg);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchQuestionData = async() => {
    try {
      console.log("fetchQuestionData");
      const data2 = await fetch(`${url}/getQuestions`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tid:test._id
        })
      });
      const response2 = await data2.json();
      // console.log(response2.question);
      if(response2.status == "yes"){
        setQuestion(response2.question)
        setCurQuestion(response2.question[curIndex]);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleNext = async(i) => {
    if(i < question.length){
      console.log(i);
      setCurIndex(i);
      console.log(question[i]);
      setCurQuestion(question[i]);
    }else{
      console.log(question.length-1);
      console.log(question[question.length-1]);
      setCurIndex(question.length-1);
      setCurQuestion(question[question.length-1]);
    }
  }

  const handlePrev = async(i,testId) => {
    if(i >= 0){
      console.log(i);
      setCurIndex(i);
      console.log(question[i]);
      setCurQuestion(question[i]);
    }else{
      console.log(0);
      console.log(question[0]);
      setCurIndex(0);
      setCurQuestion(question[0]);
    }
  }

  const handleSetRadio = () => {
    flag = true;
    temp = ""
    storeAnswer.map((row)=>{
      row.Qid == curQuestion._id ? 
        temp = row.value
      : flag = false
    })
    if(!flag){ setValue(temp) }
    else{ setValue('') }
  }

  useEffect(() => {
    handleSetRadio()
  }, [curQuestion])
  
  const handleSubmit = () => {
    console.log('handleSubmitANswer '+value);
    console.log(curQuestion._id);
    const data = {
      Qid : curQuestion._id,
      value : value
    }
    setStoreAnswer(old => [...old,data]);
    // var float = 0;

    // if(storeAnswer.length != 0){
    //   storeAnswer.map((data)=>{
    //     if(curQuestion._id === data.Qid){
    //       float = 1;
    //     }
    //   })
    //   if(float == 0){
    //     setStoreAnswer(old => [...old,data]);  
    //   }
    // }else{
    //   setStoreAnswer(old => [...old,data]);
    // }

    handleNext(curIndex+1)
  }

  const handleFinalSubmit = () => {
    Alert.alert("Warning","Are you sure to want to submit..?",[
      { 
        text:"YES",
        onPress:()=>{
          // setisFinalSubmit(true);
          calculateMarks();
        }
      },
      { text:"NO" }
    ])
  }

  const calculateMarks = async() => {
    setisFinalSubmit(true);
    var mark = 0;
    question.map((q,i)=>{
      storeAnswer.map((ans)=>{
        if(q._id === ans.Qid){
          console.log(q.answer+" - "+ans.value);
          if(q.answer === ans.value){
            mark += 1;
          }
        }
      })
    })
    console.log(mark);
    per = mark * 100 / test.totalmarks;
    await setObtainedMarks(mark);
    await setPercentage(per);
    storeResult(mark,per);
  } 

  const storeResult = async(marks,percentage) => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('userLogin'));
      console.log(user._id);

      console.log("storeResult");
      const data = await fetch(`${url}/storeResult`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid:user._id,
          cid:cid,
          chid:chid,
          tid:test._id,
          marks:marks,
          totalmarks:test.totalmarks,
          percentage:percentage
        })
      });
      const response = await data.json();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

// -------------------------------------------------------------------------------------------------

  const handleBottomSheet = (snap,bool) => {
    bottomSheetRef.current.snapTo(snap);
    setIsOpen(bool);
  }

  useEffect(() => {  
    // ---------------------
    fetchTestData();
    fetchQuestionData();
    // ---------------------

    Dimensions.addEventListener("change", ()=>{
      const {height,width} = Dimensions.get('screen');
      setIsRotate(height>width ? false : true);
    });
    const backHandle = BackHandler.addEventListener('hardwareBackPress',() => true)
    return () => backHandle.remove()
  }, []);
  
  // Timer code start

  
  useEffect(() => {
    if (timerOn) startTimer();
    else BackgroundTimer.stopBackgroundTimer();
    return () => {
      BackgroundTimer.stopBackgroundTimer();
    };
  }, [timerOn]);

  useEffect(() => {
    if (secondsLeft === 0) {
      BackgroundTimer.stopBackgroundTimer()
      calculateMarks();
    }
  }, [secondsLeft])
  
  const startTimer = () => {
    BackgroundTimer.runBackgroundTimer(() => {
      setSecondsLeft(secs => {
        if (secs > 0) return secs - 1
        else return 0
      })
    }, 1000)
  }
  const clockify = () => {
    let mins = Math.floor((secondsLeft / 60) % 60)
    let seconds = Math.floor(secondsLeft % 60)
    let displayMins = mins < 10 ? `0${mins}` : mins
    let displaySecs = seconds < 10 ? `0${seconds}` : seconds
    return {
      displayMins,
      displaySecs,
    }
  }
// Timer code end

  return (
    <>
      <StatusBar hidden={true} />
      <View style={{flex:1}}>
        {
          IsRotate ? 
          <View style={{flex:1,marginHorizontal:15,marginVertical:10}}>
            <View style={{flex:0.23,backgroundColor:'white',paddingHorizontal:15,borderRadius:10,paddingTop:5}}>
              {/* top content */}
              <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <Title>CH {chno} | {test.tname}</Title>
                <Caption style={{fontSize:18}}>Time : {test.totaltime} Minutes</Caption>
                <Caption style={{fontSize:18}}>Total Marks : {test.totalmarks}</Caption>
              </View>
              <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <View>
                  <TouchableOpacity onPress={()=>handleFinalSubmit()} style={{backgroundColor:'#21c912',paddingHorizontal:10,borderRadius:10,
                  borderRightWidth: 1,borderLeftWidth:1,borderBottomWidth: 5,borderColor: '#024e55',elevation:30,shadowColor: 'rgba(0, 0, 0, 0.4)',
                  shadowOpacity: 0.8,elevation: 30,shadowRadius: 30,shadowOffset : { width: 10, height: 50}}} disabled={isFinalSubmit?true:false}>
                    <Title style={{color:"#040804",fontSize:18}}>Final Submit</Title>
                  </TouchableOpacity>
                </View>
                {
                  !isFinalSubmit?
                    <View style={{backgroundColor:'lightblue',justifyContent:'center',paddingHorizontal:15,borderRadius:20}}>
                      <Text style={{fontWeight:'bold',fontSize:25}}>{clockify().displayMins}:{clockify().displaySecs} </Text>
                    </View>
                :null
                }
              </View>
            </View>

            {/* middle question content */}
            <View style={{flex:0.6,backgroundColor:'white',flexDirection:'row',paddingHorizontal:15,borderRadius:10,paddingTop:5,marginTop:5}}>
              <View style={{flex:0.8}}>
                <ScrollView>
                {
                  !isFinalSubmit ?
                    curQuestion ?
                    // question view
                    <>
                      <Title style={{fontSize:17}}>{curIndex+1}.{curQuestion.question}</Title>
                      <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value}>
                        <View style={{flexDirection:"row"}}><RadioButton value={curQuestion.option.A} /><Text style={{marginTop:7}}>{curQuestion.option.A}</Text></View>
                        <View style={{flexDirection:"row"}}><RadioButton value={curQuestion.option.B} /><Text style={{marginTop:7}}>{curQuestion.option.B}</Text></View>
                        <View style={{flexDirection:"row"}}><RadioButton value={curQuestion.option.C} /><Text style={{marginTop:7}}>{curQuestion.option.C}</Text></View>
                        <View style={{flexDirection:"row"}}><RadioButton value={curQuestion.option.D} /><Text style={{marginTop:7}}>{curQuestion.option.D}</Text></View>
                      </RadioButton.Group>
                    </>
                    :
                    <>
                      <View>
                        <Text style={{color:'red'}}>Note : - </Text>
                        <Text style={{color:'red',marginVertical:5}}>1. You can not press back, it'is desabled by our system...</Text>
                        <Text style={{color:'red',marginVertical:5}}>2. You can not press home button, otherwise your exam will closed..</Text>
                        <Text style={{color:'red',marginVertical:5}}>3. Once you submit your answer, you can't change your answer again of particular question.</Text>
                      </View>
                      <View style={{justifyContent:'center',alignItems:'center',marginVertical:10}}>
                        <Text style={{color:'grey'}}>We are waiting for you....</Text>
                        <View style={{flexDirection:'row'}}>
                          <Button onPress={()=>{
                            setTimerOn(timerOn => !timerOn)
                            fetchQuestionData()}}>I'M READY</Button>
                          <Button onPress={()=>Navigation.navigate("Chapter",{cid:cid})}>CANCEL</Button>
                        </View>
                      </View>
                    </>
                  :
                  // result view
                  <View style={{justifyContent:'space-between',alignItems:'center',marginVertical:10}}>
                    {percentage>=40?<Title style={{fontSize:28}}>Congratulation !😊🎉✨</Title>:null}
                    <View>
                      { 
                        percentage>=40 ? 
                        <>
                          <Icon name='crown' size={50} color={
                            percentage>=40 && percentage<60 ? "#e0511d" :
                            percentage>=60 && percentage<80 ? "#cdd4cf":
                            percentage>=80 ? "gold": null 
                          } 
                          style={{alignItems:'center'}} />
                        </>
                         : 
                         <>
                          <Title style={{color:'red',fontSize:25,marginTop:15}}>Sorry, You are Fail 😔</Title>
                         </>
                      }
                    </View>
                    <Text style={{fontSize:22,marginTop:15}}>Result : {obtainedMarks} / {test.totalmarks}</Text>
                    <View style={{flexDirection:'row',justifyContent:"space-evenly",marginTop:10}}>
                      {/* <TouchableOpacity style={{backgroundColor:'#1746A2',marginVertical:10,padding:7,borderRadius:5,paddingHorizontal:20}}
                      onPress={()=>Navigation.dispatch(StackActions.replace("Drawer"))}>
                        <Text style={{fontSize:20,color:'white'}}>OK</Text>
                      </TouchableOpacity>
                      <Text>    </Text>
                      <TouchableOpacity style={{backgroundColor:'#1746A2',marginVertical:10,padding:7,borderRadius:5,paddingHorizontal:20}}
                      onPress={()=>Navigation.navigate("ViewAnswers")}>
                        <Text style={{fontSize:20,color:'white'}}>View Answers</Text>
                      </TouchableOpacity> */}
                      <Button mode='outlined' style={{marginHorizontal:10}} onPress={()=>Navigation.dispatch(StackActions.replace("Drawer"))} >OK</Button>
                      <Button mode='outlined' style={{marginHorizontal:10}} onPress={()=>Navigation.navigate("ViewAnswers",{question:question,storeAnswer:storeAnswer})} >View Answers</Button>
                    </View>
                  </View>
                }
                </ScrollView>
              </View>
              
              <View style={{flex:0.2,paddingHorizontal:10,justifyContent:'space-evenly',borderRadius:20}} pointerEvents={isFinalSubmit?"none":null}>
                <Button mode="elevated" onPress={()=>handlePrev(curIndex-1)}>Previous</Button>
                <Button mode="contained-tonal" onPress={()=>handleNext(curIndex+1)}>Next</Button>
                <Text>{flag = true}</Text>
                {
                  storeAnswer.map((data)=>{
                    data.Qid == curQuestion._id ? flag = false : null
                  })
                }
                { flag?  <Button mode="contained" onPress={()=>handleSubmit()}>Submit</Button>
                :<Button mode="contained" onPress={()=>Alert.alert("Alert","This question is already submited")}>Submited</Button> }
                
              </View>
            </View>

            {/* Bottom Button content */}
                  
            {/* Bottom sheet */}

            <ReanimatedBottomsheet
              ref={bottomSheetRef}
              enabledGestureInteraction={true}
              snapPoints={[50, 200, height-172 ,height-125]}
              initialSnap={0}
              isBackDropDismissByPress={true}
              renderHeader={() => {
                return (
                  <View style={{alignItems: 'center',backgroundColor: 'black',paddingVertical: 0,borderTopLeftRadius:15,borderTopRightRadius:15}}>
                    <View>
                      <TouchableOpacity style={{backgroundColor:'black',paddingHorizontal:30}} onPress={() => {
                          !isOpen ? handleBottomSheet(1,true) : handleBottomSheet(0,false) }} >
                        <Icon name={isOpen ? "caret-down" : "caret-up"} color={'white'} size={30}/>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              }}
              renderContent={() => {
                return(
                  <View style={{backgroundColor:'black',height:'100%',flex:1}}>
                    <ScrollView>
                      <View style={{flexDirection:'row',justifyContent:'center'}}>
                        {
                          question.map((item,index) => {
                            return(
                              <TouchableOpacity key={index} 
                                style={{borderWidth:2,width:80,margin:10,alignItems:'center',height:50,justifyContent:'center',borderRadius:10,borderColor:'#fff'}} 
                                onPress={()=>{
                                  console.log(question[index]);
                                  setCurIndex(index);
                                  setCurQuestion(question[index]);
                                }}>
                                <View style={{width:'60%'}}>
                                  <Text style={{color:'#fff',fontSize:18,textAlign:'center'}}>{index+1}</Text>
                                </View>
                              </TouchableOpacity>
                            )
                          })
                        }
                      </View>
                    </ScrollView>       
                  </View>
                )
              }}
            />
          </View>
          :
          <View style={styles.rotateBox}>
            <Provider>
              <Portal>
                <Modal visible={true} onDismiss={false} style={{justifyContent:'center',alignItems:'center',alignSelf:'center'}}>
                  <Image source={{uri:"https://usefulicons.com/uploads/icons/202106/3824/4690e84380f8.png"}} 
                  style={{width:200,height:200,alignItems:'center',alignSelf:'center'}} />
                  <Text style={{textAlign:'center'}}>Please Rotate Your Device...</Text>
                </Modal>
              </Portal>
            </Provider>
          </View>
        }
      </View>
    </>
  );
};

export default Test;

const styles = StyleSheet.create({
  rotateBox:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
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
