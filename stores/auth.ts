import { defineStore } from 'pinia'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'

type UserRole = 'student' | 'staff' | null

interface AuthState {
  firebaseUser: User | null
  userRole: UserRole
  displayName: string | null
  lrnOrName: string | null
  email: string | null
  isReady: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    firebaseUser: null,
    userRole: null,
    displayName: null,
    lrnOrName: null,
    email: null,
    isReady: false,
  }),
  getters: {
    isAuthenticated: (s) => !!s.firebaseUser,
  },
  actions: {
    init() {
      if (this.isReady) return
      // Only access localStorage on client side
      if (process.client) {
        // restore role and identifier from localStorage
        const savedRole = localStorage.getItem('sfh_role') as UserRole | null
        const savedId = localStorage.getItem('sfh_identifier')
        const savedName = localStorage.getItem('sfh_displayName')
        const savedEmail = localStorage.getItem('sfh_email')
        this.userRole = savedRole
        this.lrnOrName = savedId
        this.displayName = savedName
        this.email = savedEmail
      }
      
      // Initialize Firebase auth - ensure it's available
      try {
        const { $auth } = useNuxtApp()
        if ($auth) {
          onAuthStateChanged($auth, (user) => {
            this.firebaseUser = user
            if (user) {
              this.email = user.email
            } else {
              this.email = null
            }
            this.isReady = true
          })
        } else {
          console.warn('Firebase auth not ready, marking as ready without Firebase listener')
          this.isReady = true
        }
      } catch (error) {
        console.warn('Firebase not initialized yet, marking as ready:', error)
        this.isReady = true
      }
    },
    async loginWithCredentials(identifier: string, password: string, role: 'student' | 'staff') {
      // For demo simplicity, we map identifier to email: <identifier>@scifood.local
      const email = `${identifier}@scifood.local`
      const { $auth } = useNuxtApp()
      console.log('Attempting login with email:', email);
      const userCredential = await signInWithEmailAndPassword($auth, email, password)
      console.log('Login successful, user:', userCredential.user);
      console.log('User email from credential:', userCredential.user.email);
      this.userRole = role
      this.lrnOrName = identifier
      this.email = userCredential.user.email
      console.log('Auth store email set to:', this.email);
      this.displayName = identifier
      
      if (process.client) {
        localStorage.setItem('sfh_role', role)
        localStorage.setItem('sfh_identifier', identifier)
        localStorage.setItem('sfh_displayName', identifier)
        localStorage.setItem('sfh_email', email)
      }
    },
    async logout() {
      const { $auth } = useNuxtApp()
      await signOut($auth)
      this.firebaseUser = null
      this.userRole = null
      this.displayName = null
      this.lrnOrName = null
      this.email = null
      
      if (process.client) {
        localStorage.removeItem('sfh_role')
        localStorage.removeItem('sfh_identifier')
        localStorage.removeItem('sfh_displayName')
        localStorage.removeItem('sfh_email')
      }
    },
  },
})
