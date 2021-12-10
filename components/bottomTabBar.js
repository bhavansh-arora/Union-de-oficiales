import React from 'react';
import {
  TouchableOpacity,
  Dimensions,
  Image,
  ImageBackground,
} from 'react-native';
import blogActive from '../assets/icons8-active.png';
import blog from '../assets/icons8.png';
import downloadActive from '../assets/icons-export-active.png';
import download from '../assets/icons-export.png';
import userActive from '../assets/icons8-user-active.png';
import user from '../assets/icons8-user.png';
import contacUsActive from '../assets/secured-letter-active.png';
import contacUs from '../assets/secured-letter.png';
import logo from '../assets/logo-uo.png';
import bottomBg from '../assets/bottombar.png';
import Tabbar from './tabbar.js';

const height = Dimensions.get('window').height;

const BottomTabBar = ({state, navigation}) => {
  const svgObj = (svgLabel, isFocused) => {
    switch (svgLabel) {
      case 'Blog':
        return isFocused ? blogActive : blog;
      case 'ContactUs':
        return isFocused ? contacUsActive : contacUs;

      case 'Download':
        return isFocused ? downloadActive : download;
      case 'User':
        return isFocused ? userActive : user;
      case 'Examenes':
        return isFocused ? userActive : user;

      default:
        return null;
    }
  };

  const onPressTab = (routing, isFocused) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: routing.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(routing.name);
    }
  };

  return (
    // <View style={{ backgroundColor: 'red',}}>
    <ImageBackground
      source={bottomBg}
      resizeMode="cover"
      style={{
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        height: 170,
        paddingTop: '15%',
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'transparent',
        justifyContent: 'space-between',
      }}>
      {state.routes.map((route, index) => {
        const label = route.name;
        const isFocused = state.index === index;
        return (
          <TouchableOpacity
            // activeOpacity={1}
            key={route.name}
            onPress={() =>
              route.name !== 'IconComponent'
                ? onPressTab(route, isFocused)
                : null
            }
            style={{padding: 10, alignItems: 'center'}}>
            <Image
              style={{width: 30, height: 30}}
              source={svgObj(label, isFocused)}
            />
          </TouchableOpacity>
        );
      })}
    </ImageBackground>
    //  </View>
  );
};

export default React.memo(BottomTabBar);
