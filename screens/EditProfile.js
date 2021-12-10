import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import ErrorText from '../components/ErrorText';
import FormikForm from '../components/FormikForm';
import FormInput from '../components/FormInput';
import FormSubmit from '../components/FormSubmit';
import AuthContext from '../Context/Context';
import * as yup from 'yup';
import AppButton from '../components/AppButton';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Schema = yup.object().shape({
  nombre: yup.string(),
  city: yup.string().label('Ciudad'),
  adress: yup.string().label('Dirección'),
});

function EditProfile({navigation}) {
  const {user, setUser} = useContext(AuthContext);
  const [description, setDescription] = useState(
    user.description ? user.description : '',
  );
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingCover, setUpdatingCover] = useState(false);

  useEffect(() => {
    console.log(
      'uri',
      'https://uoapp.es/wp-content/uploads/ultimatemember/' +
        user.user_id +
        '/' +
        user.coverphoto,
    );
  }, []);

  const handleSubmit = values => {
    setLoading(true);
    setError();
    let formData = new FormData();
    formData.append('type', 'updateProfile');
    formData.append('userName', user.user_login);
    formData.append('city', values.city);
    formData.append('first_name', values.nombre);
    formData.append('adress', values.adress);
    formData.append('description', description);

    return fetch('https://uoapp.es/authenticate.php', {
      method: 'POST',
      body: formData,
    })
      .then(async response => await response.json())
      .then(async responseJson => {
        if (!responseJson.status) {
          setError(responseJson.msg);
          setLoading(false);
          return;
        }
        let updatedUser = {...user};
        updatedUser.first_name = values.nombre;
        updatedUser.city = values.city;
        updatedUser.adress = values.adress;
        updatedUser.description = description;
        try {
          let jsonValue = JSON.stringify(updatedUser);
          await AsyncStorage.removeItem('user');
          await AsyncStorage.setItem('user', jsonValue);
        } catch (error) {
          console.log('error storing data in local storage');
        }
        setUser(updatedUser);
        setLoading(false);
        navigation.navigate('profile');
      })
      .catch(error => {
        console.error('hhh', error);
        setLoading(false);
      });
  };

  const upDatePhoto = (image, type) => {
    if (type == 'cover_photo') {
      setUpdatingCover(true);
    } else {
      setUpdatingProfile(true);
    }

    setError('');
    let imagedata = {...image[0]};

    let formData = new FormData();
    formData.append('type', 'uploadFile');
    formData.append('userId', 95);
    formData.append('photoType', type);

    const uriPart = image[0].uri.split('.');
    const fileExtension = uriPart[uriPart.length - 1];
    console.log('uptype', type);
    formData.append('image', {
      uri: image[0].uri,
      name: `photo.${fileExtension}`,
      type: `image/${fileExtension}`,
    });

    return fetch('https://uoapp.es/authenticate.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(async response => await response.json())
      .then(async responseJson => {
        if (!responseJson.status) {
          // setError(responseJson.msg);
          console.log('image error', responseJson.msg);
          setUpdatingProfile(false);
          setUpdatingCover(false);
          return;
        }
        let updatedUser = {...user};
        if (type == 'cover_photo') {
          updatedUser.coverphoto = responseJson.name;
        } else {
          updatedUser.profilePhoto = responseJson.name;
        }

        try {
          let jsonValue = JSON.stringify(updatedUser);
          await AsyncStorage.removeItem('user');
          await AsyncStorage.setItem('user', jsonValue);
        } catch (error) {
          console.log('error storing data in local storage');
        }
        setUser(updatedUser);
        setUpdatingCover(false);
        setUpdatingProfile(false);
      })
      .catch(error => {
        console.error('hhh', error);
        setUpdatingProfile(false);
      });
  };

  const pickImageFromGallery = type => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.errorMessage) {
        console.log('error picking image');
        return;
      }
      if (!response.didCancel) {
        upDatePhoto(response.assets, type);
      }
    });
  };

  const pickImageFromCamera = type => {
    launchCamera({mediaType: 'photo', saveToPhotos: false}, response => {
      if (response.errorMessage) {
        console.log('error picking image');
        return;
      }
      if (!response.didCancel) {
        upDatePhoto(response.assets);
        console.log('Rohit', response.assets, type);
      }
    });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Perfil</Text>
        <View style={styles.line}></View>
        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <View style={styles.coverphoto}>
              {user.coverphoto && (
                <Image
                  key={Date.now()}
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

              {updatingCover && (
                <ActivityIndicator
                  animating={updatingCover}
                  size={40}
                  color={'green'}
                  style={{zIndex: 2, position: 'absolute'}}
                />
              )}
            </View>
            <View style={styles.plus}>
              {!updatingCover && (
                <Menu style={styles.settings}>
                  <MenuTrigger>
                    <View>
                      <Image
                        source={require('../assets/plus.png')}
                        style={styles.image}
                      />
                    </View>
                  </MenuTrigger>
                  <MenuOptions>
                    <MenuOption
                      onSelect={async () => {
                        pickImageFromGallery('cover_photo');
                      }}
                      text="Subir foto de portada"
                    />
                    <MenuOption
                      onSelect={() => {
                        pickImageFromCamera('cover_photo');
                      }}
                      text="cámara"
                    />

                    <View style={[styles.line, {marginVertical: 1}]}></View>
                    <MenuOption
                      onSelect={() => alert(`Delete`)}
                      text="Cancelar"
                    />
                  </MenuOptions>
                </Menu>
              )}
            </View>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.imageContainer}>
              <Image
                key={Date.now()}
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

              <View style={styles.CameraIcon}>
                {updatingProfile && (
                  <ActivityIndicator
                    animating={updatingProfile}
                    size={40}
                    color={'green'}
                    style={{zIndex: 2, position: 'absolute'}}
                  />
                )}

                {!updatingProfile && (
                  <Menu style={styles.settings}>
                    <MenuTrigger>
                      <View style={{height: 25, width: 25}}>
                        <Image
                          source={require('../assets/camera.png')}
                          style={styles.image}
                        />
                      </View>
                    </MenuTrigger>
                    <MenuOptions>
                      <MenuOption
                        onSelect={() => {
                          pickImageFromGallery('profile_photo');
                        }}
                        text="Subir foto de portada"
                      />
                      <MenuOption
                        onSelect={() => {
                          pickImageFromCamera('profile_photo');
                        }}
                        text="cámara"
                      />

                      <View style={[styles.line, {marginVertical: 1}]}></View>
                      <MenuOption
                        onSelect={() => alert(`Delete`)}
                        text="Cancelar"
                      />
                    </MenuOptions>
                  </Menu>
                )}
              </View>
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
            <TextInput
              multiline
              value={description}
              onChangeText={value => setDescription(value)}
              numberOfLines={3}
              style={styles.input}
              placeholder="Cuentanos un poco mas sobre ti..."
              placeholderTextColor="green"
            />
          </View>
        </View>
        <View style={styles.line}></View>
        <View style={{marginVertical: 30}}>
          <ErrorText
            visible={true}
            error={error}
            style={{textAlign: 'center'}}
          />
          <FormikForm
            initialValues={{
              nombre: user.first_name ? user.first_name : '',
              city: user.city ? user.city : '',
              adress: user.adress ? user.adress : '',
            }}
            onSubmit={values => handleSubmit(values)}
            validationSchema={Schema}>
            <FormInput
              feildName="nombre"
              autoCapitalize="none"
              placeholder="Nombre"
            />
            <FormInput feildName="city" placeholder="Ciudad " />
            <FormInput feildName="adress" placeholder="Dirección" />
            <FormSubmit
              loading={loading}
              title="Actualizar perfil"
              backgroundColor={'green'}
              color={'white'}
              style={{marginTop: 40, textTransform: 'capitalize'}}
              // textStyle={{textTransform: 'none'}}
            />
            <AppButton
              title="Cancelar"
              backgroundColor={'#D9D9D9'}
              color={'black'}
              onPress={() => navigation.navigate('profile')}
            />
          </FormikForm>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingBottom: 150,
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
  coverphoto: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  plus: {
    height: 30,
    width: 30,
  },
  input: {
    borderWidth: 1,
    width: '80%',
    marginVertical: 5,
    borderColor: 'darkgrey',
    fontSize: 18,
    textAlignVertical: 'top',
  },
  CameraIcon: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0,0.3)',
    zIndex: 2,
  },
});

export default EditProfile;
