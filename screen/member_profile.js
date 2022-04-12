import React, {useState, useRef, useEffect} from 'react';
import {View, SafeAreaView, StyleSheet, Linking, Share, ScrollView, Alert,TextInput, ToastAndroid, Platform, AlertIOS, ActivityIndicator} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
  Searchbar,
  Button,
  // TextInput,
} from 'react-native-paper';
// import { AsyncStorageHelper } from './asyncStorageHelper';
// import { AsyncStorageHelper } from '../service';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Contacts from 'react-native-contacts';

// import Share from 'react-native-share';

// import files from '../assets/icon';

export default function ProfileScreen(props) {
  console.log("prop", props)
  const item = props.foo
  // const item = 'Mudassir zeya'
  // console.log('image_path', 'http://192.168.56.1'+item.profile_pic)

  // useEffect( async() => {
  //   // console.log("home")
  //   const gettoken = await AsyncStorageHelper.getItem('token-meem');
  //   console.log("profile", gettoken)
  //   setUsertoken(gettoken);
  // },[]);

  
  const whatsappNum = (whNum) =>{
    const txt = `${whNum}`;
    const numb = txt.match(/\d/g);
    const ten_dig = numb.join("");
    const final_numb = ten_dig.slice(-10);
    console.log(final_numb);
    Linking.openURL(`whatsapp://send?text=hello&phone=91${final_numb}`)
    // return final_numb;
  }

  const openContactPicker = (item) =>{
    var newPerson = {
      emailAddresses: [
        {
        // label: `${item.email_label ? item.email_label :''}`,
        email: `${item.email ? item.email : ''}`,
      },
    ],
      phoneNumbers: [
        {
        // label: `${item.phone_label ? item.phone_label : ''}`,
        number: `${item.mobile_number ? item.mobile_number : ''}`,
      },
    ],
      displayName: `${item.name}`,
    }
    try{
      Contacts.openContactForm(newPerson);
    }catch (error) {
      console.log(error)
      alert(error.message);
      }

  };

  const onShare = async (item) => {
    try {
      const result = await Share.share({
        message:
          `${item}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  }

  const shareString = (item) => {
    const final = []
    if(item.name){
      const name = `Name : ${item.name}`
      final.push(name)
    }
    if(item.phone){
      const phone = `
      phone1 : ${item.phone}`
      final.push(phone)
    }
    if(item.email){
      const email = `
      email : ${item.email}`
      final.push(email)
    }
    console.log('share', final)
    onShare(final)
  }

  return (
    <SafeAreaView style={{flex:1}}>
      <ScrollView>
        <View style={{flex:1}}>
          <View style={styles.userInfoSection}>
            <View style={{flexDirection: 'row', marginTop: 15}}>
              {
                item.profile_pic ? 
                <Avatar.Image 
                  source={{
                    uri: `http://192.168.56.1${item.profile_pic}`,
                  }}
                  size={60}
                /> 
              : <Avatar.Image 
                  source={{
                    uri: `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${item.name}`,
                  }}
                  size={60}
                />
              }
              <View style={{marginLeft: 20, flexShrink:1}}>
                <Title style={[styles.title, {
                  // marginRight:15,
                  marginTop:10,
                  marginBottom: 5,
                }]}>{item.name} {item.father_name ? item.father_name : null}</Title>
              </View>
            </View>
          </View>

          <View style={styles.userInfoSection}>
            {
              item.mobile_number ?
              <View style={{...styles.row}}>
                <Icon name="phone" color="#777777" size={20}/>
                <Text style={{color:"black", marginLeft: 20}}>{item.mobile_number}</Text>

                <View style={{flexDirection:'row', position:'absolute', right:0}}>
                  <Icon name="whatsapp" color="green" size={20} onPress={() => whatsappNum(item.mobile_number)}/>
                <Icon name="phone" color="blue" size={20} style={{marginLeft:10}} 
                  onPress={() => Linking.openURL(`tel:${item.mobile_number}`)}/>
                </View>
              </View> : <View/>
            }

            {
              item.email ?
              <TouchableRipple onPress={() => Linking.openURL(`mailto:${item.email}`)}>
              <View style={styles.row}>
                <Icon name="email" color="#777777" size={20}/>
                <Text style={{color:"black", marginLeft: 20}}>{item.email}</Text>
              </View>
              </TouchableRipple>
              : <View/>
            }
            {/* {
              item.city || item.state ?
              <View style={styles.row}>
              <Icon name="map-marker-radius" color="#777777" size={20}/>
              <Text style={{color:"black", marginLeft: 20}}>{item.state ? item.state : ''} {item.city ? `- ${item.city}`:''} 
              {item.pin_code ? ` - ${item.pin_code}` : ''}</Text>
              </View> :
              <View/>
            } */}
            {
              item.note ?
              <View style={styles.row}>
              <Icon name="note" color="#777777" size={20}/>
              <Text style={{color:"black", marginLeft: 20}}>{item.note}</Text>
              </View> :
              <View/>
            }

          </View>

          <View style={styles.infoBoxWrapper}>
          </View>

          <View style={styles.menuWrapper}>
            <TouchableRipple onPress={() => shareString(item)}>
              <View style={styles.menuItem}>
                <Icon name="share-outline" color="#FF6347" size={25}/>
                <Text style={styles.menuItemText}>Share this contact</Text>
              </View>
            </TouchableRipple>
            <TouchableRipple onPress={() => openContactPicker(item)}>
              <View style={styles.menuItem}>
                <Icon name="account-check-outline" color="#FF6347" size={25}/>
                <Text style={styles.menuItemText}>Save this contact</Text>
              </View>
            </TouchableRipple>
          </View>
          
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
    flexShrink:1
  },
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    // borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    // height: 100,
  },
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: '#777777',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
  input: {
    // height: 40,
    backgroundColor:'white',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});