import React, {useState, useRef, useEffect} from 'react';
import {View, SafeAreaView, StyleSheet, Linking, Share, ScrollView, Alert,TextInput, ToastAndroid, Platform, AlertIOS, ActivityIndicator, RefreshControl} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
  Searchbar,
  Button,
  Card,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Contacts from 'react-native-contacts';
import { useSelector } from 'react-redux';

export default function UserDonationReport(props) {
  const user = useSelector(state => state.user);
  const [totalDonation, setTotalDonation] = useState("");
  const [personalDonation, setPersonalDonation] = useState("");
  const [returnDonation, setReturnDonation] = useState("");
  const [remainingDonation, setRemainingDonation] = useState("");
  const [indicator, setIndicator] = useState(false);
//   console.log("prop", props)
//   const item = props.foo
  useEffect(() => {
    getData();
    },[]);

  const getData = () => {
    setIndicator(true)
        fetch('https://donationreport.pythonanywhere.com/user_donation_report/', {
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
              // setReport(data.data)
              console.log('donation report')
              setTotalDonation(data.total_amount['amount__sum'])
              setPersonalDonation(data.personal_account_donation['amount__sum'])
              setReturnDonation(data.submitted_donation['amount__sum'])
              setRemainingDonation(data.remaining_amount)
              setIndicator(false)
            }else if (data.msg == 'no'){
              setIndicator(false)
              Alert.alert("Error", 'Something went wrong please try again later')
              
            }
            else{
                Alert.alert("Error", 'something went wrong please try again later')
            }
        })
        .catch(error => Alert.alert("Error", error.toString()))

    }


  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#CE92FA'}}>
      <ScrollView>
        <RefreshControl
            refreshing={indicator}
            onRefresh={getData}
          />
        <View style={{padding:5}}>
          <Text style={{fontSize:25, fontWeight:'bold'}}>Your Report : </Text>
          {indicator ? <ActivityIndicator size="large" color="blue" animating={indicator} /> : null}
          <Card style={{backgroundColor:'#CE92FA', marginTop:10}}>
            <View style={{margin:5}}>
              <Card style={{padding:5}}>
                <Text style={{fontSize:20, color:'purple', fontWeight:'bold'}}>Total Donation: {totalDonation}</Text>
              </Card>
            </View>
            <View style={{margin:5}}>
              <Card style={{padding:5}}>
                <Text style={{fontSize:20, color:'purple', fontWeight:'bold'}}>Donation in Personal Account: {personalDonation}</Text>
              </Card>
            </View>
            <View style={{margin:5}}>
              <Card style={{padding:5}}>
                <Text style={{fontSize:20, color:'purple', fontWeight:'bold'}}>Donation Return to Organization: {returnDonation}</Text>
              </Card>
            </View>
            <View style={{margin:5}}>
              <Card style={{padding:5}}>
                <Text style={{fontSize:20, color:'purple', fontWeight:'bold'}}>Donation Remaining to return: {remainingDonation}</Text>
              </Card>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};