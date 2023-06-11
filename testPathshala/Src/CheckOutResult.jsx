import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Appbar, Button, Caption, Title} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {url} from './Services/url';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/FontAwesome5';

const CheckOutResult = props => {
  const Navigation = useNavigation();

  const cid = props.route.params.cid;
  console.log(cid);
  const [ChapterWiseResult, setChapterWiseResult] = useState([]);
  const [Test, setTest] = useState([]);

  const fetchChapterWiseResult = async () => {
    try {
      const user = JSON.parse(await AsyncStorage.getItem('userLogin'));
      console.log(user._id);

      const data = await fetch(`${url}/fetchChapterWiseResult`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user._id,
          cid: cid,
        }),
      });
      const response = await data.json();
      console.log(response);
      if (response.status == 'yes') {
        setChapterWiseResult(response.data);
        setTest(response.data2);
      }
      if (response.status == 'no') {
        Alert.alert('Error', response.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchChapterWiseResult();
  }, [cid]);

  return (
    <View style={styles.container}>
      <Appbar.Header style={{backgroundColor: 'white'}}>
        <Appbar.BackAction
          onPress={() => Navigation.navigate('Chapter', {cid: cid})}
        />
      </Appbar.Header>
      {
        !ChapterWiseResult.length?
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
          <Text style={{fontSize:18,fontWeight:'500'}}>Not applied in any test !!</Text>
        </View>
        :
          <ScrollView>
          {
            Test.map((test,index)=>{
                return(
                    ChapterWiseResult.map((result)=>{
                        return(
                            test._id == result.tid ?
                            <>
                            <View style={styles.box} key={index}>
                                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                    <Title>CH {index+1} | {test.tname}</Title>
                                </View>
                                <View style={{flexDirection:'row',marginTop:10,justifyContent:'space-between'}}>
                                    <Icon name='crown' size={50} color={
                                        result.percentage>=40 && result.percentage<60 ? "#e0511d" :
                                        result.percentage>=60 && result.percentage<80 ? "#cdd4cf":
                                        result.percentage>=80 ? "gold": null 
                                    } 
                                    style={{alignItems:'center'}} />

                                    <Progress.Circle size={70} indeterminate={false} progress={result.percentage/100}
                                    direction={'clockwise'} fill={'#3b77f7'} thickness={2} >
                                    <Text style={{textAlign:'center',fontSize:15,color:'#3b77f7'}}>{result.percentage}%</Text>  
                                    </Progress.Circle>    

                                    <View>
                                        <Text>Tota Marks : <Text style={{fontSize:15,fontWeight:'bold'}}>{result.totalmarks}</Text></Text>
                                        <Text>Obtained : <Text style={{fontSize:15,fontWeight:'bold'}}>{result.marks}</Text></Text>
                                        <Text>Time : <Text style={{fontSize:15,fontWeight:'bold'}}>{test.totaltime} min</Text></Text>
                                    </View>
                                </View>
                                {
                                    result.percentage >= 40 ?
                                    <Title style={{color:'green',fontSize:15,textAlign:'right'}}> PASS😊 </Title>
                                    : <Title style={{color:'red',fontSize:15,textAlign:'right'}}> FAIL😥 </Title>
                                }
                            </View>  
                            </>
                            :null
                        )
                    })
                )
            })
          }
          </ScrollView>
       }
    </View>
  );
};

export default CheckOutResult;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  box: {
    borderWidth: 1,
    borderColor: 'black',
    marginHorizontal: 15,
    // borderTopColor:'white',
    marginVertical: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    borderRightWidth: 1,borderLeftWidth:1,borderBottomWidth: 5,borderColor: '#024e55',elevation:30,shadowColor: 'rgba(0, 0, 0, 0.0)',
                  shadowOpacity: 0.8,elevation: 30,shadowRadius: 30,shadowOffset : { width: 10, height: 50}
  },
});
