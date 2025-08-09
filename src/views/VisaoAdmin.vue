<template>
  <div class="admin-panel">
    <Toast />
    <Card class="card-admin">
      <template #title>
        <div class="flex align-items-center">
          <i class="pi pi-user-cog mr-2" style="font-size: 1.5rem"></i>
          <h1>Painel de Administrador</h1>
        </div>
      </template>
      <template #content>
        <Tabs value="0">
          <TabList>
            <Tab value="0">Gerenciar Usuários</Tab>
            <Tab value="1">Gerenciar Produtos</Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="0">
              <Toolbar class="mb-4">
                <template #start>
                  <Button label="Novo Usuário" icon="pi pi-plus" @click="abrirModalNovoUsuario" />
                </template>
              </Toolbar>

              <div v-if="userStore.users.length === 0">
                <p>Carregando usuários...</p>
                <ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar>
              </div>

              <DataTable
                v-else
                :value="userStore.users"
                responsiveLayout="scroll"
                paginator
                :rows="5"
              >
                <Column field="username" header="Usuário" sortable></Column>
                <Column field="email" header="E-mail" sortable></Column>
                <Column header="Status de Admin" sortable>
                  <template #body="slotProps">
                    <Tag
                      v-if="authStore.adminUsernames.includes(slotProps.data.username)"
                      severity="success"
                      value="Admin"
                    />
                    <Tag v-else severity="info" value="Usuário" />
                  </template>
                </Column>
                <Column header="Ações" style="width: 15rem">
                  <template #body="slotProps">
                    <div class="actions-cell">
                      <Button
                        v-if="!authStore.adminUsernames.includes(slotProps.data.username)"
                        label="Promover"
                        icon="pi pi-arrow-up"
                        class="p-button-sm p-button-success"
                        @click="promover(slotProps.data)"
                      />
                      <Button
                        v-if="
                          authStore.adminUsernames.includes(slotProps.data.username) &&
                          slotProps.data.username !== 'admin'
                        "
                        label="Rebaixar"
                        icon="pi pi-arrow-down"
                        severity="warning"
                        class="p-button-sm"
                        @click="rebaixar(slotProps.data)"
                      />
                      <Button
                        icon="pi pi-eye"
                        severity="info"
                        text
                        rounded
                        @click="visualizarUsuario(slotProps.data)"
                      />
                      <Button
                        v-if="slotProps.data.username !== 'admin'"
                        icon="pi pi-trash"
                        severity="danger"
                        text
                        rounded
                        @click="deletar(slotProps.data.id)"
                      />
                    </div>
                  </template>
                </Column>
              </DataTable>
            </TabPanel>
            <TabPanel value="1">
              <Toolbar class="mb-4">
                <template #start>
                  <Button
                    label="Novo Produto"
                    icon="pi pi-plus"
                    severity="success"
                    @click="abrirModalNovoProduto"
                  />
                </template>
              </Toolbar>
              <div v-if="productStore.loading || productStore.products.length === 0">
                <p>Carregando produtos...</p>
                <ProgressBar mode="indeterminate" style="height: 6px"></ProgressBar>
              </div>
              <DataTable
                v-else
                :value="productStore.products"
                :key="productStore.products.length"
                responsiveLayout="scroll"
                paginator
                :rows="5"
              >
                <Column field="title" header="Produto" sortable>
                  <template #body="slotProps">
                    <div class="product-info">
                      <img
                        :src="slotProps.data.image"
                        :alt="slotProps.data.title"
                        class="product-image-table"
                      />
                      <span>{{ slotProps.data.title }}</span>
                    </div>
                  </template>
                </Column>
                <Column field="price" header="Preço" sortable>
                  <template #body="slotProps"> R$ {{ slotProps.data.price.toFixed(2) }} </template>
                </Column>
                <Column field="category" header="Categoria" sortable></Column>
                <Column header="Ações" style="width: 10rem">
                  <template #body="slotProps">
                    <div class="actions-cell">
                      <Button
                        icon="pi pi-pencil"
                        severity="info"
                        text
                        rounded
                        @click="editarProduto(slotProps.data)"
                      />
                      <Button
                        icon="pi pi-trash"
                        severity="danger"
                        text
                        rounded
                        @click="deletarProduto(slotProps.data)"
                      />
                    </div>
                  </template>
                </Column>
              </DataTable>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </template>
    </Card>
    <Dialog
      v-model:visible="isUserDialogVisible"
      :header="dialogHeader"
      :modal="true"
      style="width: 50vw"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    >
      <div v-if="selectedUser" class="user-dialog-content">
        <Fieldset legend="Informações Pessoais" class="mt-0">
          <div class="p-fluid form-grid">
            <div class="field col-12 md:col-6">
              <label for="firstname">Nome</label>
              <InputText
                id="firstname"
                v-model="selectedUser.name.firstname"
                :disabled="isViewOnly"
              />
            </div>
            <div class="field col-12 md:col-6">
              <label for="lastname">Sobrenome</label>
              <InputText
                id="lastname"
                v-model="selectedUser.name.lastname"
                :disabled="isViewOnly"
              />
            </div>
          </div>
        </Fieldset>

        <Fieldset legend="Contato e Endereço" class="mt-3">
          <div class="p-fluid form-grid">
            <div class="field col-12 md:col-6">
              <label for="email">E-mail</label>
              <InputText id="email" v-model="selectedUser.email" :disabled="isViewOnly" />
            </div>
            <div class="field col-12 md:col-6">
              <label for="phone">Telefone</label>
              <InputText id="phone" v-model="selectedUser.phone" :disabled="isViewOnly" />
            </div>
            <div class="field col-12 md:col-6">
              <label for="city">Cidade</label>
              <InputText id="city" v-model="selectedUser.address.city" :disabled="isViewOnly" />
            </div>
            <div class="field col-12 md:col-6">
              <label for="street">Rua</label>
              <InputText id="street" v-model="selectedUser.address.street" :disabled="isViewOnly" />
            </div>
            <div class="field col-12 md:col-3">
              <label for="number">Número</label>
              <InputText
                id="number"
                v-model.number="selectedUser.address.number"
                :disabled="isViewOnly"
              />
            </div>
            <div class="field col-12 md:col-9">
              <label for="zipcode">CEP</label>
              <InputText
                id="zipcode"
                v-model="selectedUser.address.zipcode"
                :disabled="isViewOnly"
              />
            </div>
          </div>
        </Fieldset>

        <Fieldset
          v-if="!selectedUser.hasOwnProperty('id')"
          legend="Credenciais de Acesso"
          class="mt-3"
        >
          <div class="p-fluid form-grid">
            <div class="field col-12 md:col-6">
              <label for="username">Usuário</label>
              <InputText id="username" v-model="selectedUser.username" />
            </div>
            <div class="field col-12 md:col-6">
              <label for="password">Senha</label>
              <InputText id="password" v-model="selectedUser.password" type="password" />
            </div>
          </div>
        </Fieldset>
      </div>
      <template #footer>
        <Button label="Fechar" icon="pi pi-times" @click="isUserDialogVisible = false" text />
        <Button
          v-if="isViewOnly && selectedUser && selectedUser.hasOwnProperty('id')"
          label="Editar"
          icon="pi pi-pencil"
          severity="info"
          @click="isViewOnly = false"
        />
        <Button v-if="!isViewOnly" label="Salvar" icon="pi pi-check" @click="salvarUsuario" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="isProductDialogVisible"
      :header="productDialogHeader"
      :modal="true"
      style="width: 50vw"
      :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    >
      <div v-if="selectedProduct" class="p-fluid">
        <Fieldset legend="Informações Principais">
          <div class="field">
            <label for="title">Título do Produto</label>
            <InputText id="title" v-model="selectedProduct.title" />
          </div>
          <div class="field">
            <label for="description">Descrição</label>
            <Textarea id="description" v-model="selectedProduct.description" rows="5" />
          </div>
        </Fieldset>

        <Fieldset legend="Detalhes Comerciais" class="mt-3">
          <div class="form-grid">
            <div class="field">
              <label for="price">Preço</label>
              <InputNumber
                id="price"
                v-model="selectedProduct.price"
                mode="currency"
                currency="BRL"
                locale="pt-BR"
              />
            </div>
            <div class="field">
              <label for="category">Categoria</label>
              <InputText id="category" v-model="selectedProduct.category" />
            </div>
          </div>
        </Fieldset>

        <Fieldset legend="Mídia" class="mt-3">
          <div class="field">
            <label for="image">URL da Imagem</label>
            <InputText id="image" v-model="selectedProduct.image" />
          </div>
        </Fieldset>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" @click="isProductDialogVisible = false" text />
        <Button label="Salvar" icon="pi pi-check" @click="salvarProduto" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStoreUsuarios } from '@/stores/usuarios'
