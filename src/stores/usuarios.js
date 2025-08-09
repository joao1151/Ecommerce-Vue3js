import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  fetchUsers as fetchUsersFromAPI,
  createUser as createUserFromAPI,
  deleteUser as deleteUserFromAPI,
} from '@/api/servico_usuario'

export const useStoreUsuarios = defineStore('usuarios', () => {
  const users = ref([])

  async function fetchUsers() {
    if (users.value.length === 0) {
      console.log('Buscando lista inicial de usuários da API...')
      const apiUsers = await fetchUsersFromAPI()

      const superAdmin = {
        id: 0,
        email: 'admin@admin.com',
        username: 'admin',
        password: 'admin',
        name: {
          firstname: 'Super',
          lastname: 'Admin',
        },
        address: {
          city: 'N/A',
          street: 'N/A',
          number: 0,
          zipcode: 'N/A',
        },
        phone: 'N/A',
        isFake: true,
      }

      users.value = [superAdmin, ...apiUsers]
      console.log('Lista de usuários populada e com super admin adicionado.')
    }
  }

  function addUser(newUser) {
    if (newUser) {
      console.log('Adicionando novo usuário à lista local:', newUser)
      users.value.push(newUser)
    }
  }

  function updateUser(updatedUser) {
    const index = users.value.findIndex((user) => user.id === updatedUser.id)
    if (index !== -1) {
      users.value[index] = updatedUser
    }
  }

  async function deleteUser(userId) {
    const userToDelete = users.value.find((user) => user.id === userId)
    if (userToDelete && userToDelete.isFake) {
      console.log(`Deletando usuário 'fake' (ID: ${userId}) localmente.`)
      users.value = users.value.filter((user) => user.id !== userId)
      return true
    }

    console.log(`Deletando usuário 'real' (ID: ${userId}) via API.`)
    const deletedUserFromApi = await deleteUserFromAPI(userId)
    if (deletedUserFromApi) {
      users.value = users.value.filter((user) => user.id !== userId)
      return true
    }

    return false
  }

  return {
    users,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
  }
})
