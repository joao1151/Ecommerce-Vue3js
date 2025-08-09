import { createRouter, createWebHistory } from 'vue-router'
import { useStoreAutenticacao } from '@/stores/autenticacao'
import VisaoHome from '../views/VisaoHome.vue'
import VisaoDetalheProduto from '../views/VisaoDetalheProduto.vue'

import VisaoCarrinho from '../views/VisaoCarrinho.vue'
import VisaoLogin from '../views/VisaoLogin.vue'
import VisaoCadastro from '../views/VisaoCadastro.vue'
import VisaoAdmin from '../views/VisaoAdmin.vue'
import VisaoPerfil from '../views/VisaoPerfil.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: VisaoHome,
    },

    {
      path: '/produto/:id',
      name: 'detalhe-produto',
      component: VisaoDetalheProduto,
    },

    {
      path: '/carrinho',
      name: 'carrinho',
      component: VisaoCarrinho,
    },

    {
      path: '/login',
      name: 'login',
      component: VisaoLogin,
    },

    {
      path: '/cadastro',
      name: 'cadastro',
      component: VisaoCadastro,
    },

    {
      path: '/admin',
      name: 'admin',
      component: VisaoAdmin,
      beforeEnter: (to, from, next) => {
        const authStore = useStoreAutenticacao()
        if (!authStore.isAdmin) {
          next({ name: 'home' })
        } else {
          next()
        }
      },
    },

    {
      path: '/perfil',
      name: 'perfil',
      component: VisaoPerfil,
      beforeEnter: (to, from, next) => {
        const authStore = useStoreAutenticacao()
        if (!authStore.isLoggedIn) {
          next({ name: 'login' })
        } else {
          next()
        }
      },
    },
  ],
})

export default router
