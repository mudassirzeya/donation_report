import * as React from 'react';
import { View, useWindowDimensions, Text, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import Remark_Page from './remark_page';
import Member_Donation_Page from './member_donation_page';
import Member_Profile from './member_profile';




export default function TabScreen(props) {
  const getting_item = props?.route?.params?.item;
  const created_item = props?.route?.params?.data?.data;
  const item = getting_item ? getting_item: created_item;
  console.log("item", created_item);
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Profile' },
    { key: 'second', title: 'Remarks' },
    { key: 'third', title: 'Donation' },
  ]);

  const renderScene = SceneMap({
  first: () => <Member_Profile foo={item} />,
  second: () => <Remark_Page foo={item} />,
  third: () => <Member_Donation_Page foo={item} />
  });

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={props => <TabBar {...props} renderLabel={({route, color}) => (<Text style={{color:'purple', fontSize:20, margin:5}}>{route.title}</Text>)} style={{backgroundColor:'white'}} indicatorStyle={styles.indicatorStyle}/> }
      // style={{backgroundColor:'pink'}}
    />
  );
}

const styles = StyleSheet.create({
  indicatorStyle: {
    backgroundColor: 'purple',
    padding: 1.5,
    marginBottom: -2,
  },
});