import { defineStore } from 'pinia'
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore'

export interface MenuItem {
  id: string
  name: string
  price: number
  imageUrl?: string
}

export const useMenuStore = defineStore('menu', {
  state: () => ({
    items: [] as MenuItem[],
    isReady: false,
  }),
  actions: {
    init() {
      if (this.isReady) return
      const { $db } = useNuxtApp()
      const ref = collection($db, 'menu')
      onSnapshot(ref, (snap) => {
        this.items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
        this.isReady = true
      })
    },
    async addItem(data: { name: string; price: number; imageFile?: File }) {
      let imageUrl = ''
      if (data.imageFile) {
        // Upload to local server instead of Firebase Storage
        const formData = new FormData()
        formData.append('file', data.imageFile)
        
        try {
          const response = await $fetch('/api/upload/image', {
            method: 'POST',
            body: formData
          })
          
          if (response.success && response.imageUrl) {
            imageUrl = response.imageUrl
          }
        } catch (error) {
          console.error('Failed to upload image:', error)
          throw new Error('Failed to upload image')
        }
      }
      const { $db } = useNuxtApp()
      const docData: any = {
        name: data.name,
        price: data.price,
      }
      if (imageUrl) docData.imageUrl = imageUrl
      await addDoc(collection($db, 'menu'), docData)
    },
    async removeItem(id: string) {
      const { $db } = useNuxtApp()
      await deleteDoc(doc($db, 'menu', id))
    },
  },
})
