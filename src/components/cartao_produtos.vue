<template>
  <Card class="product-card">
    <template #header>
      <img :alt="product.title" :src="product.image" class="product-image" />
    </template>
    <template #title>
      <div class="product-title">{{ product.title }}</div>
    </template>
    <template #subtitle>
      <div class="product-price">R$ {{ product.price.toFixed(2) }}</div>
    </template>
    <template #footer>
      <RouterLink :to="`/produto/${product.id}`">
        <Button icon="pi pi-eye" label="Detalhes" outlined class="w-full mb-2" />
      </RouterLink>

      <Button
        icon="pi pi-shopping-cart"
        label="Adicionar"
        class="w-full"
        @click="adicionar(product)"
      />
    </template>
  </Card>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
import { useStoreCarrinho } from '@/stores/carrinho'
import { useToast } from 'primevue/usetoast'

const lojaCarrinho = useStoreCarrinho()
const toast = useToast()

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

function adicionar(produto) {
  lojaCarrinho.adicionarProduto(produto)

  toast.add({
    severity: 'success',
    summary: 'Sucesso!',
    detail: `${produto.title} foi adicionado ao carrinho.`,
    life: 2000,
  })
}
</script>

<style scoped>
.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  transition: box-shadow 0.3s ease-in-out;
}

.product-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.726);
}
.product-image {
  width: 100%;
  height: 200px;
  object-fit: contain;
  padding: 1rem;
}
.product-title {
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 48px;
}
.product-price {
  font-size: 1.25rem;
  color: var(--primary-color);
}
.w-full {
  width: 100%;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
</style>
