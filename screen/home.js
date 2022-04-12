import React from "react";
import { View, Text, StyleSheet } from 'react-native'
import { Button, FAB, Card, Searchbar, IconButton, TouchableRipple, Avatar} from 'react-native-paper'

function Home_Page(props) {
    return(
        <View style= {{flex:1, margin:0, paddingTop:5, backgroundColor:'#DEC5F7'}}>
            <View>
                <TouchableRipple onPress={() => props.navigation.navigate('Search')}>
                    <View style={{padding:15}}>
                        <Card style={{backgroundColor:'purple', padding:10}}>
                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <Text style={{color:'white', fontSize:25, fontWeight:'bold'}}>Search for Members</Text>
                                <IconButton icon={'arrow-right'} color={'white'} onPress={() => console.log('pressed')}/>
                            </View>
                            <View style={{paddingTop:10}}>
                                <Text style={{color:'white', fontSize:16, fontWeight:'bold'}}>Total Member: 36000</Text>
                            </View>
                        </Card>
                    </View>
                </TouchableRipple>
                <TouchableRipple>
                    <View style={{padding:15}}>
                        <Card style={{backgroundColor:'purple', padding:10}}>
                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <Text style={{color:'white', fontSize:25, fontWeight:'bold'}}>Donation Report</Text>
                                <IconButton icon={'arrow-right'} color={'white'} onPress={() => console.log('pressed')}/>
                            </View>
                            <View style={{paddingTop:10}}>
                                <Text style={{color:'white', fontSize:16, fontWeight:'bold'}}>Total: 100000</Text>
                            </View>
                        </Card>
                    </View>
                </TouchableRipple>
            </View>
        </View>
    )
}

export default Home_Page