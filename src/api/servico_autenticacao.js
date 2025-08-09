const API_URL = 'https://fakestoreapi.com'

export async function loginUser(credentials) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      throw new Error('Usuário ou senha inválidos')
    }

    return await response.json()
  } catch (error) {
    console.error('Falha no serviço de login:', error)
    return null
  }
}
