import React from 'react';
import {View,Text} from 'react-native';
import MyWebView from '../myWebView';
const Home = () => {
    return(
        <MyWebView
        uri={'https://uoapp.es/'}
        />
    )
}
export default Home;