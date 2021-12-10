import React from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  View,
  Platform,
  Linking,
} from 'react-native';
import {WebView} from 'react-native-webview';
import RNFetchBlob from 'react-native-fetch-blob';
import {PermissionsAndroid, Alert} from 'react-native';

// import {useNavigation} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
const MyWebView = props => {
  const {uri} = props;
  const webViewRef = React.useRef();
  const [url, setUrl] = React.useState(undefined);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    reloadPage();
  }, [props?.focus]);

  const reloadPage = () => {
    webViewRef.current.reload();
  };

  const onLoadEnd = () => {
    setLoading(false);
  };
  useFocusEffect(
    React.useCallback(() => {
      console.log(uri);
      setUrl(uri);
      return () => {
        setUrl(undefined);
      };
    }, [uri]),
  );
  // if(true){
  //   return(<View
  //     style={{
  //       flex:1,
  //       // backgroundColor:'red',
  //       justifyContent:'center',
  //       alignItems: 'center',
  //     }}>
  //     <ActivityIndicator
  //       visible={true}
  //       size="large"
  //     />
  //   </View>)
  // }
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {loading ? (
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator visible={true} size="large" />
        </View>
      ) : null}
      <WebView
        style={{marginBottom: 75, opacity: 0.99, overflow: 'hidden'}}
        ref={webViewRef}
        onNavigationStateChange={data => {
          console.log(data);
          if (Platform.OS == 'ios') {
            let url = data.url;
            if (!!url) {
              let downoad = url.search('download');
              let refresh = url.search('refresh');
              if (downoad !== -1 && refresh !== -1) {
                Linking.openURL(url);
              }
            }
          }
        }}
        onFileDownload={data => {
          console.log('------>', data.nativeEvent.downloadUrl);
          // downloadFile(data.nativeEvent.downloadUrl)
        }}
        onMessage={data => {
          console.log(data);
        }}
        onLoad={daata => {
          console.log(daata);
        }}
        source={{uri: url}}
        onLoadEnd={onLoadEnd}
        onContentProcessDidTerminate={reloadPage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
});

export default MyWebView;
