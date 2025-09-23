import { defineStore } from 'pinia'
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../utils/firebase'

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
      const ref = collection(db, 'menu')
      onSnapshot(ref, (snap) => {
        this.items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
        this.isReady = true
      })
    },
    async addItem(data: { name: string; price: number; imageFile?: File }) {
      let imageUrl = ''
      if (data.imageFile) {
        const { storage } = await import('../utils/firebase')
        const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage')
        const imageRef = ref(storage, `menu/${Date.now()}_${data.imageFile.name}`)
        await uploadBytes(imageRef, data.imageFile)
        imageUrl = await getDownloadURL(imageRef)
      }
      const docData: any = {
        name: data.name,
        price: data.price,
      }
      if (imageUrl) docData.imageUrl = imageUrl
      await addDoc(collection(db, 'menu'), docData)
    },
    
    async removeItem(id: string) {
      // Find the menu item to get its imageUrl
      const item = this.items.find((i) => i.id === id)
      if (item && item.imageUrl) {
        try {
          // Extract Cloudinary public_id from imageUrl
          const urlParts = item.imageUrl.split('/');
          const uploadIdx = urlParts.findIndex((p) => p === 'upload');
          let publicId = urlParts.slice(uploadIdx + 1).join('/');
          publicId = publicId.replace(/\.[^.]+$/, '');

          // Call server API to delete image from Cloudinary
          await $fetch('/api/delete-image', {
            method: 'POST',
            body: { publicId },
          });
        } catch (e) {
          console.warn('Failed to delete image from Cloudinary:', e);
        }
      }
      await deleteDoc(doc(db, 'menu', id));
    },
  },
})

