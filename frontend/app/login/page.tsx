
'use client'

// react
import { useState } from 'react'

// next
import { useRouter } from 'next/navigation'

// components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// lib
import { login, signup } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState('login')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleChangeTab = (tab: string) => {
    setActiveTab(tab)
    setError('')
  }

  const handleRedirect = () => {
    router.push('/')
  }

  const handleLogin = async () => {
    setLoading(true)
    setError('')

    if (!formData.email || !formData.password) {
      setError('All fields are required')
      setLoading(false)
      return
    }

    const tokens = await login(formData.email, formData.password)
    
    if(tokens) handleRedirect()
    else setError('Incorrect Username or Password')

    setLoading(false)
  }

  const handleSignup = async () => {
    setLoading(true)
    setError('')
    
    if (!formData.username || !formData.email || !formData.password) {
      setError('All fields are required')
      setLoading(false)
      return
    }

    const tokens = await signup(formData.username, formData.email, formData.password)
    
    if(tokens) handleRedirect()

    setLoading(false)
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to Eloquent AI</CardTitle>
          <CardDescription>
            {activeTab === 'login' ? 'Login to your account' : 'Create a new account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleChangeTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="signup">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {error && (
            <div className="text-red-500 mt-4 text-sm">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={activeTab === 'login' ? handleLogin : handleSignup}
            disabled={loading}
          >
            {loading ? 'Processing...' : activeTab === 'login' ? 'Login' : 'Sign Up'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
