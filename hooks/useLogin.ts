import { useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import { Alert, Linking } from 'react-native'

export const useLogin = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  const login = async (
    username: string,
    password: string,
    biometrics: boolean
  ) => {
    setLoading(true)
    setError(null)

    const yourDate = new Date()

    const body = JSON.stringify({
      Name: username,
      Pass: password,
      LogDate: yourDate.toISOString().split('T')[0],
    })

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/Authentication`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      }
    )

    if (!response.ok) {
      setLoading(false)
      setError('Login failed')
      await clearItem('credentials')
      return
    }

    const data = await response.json()

    if (data === null) {
      setLoading(false)
      const errorMessage = 'User name or password is incorrect.'
      setError(errorMessage)
      Alert.alert(errorMessage)
      setItem('credentials', '')
      await clearItem('credentials')
      return
    }

    setLoading(false)
    setData(data)
    setItem('credentials', body)

    const authToken = data?.AuthorizationToken?.access_token
    const refreshToken = data?.AuthorizationToken?.refresh_token

    const url = `${process.env.EXPO_PUBLIC_REDIRECT_URL}?token=${authToken}|${
      biometrics ? '1' : '0'
    }&refresh_token=${refreshToken}`

    const canOpenUrl = await Linking.canOpenURL(url)

    // Alert.alert(url)

    if (canOpenUrl) {
      await Linking.openURL(url)
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`)
    }
  }

  const secureLogin = async () => {
    const credentials = await getItem('credentials')

    if (credentials) {
      const { Name: username, Pass: password } = JSON.parse(credentials)
      login(username, password, true)
    }
  }

  const setItem = (key: string, value: string) =>
    SecureStore.setItem(key, value)

  const getItem = (key: string) => SecureStore.getItem(key)

  const clearItem = async (key: string) => {
    await SecureStore.deleteItemAsync(key)
  }

  const checkSecureCredentials = () => {
    const credentials = getItem('credentials')
    return !!credentials
  }

  return { login, loading, error, data, secureLogin, checkSecureCredentials }
}
