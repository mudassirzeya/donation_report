import React, {useState, useEffect, useContext} from "react";
import { View, Text, StyleSheet, FlatList, Alert,Linking, Platform, Share, ActivityIndicator } from 'react-native'
import { Button, FAB, Card, Searchbar, IconButton, TouchableRipple, Avatar } from 'react-native-paper'
import { AsyncStorageHelper } from "../service";
import { useSelector } from "react-redux";

export default function Search_Member(props) {
    const [search, setSearch] = useState("")
    const [userToken, setUsertoken] = useState("")
    const [contacts, setContacts] = useState([])
    const [indicator, setIndicator] = useState(false);
    const [texterror, settexterror] = useState(false);
    const [datatext, setDatatext] = useState(false);

    const user = useSelector(state => state.user);

    const validate_text = () => {
      if (search.length > 0){
          searchContact();
      }else{
          settexterror(true)
      }
    }

    const whatsappNum = (whNum) =>{
    const txt = `${whNum}`;
    const numb = txt.match(/\d/g);
    const ten_dig = numb.join("");
    const final_numb = ten_dig.slice(-10);
    // console.log(final_numb);
    Linking.openURL(`whatsapp://send?text=hello&phone=91${final_numb}`)
    // return final_numb;
  }

  // useEffect(() => {
  //   const gettoken = AsyncStorageHelper.getItem('token-donation');
  //   console.log("home", userToken)
  //     // setUsertoken(gettoken);
  // }, []);

  const searchContact = () => {
    // console.log("api", Platform.Version)
    settexterror(false)
    setDatatext(false)
    setIndicator(true)
    fetch ("https://donationreport.pythonanywhere.com/search_member_mobile/", {
        method: "POST",
        headers: {
          'Content-Type' : 'application/json',
          'Authorization': 'Token ' + user.token
        },
        body:JSON.stringify({body:search})
    })
    .then(resp => resp.json())
    .then(data => {
        console.log("data: ", data.data)
        if(data.msg == 'yes'){
          setIndicator(false)
          setDatatext(false)
          setContacts(data.data)
        }
        else{
          setIndicator(false)
          setDatatext(true)
          setContacts([])
          // console.log("no data")
        }
        // data.navigation.push('Home');
    })
    .catch(error => Alert.alert("Error", error.toString()))
  }

    const renderData = (item) => {
        return(
          <TouchableRipple onPress={() => props.navigation.navigate('Tab', {item})}>
          <View style={styles.container}>
            <Card style={styles.cardStyle}>
              <View style={styles.messageBox}>
                <View style={{flexDirection:'row'}}>
                  {
                    item.profile_pic ? 
                    <Avatar.Image 
                      source={{
                        uri: `https://donationreport.pythonanywhere.com${item.profile_pic}`,
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
                <View style={{paddingLeft:25, paddingTop:5, flexShrink:1}}>
                  <Text style={styles.name}>{item.name}</Text>    
                </View>
                </View>
                <View style={{flexDirection:'row'}}>
                  <View style={{justifyContent:'center'}}>
                    <Text style={styles.message}>{item.mobile_number}</Text>
                  </View>
                    <View style={styles.iconbtn}>
                      {item.mobile_number ?
                      <IconButton
                        icon={'whatsapp'}
                        color={'green'}
                        // size={20}
                        onPress={() => whatsappNum(item.phone)}
                      /> : null }
                      
                      {item.mobile_number ?
                      <IconButton
                        // style={{alignSelf:'flex-end'}}
                        icon={'phone'}
                        color={'blue'}
                        onPress={() => Linking.openURL(`tel:${item.phone}`)}
                      /> : null}
                    </View>
                </View>
                
              </View>
            </Card>
          </View>
          </TouchableRipple>

            // <Card style = {styles.cardStyle} >
            //     <Text style = {{fontSize:25}}>{item.phone} </Text>
            // </Card>
        )
    }


    return (
    <View style= {{flex:1, margin:0, paddingTop:5, backgroundColor:'#DEC5F7'}}>
      <Searchbar
      style= {{margin:10}}
      placeholder="Type here.."
      onChangeText={text => setSearch(text)}
      value={search}
      /> 
      {texterror ? 
        <View style={{flexDirection:'row',justifyContent:'center'}}>
          <Text style={{color:'#B11000', fontSize:16}}>You have not entered any text !!</Text>
        </View> : null}
      <Button
       style= {{margin:10, backgroundColor:'blue'}}
       mode = "contained"
       onPress={() => validate_text()}
       > Search </Button>
       {indicator ? <ActivityIndicator size="large" color="blue" animating={indicator} /> : null}
       {datatext ? 
        <View style={{flex:1,justifyContent:'center', alignItems:'center'}}>
          <Text style={{color:'black', fontSize:25}}>Sorry!! No Data Found.</Text>
          <Text style={{fontSize:18}}>something went wrong</Text>
        </View> : null}
       <View>
         <FlatList
          contentContainerStyle={{paddingBottom: 150}}
          data = {contacts}
          renderItem={({item}) => {
            return renderData(item)
          }}
          keyExtractor={item => `${item.id}`}
         />
       </View>
       <FAB 
          style = {styles.fab}
          small = {false}
          icon = 'plus'
          // onPress = {() => props.navigation.navigate("Create", {token})}
          onPress={() => props.navigation.navigate("Create")}
      />
    </View>
  )
    
};

const styles = StyleSheet.create({
    cardStyle: {
        // padding:10,
        margin:10,
        backgroundColor: '#FBFCD6'   
    },
    container:{
        // padding:10,

    },
    messageBox:{
        borderRadius:5,
        padding:10,
    },
    name:{
        color: '#3399ff',
        fontWeight: 'bold',
        fontSize:20,
        // marginBottom:5,
    },
    message:{
      color: 'black',
        fontSize:20,
        fontWeight: 'bold',
    },
    time:{
        alignSelf: 'flex-end',
        color: '#F995B0',
        fontWeight:'bold',
    },
    iconbtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  fab:{
    position: 'absolute',
    margin:16,
    right:0,
    bottom:0,
    backgroundColor: 'blue',
    },
})
