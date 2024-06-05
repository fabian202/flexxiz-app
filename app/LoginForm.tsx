import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'
import * as LocalAuthentication from 'expo-local-authentication'
import { useLogin } from '../hooks/useLogin'

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
})

const LoginForm: React.FC = () => {
  const {
    login,
    loading,
    error,
    data,
    secureLogin,
    checkSecureCredentials,
  } = useLogin()

  const [canUseBio, setCanUseBio] = useState<boolean>(false)

  useEffect(() => {
    const checkCredentials = async () => {
      const presentCredentials = await checkSecureCredentials()
      setCanUseBio(presentCredentials)
      // presentCredentials && handleBiometricAuth()
    }

    checkCredentials()
  }, [canUseBio])

  const handleBiometricAuth = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync()
      if (!hasHardware) {
        Alert.alert('Error', 'Biometric hardware not available')
        return
      }

      const biometricRecords = await LocalAuthentication.isEnrolledAsync()
      if (!biometricRecords) {
        Alert.alert('Error', 'No biometric records found')
        return
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with Face ID or Touch ID',
        fallbackLabel: 'Use Passcode',
      })

      if (result.success) {
        // Alert.alert('Success', 'Biometric Authentication Successful')
        // onLogin({ username: 'biometricUser', password: 'biometricPass' })
        secureLogin()
      } else {
        Alert.alert('Failure', 'Biometric Authentication Failed')
      }
    } catch (e) {
      Alert.alert('Error', `Biometric Authentication Error:`)
    }
  }

  const handleSubmit = (values: { username: string; password: string }) => {
    login(values.username, values.password)
  }

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={LoginSchema}
      onSubmit={handleSubmit}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
      }) => (
        <View style={styles.container}>
          <Image
            style={styles.image}
            source={require('../assets/images/logo-flexxiz.png')}
          />
          <View style={styles.separatorLine} />
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="E-mail or telephone"
            onChangeText={handleChange('username')}
            onBlur={handleBlur('username')}
            value={values.username}
          />
          {errors.username && touched.username ? (
            <Text style={styles.error}>{errors.username}</Text>
          ) : null}
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={handleChange('password')}
            onBlur={handleBlur('password')}
            value={values.password}
            secureTextEntry
          />
          {errors.password && touched.password ? (
            <Text style={styles.error}>{errors.password}</Text>
          ) : null}
          {loading ? (
            <ActivityIndicator size="large" color="#337ab7" />
          ) : (
            <Pressable style={styles.button} onPress={() => handleSubmit()}>
              <Text style={styles.buttonLabel}>Login</Text>
            </Pressable>
          )}
          <View style={styles.separator} />
          <Pressable
            style={[styles.outlinedButton, (!canUseBio || loading) && styles.buttonDisabled]}
            onPress={handleBiometricAuth}
            disabled={!canUseBio || loading}
          >
            <Text style={styles.outlinedButtonLabel}>Use Biometric Authentication</Text>
          </Pressable>
          {/* <View style={styles.separatorLine} /> */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2021 Flexxiz Corporation</Text>
          </View>
        </View>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  error: {
    fontSize: 12,
    color: 'red',
    marginBottom: 8,
  },
  separator: {
    height: 20,
  },
  image: {
    width: 220,
    height: 100,
    alignSelf: 'center',
  },
  button: {
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#337ab7',
    borderBlockColor: '#2e6da4',
    height: 40,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  separatorLine: {
    height: 2,
    backgroundColor: 'rgb(124, 183, 42)',
    marginVertical: 20, // Adjust the margin as needed
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    alignItems: 'center',
    margin: 15 
  },
  footerText: {
    color: 'gray',
    textAlign: 'center',
  },
  outlinedButton: {
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlinedButtonLabel: {
    fontSize: 16,
    color: '#337ab7'
  }
})

export default LoginForm