import { useStoreAutenticacao } from '@/stores/autenticacao'
import { useStoreProdutos } from '@/stores/produtos'
import { useToast } from 'primevue/usetoast'

import Card from 'primevue/card'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Toast from 'primevue/toast'
import ProgressBar from 'primevue/progressbar'
import Toolbar from 'primevue/toolbar'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import Fieldset from 'primevue/fieldset'

const userStore = useStoreUsuarios()
const authStore = useStoreAutenticacao()
const toast = useToast()
const productStore = useStoreProdutos()

const isUserDialogVisible = ref(false)
const selectedUser = ref(null)
const isViewOnly = ref(true)

const dialogHeader = computed(() => {
  if (selectedUser.value && !selectedUser.value.hasOwnProperty('id')) {
    return 'Criar Novo Usuário'
  }
  return isViewOnly.value
    ? `Detalhes de ${selectedUser.value?.username || ''}`
    : `Editando ${selectedUser.value?.username || ''}`
})

function abrirModalNovoUsuario() {
  selectedUser.value = {
    email: '',
    username: '',
    password: '',
    name: { firstname: '', lastname: '' },
    address: { city: '', street: '', number: null, zipcode: '' },
    phone: '',
  }
  isViewOnly.value = false
  isUserDialogVisible.value = true
}

