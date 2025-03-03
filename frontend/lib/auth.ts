
export async function signup(username: string, email: string, password: string) {
  try {
    const response = await fetch('/api/auth/signup', 
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          email,
          password
        })
      })
  
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail)
    }
  
    const { user_id } = await response.json()
    
    return user_id
  } 
  catch (error) {
    console.error('Error signing up:', error)
    return null
  }
}

export async function login(email: string, password: string) {
  try {    
    const formData = new FormData()

    formData.append('username', email)
    formData.append('password', password)
  
    const response = await fetch('/api/auth/token', 
      {
        method: 'POST',
        credentials: 'include',
        body: formData,
      }
    )
  
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Login failed')
    }
  
    const { user_id } = await response.json()

    return user_id
  }
  catch (error) {
    console.error('Error logging in:', error)
    return null
  }
}

export async function validateToken() {
  try {
    const response = await fetch('/api/auth/validate', 
      {
        method: 'POST',
        credentials: 'include',
      }
    )
  
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail)
    }
  
    const { user_id } = await response.json()

    return user_id
  }
  catch (error) {
    console.error('Error validating tokens:', error)
    return null
  }
}

export async function refreshAccessToken() {
  try {
    const response = await fetch('/api/auth/refresh', 
      {
        method: 'POST',
        credentials: 'include',
      }
    )
  
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail)
    }
  
    const { user_id } = await response.json()

    return user_id
  }
  catch (error) {
    console.error('Error refreshing token:', error)
    return null
  }
}
