import React from 'react';
import {View,Text} from 'react-native';
import MyWebView from '../myWebView';
const ContactUs = () => {
    return(
        <MyWebView
        uri={'https://uoapp.es/contacto/'}
        />
    )
}
export default ContactUs;