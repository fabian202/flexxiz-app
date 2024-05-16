import React, { useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import LoginForm  from './LoginForm'

export default function Index() {

  return (
    <SafeAreaProvider>
      <LoginForm  />
    </SafeAreaProvider>
  )
}
