<template>
  <div id="app-layout">
    <Toast />
    <header>
      <Toolbar class="app-toolbar">
        <template #start>
          <div class="logo-container">
            <i class="pi pi-shopping-bag" style="font-size: 1.5rem"></i>
            <span class="logo-text">TudoAqui Store</span>
            <i class="pi pi-shopping-bag" style="font-size: 1.5rem"></i>
          </div>
        </template>

        <template #center>
          <div class="nav-links">
            <RouterLink to="/">
              <Button label="Início" text plain />
            </RouterLink>
            <RouterLink v-if="authStore.isAdmin" to="/admin">
              <Button label="Painel Admin" severity="help" text plain />
            </RouterLink>
          </div>
        </template>

        <template #end>
          <div class="controls-container">
            <RouterLink to="/carrinho">
              <div class="cart-icon-container">
                <Button
                  label="Meu carrinho"
                  icon="pi pi-shopping-cart"
                  iconPos="right"
                  severity="secondary"
                  rounded
                  text
                />
                <!-- <span v-if="lojaCarrinho.totalItens > 0" class="manual-counter">
                  {{ lojaCarrinho.totalItens }}
                </span> -->
              </div>
            </RouterLink>

            <div v-if="!authStore.isLoggedIn" class="nav-links">
              <RouterLink to="/login">
                <Button label="Login" text plain />
              </RouterLink>
            </div>
            <div v-else class="user-menu">
              <RouterLink to="/perfil">
                <Button :label="`Olá, ${authStore.user.username}`" icon="pi pi-user" text plain />
              </RouterLink>
              <Button
                label="Sair"
                icon="pi pi-sign-out"
                severity="danger"
                text
                @click="handleLogout"
              />
            </div>
          </div>
        </template>
      </Toolbar>
    </header>

    <main class="content">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

import { useStoreCarrinho } from '@/stores/carrinho'
import { useStoreAutenticacao } from '@/stores/autenticacao'
import { useStoreUsuarios } from '@/stores/usuarios'
import { useStoreProdutos } from '@/stores/produtos'

import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import Toast from 'primevue/toast'

const lojaCarrinho = useStoreCarrinho()
const authStore = useStoreAutenticacao()
const userStore = useStoreUsuarios()
const productStore = useStoreProdutos()

function handleLogout() {
  authStore.logout()
}

onMounted(() => {
  console.log('App.vue montado. Buscando dados iniciais...')
  userStore.fetchUsers()
  productStore.fetchProducts()
})
</script>

<style scoped>
.app-toolbar {
  background-image: linear-gradient(to right, #bdbdbd, #e9ecef);

  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  border-bottom: none;
  padding: 0.5rem 1.5rem;
}
.content {
  padding: 1.5rem;
}
.nav-links a {
  text-decoration: none;
}

.controls-container {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
.cart-icon-container {
  position: relative;
  font-size: 1.25rem;
}
.manual-counter {
  position: absolute;
  top: 0.5rem;
  right: 0.2rem;
  background-color: #81818178;
  color: white;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.75rem;
  font-weight: bold;
}
.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.user-menu span {
  font-weight: 600;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.logo-text {
  font-weight: 700;
  font-size: 1.25rem;
}
.nav-links {
  display: flex;
  justify-content: center;
}

.nav-links .p-button.p-button-text,
.user-menu .p-button.p-button-text {
  transition: transform 0.2s ease-in-out;
  font-weight: 600;
  color: #1f2937;
}

.app-toolbar :deep(.p-button-text) {
  transition: transform 0.2s ease-in-out;
  font-weight: 600;
  color: #1f2937;
}

.app-toolbar :deep(.p-button-text:hover) {
  background-color: transparent !important;
  transform: scale(1.2);
}

.app-toolbar :deep(.p-button-text:active) {
  transform: scale(0.9);
  transition: transform 0.2s ease;
}

.controls-container a[href='/carrinho'] {
  position: relative;
  text-decoration: none;
}
</style>
<style>
body {
  background-color: #cdcdce;

  background-image: linear-gradient(to bottom, #c8c8c8, #e9ecef);
  min-height: 100vh;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
