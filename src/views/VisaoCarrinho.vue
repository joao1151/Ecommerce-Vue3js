<template>
  <div class="cart-page">
    <Card class="card-carrinho">
      <template #title>
        <div class="flex justify-content-between align-items-center">
          <h2>Meu Carrinho de Compras</h2>
          <span class="contador-itens">{{ lojaCarrinho.totalItens }} Itens</span>
        </div>
      </template>
      <template #content>
        <div v-if="lojaCarrinho.items.length === 0" class="carrinho-vazio">
          <i class="pi pi-shopping-cart" style="font-size: 3rem"></i>
          <p>Seu carrinho está vazio.</p>
          <RouterLink to="/">
            <Button label="Continuar Comprando" />
          </RouterLink>
        </div>

        <DataTable v-else :value="lojaCarrinho.items" responsiveLayout="scroll">
          <Column field="image" header="Produto">
            <template #body="slotProps">
              <div class="produto-info">
                <img
                  :src="slotProps.data.image"
                  :alt="slotProps.data.title"
                  class="product-image-cart"
                />
                <span>{{ slotProps.data.title }}</span>
              </div>
            </template>
          </Column>

          <Column field="price" header="Preço Unit.">
            <template #body="slotProps"> R$ {{ slotProps.data.price.toFixed(2) }} </template>
          </Column>

          <Column field="quantity" header="Quantidade" style="width: 15rem">
            <template #body="slotProps">
              <div class="quantity-selector">
                <Button
                  icon="pi pi-minus"
                  text
                  rounded
                  @click="lojaCarrinho.diminuirQuantidade(slotProps.data.id)"
                />
                <InputText :modelValue="slotProps.data.quantity" class="quantity-input" readonly />
                <Button
                  icon="pi pi-plus"
                  text
                  rounded
                  @click="lojaCarrinho.aumentarQuantidade(slotProps.data.id)"
                />
              </div>
            </template>
          </Column>

          <Column field="total" header="Subtotal">
            <template #body="slotProps">
              R$ {{ (slotProps.data.price * slotProps.data.quantity).toFixed(2) }}
            </template>
          </Column>

          <Column header="Ações">
            <template #body="slotProps">
              <Button
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                @click="remover(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>
      </template>

      <template #footer v-if="lojaCarrinho.items.length > 0">
        <div class="cart-summary">
          <div class="total-price">
            <h3>Total:</h3>
            <h2>R$ {{ lojaCarrinho.precoTotal }}</h2>
          </div>
          <Button
            label="Finalizar Compra"
            class="checkout-button"
            icon="pi pi-check"
            @click="handleFinalizarCompra"
            :loading="isProcessing"
          />
        </div>
      </template>
    </Card>

    <Dialog
      v-model:visible="isProcessing"
      :style="{ width: '25vw' }"
      :modal="true"
      :closable="false"
      header="Processando"
    >
      <div class="processing-content">
        <ProgressSpinner />
        <h2>Processando sua compra...</h2>
        <p>Por favor, aguarde.</p>
      </div>
    </Dialog>

    <Dialog
      v-model:visible="isSuccess"
      header="Compra Efetuada com Sucesso!"
      :style="{ width: '30vw' }"
      :modal="true"
    >
      <div class="success-content">
        <i class="pi pi-check-circle" style="font-size: 3rem; color: var(--green-500)"></i>
        <p class="mt-4">Obrigado por comprar conosco! Seu pedido foi registrado.</p>
      </div>
      <template #footer>
        <Button label="Fechar" icon="pi pi-check" @click="fecharModalSucesso" autofocus />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStoreCarrinho } from '@/stores/carrinho'
import { useToast } from 'primevue/usetoast'
import { RouterLink } from 'vue-router'

import Card from 'primevue/card'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'

const lojaCarrinho = useStoreCarrinho()
const toast = useToast()

const isProcessing = ref(false)
const isSuccess = ref(false)

function remover(produto) {
  lojaCarrinho.removerProduto(produto.id)
  toast.add({
    severity: 'info',
    summary: 'Item Removido',
    detail: `${produto.title} foi removido do seu carrinho.`,
    life: 3000,
  })
}

async function handleFinalizarCompra() {
  isProcessing.value = true

  const success = await lojaCarrinho.finalizarCompra()

  isProcessing.value = false

  if (success) {
    isSuccess.value = true
  } else {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Ocorreu um erro ao processar seu pedido.',
      life: 3000,
    })
  }
}

function fecharModalSucesso() {
  isSuccess.value = false
}
</script>

<style scoped>
.card-carrinho {
  border: 1px solid #b0b0b1;
  border-radius: 20px;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.549);

  transition: all 0.3s ease-in-out;
}

.card-carrinho {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.464);
}

.contador-itens {
  background-color: #86868696;
  color: #000000;
  padding: 0.5rem 1rem;
  border-radius: 26px;
  font-weight: bold;
  font-size: 0.9rem;
}
.cart-page {
  max-width: 1200px;
  margin: 2rem auto;
}
.carrinho-vazio {
  text-align: center;
  padding: 4rem 0;
  color: #6c757d;
}
.carrinho-vazio p {
  margin: 1.5rem 0;
  font-size: 1.2rem;
}
.produto-info {
  display: flex;
  align-items: center;
}
.product-image-cart {
  width: 60px;
  height: 60px;
  object-fit: contain;
  margin-right: 1rem;
  border: 1px solid #eee;
  border-radius: 6px;
}
.cart-summary {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
  gap: 2rem;
}
.total-price {
  text-align: right;
}
.total-price h3 {
  margin: 0;
  font-weight: normal;
  color: #6c757d;
}
.total-price h2 {
  margin: 0;
  color: var(--primary-color);
  font-size: 2rem;
}
.checkout-button {
  height: 50px;
  font-size: 1.1rem;
}
.quantity-selector {
  display: flex;
  align-items: center;
  justify-content: center;
}
.quantity-input {
  width: 50px;
  text-align: center;
}
.quantity-input::-webkit-outer-spin-button,
.quantity-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.flex {
  display: flex;
}
.justify-content-between {
  justify-content: space-between;
}
.align-items-center {
  align-items: center;
}

.processing-content,
.success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 0;
}
.processing-content h2,
.success-content p {
  margin-top: 1.5rem;
  font-size: 1.2rem;
}
</style>
