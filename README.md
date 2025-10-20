# E-commerce com Vue.js 3

Este projeto é uma aplicação de e-commerce completa. A aplicação permite a visualização de produtos, gerenciamento de carrinho de compras e um sistema de autenticação com um painel de administração para gerenciamento de usuários e produtos.

**Aplicação online:** [desafio-frontend-vue-ecommerce.vercel.app]

---

## Funcionalidades Implementadas

### Para Usuários

- **Navegação e Visualização de Produtos:**
  - Listagem completa de produtos na página inicial.
  - Página dedicada para cada produto com informações detalhadas.
- **Carrinho de Compras:**
  - Adicionar e remover itens do carrinho.
  - Alterar la cantidad de cada item.
  - Feedback visual instantâneo.
  - Simulação de finalização de compra com esvaziamento do carrinho e modal de sucesso.
  - O estado do carrinho persiste no navegador mesmo se a página for recarregada, utilizando `localStorage`.
- **Autenticação e Perfil:**
  - Cadastro de novas contas com formulário completo e validação.
  - Login de usuários (originais da API e novos cadastrados na sessão).
  - Página de "Meu Perfil" para usuários logados visualizarem seus dados.
  - Sessão de usuário persistente.

### Para Administradores

- **Painel de Admin Seguro:**
  - Rota `/admin` protegida, acessível apenas por usuários com permissão de administrador (Vue Router Navigation Guard).
  - Link para o painel só é visível para administradores logados.
- **Gerenciamento de Usuários:**
  - Listar todos os usuários (da API + novos) em uma tabela paginada.
  - Visualizar detalhes de cada usuário em um modal.
  - Editar as informações de usuários existentes.
  - Promover usuários normais a administradores e rebaixar administradores.
  - Deletar usuários (com trava de segurança para o super admin).
  - Criar novos usuários diretamente pelo painel.
- **Gerenciamento de Produtos:**
  - Listar todos os produtos em uma tabela paginada.
  - Criar, Editar e Deletar produtos através de um modal.

---

## Tecnologias Utilizadas

- **Framework Principal:** Vue.js 3.
- **Gerenciamento de Estado:** Pinia.
  - `pinia-plugin-persistedstate` para persistir o estado do carrinho.
- **Roteamento:** Vue Router 4.
- **Biblioteca de UI:** PrimeVue.
- **Ferramentas de Build:** Vite.
- **Qualidade de Código:** ESLint e Prettier.
- **API:** FakeStore API para consumo de dados.

---

## Arquitetura e Decisões de Design

O projeto foi estruturado com foco na **Modularidade** para garantir sua organização e manutenção:

- **`/api`**: Contém os serviços responsáveis por toda a comunicação com a API externa.
- **`/stores`**: Centraliza toda a lógica de negócio e o gerenciamento de estado global. Cada "domínio" (produtos, carrinho, usuários, autenticação) tem sua própria store.
- **`/views`**: Representa as "páginas" da aplicação.
- **`/components`**: Contém os componentes reutilizáveis.

Uma decisão de design importante para a resolução de um problema prático foi a **simulação de funcionalidades não persistentes da API**. Como a FakeStore API não salva as alterações, toda a lógica de criação e modificação de dados é refletida em um estado local no Pinia. Isso permite uma experiência de usuário completa e realista durante a sessão. Para diferenciar usuários/produtos "reais" da API dos "fakes" criados localmente, foi utilizada uma flag `isFake: true` nos objetos criados.

---

## Como Executar o Projeto Localmente

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/joao1151/desafio-frontend-vue-ecommerce]
    ```
2.  **Navegue até a pasta do projeto:**
    ```bash
    cd nome-do-seu-projeto
    ```
3.  **Instale as dependências:**
    ```bash
    npm install
    ```
4.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```
5.  Abra [http://localhost:5173] no seu navegador.

### Credenciais de Administrador

Para acessar o painel de administrador e testar as funcionalidades restritas, utilize as credenciais do super admin criado localmente assim que o servidor é iniciado:

- **Usuário:** `admin`
- **Senha:** `admin`
