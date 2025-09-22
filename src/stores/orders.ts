import { defineStore } from 'pinia'
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import { db } from '../utils/firebase'
import type { CartItem } from './cart'
import { v4 as uuidv4 } from 'uuid'
import { useAuthStore } from './auth'

export interface OrderItem { id: string; name: string; quantity: number }
export interface Order {
  id: string
  userId: string
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
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', auth.lrnOrName || ''),
        orderBy('createdAt', 'desc'),
      )
      onSnapshot(q, (snap) => {
        this.myOrders = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Order[]
      })
    },
    initStaff() {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
      onSnapshot(q, (snap) => {
        this.allOrders = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Order[]
      })
    },
    async placeOrder(items: CartItem[], slot: Order['slot']) {
      const auth = useAuthStore()
      const claimCode = uuidv4().slice(0, 6).toUpperCase()
      await addDoc(collection(db, 'orders'), {
        userId: auth.lrnOrName,
        slot,
        items: items.map((i) => ({ id: i.id, name: i.name, quantity: i.quantity })),
        status: 'pending',
        claimCode,
        createdAt: Date.now(),
        createdAtServer: serverTimestamp(),
      })
      return claimCode
    },
    async confirmOrder(id: string) {
      await updateDoc(doc(db, 'orders', id), { status: 'confirmed' })
    },
    async completeOrder(id: string) {
      await updateDoc(doc(db, 'orders', id), { status: 'completed' })
    },
  },
})

