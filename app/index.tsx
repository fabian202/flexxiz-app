import React, { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import LoginForm  from './LoginForm'

export default function Index() {
  const handleLogin = (values: { username: string; password: string }) => {
    // Implement your login logic here
    Alert.alert('Success', `Logged in as ${values.username}`);
  }

  return (
    <SafeAreaProvider>
      <LoginForm onLogin={handleLogin} />
    </SafeAreaProvider>
  )
}
