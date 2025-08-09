<template>
  <div class="register-page">
    <Card class="register-card">
      <template #title>
        <h2 class="text-center">Criar Nova Conta</h2>
      </template>
      <template #content>
        <form @submit.prevent="handleRegister" class="p-fluid">
          <div class="form-grid">
            <div class="field">
              <FloatLabel>
                <InputText id="firstname" v-model="form.name.firstname" />
                <label for="firstname">Nome</label>
              </FloatLabel>
            </div>
            <div class="field">
              <FloatLabel>
                <InputText id="lastname" v-model="form.name.lastname" />
                <label for="lastname">Sobrenome</label>
              </FloatLabel>
            </div>
          </div>

          <div class="field">
            <FloatLabel>
              <InputText id="email" type="email" v-model="form.email" />
              <label for="email">E-mail</label>
            </FloatLabel>
          </div>
          <div class="field">
            <FloatLabel>
              <InputText id="username" v-model="form.username" />
              <label for="username">Usuário</label>
            </FloatLabel>
          </div>
          <div class="field">
            <FloatLabel>
              <Password id="password" v-model="form.password" :feedback="false" toggleMask />
              <label for="password">Senha</label>
            </FloatLabel>
          </div>

          <h4 class="mt-4">Endereço e Contato</h4>
          <div class="form-grid">
            <div class="field">
              <FloatLabel>
                <InputText id="city" v-model="form.address.city" />
                <label for="city">Cidade</label>
              </FloatLabel>
            </div>
            <div class="field">
              <FloatLabel>
                <InputText id="street" v-model="form.address.street" />
                <label for="street">Rua</label>
              </FloatLabel>
            </div>
          </div>
          <div class="form-grid">
            <div class="field">
              <FloatLabel>
                <InputText id="number" type="number" v-model.number="form.address.number" />
                <label for="number">Número</label>
              </FloatLabel>
            </div>
            <div class="field">
              <FloatLabel>
                <InputText id="zipcode" v-model="form.address.zipcode" />
                <label for="zipcode">CEP</label>
              </FloatLabel>
            </div>
          </div>
          <div class="field">
            <FloatLabel>
              <InputText id="phone" v-model="form.phone" />
              <label for="phone">Telefone</label>
            </FloatLabel>
          </div>

          <Button type="submit" label="Cadastrar" class="mt-2" :loading="loading" />
        </form>
      </template>
      <template #footer>
        <div class="text-center">
          <span>Já tem uma conta? </span>
          <RouterLink to="/login">Faça o login</RouterLink>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { createUser } from '@/api/servico_usuario'
import { useStoreUsuarios } from '@/stores/usuarios'

import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import FloatLabel from 'primevue/floatlabel'
import Password from 'primevue/password'
import Button from 'primevue/button'

const router = useRouter()
const toast = useToast()
const userStore = useStoreUsuarios()

const loading = ref(false)
const form = ref({
  email: '',
  username: '',
  password: '',
  name: {
    firstname: '',
    lastname: '',
  },
  address: {
    city: '',
    street: '',
    number: null,
    zipcode: '',
  },
  phone: '',
})

async function handleRegister() {
  if (
    !form.value.username ||
    !form.value.password ||
    !form.value.email ||
    !form.value.name.firstname ||
    !form.value.name.lastname ||
    !form.value.address.city ||
    !form.value.address.street ||
    !form.value.address.number ||
    !form.value.address.zipcode ||
    !form.value.phone
  ) {
    toast.add({
      severity: 'warn',
      summary: 'Campos Obrigatórios',
      detail: 'Por favor, preencha todos os campos para se cadastrar.',
      life: 3000,
    })
    return
  }

  loading.value = true
  try {
    const apiResponse = await createUser(form.value)

    if (apiResponse) {
      const newUser = {
        ...form.value,
        ...apiResponse,
        id: apiResponse.id || Date.now(),
        isFake: true,
      }

      userStore.addUser(newUser)

      toast.add({
        severity: 'success',
        summary: 'Conta Criada!',
        detail: `Usuário ${newUser.username} criado com sucesso. Agora você pode fazer o login.`,
        life: 5000,
      })
      router.push('/login')
    } else {
      throw new Error('A API não retornou uma resposta válida.')
    }
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Erro no Cadastro',
      detail: 'Não foi possível criar a conta. Tente novamente.',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}
.register-card {
  width: 100%;
  max-width: 550px;
}
.field {
  margin-bottom: 2rem;
}
.text-center {
  text-align: center;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.mt-4 {
  margin-top: 1.5rem;
}
</style>
