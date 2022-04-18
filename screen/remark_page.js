import React, {useState, useEffect, useContext} from "react";
import { View, Text, StyleSheet, FlatList, Alert,Linking, Platform, Share, ActivityIndicator, SafeAreaView, Modal, TouchableOpacity, ToastAndroid} from 'react-native'
import { Button, FAB, Card, Searchbar, IconButton, TouchableRipple, Avatar, TextInput } from 'react-native-paper'
import { AsyncStorageHelper } from "../service";
import { useSelector } from "react-redux";
import Moment from "moment";

export default function Remark_Page(props) {

    const item = props.foo
    const user_id = item.id
    const user = useSelector(state => state.user);

    console.log('remark', item)

    const [remark, setRemark] = useState([])
    const [note, setNote] = useState("")
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalVisible, setModalVisible] = useState(false);
    const [remarkError, setRemarkError] = useState(false);
    const [indicator, setIndicator] = useState(false);
    const [texterror, settexterror] = useState(false);
    const [datatext, setDatatext] = useState(false);

    const validate_text = () => {
      if (note.length > 3){
          createremark();
      }else{
          settexterror(true)
      }
    }

    useEffect(() => {
        getData();
    },[]);

    const createremark = () => {
    // console.log("api", Platform.Version)
    settexterror(false)
    setIndicator(true)
    fetch ("https://donationreport.pythonanywhere.com/member_remark_mobile/", {
        method: "POST",
        headers: {
          'Content-Type' : 'application/json',
          'Authorization': 'Token ' + user.token
        },
        body:JSON.stringify({body:note, uid:user_id})
    })
    .then(resp => resp.json())
    .then(data => {
        console.log("data: ", data.data)
        if(data.msg == 'yes'){
            getData();
          setIndicator(false)
          setModalVisible(!modalVisible)
          ToastAndroid.show('Reported Successfully', ToastAndroid.SHORT)
        //   setContacts(data.data)
        }
        else{
          setIndicator(false)
          settexterror(true)
          setContacts([])
          // console.log("no data")
        }
        // data.navigation.push('Home');
    })
    .catch(error => Alert.alert("Error", error.toString()))
  }


    const getData = () => {
        setDatatext(false);
        fetch('https://donationreport.pythonanywhere.com/member_remark_mobile/?uid='+user_id, {
            method: "GET",
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + user.token
            }
        })
        .then(resp => resp.json())
        .then(data => {
            console.log("remark data", data)
            if (data.msg == 'yes'){
                setRemark(data.data)
                setDatatext(false);
                setLoading(false)
            }else if (data.msg == 'no'){
                setLoading(false)
                setDatatext(true);
            }
            else{
                Alert.alert("Error", 'something went wrong please try again later')
            }
        })
        .catch(error => Alert.alert("Error", error.toString()))

    }

    const renderData = (item) => {
        return(
            <Card style = {styles.cardStyle} >
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <Text style={{fontSize:18, color:'purple'}}>Mudassir</Text>
                    <Text style={{fontSize:15}}>{Moment(item.added_date).format('DD/MM/YYYY')}</Text>
                </View>
                <Text style = {{fontSize:16, color:'black'}}>{item.report_note} </Text>
            </Card>
        )
    }


    return (
        <SafeAreaView style={{flex:1}}>
        <View style={{flex:1}}>
            <FlatList
                data = {remark}
                renderItem={({item}) => {
                    return renderData(item)
                }}
                onRefresh={() => getData()}
                refreshing = {loading}
                keyExtractor={item => `${item.id}`}
            />
            {datatext ? 
                <View style={{flex:1, alignItems:'center'}}>
                <Text style={{color:'black', fontSize:25}}>Sorry!! No Data Found.</Text>
                <Text style={{fontSize:18}}>or something went wrong</Text>
                </View> : null}
            {/* <TextInput /> */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    // this.closeButtonFunction()
                    setModalVisible(!modalVisible);
                }}>
                <View
                    style={{
                        padding:10,
                        height: '35%',
                        marginTop: 'auto',
                        backgroundColor:'#DEC5F7',
                        // backgroundColor:'#EC3EE9',
                        // borderRadius:20,
                        marginRight:5,
                        marginLeft:5,
                        borderTopLeftRadius:20,
                        borderTopRightRadius:20,
        
                    }}>
                    <TextInput
                    //   style={{backgroundColor:'#DEC5F7'}}
                      placeholder="Text here.."
                      placeholderTextColor="#666666"
                      autoCorrect={false}
                      value={note}
                      onChangeText={text => setNote(text)}
                    //   mode='flat'
                      style={styles.input}
                      />
                      {texterror ? 
                        <View style={{flexDirection:'row',justifyContent:'center'}}>
                        <Text style={{color:'#B11000', fontSize:16}}>Please Enter your Text Properly !!</Text>
                        </View> : null}
                      {indicator ? <ActivityIndicator size="large" color="blue" animating={indicator} /> : null}
                    <Button
                        style= {{margin:10, backgroundColor:'#1C33E5', borderRadius:10}}
                        mode = "contained"
                        icon={'pencil'}
                        onPress={() => validate_text()}
                        > Submit Remark </Button>
                    <Button
                        style= {{margin:10, backgroundColor:'#EA423A', borderRadius:10}}
                        mode = "contained"
                        icon={'cancel'}
                        onPress={() => {setModalVisible(!modalVisible)}}
                        > Close </Button>
                </View>
            </Modal>
            <FAB 
                style = {styles.fab}
                small = {false}
                icon = 'plus'
                // onPress = {() => props.navigation.navigate("Donation")}
                onPress={() => setModalVisible(true)}
            />
        </View>
        </SafeAreaView>
    )
    
};

const styles = StyleSheet.create({
    cardStyle: {
        padding:10,
        margin:10,
        backgroundColor: 'white'
    },
    fab: {
        position: 'absolute',
        margin:16,
        right:0,
        bottom:0,
        backgroundColor: 'blue',
    },
    input: {
    // flex: 1,
    // paddingTop: 10,
    // paddingRight: 10,
    // paddingBottom: 10,
    // paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
    borderRadius:5,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    fontSize:20
},
});
