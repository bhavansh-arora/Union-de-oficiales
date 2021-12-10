import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import Home from './screens/home';
import Blog from './screens/blog';
import ContactUs from './screens/contactUs';
import Download from './screens/download';
import Examenes from './screens/examenes';

import Tabbar from './components/tabbar.js';
import ProfileStackNavigator from './Navigators/ProfileStackNavigator';
import AuthStackNavigator from './Navigators/AuthStackNavigator';
import AuthContext from './Context/Context';
const Tab = createBottomTabNavigator();

function MyTabs() {
  
  const {user} = useContext(AuthContext);

  return (
    <Tab.Navigator tabBar={props => <Tabbar {...props} />}>
      <Tab.Screen name="Blog" component={Blog} />
      <Tab.Screen name="ContactUs" component={ContactUs} />
      <Tab.Screen name="IconComponent" component={ContactUs} />
      <Tab.Screen name="Download" component={Download} />
      {/* <Tab.Screen name="User" component={User} /> */}
      {user ? (
        <Tab.Screen name="User" component={ProfileStackNavigator} />
      ) : (
        <Tab.Screen name="User" component={AuthStackNavigator} />
      )}
      <Tab.Screen name="Examenes" component={Examenes} />
    </Tab.Navigator>
  );
}
export default MyTabs;
