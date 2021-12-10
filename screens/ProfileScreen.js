import React, {useContext, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  TouchableWithoutFeedback,
  Linking,
  ScrollView,
} from 'react-native';
import AuthContext from '../Context/Context';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './Login';

function ProfileScreen({navigation}) {
  const {user, setUser} = useContext(AuthContext);

  useEffect(() => {
    console.log('user', user);
    return () => {};
  }, []);

  const onLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser();
    } catch (error) {
      console.log('error logging out');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{paddingBottom: 160}}>
        <Text style={styles.title}>Perfil</Text>
        <View style={styles.line}></View>
        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <View style={styles.coverphoto}>
              {user.coverphoto != null && (
                <Image
                  source={{
                    uri:
                      'https://uoapp.es/wp-content/uploads/ultimatemember/' +
                      user.user_id +
                      '/' +
                      user.coverphoto +
                      '?' +
                      new Date(),
                  }}
                  style={styles.image}
                />
              )}
            </View>
          </View>
          <View style={styles.cardBody}>
            <Menu style={styles.settings}>
              <MenuTrigger>
                <View>
                  <Image
                    source={require('../assets/settings.png')}
                    style={styles.image}
                  />
                </View>
              </MenuTrigger>
              <MenuOptions>
                <MenuOption
                  onSelect={() => navigation.navigate('editProfile')}
                  text="editar mi cuenta"
                />
                <MenuOption onSelect={() => onLogout()} text="Desconectar" />
                <View style={[styles.line, {marginVertical: 1}]}></View>
                <MenuOption onSelect={() => {}} text="Cancelar" />
              </MenuOptions>
            </Menu>

            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: user.profilePhoto
                    ? 'https://uoapp.es/wp-content/uploads/ultimatemember/' +
                      user.user_id +
                      '/' +
                      user.profilePhoto +
                      '?' +
                      new Date()
                    : 'https://uoapp.es/wp-content/uploads/2020/11/kisspng-symbol-guardia-civil-uniform-5ab073019eea11.5214659915215132176509.png',
                }}
                style={styles.image}
              />
            </View>
            <Text style={styles.name}>{user.user_name}</Text>
            {user.first_name != '' && (
              <Text style={styles.grey}>{user.first_name} • </Text>
            )}
            <Text>{user.user_email}</Text>
            <Text>
              {user.city != '' && (
                <Text style={styles.grey}> • {user.city}</Text>
              )}
              {user.adress != '' && (
                <Text style={styles.grey}> • {user.adress}</Text>
              )}
            </Text>
            <Text>{user.description}</Text>
          </View>
        </View>
        <View style={styles.line}></View>
        {user.first_name != '' && (
          <View style={styles.emailLink}>
            <Text>{user.first_name}</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.emailLink}
          onPress={() => Linking.openURL('mailto:' + user.user_email)}>
          <View>
            <Text>{user.user_email}</Text>
          </View>
        </TouchableOpacity>
        {user.city != '' && (
          <View style={styles.emailLink}>
            <Text>{user.city}</Text>
          </View>
        )}
        {user.adress != '' && (
          <View style={styles.emailLink}>
            <Text>{user.adress}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 10,
  },
  line: {
    height: 0,
    width: '100%',
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    opacity: 0.3,
    marginVertical: 10,
  },
  cardContainer: {
    marginVertical: 10,
  },
  cardHeader: {
    height: 120,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cardBody: {
    position: 'relative',
    alignItems: 'center',
    paddingTop: 60,
    marginBottom: 20,
  },
  imageContainer: {
    position: 'absolute',
    height: 100,
    width: 100,
    backgroundColor: 'grey',
    borderRadius: 100,
    top: -40,
    borderWidth: 5,
    borderColor: 'white',
    overflow: 'hidden',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
  },
  emailLink: {
    textAlign: 'center',
    alignItems: 'center',
    width: '100%',
    borderBottomColor: 'orange',
    borderBottomWidth: 2,
    paddingBottom: 5,
    zIndex: 1,
    marginTop: 50,
  },
  settings: {
    height: 25,
    width: 25,
    position: 'absolute',
    right: 10,
    top: 10,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  plus: {
    height: 30,
    width: 30,
  },
  coverphoto: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  grey: {
    color: 'grey',
  },
});

export default ProfileScreen;
