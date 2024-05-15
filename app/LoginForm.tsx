import React from 'react'
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native'
import { Formik } from 'formik'
import * as Yup from 'yup'
import * as LocalAuthentication from 'expo-local-authentication'

interface LoginFormProps {
  onLogin: (values: { username: string; password: string }) => void
}

const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
})

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const handleBiometricAuth = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync()
      if (!hasHardware) {
        Alert.alert('Error', 'Biometric hardware not available')
        return
      }

      console.log('hasHardware', hasHardware)

      const biometricRecords = await LocalAuthentication.isEnrolledAsync()
      if (!biometricRecords) {
        Alert.alert('Error', 'No biometric records found')
        return
      }

      console.log('biometricRecords', biometricRecords)

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate with Face ID or Touch ID',
        fallbackLabel: 'Use Passcode',
      });

      console.log(result)

      if (result.success) {
        Alert.alert('Success', 'Biometric Authentication Successful')
        onLogin({ username: 'biometricUser', password: 'biometricPass' })
      } else {
        Alert.alert('Failure', 'Biometric Authentication Failed')
      }
    } catch (e) {
      Alert.alert('Error', `Biometric Authentication Error:`)
    }
  }

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={LoginSchema}
      onSubmit={(values) => {
        if (onLogin) {
          onLogin(values)
        } else {
          Alert.alert('Success', `Logged in as ${values.username}`)
        }
      }}
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
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
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
          <Button
            title="Login"
            onPress={() => handleSubmit()}
            disabled={isSubmitting}
          />
          <View style={styles.separator} />
          <Button
            title="Use Biometric Authenticationn"
            onPress={handleBiometricAuth}
          />
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
})

export default LoginForm
