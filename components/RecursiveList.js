import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Platform,
  PermissionsAndroid,
  Alert,
  Image,
} from 'react-native';
import List from './List';
import RNFetchBlob from 'react-native-fetch-blob';
import AuthContext from '../Context/Context';
import {useContext} from 'react';

function RecursiveList({data, files, access, url, search}) {
  const {user} = useContext(AuthContext);
  if (access != undefined && access == false) {
    return (
      <View style={styles.container}>
        <Text>No tienes acceso</Text>
      </View>
    );
  }

  const requestPermission = async (fileUrl, ext) => {
    if (Platform.OS === 'ios') {
      onFile(fileUrl, ext);
    } else {
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'storage permission',
            message: 'storage permission needed to download pdf',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        ).then(granted => {
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Storage Permission Granted.');
            onFile(fileUrl, ext);
          } else {
            Alert.alert('storage_permission');
          }
        });
      } catch (err) {
        console.log('error', err);
      }
    }
  };

  const onFile = fileUrl => {
    try {
      let urlArray = fileUrl.split('/');
      let name = urlArray[urlArray.length - 1];
      const {dirs} = RNFetchBlob.fs;
      const dirToSave =
        Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
      const configfb = {
        fileCache: true,
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: name,
        path: `${dirToSave}/${decodeURI(name)}`,
      };
      const configOptions = Platform.select({
        ios: {
          fileCache: configfb.fileCache,
          title: configfb.title,
          path: configfb.path,
        },
        android: {addAndroidDownloads: configfb},
      });
      if (Platform.OS === 'android') {
        Alert.alert('Aviso', 'Se inició la descarga del archivo');
      }
      // let final = fileUrl.replace(/ /g, '%20');
      let final = fileUrl;
      RNFetchBlob.config(configOptions)
        .fetch('GET', final, {})
        .then(res => {
          if (Platform.OS === 'ios') {
            RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
            RNFetchBlob.ios.previewDocument(configfb.path);
          }
          console.log('The file saved to ', res);
        })
        .catch(err => {
          alert('El archivo no se encuentra disponible temporalmente');
          console.log('error downloading file', err, final);
        });
    } catch (error) {
      console.log('something went wrong');
    }
  };

  const checkForMatchingFile = (data, query) => {
    let result = false;
    if (data.files && data.permissions.some(p => user.user_role.includes(p))) {
      data.files.map(file => {
        if (file.title.toLowerCase().includes(query.toLowerCase())) {
          result = true;
        }
      });
    }
    if (data.subcategories && !result) {
      data.subcategories.map(d => {
        const check = checkForMatchingFile(d, query);
        if (check) {
          result = true;
        }
      });
    }
    return result;
  };

  return (
    <View>
      {data != undefined &&
        data.map(d => {
          let match = false;
          if (search) {
            match = checkForMatchingFile(d, search);
          } else {
            match = true;
          }
          if (!match) {
            return null;
          }
          return <List data={d} key={d.title} url={url} query={search} />;
        })}
      {files != undefined &&
        files.map((file, index) => {
          if (
            search &&
            !file.title.toLowerCase().includes(search.toLowerCase())
          ) {
            return null;
          }
          return (
            <TouchableWithoutFeedback
              onPress={() =>
                file.url
                  ? requestPermission(file.url)
                  : requestPermission(url + '/' + encodeURI(file.file))
              }
              key={file.title + index.toString()}>
              <View style={styles.container}>
                <Image
                  source={require('../assets/pdf.png')}
                  style={styles.icon}
                  resizeMethod="scale"
                />
                <Text>{file.title}</Text>
              </View>
            </TouchableWithoutFeedback>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
    width: 15,
    height: 15,
  },
});

export default RecursiveList;
