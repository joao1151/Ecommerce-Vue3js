<template>
  <div class="home-page">
    <div v-if="lojaProdutos.loading" class="loading-spinner">
      <ProgressSpinner />
      <p>Carregando produtos...</p>
    </div>

    <div v-else class="product-grid">
      <div v-for="product in lojaProdutos.products" :key="product.id">
        <CartaoProdutos :product="product" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useStoreProdutos } from '@/stores/produtos'
import CartaoProdutos from '@/components/cartao_produtos.vue'

import ProgressSpinner from 'primevue/progressspinner'

const lojaProdutos = useStoreProdutos()

onMounted(() => {
  if (lojaProdutos.products.length === 0) {
    lojaProdutos.fetchProducts()
  }
})
</script>

<style scoped>
.home-page {
  padding: 2rem;
}
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
.loading-spinner {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
</style>
