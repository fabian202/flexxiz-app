import { useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import { Alert, Linking } from 'react-native'

export const useLogin = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<any>(null)

  const login = async (username: string, password: string) => {
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
      return
    }

    const data = await response.json()
    setLoading(false)
    setData(data)
    setItem('credentials', body)
    //Redirect

    const authToken = data?.AuthorizationToken?.access_token

    //Use Linking component
    Alert.alert('redirect', `redirect to url ${process.env.EXPO_PUBLIC_REDIRECT_URL}?token=${authToken}`)
  }

  const secureLogin = async () => {
    const credentials = await getItem('credentials')

    if (credentials) {
      const { Name: username, Pass: password } = JSON.parse(credentials)
      login(username, password)
    }
  }

  const setItem = async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value)
  }

  const getItem = async (key: string) => SecureStore.getItemAsync(key)

  const checkSecureCredentials = async () => {
    const credentials = await getItem('credentials')
    return !!credentials
  }

  return { login, loading, error, data, secureLogin, checkSecureCredentials }
}
