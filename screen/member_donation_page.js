import React, {useState, useEffect, useContext} from "react";
import { View, Text, StyleSheet, FlatList, Alert,Linking, Platform, Share, ActivityIndicator, SafeAreaView, Modal, ToastAndroid } from 'react-native';
import { Button, FAB, Card, Searchbar, IconButton, TouchableRipple, Avatar, TextInput } from 'react-native-paper';
// import DateField from 'react-native-datefield';
// import DatePicker from "react-native-datepicker";
import DatePicker from "react-native-date-picker";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Moment from "moment";
import { AsyncStorageHelper } from "../service";
import { useSelector } from "react-redux";


export default function Member_Donation_Page(props) {
    const item = props.foo
    const user_id = item.id

    const [donation, setDonation] = useState([])
    const [userToken, setUsertoken] = useState("")
    const [loading, setLoading] = useState(true)
    const [modalVisible, setModalVisible] = useState(false);
    const [indicator, setIndicator] = useState(false);
    const [texterror, settexterror] = useState(false);
    const [datatext, setDatatext] = useState(false);
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false)

    const user = useSelector(state => state.user);

    const validate_text = () => {
      if (amount.length > 0){
          adddonation();
      }else{
          settexterror(true)
      }
    }

    useEffect(() => {
        getData();
    },[]);

    const donate = [100, 600, 900, 300, 1000, 5000, 10000, 2000 ]

    const adddonation = () => {
    // console.log("api", Platform.Version)
    settexterror(false)
    setIndicator(true)
    fetch ("https://donationreport.pythonanywhere.com/member_donation_mobile/", {
        method: "POST",
        headers: {
          'Content-Type' : 'application/json',
          'Authorization': 'Token ' + user.token
        },
        body:JSON.stringify({body:note, uid:user_id, date:date, money:amount})
    })
    .then(resp => resp.json())
    .then(data => {
        console.log("data: ", data.data)
        if(data.msg == 'yes'){
            getData();
          setIndicator(false)
          setModalVisible(!modalVisible)
          ToastAndroid.show('Added Successfully', ToastAndroid.SHORT)
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
        fetch('https://donationreport.pythonanywhere.com/member_donation_mobile/?uid='+user_id, {
            method: "GET",
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + user.token
            }
        })
        .then(resp => resp.json())
        .then(data => {
            console.log("donation data", data)
            if (data.msg == 'yes'){
                setDonation(data.data)
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
                    <Text style = {{fontSize:20, color:'black', marginLeft:5}}>{item.amount} </Text>
                    <Text>{Moment(item.added_date).format('DD/MM/YYYY')}</Text>
                </View>
                <Text style = {{fontSize:20, marginLeft:5}}>{item.note} </Text>
            </Card>
        )
    }


    return (
        <SafeAreaView style={{flex:1}}>
            <View style={{flex:1, marginTop:5, padding:5}}>
                <FlatList
                    data = {donation}
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
                            height: '60%',
                            marginTop: 'auto',
                            backgroundColor:'#DEC5F7',
                            // backgroundColor:'#EC3EE9',
                            // borderRadius:20,
                            marginRight:5,
                            marginLeft:5,
                            borderTopLeftRadius:20,
                            borderTopRightRadius:20,
            
                        }}>
                        <View style={styles.searchSection}>
                            <FontAwesome style={styles.searchIcon} name="rupee" size={22} color="red"/>
                            <TextInput
                                //   style={{backgroundColor:'#DEC5F7'}}
                                placeholder="Amount"
                                placeholderTextColor="#666666"
                                autoCorrect={false}
                                value={amount}
                                onChangeText={text => setAmount(text)}
                                //   mode='flat'
                                style={styles.input2}
                            />
                        </View>
                        {texterror ? 
                        <View style={{flexDirection:'row',justifyContent:'center'}}>
                        <Text style={{color:'#B11000', fontSize:16}}>Please Enter the Amount !!</Text>
                        </View> : null}

                        <DatePicker
                            modal
                            open={open}
                            date={date}
                            onConfirm={(date) => {
                            setOpen(false)
                            setDate(date)
                            }}
                            onCancel={() => {
                            setOpen(false)
                            }}
                        />
                        
                        <View style={styles.searchSection}>
                            <TouchableRipple onPress={() => setOpen(true)}>
                                <FontAwesome style={styles.searchIcon} name="calendar" size={20} color="red"/>
                            </TouchableRipple>
                            <TextInput
                                placeholderTextColor="#666666"
                                autoCorrect={false}
                                value={Moment(date).format('DD/MM/YYYY')}
                                onChangeText={setDate}
                                style={styles.input2}
                                onFocus={() => setOpen(true)}
                                // showSoftInputOnFocus={false}
                            />
                        </View>

                        {/* <TextInput
                            placeholderTextColor="#666666"
                            autoCorrect={false}
                            value={Moment(date).format('DD/MM/YYYY')}
                            onChangeText={setDate}
                            style={styles.input}
                            onFocus={() => setOpen(true)}
                        /> */}
                        {/* <Button onPress={() => setOpen(true)}>Click To Change Date</Button> */}

                        <View style={styles.searchSection}>
                            <FontAwesome style={styles.searchIcon} name="pencil" size={22} color="red"/>
                            <TextInput
                                //   style={{backgroundColor:'#DEC5F7'}}
                                placeholder="Note"
                                placeholderTextColor="#666666"
                                autoCorrect={false}
                                value={note}
                                onChangeText={text => setNote(text)}
                                //   mode='flat'
                                style={styles.input2}
                            />
                        </View>
                        
                        {indicator ? <ActivityIndicator size="large" color="blue" animating={indicator} /> : null}
                        <Button
                            style= {{margin:10, backgroundColor:'#1C33E5', borderRadius:10}}
                            mode = "contained"
                            icon={'pencil'}
                            onPress={() => validate_text()}
                            > Add Donation </Button>
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
                    onPress = {() => {setModalVisible(true)}}
                    // onPress={() => console.log('create')}
                />
            </View>
        </SafeAreaView>
    )
    
};

const styles = StyleSheet.create({
    cardStyle: {
        padding:5,
        margin:5,
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
    marginBottom:5,
    backgroundColor: '#fff',
    color: '#424242',
    // borderRadius:5,
    // borderTopLeftRadius:10,
    // borderTopRightRadius:10,
    fontSize:20
    },
    searchSection: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    },
    searchIcon: {
        padding: 10,
    },
    input2: {
        flex: 1,
        // paddingTop: 10,
        // paddingRight: 10,
        // paddingBottom: 10,
        paddingLeft: 0,
        backgroundColor: '#fff',
        color: '#424242',
        fontSize:20,
        // marginBottom:5,
    },

});
