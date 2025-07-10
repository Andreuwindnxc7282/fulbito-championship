"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trophy, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { loginAsAdmin, isAdmin } from "@/lib/auth-utils"
import { useToast } from "@/hooks/use-toast"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const success = await login(username, password)
      if (success) {
        toast({
          title: "Login exitoso",
          description: "Bienvenido al sistema",
        })
        
        // Verificar si es admin para redirigir al dashboard correcto
        if (isAdmin()) {
          router.push("/admin/dashboard")
        } else {
          router.push("/")
        }
      } else {
        setError("Credenciales inválidas")
      }
    } catch (err) {
      setError("Error al iniciar sesión")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdminLogin = async () => {
    setIsLoading(true)
    setError("")

    try {
      const result = await loginAsAdmin()
      
      if (result.success) {
        toast({
          title: "Login Admin exitoso",
          description: "Bienvenido, Administrador",
        })
        router.push("/admin/dashboard")
      } else {
        setError(result.message)
        toast({
          title: "Error de login admin",
          description: result.message,
          variant: "destructive"
        })
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-blue-500">
              <Trophy className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">FulbitoManager</CardTitle>
          <CardDescription>Ingresa a tu cuenta para gestionar el campeonato</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                O
              </span>
            </div>
          </div>

          <Button 
            type="button"
            variant="outline"
            className="w-full bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
            onClick={handleAdminLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Accediendo como Admin...
              </>
            ) : (
              <>
                <Trophy className="mr-2 h-4 w-4" />
                Login Rápido como Administrador
              </>
            )}
          </Button>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Credenciales de prueba:</p>
            <p className="font-mono bg-gray-100 p-2 rounded mt-2">
              Usuario: admin
              <br />
              Contraseña: admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
