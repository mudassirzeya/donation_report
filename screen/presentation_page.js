import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList, Linking } from 'react-native'
import { Button, FAB, Card, Searchbar, IconButton, TouchableRipple, Avatar} from 'react-native-paper'
import { useSelector } from "react-redux";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

function Presentation_Screen(props) {
    const [data, setData] = useState([])
    const [errorText, setErrorText] = useState(false)
    const [loading, setLoading] = useState(true)

    const user = useSelector(state => state.user);

    useEffect(() => {
        getData();
    },[]);

    const getData = () => {
        setErrorText(false);
        fetch('https://donationreport.pythonanywhere.com/presentation_mobile/', {
            method: "GET",
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + user.token
            }
        })
        .then(resp => resp.json())
        .then(data => {
            console.log("presentation data", data)
            if (data.msg == 'yes'){
                setData(data.data)
                setErrorText(false);
                setLoading(false)
            }else if (data.msg == 'no'){
                setLoading(false)
                setErrorText(true);
            }
            else{
                Alert.alert("Error", 'something went wrong please try again later')
            }
        })
        .catch(error => Alert.alert("Error", error.toString()))

    }

    const renderData = (item) => {
        return(
            <TouchableRipple onPress={() => Linking.openURL(item.link)}>
                <Card style = {styles.cardStyle} >
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <Text style = {{fontSize:20, color:'white', marginLeft:5, fontWeight:'bold'}}>{item.title} </Text>
                    <FontAwesome name="folder" size={22} style={{color:'white'}}/>
                </View>
            </Card>
            </TouchableRipple>
        )
    }


    return(
        <SafeAreaView style={{flex:1, backgroundColor:'#DEC5F7'}}>
            <View style={{flex:1, margin:5, padding:5}}>
                <FlatList
                    data = {data}
                    renderItem={({item}) => {
                        return renderData(item)
                    }}
                    onRefresh={() => getData()}
                    refreshing = {loading}
                    keyExtractor={item => `${item.id}`}
                />
            </View>
            {/* <Text>Presentation</Text> */}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    cardStyle: {
        padding:10,
        margin:5,
        backgroundColor: 'purple'
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


export default Presentation_Screen