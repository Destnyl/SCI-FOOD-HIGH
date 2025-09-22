import { defineStore } from 'pinia'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth } from '../utils/firebase'

type UserRole = 'student' | 'staff' | null

interface AuthState {
  firebaseUser: User | null
  userRole: UserRole
  displayName: string | null
  lrnOrName: string | null
  isReady: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    firebaseUser: null,
    userRole: null,
    displayName: null,
    lrnOrName: null,
    isReady: false,
  }),
  getters: {
    isAuthenticated: (s) => !!s.firebaseUser,
  },
  actions: {
    init() {
      if (this.isReady) return
      // restore role and identifier from localStorage
      const savedRole = localStorage.getItem('sfh_role') as UserRole | null
      const savedId = localStorage.getItem('sfh_identifier')
      const savedName = localStorage.getItem('sfh_displayName')
      this.userRole = savedRole
      this.lrnOrName = savedId
      this.displayName = savedName
      onAuthStateChanged(auth, (user) => {
        this.firebaseUser = user
        this.isReady = true
      })
    },
    async loginWithCredentials(identifier: string, password: string, role: 'student' | 'staff') {
      // For demo simplicity, we map identifier to email: <identifier>@scifood.local
      const email = `${identifier}@scifood.local`
      await signInWithEmailAndPassword(auth, email, password)
      this.userRole = role
      this.lrnOrName = identifier
      this.displayName = identifier
      localStorage.setItem('sfh_role', role)
      localStorage.setItem('sfh_identifier', identifier)
      localStorage.setItem('sfh_displayName', identifier)
    },
    async logout() {
      await signOut(auth)
      this.firebaseUser = null
      this.userRole = null
      this.displayName = null
      this.lrnOrName = null
      localStorage.removeItem('sfh_role')
      localStorage.removeItem('sfh_identifier')
      localStorage.removeItem('sfh_displayName')
    },
  },
})

