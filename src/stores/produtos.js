import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  fetchProducts as fetchProductsFromAPI,
  createProduct as createProductFromAPI,
  updateProduct as updateProductFromAPI,
  deleteProduct as deleteProductFromAPI,
} from '@/api/servico_produtos'

export const useStoreProdutos = defineStore('produtos', () => {
  const products = ref([])
  const loading = ref(false)

  async function fetchProducts() {
    if (products.value.length === 0) {
      loading.value = true
      try {
        products.value = await fetchProductsFromAPI()
      } catch (error) {
        console.error('Erro na store ao buscar produtos:', error)
      } finally {
        loading.value = false
      }
    }
  }

  async function addProduct(productData) {
    const apiResponse = await createProductFromAPI(productData)

    if (apiResponse) {
      const finalProduct = {
        ...productData,
        id: Date.now(),
        isFake: true,
      }

      products.value.push(finalProduct)
      return true
    }

    return false
  }

  async function editProduct(productId, productData) {
    const updatedProduct = await updateProductFromAPI(productId, productData)
    if (updatedProduct) {
      const index = products.value.findIndex((p) => p.id === productId)
      if (index !== -1) {
        products.value[index] = updatedProduct
      }
      return true
    }
    return false
  }

  async function removeProduct(productId) {
    const productToDelete = products.value.find((p) => p.id === productId)

    if (productToDelete && productToDelete.isFake) {
      products.value = products.value.filter((p) => p.id !== productId)
      return true
    }

    const deletedProduct = await deleteProductFromAPI(productId)
    if (deletedProduct) {
      products.value = products.value.filter((p) => p.id !== productId)
      return true
    }
    return false
  }

  return {
    products,
    loading,
    fetchProducts,
    addProduct,
    editProduct,
    removeProduct,
  }
})
