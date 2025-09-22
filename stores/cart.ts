import { defineStore } from 'pinia'
import type { MenuItem } from './menu'

export interface CartItem extends MenuItem { quantity: number }

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),
  actions: {
    addToCart(item: MenuItem) {
      const found = this.items.find((i) => i.id === item.id)
      if (found) found.quantity += 1
      else this.items.push({ ...item, quantity: 1 })
    },
    increment(id: string) {
      const it = this.items.find((i) => i.id === id)
      if (it) it.quantity += 1
    },
    decrement(id: string) {
      const it = this.items.find((i) => i.id === id)
      if (it) {
        it.quantity -= 1
        if (it.quantity <= 0) this.items = this.items.filter((i) => i.id !== id)
      }
    },
    remove(id: string) {
      this.items = this.items.filter((i) => i.id !== id)
    },
    clear() {
      this.items = []
    },
  },
})
