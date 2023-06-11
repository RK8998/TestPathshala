import { TextInput,Dimensions, StyleSheet, Text, View, ScrollView, TouchableOpacity,RefreshControl, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Caption, Paragraph, Title } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { url } from './Services/url';

const {width,height} = Dimensions.get('screen')

const Forums = () => {
  const [user, setUser] = useState([])
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);

  const [enroll, setEnroll] = useState([]);
  const [course, setCourse] = useState([]);
  const [txtValue, setTxtValue] = useState("");
  const [chat, setChat] = useState([]);

  // ----------------------------------
  const fetchData = async() => {
    setUser(JSON.parse(await AsyncStorage.getItem('userLogin')));
  }

  const fetchEnrollCourses = async() => {
    console.log('fetch enroll');
    try {
      userData = JSON.parse(await AsyncStorage.getItem('userLogin'));
      console.log(userData._id);

      const data = await fetch(`${url}/fetchEnrollCourses`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid:userData._id
        })
      });
      const response = await data.json();
      // console.log(response);  
      if(response.status == "yes"){
        await setEnroll(response.enroll);
        await setCourse(response.course);
      }
      if(response.status == "no"){
        Alert.alert("Error",response.msg);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const setItemObj = async() => {
    // console.log(enroll);
    course.length && !items.length?
      course.map((c)=>{
        enroll.map((e)=>{
          c._id == e.cid ? 
            items.push({
              "label":c.cname,"value":c._id
            })
          : null
        })
      })
    :null
  }

  const storeMessage = async() => {
    try {
      const data = await fetch(`${url}/storeChat`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid:user._id,
          name:user.name,
          cid:value,
          msg:txtValue
        })
      });
      const response = await data.json();
      // console.log(response);  
      if(response.status == "yes"){
        setTxtValue("");
        fetchChat();
      }
      if(response.status == "no"){
        Alert.alert("Error","Please Select Course...");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const fetchChat = async() => {
    try {
      console.log('fetchChat');
      const cid = value == null ? 0 : value;
      console.log("cid"+cid);
      const data = await fetch(`${url}/fetchChat`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cid:cid,
        })
      });
      const response = await data.json();
      console.log(response);  
      if(response.status == "yes"){
        setChat(response.chat)
      }
      if(response.status == "no"){
        Alert.alert("Error",response.msg);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const [refresh, setrefresh] = useState(false);
  const OnRefresh = async() => {
    setrefresh(true)
    setItems([]);
    await fetchEnrollCourses();
    await fetchChat();
    await setItemObj();

    setTimeout(() => {
      setrefresh(false);
    }, 1000);
  }

  useEffect(() => {
    fetchData();
    fetchEnrollCourses();
    setItemObj();
    fetchChat();
  }, [])

  useEffect(() => {
    setItemObj();
  }, [course])
  

  return (
    <View style={styles.container}>

      <View style={styles.msgView}>
        <View style={{marginHorizontal:10}}>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={()=>setOpen(!open)}
            setValue={setValue}
            setItems={setItems}
            onChangeValue={()=>fetchChat()}
            placeholder={'Select Your Course...'}
            style={{marginBottom:10,marginTop:5}}
            />
        </View>

        <ScrollView refreshControl={<RefreshControl refreshing={refresh} onRefresh={OnRefresh}/>}
        ref={ref => {this.scrollView = ref}}
        onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})} >
          {
            !chat.length ? 
            <View style={{backgroundColor:"lightgrey",alignItems:'center',paddingVertical:5}}>
              <Text style={{fontSize:18}}>Start Conversation</Text>
            </View>
            :
            chat.map((msg,index)=>{
              return(
                <>
                {
                  msg.uid == user._id ? 
                  <View style={styles.msgright}>
                    <Caption style={{fontWeight:"bold",textAlign:"right"}}>you</Caption>
                    <Paragraph style={{color:'white',textAlign:'left'}}>{msg.msg}</Paragraph>
                  </View>
                  :
                  <View style={styles.msgleft} key={index}>
                    <Caption style={{fontWeight:"bold"}}>{msg.name}</Caption>
                    <Paragraph style={{color:'white'}}>{msg.msg}</Paragraph>
                  </View>     
                }
                </>
              )
            })
          }
        </ScrollView>
      </View>
      
      <View style={styles.typeMsg}>
        <View style={{flexDirection:'row',justifyContent:'center'}}>
          {
            value!= null ?
            <>
              <TextInput placeholder='type here...' style={styles.txtInput} value={txtValue} onChangeText={(text)=>setTxtValue(text)} />
              <TouchableOpacity onPress={()=>storeMessage()} style={{marginRight:10}}>
                <Icon name='send' size={30} style={{marginTop:8,marginHorizontal:5,color:'#2C6AD5'}} />
              </TouchableOpacity>
            </>  
            : <Text>Select course from above to giving reply..</Text>
          }
          
        </View>
      </View>

    </View>
  )
}

export default Forums

const styles = StyleSheet.create({
  container:{
    flex:1
  }, 
  msgView:{
    flex:0.90,
    backgroundColor:'#fff'
  },  
  typeMsg:{
    flex:0.10,
    backgroundColor:'#fff',
    alignItems:'center',
    justifyContent:'center'
    // paddingTop:25
  },  
  txtInput:{
    flex:1,
    borderWidth:1,
    marginHorizontal:10,
    borderRadius:50,
    paddingLeft:20
  },
  msgleft:{
    backgroundColor:'#2C6AD5',
    marginVertical:7,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    borderBottomRightRadius:10,
    paddingHorizontal:10,
    width:'auto',alignSelf:'flex-start',marginLeft:10,paddingBottom:5,
    maxWidth:width-80
  },
  msgright:{
    backgroundColor:'#57caff',
    marginVertical:7,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    borderBottomLeftRadius:10,
    paddingHorizontal:10,
    width:'auto',alignSelf:'flex-end',marginRight:10,paddingBottom:5,
    maxWidth:width-80
  }
})