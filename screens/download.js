import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useContext, useState} from 'react';
// import { withNavigationFocus } from 'react-navigation';
import {
  StyleSheet,
  Text,
  Image,
  ScrollView,
  View,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import RecursiveList from '../components/RecursiveList';
import AuthContext from '../Context/Context';
// import {withNavigationFocus} from '@react-navigation/native';

const Download = props => {
  const {user, setUser} = useContext(AuthContext);
  const [reload, setReload] = React.useState(true);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [categories, setCategories] = useState([]);

  React.useEffect(() => {
    if (user) {
      getDataFromStorage();
      getAllData();
    }
  }, [user]);

  const getDataFromStorage = async () => {
    try {
      const userData = await AsyncStorage.getItem('directory');
      const jsonValue = JSON.parse(userData);
      if (jsonValue === null) {
        setCategories([]);
      } else {
        setCategories(jsonValue);
      }
    } catch (error) {
      console.log('error retriving data');
    }
  };

  const getAllData = async () => {
    if (reload) {
      await getUserRoles();
    }
    getData();
  };

  const getUserRoles = () => {
    setLoading(true);
    let formData = new FormData();
    formData.append('type', 'getRole');
    formData.append('userName', user.user_login);
    return fetch('https://uoapp.es/authenticate.php', {
      method: 'POST',
      body: formData,
    })
      .then(async response => {
        if (response.ok) {
          return await response.json();
        } else {
          setLoading(false);
          return {};
        }
      })
      .then(async responseJson => {
        if (!responseJson.status) {
          console.log('error', responseJson.msg);
          setReload(false);
          return;
        }
        let updatedUser = {...user};
        console.log('user Role', responseJson.data);
        updatedUser.user_role = responseJson.data;
        try {
          let jsonValue = JSON.stringify(updatedUser);
          await AsyncStorage.removeItem('user');
          await AsyncStorage.setItem('user', jsonValue);
        } catch (error) {
          console.log('error storing data in local storage');
        }
        setUser(updatedUser);
        setReload(false);
      })
      .catch(error => {
        console.error('hhh', error);
        setLoading(false);
        setReload(false);
      });
  };

  const getData = () => {
    setLoading(true);
    fetch('https://directorio.uoapp.es/data-json')
      .then(response => {
        return response.json();
      })
      .then(async data => {
        console.log('directoried', data.categories);
        setCategories(data.categories);
        try {
          let jsonValue = JSON.stringify(data.categories);
          await AsyncStorage.setItem('directory', jsonValue);
        } catch (error) {
          console.log('error storing data in local storage');
        }
        setLoading(false);
      })
      .catch(err => {
        console.log('error fetching data', err);
        setLoading(false);
      });
  };

  if (!user) {
    return (
      <View style={[styles.container, {paddingTop: 20, alignItems: 'center'}]}>
        <Text style={styles.title}>Error directorio</Text>
        <View style={styles.line}></View>
        <Text style={styles.subTitle}>
          Debes estar registrado para podar ver este contenido
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, {color: 'black', fontSize: 40}]}>
        Directorio
      </Text>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          onChangeText={value => {
            setSearchText(value);
            // onSearchFile(value);
          }}
          value={searchText}
        />
        <View style={styles.searchIcon}>
          <Image
            source={require('../assets/search.png')}
            style={{height: 20, width: 20}}
          />
        </View>
      </View>
      {loading ? (
        <ActivityIndicator
          animating
          size={'large'}
          color="green"
          style={{marginTop: 20}}
        />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => {
                getUserRoles();
              }}
            />
          }
          style={{marginTop: 20}}
          contentContainerStyle={{paddingBottom: 155}}>
          <RecursiveList
            data={categories}
            files={undefined}
            url="https://directorio.uoapp.es/static/categories"
            search={searchText != '' ? searchText : undefined}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    backgroundColor: 'white',
    flex: 1,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginVertical: 10,
    color: 'green',
    fontFamily: 'Poppins-ExtraBold',
  },
  input: {
    borderBottomWidth: 2,
    borderColor: 'orange',
    flexGrow: 1,
  },
  searchBar: {
    flexDirection: 'row',
  },
  searchIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'green',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginLeft: 5,
  },
  line: {
    borderBottomColor: 'grey',
    width: '100%',
    height: 0,
    borderBottomWidth: 1,
    opacity: 0.5,
  },

  subTitle: {
    fontSize: 16,
    marginVertical: 10,
    // fontWeight: '700',
    paddingHorizontal: 10,
    textAlign: 'center',
    fontFamily: 'Poppins-ExtraBold',
  },
});
export default Download;
// withNavigationFocus(Download);
