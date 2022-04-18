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
import ProfileScreen from './screen/member_profile';
import Remark_Page from './screen/remark_page';
import Member_Donation_Page from './screen/member_donation_page';
import LoginScreen from './screen/login';
import UserProfile from './screen/userProfile';
import UserDonationReport from './screen/user_donation_report';
import Presentation_Screen from './screen/presentation_page';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import TabView from './screen/tab';
import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItemList, DrawerItem, DrawerContentScrollView } from '@react-navigation/drawer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TabScreen from './screen/tab';
import UserAction from './Actions/user';
import { AsyncStorageHelper } from './service';
import { useDispatch, useSelector } from 'react-redux';

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()
const Tab = createMaterialTopTabNavigator()

export default function App() {
  const user = useSelector(state => state.user);
  console.log('user', user);
  const dispatch = useDispatch();
  // LogBox.ignoreAllLogs()

  const [loading, setloading] = useState(true);
  const [username, setUsername] = useState("");
  console.log("username: ", username);

  function TabRoot(){
    return(
      <Tab.Navigator screenOptions={({route}) => ({
        tabBarActiveTintColor:'purple',
        tabBarInactiveTintColor:'black',
        tabBarLabelStyle:{fontSize:16, fontWeight:'bold'}
      })}>
        <Tab.Screen name='My_profile' component={UserProfile} options={{title:'My Profile'}}/>
        <Tab.Screen name='Donation_report' component={UserDonationReport} options={{title:'My Report'}}/>
      </Tab.Navigator>
    )

  }

  function DrawerRoot(){
  return(
    <Drawer.Navigator drawerContent={props =>{
      return(
        <DrawerContentScrollView>
          <DrawerItem label={`Hello, ${username}`} labelStyle={{fontSize:18, color:'purple'}}/>
          <DrawerItemList {...props}/>
          <DrawerItem icon={({ focused, color, size }) => {return(<FontAwesome name='sign-out' size={22} />)}} label="Logout" labelStyle={{fontSize:18}} onPress={() => {
            AsyncStorageHelper.removeToken('token-donation');
            AsyncStorageHelper.removeToken('username-donation');
            UserAction.logout(dispatch);}} />
        </DrawerContentScrollView>
      )
    }}>
      <Drawer.Screen name='meem_donation_home' component={Home_Page} options={{title:"Home", drawerLabelStyle:{fontSize:18}, headerTitle:'Meem Donation', drawerIcon:({focused, size}) =>(<FontAwesome name='home' size={20} color={focused? 'blue' : null} />),
          headerStyle:{backgroundColor:'#3399ff'}}} drawerContent/>
      <Drawer.Screen name='MyProfile' component={TabRoot} options={{title:"My Profile", drawerLabelStyle:{fontSize:18}, drawerIcon:({focused, size}) =>(<FontAwesome name='user-circle' size={20} color={focused? 'blue' : null} />),
          headerStyle:{backgroundColor:'#3399ff'}}} />
      {/* <DrawerItem label="Logout" onPress={() => props.navigation.navigate("Login")} /> */}
    </Drawer.Navigator>
  )
}

  

  const getusertoken = async() => {
    if (!user.token) {
      const data = await AsyncStorageHelper.getItem('token-donation');
      const user_name = await AsyncStorageHelper.getItem('username-donation');
      console.log('name: ', user_name);
      setUsername(user_name);
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
          <Stack.Screen name='Home' component = {DrawerRoot} options={{headerShown:false}}/>
          <Stack.Screen name='Search' component = {Search_Member} options={{title:"Search or Create",
          headerStyle:{backgroundColor:'#3399ff'}}}/>
          <Stack.Screen name='Create' component = {Member_Create} options={{title:"Create New Member",
          headerStyle:{backgroundColor:'#3399ff'}}}/>
          <Stack.Screen name='Tab' component = {TabScreen} options={{title:"Member's Info", 
          headerStyle:{backgroundColor:'#3399ff'}}}/>
          <Stack.Screen name='Profile' component = {ProfileScreen} options={{title:"Profile",
          headerStyle:{backgroundColor:'#3399ff'}}}/>
          <Stack.Screen name='Remark' component = {Remark_Page} options={{title:"Remarks",
          headerStyle:{backgroundColor:'#3399ff'}}}/>
          <Stack.Screen name='Donation' component = {Member_Donation_Page} options={{title:"Donation",
          headerStyle:{backgroundColor:'#3399ff'}}}/>
          <Stack.Screen name='Presentation' component = {Presentation_Screen} options={{title:"Presentation",
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


