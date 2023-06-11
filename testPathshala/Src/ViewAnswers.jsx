import {StyleSheet, Text, View, StatusBar, ScrollView, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Appbar} from 'react-native-paper';
import { StackActions, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ViewAnswers = props => {
  const Navigation = useNavigation();

  console.log(props.route.params.question);
  console.log(props.route.params.storeAnswer);
  const [question, setquestion] = useState(props.route.params.question);
  const [storeAnswer, setStoreAnswer] = useState(props.route.params.storeAnswer);

  return (
    <>
      <View style={{flex: 1}}>
        <StatusBar hidden={true} />
        <Appbar.Header style={{backgroundColor:"#fff"}}>
          <Appbar.BackAction
            onPress={() => Navigation.dispatch(StackActions.replace('Drawer'))}
          />
          <TouchableOpacity style={{backgroundColor:'#BCCEF8',marginHorizontal:15,paddingVertical:5,paddingHorizontal:10,borderRadius:10}}
            onPress={()=>Navigation.dispatch(StackActions.replace('Drawer'))}>
              <Text style={{fontSize:15,color:'black',fontWeight:"800"}}>SKIP</Text>
            </TouchableOpacity>
        </Appbar.Header>
        <View style={{marginHorizontal: 0, backgroundColor: '#fff', flex: 1,borderRadius:10}}>
          <ScrollView>
            {question.map((row, index) => {
              return (
                <>
                  <View style={{marginHorizontal: 15, marginVertical: 10}} key={index}>
                    <Text style={{fontWeight: 'bold',color:'#000'}}>
                        {index + 1}. {row.question} {flag=false}
                        {
                            storeAnswer.map((ans,j)=>{
                                return(
                                    ans.Qid == row._id && row.answer == ans.value ? flag=true : null 
                                )
                            })
                        }
                        { flag ? <Icon name='check' size={18} style={{marginTop:7,fontWeight:'bold',color:'green'}}/>
                         : <Icon name='close' size={18} style={{marginTop:7,fontWeight:'bold',color:'red'}}/> }
                    </Text>
                    <Text style={{marginLeft: 15,color:'#000'}}>A. {row.option.A}</Text>
                    <Text style={{marginLeft: 15,color:'#000'}}>B. {row.option.B}</Text>
                    <Text style={{marginLeft: 15,color:'#000'}}>C. {row.option.C}</Text>
                    <Text style={{marginLeft: 15,color:'#000'}}>D. {row.option.D}</Text>
                    <Text style={{marginTop: 5,color:'#000'}}>Ans : {row.answer}</Text>
                  </View>
                </>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </>
  );
};

export default ViewAnswers;

const styles = StyleSheet.create({});
