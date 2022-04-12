import React, {useState, useEffect, useContext} from "react";
import { View, Text, StyleSheet, FlatList, Alert,Linking, Platform, Share, ToastAndroid, ActivityIndicator, KeyboardAvoidingView, ScrollView } from 'react-native'
import { Button, FAB, Card, Searchbar, IconButton, TouchableRipple, Avatar, TextInput } from 'react-native-paper'
import Geolocation from "@react-native-community/geolocation";
import Geocoder from "react-native-geocoding";
import KeyboardSpacer from "react-native-keyboard-spacer";
// import ImageCropPicker from "react-native-image-crop-picker";
import ImagePicker from 'react-native-image-crop-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AsyncStorageHelper } from "../service";
import { useSelector } from "react-redux";
// import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

export default function Member_Create(props) {
    const [indicator, setIndicator] = useState(false);
    const [userToken, setUsertoken] = useState("");
    const [item, setItem] = useState({});
    const [nameerror, setNameError] = useState(false);
    const [phoneerror, setPhoneError] = useState(false);
    const [image, setImage] = useState(null);
    const [name, setName] = useState("");
    const [father, setFather] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [lat, setlat] = useState("");
    const [lon, setlon] = useState("");
    const [note, setNote] = useState("");
    const [imagepath, setImagepath] = useState("");

    const user = useSelector(state => state.user);

    const validate_text = () => {
      if (name.length > 3){
          if(phone.length > 9){
            getlocation();
          }else{
            setPhoneError(true);
            setNameError(false);
          }
      }else{
          setNameError(true);
      }
    }

    const getlocation = () => {
      setIndicator(true)
        Geolocation.getCurrentPosition( (position) => {
            const currentLongitude = JSON.stringify(position.coords.longitude);
            const currentLatitude = JSON.stringify(position.coords.latitude);
            console.log("location", currentLongitude, currentLatitude)
            setlat(currentLatitude);
            setlon(currentLongitude);
            if (Platform.OS === 'android') {
            ToastAndroid.show('Location Added Successfully', ToastAndroid.SHORT)
            createMember(currentLatitude, currentLongitude );
          } else {
            // setIndicator(false)
            AlertIOS.alert('Reported Successfully');
            createMember(currentLatitude, currentLongitude);
          }
        }, (error) => alert(error.message), {
            enableHighAccuracy: true, timeout: 20000, maximumAge: 1000
        });

    }

    const takePhoto = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
        }).then(image => {
            console.log(image);
            setImage(image.path);
        });
    }

    const createMember = (map1, map2) => {
      // const sendimage = SendFileToBackend(image);
      setIndicator(true)
      setNameError(false)
      setPhoneError(false)
      //If file selected then create FormData
      // const fileToUpload = image;
      const img_data = new FormData();
      if(image){
        img_data.append('profile', {name: name+'_'+phone+'.jpg', uri:image, type: 'image/jpg'});
      }
      img_data.append('name', name);
      img_data.append('father', father);
      img_data.append('phone', phone);
      img_data.append('email', email);
      img_data.append('lat', map1);
      img_data.append('lon', map2);
      img_data.append('note', note);

      fetch ("http://192.168.56.1/member_create_mobile/", {
          method: "POST",
          headers: {
            // 'Content-Type' : 'application/json',
            'Content-Type': 'multipart/form-data; ',
            'Authorization': 'Token ' + user.token
          },
          // body: img_data
          body:img_data
      })
      .then(resp => resp.json())
      .then(data => {
          console.log("get data: ", data)
          if(data.msg == 'success'){
            // setItem(data.data)
            setIndicator(false)
            ToastAndroid.show('Member Added Successfully', ToastAndroid.SHORT);
            props.navigation.replace('Tab', {data})
          }
          else{
            setIndicator(false)
            Alert.alert("Error", "Something went wrong please try again later");
            // console.log("no data")
          }
          // data.navigation.push('Home');
      })
      .catch(error => Alert.alert("Error", error.toString()))
    }

    return(
      <ScrollView style={styles.container}>
        <View>
            <View style={{marginTop:20}}>
                <View style={{flexDirection:'row', justifyContent:'center'}}>
                  {
                    image ? 
                    <TouchableRipple onPress={() => takePhoto()}>
                      <Avatar.Image 
                      source={{
                        uri: image,
                      }}
                      size={100}
                    />
                    </TouchableRipple> 
                  : <TouchableRipple onPress={() => takePhoto() }>
                    <Avatar.Image 
                      source={{
                        uri: "https://i.ibb.co/z8pdGtX/download-2.png",
                      }}
                      backgroundColor={'white'}
                      size={100}
                    />
                  </TouchableRipple>
                  }
                </View>
                <View style={{marginTop:10}}>
                  <View style={styles.searchSection}>
                    <FontAwesome name="user-o" size={20} />
                      <TextInput
                      value={name}
                      onChangeText={text => setName(text)}
                      placeholder="Name"
                      placeholderTextColor="#666666"
                      autoCorrect={false}
                      style={styles.input}
                      />
                  </View>
                  {nameerror ?
                    <View style={{flexDirection:'row', justifyContent:'center'}}> 
                      <Text style={{color:'red'}} >Please Enter Your Name Correctly !!</Text>
                    </View> : null
                  }
                  <View style={styles.searchSection}>
                    <FontAwesome name="user-o" size={20} />
                      <TextInput
                      value={father}
                      onChangeText={text => setFather(text)}
                      placeholder="Father Name"
                      placeholderTextColor="#666666"
                      autoCorrect={false}
                      style={styles.input}
                      />
                  </View>
                  <View style={styles.searchSection}>
                    <FontAwesome name="phone" size={20} />
                      <TextInput
                      value={phone}
                      onChangeText={text => setPhone(text)}
                      placeholder="Phone"
                      placeholderTextColor="#666666"
                      autoCorrect={false}
                      style={styles.input}
                      />
                  </View>
                  {phoneerror ?
                    <View style={{flexDirection:'row', justifyContent:'center'}}> 
                      <Text style={{color:'red'}} >Please Enter Your Phone Number Correctly !!</Text>
                    </View> : null
                  }
                  <View style={styles.searchSection}>
                    <FontAwesome name="envelope-o" size={20} />
                      <TextInput
                      value={email}
                      onChangeText={text => setEmail(text)}
                      placeholder="Email"
                      placeholderTextColor="#666666"
                      autoCorrect={false}
                      style={styles.input}
                      />
                  </View>
                  <View style={styles.searchSection}>
                    <FontAwesome name="pencil" size={20} />
                      <TextInput
                      value={note}
                      onChangeText  ={text => setNote(text)}
                      // style={{backgroundColor:'#DEC5F7'}}
                      placeholder="Note"
                      placeholderTextColor="#666666"
                      autoCorrect={false}
                      style={styles.input}
                      />
                  </View>
                </View>
                {/* <TextInput
                    style={{backgroundColor:'white', marginTop:10, fontSize:18}}
                    placeholder='Father name'
                    value = {father}
                    mode=''
                    onChangeText={text => setFather(text)}
                />
                <TextInput
                    style={{backgroundColor:'white', marginTop:10, fontSize:18}}
                    placeholder='Phone Number'
                    value = {phone}
                    mode=''
                    onChangeText={text => setPhone(text)}
                />
                <TextInput
                    style={{backgroundColor:'white', marginTop:10, fontSize:18}}
                    placeholder='Email'
                    value = {email}
                    mode=''
                    onChangeText={text => setEmail(text)}
                />
                <TextInput
                    style={{backgroundColor:'white', marginTop:10, fontSize:18}}
                    placeholder='Note'
                    value = {note}
                    mode=''
                    onChangeText={text => setNote(text)}
                /> */}
                {indicator ? <ActivityIndicator size="large" color="blue" animating={indicator} /> : null}
                <Button
                    style= {{margin:10, backgroundColor:'purple', borderRadius:8}}
                    mode= "contained"
                    icon={'plus'}
                    onPress={() => validate_text()}
                >
                    Create Member
                </Button>
                <KeyboardSpacer/>
            </View>
        </View>
      </ScrollView>  
    )
    
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white',
    padding:5,

  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    // borderBottomColor: '#f2f2f2',
    borderBottomColor:'purple',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
    backgroundColor:'white'
  },
  searchSection: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding:5,

},
searchIcon: {
    padding: 10,
},
input: {
    flex: 1,
    // paddingTop: 10,
    // paddingRight: 10,
    // paddingBottom: 10,
    // paddingLeft: 0,
    backgroundColor: '#fff',
    color: '#424242',
},
});