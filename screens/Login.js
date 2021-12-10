import React, {useContext, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import FormikForm from '../components/FormikForm';
import FormInput from '../components/FormInput';
import FormSubmit from '../components/FormSubmit';
import * as yup from 'yup';
import ErrorText from '../components/ErrorText';
import AuthContext from '../Context/Context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Schema = yup.object().shape({
  user: yup.string().required('Usuario requerido').label('Usuario'),
  password: yup
    .string()
    .required('Contraseña requerida')

    .label('Contraseña'),
});

function Login({navigation}) {
  const [error, setError] = useState('');
  const {user, setUser} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleSubmit = values => {
    setLoading(true);
    setError();
    let formData = new FormData();
    formData.append('type', 'login');
    formData.append('email', values.user);
    formData.append('password', values.password);

    return fetch('https://uoapp.es/authenticate.php', {
      method: 'POST',
      body: formData,
    })
      .then(async response => await response.json())
      .then(async responseJson => {
        let data = responseJson;
        if (!data.status) {
          setError(data.msg);
          setLoading(false);
          return;
        }
        console.log('data', data);
        try {
          let jsonValue = JSON.stringify(data.data);
          await AsyncStorage.setItem('user', jsonValue);
        } catch (error) {
          console.log('error storing data in local storage');
        }
        setUser(data.data);
      })
      .catch(error => {
        console.error('hhh', error);
        setLoading(false);
      });
  };

  return (
    <KeyboardAvoidingView style={{backgroundColor: 'white', flex: 1}}>
      <ScrollView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        contentContainerStyle={{paddingBottom: 50}}>
        <View style={styles.container}>
          <View style={{height: '80%'}}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/logo-uo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <ErrorText
              visible={true}
              error={error}
              style={{textAlign: 'center'}}
            />
            <FormikForm
              initialValues={{user: '', password: ''}}
              onSubmit={values => handleSubmit(values)}
              validationSchema={Schema}>
              <FormInput
                feildName="user"
                autoCapitalize="none"
                placeholder="Usuario"
              />
              <FormInput
                feildName="password"
                placeholder="Contraseña"
                textContentType="password"
                secureTextEntry={true}
              />
              <FormSubmit
                loading={loading}
                title="ingresar"
                backgroundColor={'green'}
                color={'white'}
                style={{marginTop: 40}}
              />
              <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.push('register')}>
                  <View>
                    <Text style={styles.footerText}>Crea tu cuenta</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.push('forgotPassword')}>
                  <View>
                    <Text style={styles.footerText}>Recordar Contraseña</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </FormikForm>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    // height: '100%',
    paddingHorizontal: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingBottom: 160,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 150,
    height: 150,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: 'grey',
    marginBottom: 3,
  },
});

export default Login;
