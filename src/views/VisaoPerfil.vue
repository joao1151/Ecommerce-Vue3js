<template>
  <div class="profile-page">
    <Card v-if="authStore.user" class="card-perfil">
      <template #title>
        <div class="flex align-items-center">
          <i class="pi pi-user mr-2" style="font-size: 1.5rem"></i>
          <h1>Meu Perfil</h1>
        </div>
      </template>
      <template #content>
        <div class="profile-details">
          <p><strong>Username:</strong> {{ authStore.user.username }}</p>
          <p><strong>E-mail:</strong> {{ authStore.user.email }}</p>
          <p>
            <strong>Nome:</strong> {{ authStore.user.name.firstname }}
            {{ authStore.user.name.lastname }}
          </p>
          <p><strong>Telefone:</strong> {{ authStore.user.phone }}</p>

          <Divider />

          <p><strong>Endereço:</strong></p>
          <p>{{ authStore.user.address.street }}, {{ authStore.user.address.number }}</p>
          <p>{{ authStore.user.address.city }} - CEP: {{ authStore.user.address.zipcode }}</p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { useStoreAutenticacao } from '@/stores/autenticacao'

import Card from 'primevue/card'
import Divider from 'primevue/divider'

const authStore = useStoreAutenticacao()
</script>

<style scoped>
.profile-page {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.card-perfil {
  width: 100%;
  max-width: 800px;
  border: 1px solid #9b9c9d;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.497);
}

.profile-details p {
  font-size: 1.1rem;
  margin: 0.75rem 0;
  color: #4b5563;
}

.profile-details p strong {
  color: #1f2937;
  margin-right: 0.5rem;
}

.flex {
  display: flex;
}
.align-items-center {
  align-items: center;
}
.mr-2 {
  margin-right: 0.5rem;
}
</style>
