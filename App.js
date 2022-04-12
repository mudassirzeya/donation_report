import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  LogBox
} from 'react-native';
import Home_Page from './screen/home';
import Search_Member from './screen/search_member_page';
import Member_Create from './screen/member_create_page';
import Member_Profile from './screen/member_profile';
import Remark_Page from './screen/remark_page';
import Member_Donation_Page from './screen/member_donation_page';
import LoginScreen from './screen/login';
// import TabView from './screen/tab';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer'
import TabScreen from './screen/tab';
import UserAction from './Actions/user';
import { AsyncStorageHelper } from './service';
import { useDispatch, useSelector } from 'react-redux';

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator();

export default function App() {
  const user = useSelector(state => state.user);
  console.log('user', user);
  const dispatch = useDispatch();
  // LogBox.ignoreAllLogs()

  const [loading, setloading] = useState(true);

  

  const getusertoken = async() => {
    if (!user.token) {
      const data = await AsyncStorageHelper.getItem('token-donation');
      console.log('data', data);
      if (data) {
        UserAction.set(data, dispatch);
        setloading(false);
      } else {
        UserAction.logout(dispatch);
        setloading(false);
      }
    }
  }

  useEffect(() => {
    getusertoken();
  }, []);

  // useEffect(() => {
  //   if (!user.token) {
  //     AsyncStorageHelper.getItem('token-donation', setUsertoken);
  //     console.log('data', usertoken);
  //     if (usertoken) {
  //       UserAction.set(usertoken, dispatch);
  //       setloading(false);
  //     } else {
  //       UserAction.logout(dispatch);
  //       setloading(false);
  //     }
  //   }
  // }, []);

  const {isAuthenticated} = user;

  console.log('isAuthenticated', isAuthenticated);

  if (loading) {
    return (
      <View style={{flex:1,justifyContent:'center', alignItems:'center', backgroundColor:'#DEC5F7'}}>
        {/* <Text style={{color:'purple', fontSize:25}}>Welcome Back</Text> */}
        <Text style={{color:'black', fontSize:35}}>Loading....</Text>
      </View>
      
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        {!isAuthenticated ? (
          <Stack.Screen name='Login' component = {LoginScreen} options={{headerShown: false}} />
        ) : (
          <>
          <Stack.Screen name='Home' component = {Home_Page} options={{title:"Meem Donation",
          headerStyle:{backgroundColor:'#3399ff'}}}/>
          <Stack.Screen name='Search' component = {Search_Member} options={{title:"Search or Create",
          headerStyle:{backgroundColor:'#3399ff'}}}/>
          <Stack.Screen name='Create' component = {Member_Create} options={{title:"Create New Member",
          headerStyle:{backgroundColor:'#3399ff'}}}/>
          <Stack.Screen name='Tab' component = {TabScreen} options={{title:"Member's Info", 
          headerStyle:{backgroundColor:'#3399ff'}}}/>
          <Stack.Screen name='Profile' component = {Member_Profile} options={{title:"Profile",
          headerStyle:{backgroundColor:'#3399ff'}}}/>
          <Stack.Screen name='Remark' component = {Remark_Page} options={{title:"Remarks",
          headerStyle:{backgroundColor:'#3399ff'}}}/>
          <Stack.Screen name='Donation' component = {Member_Donation_Page} options={{title:"Donation",
          headerStyle:{backgroundColor:'#3399ff'}}}/>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#3399ff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
});


