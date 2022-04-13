import React, { useState, useContext, useEffect } from 'react'
import {StyleSheet, View,Text, TextInput, SafeAreaView, ScrollView, ActivityIndicator, Alert } from 'react-native';
// import { AsyncStorageHelper } from './asyncStorageHelper';
import { AsyncStorageHelper } from '../service';
import { Avatar, Button } from 'react-native-paper';
import UserAction from '../Actions/user';
import { useDispatch } from 'react-redux';
// import AppLoader, {loaderRef, showLoader, hideLoader} from './apploader'
// import { showLoader } from './apploader'

export default function LoginScreen(props) {
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [indicator, setIndicator] = useState(false);
  const [texterror, settexterror] = useState(false);

  const dispatch = useDispatch();


  const validate_text = () => {
      if (phone.length > 9 && password.length > 4){
          loginuser();
      }else{
          settexterror(true)
      }
  }

  const loginuser= () => {
    //   console.log(phone, password)
      setIndicator(true)
      settexterror(false)
      fetch('https://donationreport.pythonanywhere.com/user_mobile_login/', {
            method: 'POST',
            headers:{
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({'phone':phone, 'password':password})
        })
        .then(resp => resp.json())
        .then(data => {
            // console.log('data',data.msg)
            setIndicator(false)
            if (data.msg=='failed'){
                Alert.alert("Error", "Please enter the correct phone/password")
            }else if(data.msg == 'success'){
                // AsyncStorageHelper.saveItem('token', data.token);
                AsyncStorageHelper.saveItem('token-donation', data.token);

                UserAction.set(data.token, dispatch);
                // props.navigation.navigate("Home", {data});
            }else{
                Alert.alert("Error", "Something Went wrong please check it and try again.")
            }
            // props.navigation.navigate("Home", {data})
        })
        .catch(error => Alert.alert("Error", error.toString()))
  }

//   useEffect(()=>{
//     if(isAuthenticated){
//       props.navigation.navigate("Home");
//     }
//   }, [])

  return (
       <SafeAreaView style={{flex:1, padding:10, justifyContent:'center', backgroundColor:'#CE92FA'}}>
          <ScrollView>
            <View style={{justifyContent:'center', backgroundColor:'#CE92FA', marginTop:150}}>
                {/* <AppLoader ref={loaderRef} /> */}
                <View style={{flexDirection:'row',justifyContent:'center'}}>
                    <Avatar.Image 
                        source={{
                        uri: 'https://i.ibb.co/c1LJNDm/icon-removebg-preview-4.png',
                        }}
                        size={100}
                        />
                </View>
                <TextInput
                    style={{backgroundColor:'white', padding:10, borderRadius:10, margin:10, fontSize:20, textAlign:'left'}}
                    placeholder='Phone..'
                    value = {phone}
                    // mode='outlined'
                    onChangeText={text => setPhone(text)}
                />
                <TextInput
                    style={{backgroundColor:'white', padding:10, borderRadius:10, margin:10, fontSize:20, textAlign:'left'}}
                    placeholder='Pasword..'
                    value = {password}
                    // mode='outlined'
                    secureTextEntry
                    autoCapitalize='none'
                    onChangeText={text => setPassword(text)}
                />
                {texterror ? 
                <View style={{flexDirection:'row',justifyContent:'center'}}>
                    <Text style={{color:'#B11000', fontSize:16}}>Please Fill your details correctly !!</Text>
                </View> : null}
                {indicator ? <ActivityIndicator size="large" color="blue" animating={indicator} /> : null}
                <View style={{margin:10}}>
                    <Button mode="contained" style={{borderRadius:10, backgroundColor:'purple'}} onPress={() => validate_text()}>
                        <Text style={{fontSize:18}}>Login</Text>
                    </Button>
                </View>
            </View>
            </ScrollView>
        </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
//   forgot: {
//     fontSize: 13,
//     color: ,
//   },
//   link: {
//     fontWeight: 'bold',
//     color: theme.colors.primary,
//   },
})