function visualizarUsuario(usuario) {
  selectedUser.value = { ...usuario }
  isViewOnly.value = true
  isUserDialogVisible.value = true
}

function editarUsuario(usuario) {
  selectedUser.value = JSON.parse(JSON.stringify(usuario))
  isViewOnly.value = false
  isUserDialogVisible.value = true
}

function salvarUsuario() {
  if (selectedUser.value) {
    if (selectedUser.value.hasOwnProperty('id')) {
      userStore.updateUser(selectedUser.value)
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Usuário atualizado!',
        life: 3000,
      })
    } else {
      if (
        !selectedUser.value.username ||
        !selectedUser.value.password ||
        !selectedUser.value.email ||
        !selectedUser.value.name.firstname
      ) {
        toast.add({
          severity: 'warn',
          summary: 'Campos Obrigatórios',
          detail: 'Preencha pelo menos nome, email, usuário e senha.',
          life: 3000,
        })
        return
      }
      const newUserForStore = {
        ...selectedUser.value,
        id: Date.now(),
        isFake: true,
      }
      userStore.addUser(newUserForStore)
      toast.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Novo usuário criado!',
        life: 3000,
      })
    }
    isUserDialogVisible.value = false
    selectedUser.value = null
  }
}

function promover(usuario) {
  authStore.promoteUser(usuario.username)
  toast.add({
    severity: 'success',
    summary: 'Sucesso',
    detail: `O usuário ${usuario.username} foi promovido a admin.`,
    life: 3000,
  })
}

