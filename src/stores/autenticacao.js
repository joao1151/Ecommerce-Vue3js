import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loginUser as loginUserFromAPI } from '@/api/servico_autenticacao'
import router from '@/router'
import { useStoreUsuarios } from './usuarios'

export const useStoreAutenticacao = defineStore('autenticacao', () => {
  const token = ref(localStorage.getItem('authToken') || null)
  const user = ref(JSON.parse(localStorage.getItem('authUser')) || null)

  const adminUsernames = ref(['admin'])

  const isLoggedIn = computed(() => !!token.value && !!user.value)

  const isAdmin = computed(() => {
    return user.value && adminUsernames.value.includes(user.value.username)
  })

  async function login(credentials) {
    const userStore = useStoreUsuarios()
    const userIsValid = userStore.users.find(
      (u) => u.username === credentials.username && u.password === credentials.password,
    )

    if (!userIsValid) {
      throw new Error('Usuário ou senha inválidos')
    }

    try {
      const isNewFakeUser = userIsValid.isFake === true
      let tokenResponse
      if (isNewFakeUser) {
        tokenResponse = { token: 'fake-token-for-new-user-' + Date.now() }
      } else {
        tokenResponse = await loginUserFromAPI(credentials)
      }
      if (tokenResponse && tokenResponse.token) {
        token.value = tokenResponse.token
        user.value = userIsValid
        localStorage.setItem('authToken', tokenResponse.token)
        localStorage.setItem('authUser', JSON.stringify(user.value))
        router.push('/')
      } else {
        throw new Error('Não foi possível obter um token.')
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    router.replace('/')
  }

  function promoteUser(username) {
    if (!adminUsernames.value.includes(username)) {
      adminUsernames.value.push(username)
    }
  }

  function demoteUser(username) {
    if (username === 'admin') return
    adminUsernames.value = adminUsernames.value.filter((u) => u !== username)
  }

  return {
    token,
    user,
    isLoggedIn,
    isAdmin,
    adminUsernames,
    login,
    logout,
    promoteUser,
    demoteUser,
  }
})
