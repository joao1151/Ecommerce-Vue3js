import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useStoreCarrinho = defineStore('carrinho', () => {
  const items = ref([])
  const isProcessingCheckout = ref(false)

  const totalItens = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const precoTotal = computed(() => {
    const total = items.value.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)
    return total.toFixed(2)
  })

  function adicionarProduto(produto) {
    const itemExistente = items.value.find((item) => item.id === produto.id)

    if (itemExistente) {
      itemExistente.quantity++
    } else {
      items.value.push({ ...produto, quantity: 1 })
    }
  }

  function removerProduto(produtoId) {
    items.value = items.value.filter((item) => item.id !== produtoId)
  }

  function aumentarQuantidade(produtoId) {
    const item = items.value.find((item) => item.id === produtoId)
    if (item) {
      item.quantity++
    }
  }

  function diminuirQuantidade(produtoId) {
    const item = items.value.find((item) => item.id === produtoId)
    if (item && item.quantity > 1) {
      item.quantity--
    } else if (item) {
      removerProduto(produtoId)
    }
  }
  function esvaziarCarrinho() {
    items.value = []
  }

  async function finalizarCompra() {
    isProcessingCheckout.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      esvaziarCarrinho()

      return true
    } catch (error) {
      console.error('Erro ao finalizar a compra (simulação):', error)
      return false
    } finally {
      isProcessingCheckout.value = false
    }
  }

  return {
    items,
    totalItens,
    precoTotal,
    adicionarProduto,
    removerProduto,
    aumentarQuantidade,
    diminuirQuantidade,
    esvaziarCarrinho,
    finalizarCompra,
    isProcessingCheckout,
  }
})
