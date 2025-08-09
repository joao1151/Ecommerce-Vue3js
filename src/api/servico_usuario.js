const API_URL = 'https://fakestoreapi.com'

export async function fetchUsers() {
  try {
    const response = await fetch(`${API_URL}/users`)
    if (!response.ok) {
      throw new Error('Falha ao buscar usuários da API')
    }
    return await response.json()
  } catch (error) {
    console.error('Falha no serviço fetchUsers:', error)
    return []
  }
}

export async function createUser(userData) {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    if (!response.ok) {
      throw new Error('Falha ao criar usuário na API')
    }

    const responseData = await response.json()

    console.log('RESPOSTA EXATA DA API:', responseData)

    return responseData
  } catch (error) {
    console.error('Falha no serviço createUser:', error)
    return null
  }
}

export async function deleteUser(userId) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Falha ao deletar usuário na API')
    }
    return await response.json()
  } catch (error) {
    console.error(`Falha no serviço deleteUser para o id ${userId}:`, error)
    return null
  }
}
