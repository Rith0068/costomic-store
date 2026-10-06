import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    api
      .me()
      .then((data) => {
        if (active) setUser(data.user)
      })
      .catch(() => {
        if (active) setUser(null)
      })
      .finally(() => {
        if (active) setReady(true)
      })
    return () => {
      active = false
    }
  }, [])

  const login = useCallback(async (credentials) => {
    const data = await api.login(credentials)
    setUser(data.user)
    return data
  }, [])

  const register = useCallback(async (details) => {
    const data = await api.register(details)
    setUser(data.user)
    return data
  }, [])

  const applyUser = useCallback((next) => {
    setUser(next)
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.logout()
    } finally {
      setUser(null)
    }
  }, [])

  const value = useMemo(
    () => ({ user, ready, login, register, logout, applyUser, isAdmin: user?.role === 'admin' }),
    [user, ready, login, register, logout, applyUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
