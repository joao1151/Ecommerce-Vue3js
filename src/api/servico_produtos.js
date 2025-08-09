const API_URL = 'https://fakestoreapi.com'

export async function fetchProducts() {
  try {
    const response = await fetch(`${API_URL}/products`)
    if (!response.ok) {
      throw new Error('Erro ao buscar produtos da API')
    }
    return await response.json()
  } catch (error) {
    console.error('Falha no serviço fetchProducts:', error)
    return []
  }
}

export async function fetchProductById(id) {
  try {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`)
    if (!response.ok) {
      throw new Error(`Erro ao buscar o produto com id: ${id}`)
    }
    return await response.json()
  } catch (error) {
    console.error(error)
    return null
  }
}

export async function createProduct(productData) {
  try {
    const response = await fetch(`https://fakestoreapi.com/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    })
    if (!response.ok) throw new Error('Falha ao criar produto na API')
    return await response.json()
  } catch (error) {
    console.error('Falha no serviço createProduct:', error)
    return null
  }
}

export async function updateProduct(productId, productData) {
  try {
    const response = await fetch(`https://fakestoreapi.com/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    })
    if (!response.ok) throw new Error('Falha ao atualizar produto na API')
    return await response.json()
  } catch (error) {
    console.error('Falha no serviço updateProduct:', error)
    return null
  }
}

export async function deleteProduct(productId) {
  try {
    const response = await fetch(`https://fakestoreapi.com/products/${productId}`, {
      method: 'DELETE',
    })
    if (!response.ok) throw new Error('Falha ao deletar produto na API')
    return await response.json()
  } catch (error) {
    console.error('Falha no serviço deleteProduct:', error)
    return null
  }
}

export async function saveCart(cartData) {
  try {
    const response = await fetch(`${API_URL}/carts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cartData),
    })
    if (!response.ok) throw new Error('Falha ao salvar carrinho na API')
    return await response.json()
  } catch (error) {
    console.error('Falha no serviço saveCart:', error)
    return null
  }
}
