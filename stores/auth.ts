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
        const { $auth, $db } = useNuxtApp()
        if ($auth) {
          onAuthStateChanged($auth, async (user) => {
            this.firebaseUser = user
            if (user) {
              // Try to fetch user data from Firestore
              const { collection, query, where, getDocs } = await import('firebase/firestore')
              try {
                const usersRef = collection($db, 'users')
                const q = query(usersRef, where('uid', '==', user.uid))
                const querySnapshot = await getDocs(q)
                
                if (!querySnapshot.empty) {
                  const userData = querySnapshot.docs[0].data()
                  this.userRole = userData.userType
                  this.lrnOrName = userData.identifier
                  this.email = userData.email
                  this.displayName = userData.displayName
                }
              } catch (error) {
                console.warn('Error fetching user data from Firestore:', error)
                // Keep the data from localStorage if Firestore fetch fails
              }
            } else {
              this.email = null
              this.userRole = null
              this.lrnOrName = null
              this.displayName = null
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
    async checkUserType(identifier: string) {
      const { $db } = useNuxtApp()
      const { collection, query, where, getDocs } = await import('firebase/firestore')
      const usersRef = collection($db, 'users')
      const q = query(usersRef, where('identifier', '==', identifier))
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data()
        return userData.userType
      }
      return null
    },

    async loginWithCredentials(identifier: string, password: string, newUserType?: 'student' | 'staff' | null) {
      // Check if user exists in Firestore to get their type
      let userType = await this.checkUserType(identifier)
      
      // If user doesn't exist in Firestore but we have a new user type, use that
      if (!userType && newUserType) {
        userType = newUserType
      }

      // For demo simplicity, we map identifier to email: <identifier>@scifood.local
      const email = `${identifier}@scifood.local`
      const { $auth, $db } = useNuxtApp()
      console.log('Attempting login with email:', email);
      
      const userCredential = await signInWithEmailAndPassword($auth, email, password)
      console.log('Login successful, user:', userCredential.user);
      
      // Fetch user data from Firestore
      const { collection, query, where, getDocs, setDoc, doc } = await import('firebase/firestore')
      const usersRef = collection($db, 'users')
      const q = query(usersRef, where('uid', '==', userCredential.user.uid))
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data()
        this.userRole = userData.userType
        this.lrnOrName = userData.identifier
        this.email = userData.email
        this.displayName = userData.displayName
      } else {
        // Create new user document in Firestore
        const newUserData = {
          uid: userCredential.user.uid,
          identifier: identifier,
          userType: userType,
          email: email,
          displayName: identifier,
          createdAt: new Date().toISOString(),
        }
        
        try {
          await setDoc(doc(usersRef, userCredential.user.uid), newUserData)
          this.userRole = userType
          this.lrnOrName = identifier
          this.email = email
          this.displayName = identifier
        } catch (error) {
          console.error('Error creating user document:', error)
          throw new Error('Failed to create user account')
        }
      }
      
      if (process.client) {
        localStorage.setItem('sfh_role', this.userRole!)
        localStorage.setItem('sfh_identifier', this.lrnOrName!)
        localStorage.setItem('sfh_displayName', this.displayName!)
        localStorage.setItem('sfh_email', this.email!)
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