function rebaixar(usuario) {
  authStore.demoteUser(usuario.username)
  toast.add({
    severity: 'warn',
    summary: 'Aviso',
    detail: `O usuário ${usuario.username} não é mais um admin.`,
    life: 3000,
  })
}

async function deletar(userId) {
  const usuarioParaDeletar = userStore.users.find((u) => u.id === userId)

  const success = await userStore.deleteUser(userId)

  if (success) {
    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `Usuário ${usuarioParaDeletar?.username || 'ID: ' + userId} foi deletado.`,
      life: 3000,
    })
  } else {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: `Não foi possível deletar o usuário.`,
      life: 3000,
    })
  }
}

const isProductDialogVisible = ref(false)
const selectedProduct = ref(null)

const productDialogHeader = computed(() => {
  return selectedProduct.value && selectedProduct.value.id ? 'Editar Produto' : 'Criar Novo Produto'
})

function abrirModalNovoProduto() {
  selectedProduct.value = {
    title: '',
    price: 0,
    description: '',
    image: 'https://i.pravatar.cc/450',
    category: '',
  }
  isProductDialogVisible.value = true
}

function editarProduto(produto) {
  selectedProduct.value = { ...produto }
  isProductDialogVisible.value = true
}

async function salvarProduto() {
  if (selectedProduct.value) {
    let success = false
    if (selectedProduct.value.id) {
      success = await productStore.editProduct(selectedProduct.value.id, selectedProduct.value)
    } else {
      if (
        !selectedProduct.value.title ||
        !selectedProduct.value.price ||
        !selectedProduct.value.category
      ) {
        toast.add({
          severity: 'warn',
          summary: 'Campos Obrigatórios',
          detail: 'Preencha pelo menos título, preço e categoria.',
          life: 3000,
        })
        return
      }
      success = await productStore.addProduct(selectedProduct.value)
    }

    if (success) {
      toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Produto salvo!', life: 3000 })
    } else {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível salvar o produto.',
        life: 3000,
      })
    }
    isProductDialogVisible.value = false
    selectedProduct.value = null
  }
}

async function deletarProduto(produto) {
  const success = await productStore.removeProduct(produto.id)
  if (success) {
    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `Produto "${produto.title}" deletado.`,
      life: 3000,
    })
  } else {
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Não foi possível deletar o produto.',
      life: 3000,
    })
  }
}

onMounted(() => {
  if (productStore.products.length === 0) {
    productStore.fetchProducts()
  }
  if (userStore.users.length === 0) {
    userStore.fetchUsers()
  }
})
</script>

<style scoped>
.card-admin {
  border: 2px solid #cbcbcc;
  border-radius: 50px;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  transition: all 0.3s ease-in-out;
}

.card-admin:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.258);
}
.admin-panel {
  max-width: 1200px;
  margin: 2rem auto;
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
.mb-4 {
  margin-bottom: 1.5rem;
}
.p-button-sm {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}
.field {
  margin-bottom: 1rem;
}
.product-image-table {
  width: 50px;
  height: 50px;
  object-fit: contain;
  margin-right: 1rem;
  border: 1px solid #eee;
  border-radius: 6px;
}
.actions-cell {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.mt-4 {
  margin-top: 1.5rem;
}
.product-info {
  display: flex;
  align-items: center;
}
.user-dialog-content {
  padding-top: 0.5rem;
}
.mt-0 {
  margin-top: 0 !important;
}
.mt-3 {
  margin-top: 1rem !important;
}

.field {
  margin-bottom: 1rem;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.col-12 {
  grid-column: span 12;
}
.col-9 {
  grid-column: span 9;
}
.col-6 {
  grid-column: span 6;
}
.col-3 {
  grid-column: span 3;
}
.field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.p-fieldset .p-fieldset-content {
  padding: 1.5rem;
}
</style>
