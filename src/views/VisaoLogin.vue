<template>
  <div class="login-page">
    <Card class="login-card">
      <template #title>
        <h2 class="text-center">Acessar Conta</h2>
      </template>
      <template #content>
        <form @submit.prevent="handleLogin" class="p-fluid">
          <div class="field">
            <FloatLabel>
              <InputText id="username" v-model="username" />
              <label for="username">Usuário</label>
            </FloatLabel>
          </div>
          <div class="field">
            <FloatLabel>
              <Password id="password" v-model="password" :feedback="false" toggleMask />
              <label for="password">Senha</label>
            </FloatLabel>
          </div>

          <Message v-if="errorMessage" severity="error" :closable="false">{{
            errorMessage
          }}</Message>

          <Button type="submit" label="Entrar" class="mt-2" :loading="loading" />
        </form>
      </template>
      <template #footer>
        <div class="text-center">
          <span>Não tem uma conta? </span>
          <RouterLink to="/cadastro">Crie uma agora</RouterLink>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStoreAutenticacao } from '@/stores/autenticacao'
import { RouterLink } from 'vue-router'

import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'

const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const authStore = useStoreAutenticacao()

async function handleLogin() {
  console.log('O formulário de login foi submetido! A função handleLogin foi chamada.')

  console.log('O que é o objeto da store?', authStore)
  console.log('Ele tem a função "login"?', authStore.login)

  if (!username.value || !password.value) {
    errorMessage.value = 'Por favor, preencha o usuário e a senha.'
    return
  }

  loading.value = true
  errorMessage.value = ''
  try {
    await authStore.login({
      username: username.value,
      password: password.value,
    })
  } catch (error) {
    errorMessage.value = 'Usuário ou senha inválidos. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  min-height: 80vh;
}

.login-card {
  width: 100%;
  max-width: 400px;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.p-fluid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.field {
  width: 80%;
  margin-bottom: 0;
}

.p-button {
  width: 80%;
}

.text-center {
  text-align: center;
}

.login-card :deep(.p-card-content) {
  padding: 2rem 0;
}
.login-card :deep(.p-card-footer) {
  padding-top: 1rem;
}
</style>
