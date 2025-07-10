"use client"

import React from "react"
import { useState, useEffect, createContext, useContext } from "react"
import { authAPI } from "../lib/api"

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  is_staff: boolean
  is_superuser: boolean
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem("access_token")
    if (token) {
      // Validate token with backend and get real user info
      const validateToken = async () => {
        try {
          const response = await authAPI.me()
          setUser(response.data)
        } catch (error) {
          // Token is invalid, remove it
          console.error("Token validation failed:", error)
          localStorage.removeItem("access_token")
          localStorage.removeItem("refresh_token")
          setUser(null)
        }
      }
      
      validateToken()
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log("Attempting login for:", username)
      console.log("API Base URL:", process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api")
      
      const response = await authAPI.login({ username, password })
      console.log("Login response:", response.data)
      
      const { access, refresh, user: userData } = response.data

      localStorage.setItem("access_token", access)
      localStorage.setItem("refresh_token", refresh)
      setUser(userData)

      return true
    } catch (error) {
      console.error("Login failed:", error)
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any
        console.error("Response data:", axiosError.response?.data)
        console.error("Response status:", axiosError.response?.status)
      }
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    setUser(null)
  }

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
