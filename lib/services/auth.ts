export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'ADMIN' | 'BASIC'
  createdAt: string
}

export const authService = {
  // Sign up
  async signUp(data: { firstName: string; lastName: string; email: string; password: string }): Promise<{ user: User }> {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create account')
    }

    return response.json()
  },

  // Sign in
  async signIn(data: { email: string; password: string }): Promise<{ user: User }> {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to sign in')
    }

    return response.json()
  },

  // Get current user from localStorage
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null
    
    const userData = localStorage.getItem('user')
    if (!userData) return null

    try {
      return JSON.parse(userData)
    } catch {
      localStorage.removeItem('user')
      return null
    }
  },

  // Sign out
  signOut(): void {
    localStorage.removeItem('user')
    window.location.href = '/'
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  }
} 