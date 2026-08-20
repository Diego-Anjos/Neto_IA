# 🤖 NetoIA - Seu Assistente Digital Paciente

<div align="center">
  <p><strong>Apresentado na Expo Tech UniFECAF 2025</strong></p>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white" />
</div>

---

## 📋 Sobre o Projeto

**NetoIA** é um assistente digital inteligente desenvolvido com foco em acessibilidade e facilidade de uso. O sistema utiliza a API Google Gemini para fornecer respostas contextuais e instruções passo a passo, sendo especialmente útil para auxiliar usuários em tarefas do dia a dia no ambiente digital (como idosos ou iniciantes em tecnologia).

O projeto foi criado como trabalho acadêmico para apresentação na **Expo Tech UniFECAF 2025**, demonstrando a integração de tecnologias modernas de IA com interfaces web responsivas, acessíveis e com persistência de dados em nuvem.

## 👥 Equipe de Desenvolvimento

| Nome | RA |
| :--- | :--- |
| **Diego dos Anjos Gomes** | 7961 |
| **Gustavo Ribeiro Santos** | 90044 |
| **Ian Meirelles** | 94838 |

---

## ✨ Funcionalidades

* 🗣️ **Reconhecimento de Voz:** Faça perguntas usando o microfone do dispositivo.
* 🔊 **Síntese de Voz:** Ouça as respostas em áudio com voz natural.
* 📝 **Instruções Passo a Passo:** Receba tutoriais visuais e detalhados.
* 🔐 **Contas de Usuário:** Autenticação segura e isolamento de dados (cada usuário vê apenas o seu histórico).
* 💬 **Histórico Salvo em Nuvem:** Conversas persistidas com segurança em banco de dados.
* 🛡️ **Foco Protegido:** A IA é programada para responder **apenas** sobre tecnologia, recusando desvios de assunto.
* 🔄 **Fallback de Modelos:** Rotação automática de modelos de IA para garantir disponibilidade.

---

## 🚀 Stack Tecnológica

O projeto adota uma arquitetura Fullstack dividida em duas aplicações:

### Frontend (`/frontend`)
* **React 19 & TypeScript:** Construção da interface.
* **Vite 6:** Build tool ultra-rápida.
* **Tailwind CSS:** Estilização responsiva.
* **Google Gemini API SDK:** Comunicação via `@google/genai`.
* **Web Speech API:** Reconhecimento e síntese de voz nativa.

### Backend (`/backend`)
* **NestJS 11:** Framework Node.js robusto para a API REST.
* **Prisma ORM:** Gerenciamento do banco de dados.
* **PostgreSQL:** Banco de dados relacional (hospedado no Supabase).
* **JWT & Scrypt:** Autenticação e criptografia de senhas.

---

## 🛠️ Como Configurar e Executar Localmente

### Pré-requisitos
* Node.js (versão 18 ou superior)
* Banco de dados PostgreSQL rodando (ou conta no Supabase)
* Chave de API do Google AI Studio

### 1. Clonar o Repositório
```bash
git clone https://github.com/Diego-Anjos/Projeto_Neto_IA.git
cd Projeto_Neto_IA
```

### 2. Configurar o Backend

```bash
cd backend
npm install
```

Crie o arquivo `backend/.env` com as variáveis abaixo:

```env
DATABASE_URL="postgresql://USUARIO:SENHA@HOST:5432/postgres"
PORT=3000
JWT_SECRET="uma-chave-secreta-com-pelo-menos-16-caracteres"
CORS_ORIGIN="http://localhost:5173"
```

Em seguida, gere o cliente Prisma e inicie a API:

```bash
npx prisma generate
npm run start:dev
```

A API ficará disponível em **http://localhost:3000**.

### 3. Configurar o Frontend

Em outro terminal:

```bash
cd frontend
npm install
```

Crie o arquivo `frontend/.env`:

```env
VITE_GEMINI_API_KEY=sua-chave-api-aqui
VITE_API_URL=http://localhost:3000
```

> **Nota:** Você pode adicionar várias chaves do Gemini separadas por vírgula para rotação automática:
> ```env
> VITE_GEMINI_API_KEY=chave1,chave2,chave3
> ```

Obtenha a chave em [Google AI Studio](https://aistudio.google.com/app/apikey).

Inicie o frontend:

```bash
npm run dev
```

O aplicativo estará disponível em **http://localhost:5173**.

### 4. Build para Produção

**Backend:**

```bash
cd backend
npm run build
npm run start:prod
```

**Frontend:**

```bash
cd frontend
npm run build
```

Os arquivos otimizados do frontend serão gerados em `frontend/dist/`.

---

## 🎯 Como Usar

### 1. Criar conta ou entrar
Cadastre-se ou faça login para que o histórico fique associado à sua conta.

### 2. Fazer uma pergunta
- **Por texto:** digite no campo de entrada e pressione Enter.
- **Por voz:** clique no ícone do microfone e fale.

### 3. Receber respostas
As respostas aparecem em formato de chat. Instruções complexas são exibidas em passos numerados, com descrição visual.

### 4. Ouvir respostas
Clique no ícone de alto-falante ao lado das mensagens para ouvir o conteúdo.

### 5. Gerenciar conversas
Crie novas conversas, volte ao histórico na barra lateral e ajuste idioma e preferências nas configurações.

---

## 🔒 Segurança e Privacidade

* Senhas são armazenadas com **Scrypt**, nunca em texto puro.
* Acesso à API autenticado por **JWT**.
* Cada usuário acessa apenas as próprias conversas.
* Chaves de API e `JWT_SECRET` ficam apenas em variáveis de ambiente (não versionadas).

---

## 📱 Compatibilidade

### Navegadores suportados
* Google Chrome (recomendado)
* Microsoft Edge
* Safari (iOS 15+)
* Firefox (reconhecimento de voz limitado)

### Dispositivos
* Desktop (Windows, macOS, Linux)
* Mobile (Android, iOS)
* Tablets

---

## 🐛 Solução de Problemas

### Erro: chave da API Gemini não configurada
Verifique se `frontend/.env` existe e contém `VITE_GEMINI_API_KEY`.

### Erro: `JWT_SECRET` inválida
O backend exige `JWT_SECRET` com pelo menos 16 caracteres em `backend/.env`.

### API indisponível no frontend
Confirme se o NestJS está rodando na porta 3000 e se `VITE_API_URL` aponta para essa URL.

### Áudio ou microfone não funcionam
Permita acesso ao microfone/áudio no navegador. O Chrome costuma ter o melhor suporte à Web Speech API.

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos como parte da **Expo Tech UniFECAF 2025**.

---

## 📞 Contato

**Instituição:** UniFECAF  
**Evento:** Expo Tech 2025  
**Curso:** Gestão Tecnologia da Informação  
**Ano:** 2025

---

<div align="center">

### Desenvolvido por Diego Anjos, Gustavo Santos e Ian Meirelles

**UniFECAF - Expo Tech 2025**

</div>
