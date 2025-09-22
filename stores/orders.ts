import { defineStore } from 'pinia'
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import type { CartItem } from './cart'
import { v4 as uuidv4 } from 'uuid'
import { useAuthStore } from './auth'

export interface OrderItem { id: string; name: string; quantity: number }
export interface Order {
  id: string
  userId: string
  identifier: string // Student's LRN or Staff identifier
  email?: string // Student's email address (optional for existing orders)
  slot: 'AM Recess' | 'Lunch' | 'PM Recess'
  items: OrderItem[]
  status: 'pending' | 'confirmed' | 'completed'
  claimCode: string
  createdAt: number
}

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    myOrders: [] as Order[],
    allOrders: [] as Order[],
  }),
  getters: {
    completedOrders: (s) => s.allOrders.filter((o) => o.status === 'completed'),
    pendingCount: (s) => s.allOrders.filter((o) => o.status === 'pending').length,
    confirmedToday: (s) => s.allOrders.filter((o) => o.status === 'confirmed').length,
    completedToday: (s) => s.allOrders.filter((o) => o.status === 'completed').length,
  },
  actions: {
    initStudent() {
      const auth = useAuthStore()
      const { $db } = useNuxtApp()
      console.log('Initializing student orders for user:', auth.lrnOrName);
      const q = query(
        collection($db, 'orders'),
        where('userId', '==', auth.lrnOrName || ''),
        orderBy('createdAt', 'desc'),
      )
      onSnapshot(q, (snap) => {
        console.log('Firestore snapshot received, docs count:', snap.docs.length);
        this.myOrders = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Order[]
        console.log('Updated myOrders:', this.myOrders);
      })
    },
    initStaff() {
      const { $db } = useNuxtApp()
      const q = query(collection($db, 'orders'), orderBy('createdAt', 'desc'))
      onSnapshot(q, (snap) => {
        this.allOrders = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Order[]
      })
    },
    async placeOrder(items: CartItem[], slot: Order['slot']) {
      const auth = useAuthStore()
      const { $db, $auth } = useNuxtApp()
      const claimCode = uuidv4().slice(0, 6).toUpperCase()
      console.log('Placing order for user:', auth.lrnOrName);
      
      // Get the actual email from Firebase Auth
      const userEmail = $auth.currentUser?.email || `${auth.lrnOrName}@scifood.local`
      console.log('Firebase Auth user:', $auth.currentUser);
      console.log('User email from Firebase:', $auth.currentUser?.email);
      console.log('Final email to use:', userEmail);
      
      const orderData = {
        userId: auth.lrnOrName,
        identifier: auth.lrnOrName, // Store the LRN/identifier separately
        email: userEmail, // Use actual Firebase Auth email
        slot,
        items: items.map((i) => ({ id: i.id, name: i.name, quantity: i.quantity })),
        status: 'pending',
        claimCode,
        createdAt: Date.now(),
        createdAtServer: serverTimestamp(),
      }
      console.log('Order data:', orderData);
      await addDoc(collection($db, 'orders'), orderData)
      return claimCode
    },
    async confirmOrder(id: string) {
      const { $db } = useNuxtApp()
      await updateDoc(doc($db, 'orders', id), { status: 'confirmed' })
    },
    async completeOrder(id: string) {
      const { $db } = useNuxtApp()
      await updateDoc(doc($db, 'orders', id), { status: 'completed' })
    },
  },
})
