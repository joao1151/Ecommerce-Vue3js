<template>
  <div class="product-detail-page">
    <div v-if="loading" class="loading-spinner">
      <ProgressSpinner />
    </div>

    <div v-else-if="product" class="product-container">
      <Card class="card-detalhe-produto">
        <template #header>
          <Image
            :src="product.image"
            alt="Imagem do Produto"
            imageClass="product-image-detail"
            preview
          />
        </template>
        <template #title>
          <h1 class="product-title-detail">{{ product.title }}</h1>
        </template>
        <template #subtitle>
          <div class="subtitle-container">
            <Tag :value="product.category" class="category-tag"></Tag>
            <span class="product-price-detail">R$ {{ product.price.toFixed(2) }}</span>
          </div>
        </template>
        <template #content>
          <p class="product-description">{{ product.description }}</p>
        </template>
        <template #footer>
          <Button
            icon="pi pi-shopping-cart"
            label="Adicionar ao Carrinho"
            class="w-full"
            @click="adicionar(product)"
          />
        </template>
      </Card>
    </div>

    <div v-else class="error-message">
      <h2>Produto não encontrado.</h2>
      <p>O produto que você está tentando acessar não existe ou não pôde ser carregado.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { fetchProductById } from '@/api/servico_produtos'
import { useStoreProdutos } from '@/stores/produtos'
import { useStoreCarrinho } from '@/stores/carrinho'
import { useToast } from 'primevue/usetoast'

import Card from 'primevue/card'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import Tag from 'primevue/tag'
import Image from 'primevue/image'

const route = useRoute()
const product = ref(null)
const loading = ref(true)
const productStore = useStoreProdutos()
const lojaCarrinho = useStoreCarrinho()
const toast = useToast()

function adicionar(produto) {
  lojaCarrinho.adicionarProduto(produto)

  toast.add({
    severity: 'success',
    summary: 'Sucesso!',
    detail: `${produto.title} foi adicionado ao carrinho.`,
    life: 2000,
  })
}

onMounted(async () => {
  const productId = Number(route.params.id)

  const productFromStore = productStore.products.find((p) => p.id === productId)

  if (productFromStore) {
    console.log('Produto encontrado na store local. Não é necessário buscar na API.')
    product.value = productFromStore
  } else {
    console.log('Produto não encontrado na store. Buscando na API...')
    try {
      product.value = await fetchProductById(productId)
    } catch (error) {
      console.error('Erro ao carregar detalhes do produto:', error)
    }
  }

  loading.value = false
})
</script>

<style scoped>
.card-detalhe-produto :deep(.p-card-header) {
  display: flex;
  justify-content: center;
}

.card-detalhe-produto :deep(.product-image-detail) {
  max-height: 400px;
  width: auto;
  object-fit: contain;
  padding: 1rem;
}

.card-detalhe-produto {
  border: 1px solid #e9ecef;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
}

.card-detalhe-produto:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.product-detail-page {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.product-container {
  max-width: 800px;
  width: 100%;
}

.product-title-detail {
  font-size: 1.75rem;
  font-weight: 700;
}
.subtitle-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}
.category-tag {
  text-transform: capitalize;
}
.product-price-detail {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
}
.product-description {
  margin-top: 1.5rem;
  line-height: 1.6;
}
.loading-spinner,
.error-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
  text-align: center;
  color: #6c757d;
}
.w-full {
  width: 100%;
}
</style>
