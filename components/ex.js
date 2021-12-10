import React from 'react';
import { TouchableOpacity,Pressable, Image, View, ImageBackground, Platform } from 'react-native';
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


const Tabbar = ({ state, navigation }) => {
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

            default:
                return null;
        }
    };

    const onPressTab = (label) => {
        if (label !== 'IconComponent') {
            navigation.navigate(label)
        }
    }

    return (
        // <View style={{ backgroundColor: 'red',}}>
            <ImageBackground
                source={bottomBg}
                style={{
                    flexDirection: 'row',
                    // position:'absolute',
                    // bottom:0,
                    height: 200,
                    paddingTop: '15%',
                    width: '100%',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    justifyContent: 'space-between'
                    
                }}>
                {state.routes.map((route, index) => {
                    const label = route.name;
                    const isFocused = state.index === index;
                    if (label === 'IconComponent') {
                        return (
                            <View style={{ paddingBottom: '20%',flex:1,paddingHorizontal:20,zIndex:-1,backgroundColor:'transparent' }}>
                                <Image
                                    source={logo}
                                    style={{ height: 100, width: 100,position:'absolute',bottom:Platform.OS==='android'? '20%':'40%',left:Platform.OS==='android'? '20%':'30%' }}
                                />

                            </View>
                        )
                    }
                    return (
                        <TouchableOpacity
                            // activeOpacity={1}
                            onPress={() => onPressTab(label)}
                            style={{ padding: 10, alignItems: 'center', }}>
                            <Image
                                style={{ width: 40, height: 40 }}
                                source={svgObj(label, isFocused)}
                            />
                        </TouchableOpacity>
                    );
                })}
            </ImageBackground>
        //  </View>

    );
};

export default React.memo(Tabbar);
