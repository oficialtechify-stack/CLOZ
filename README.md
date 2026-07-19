# CLOZ - Curated Fashion & Interactive Digital Closet

**CLOZ** é uma plataforma inovadora de moda curada e guarda-roupa digital interativo. Desenvolvido com React, TypeScript, Express e Inteligência Artificial, o aplicativo permite que os usuários façam upload de suas composições de roupas, utilizem algoritmos avançados de segmentação de imagem (IA) para remoção de fundos, analisem paletas cromáticas dominantes, detectem peças e acessórios individuais, e gerenciem seu closet digital com total privacidade.

---

## 🚀 Principais Funcionalidades

- **Onboarding Interativo com IA**: Fluxo dinâmico de boas-vindas com personalização de perfil, escolha de localização global e demonstração de segmentação inteligente.
- **Segmentação e Remoção de Fundo (IA)**: Tecnologia integrada para recortar peças de vestuário e anonimizar automaticamente os rostos com barras de censura de estilo editorial, garantindo privacidade absoluta.
- **Detecção de Peças e Tags Interativas**: Identificação automática de itens (Jaquetas, Jeans, Camisetas, Sapatos, Acessórios) com tags de preços e marcas estimadas direto na foto.
- **Análise Cromática Inteligente**: Gráficos analíticos processados via Gemini Vision revelando as cores dominantes das composições para combinações perfeitas.
- **Análise de Estéticas e Tendências**: Mapeamento do estilo predominante (ex: Monástico, Parisiense, Androginia, Sotto) de cada look publicado.
- **Gerenciamento de Closet**: Guarda-roupa virtual categorizado dinamicamente.
- **Sistema de Autenticação Seguro**: Fluxo completo via Firebase Authentication (E-mail/Senha e login sem senha).
- **Banco de Dados em Tempo Real**: Persistência de dados confiável hospedada no Firebase Firestore.

---

## 🛠️ Stack Tecnológica

- **Frontend**: React 19, Vite, Tailwind CSS 4, Motion (`motion/react` para animações fluidas) e Lucide Icons.
- **Backend**: Node.js, Express (para rotas de proxy de API seguras que protegem suas credenciais).
- **Integração de IA**: SDK oficial `@google/genai` utilizando modelos Gemini de última geração para processamento de visão computacional.
- **Infraestrutura**: Firebase (Auth e Firestore) para autenticação segura e persistência durável em nuvem.

---

## 📦 Como Rodar Localmente

### 1. Clonar o Repositório
```bash
git clone <url-do-seu-repositorio-no-github>
cd cloz
```

### 2. Instalar as Dependências
```bash
npm install
```

### 3. Configurar as Variáveis de Ambiente
Copie o arquivo de exemplo de ambiente para criar o seu `.env`:
```bash
cp .env.example .env
```
Abra o arquivo `.env` e preencha as variáveis necessárias:
- `GEMINI_API_KEY`: Sua chave de API do Google AI Studio para processamento de imagens e inteligência artificial.
- `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, etc.: Suas credenciais do Firebase Firestore/Authentication (altamente recomendado para persistir dados reais em ambiente de produção).

*Nota: Se as variáveis do Firebase não forem configuradas de imediato, o aplicativo inicializará de forma resiliente em modo sandbox local (com dados de demonstração salvos no navegador), garantindo que a aplicação nunca quebre no primeiro início.*

### 4. Executar o Servidor de Desenvolvimento
```bash
npm run dev
```
O servidor de desenvolvimento iniciará localmente. Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🌍 Estrutura do Projeto

- `/src/App.tsx`: Gerenciador principal de rotas e estados da aplicação.
- `/src/components/OnboardingFlow.tsx`: Interface do fluxo inteligente de onboarding de novos usuários.
- `/src/components/AuthScreen.tsx`: Tela de login e cadastro sofisticada com backgrounds dinâmicos.
- `/src/components/AppSimulator.tsx`: Simulador completo do ecossistema do app (feed, busca, closet virtual, upload de fotos e tags interativas).
- `/src/lib/firebase.ts`: Inicialização resiliente e segura do Firebase.
- `/server.ts`: Servidor backend Node/Express que provê endpoints seguros `/api/remove-bg` e `/api/gemini/analyze-look`.
- `/src/vite-env.d.ts`: Arquivo de declaração que garante builds TypeScript sem quebras no GitHub, fornecendo definições seguras para arquivos de configuração omitidos por segurança.

---

## ☁️ Como Fazer Deploy (GitHub -> Produção)

Este projeto foi projetado para ser compatível de forma nativa com as principais plataformas de hospedagem na nuvem:

### Opção A: Deploy no Vercel (Recomendado)
O projeto inclui o arquivo `vercel.json` pré-configurado para mapear as rotas estáticas do frontend e os endpoints da API Express automaticamente:
1. Conecte seu repositório do GitHub à sua conta do Vercel.
2. Na configuração do projeto, selecione o diretório raiz.
3. Adicione as variáveis de ambiente em **Project Settings -> Environment Variables**:
   - `GEMINI_API_KEY`
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_DATABASE_ID`
4. Clique em **Deploy**. O Vercel lidará com o build do frontend e hospedará as rotas de API como serverless functions de maneira transparente!

### Opção B: Deploy em Servidores VPS ou PaaS (Railway, Render, Google Cloud Run)
Para hospedagem de servidor clássico que executa continuamente:
- O script `npm run build` compila o frontend e agrupa o servidor Express em `dist/server.cjs` via `esbuild`.
- O comando de inicialização padrão configurado no `package.json` é `npm start`, que inicia o servidor compilado na porta `3000` (escutando em `0.0.0.0`).
- Configure as mesmas variáveis de ambiente listadas acima no painel do seu provedor de hospedagem e faça o deploy diretamente do seu branch principal do GitHub.

---

## 🛡️ Robustez no GitHub e Controle de Erros

Por motivos de segurança cibernética e privacidade dos seus dados, arquivos de configuração locais contendo chaves privadas, como `firebase-applet-config.json`, são ignorados no Git e nunca enviados ao GitHub (definido em `.gitignore`). 

Para evitar que compiladores TypeScript quebrem e falhem ao rodar o comando de compilação em computadores de outros desenvolvedores ou em pipelines de CI/CD (GitHub Actions, Vercel Build), implementamos um padrão duplo de resiliência:
1. **TypeScript Safe Declarations**: Criamos uma definição de tipo global para garantir que o import do arquivo de configuração sempre passe pelas verificações estáticas do compilador.
2. **Vite Alias Fallback**: Configuramos o `vite.config.ts` para mapear dinamicamente o arquivo ausente para um template de fallback neutro (`firebase-applet-config.fallback.json`) caso ele não exista no disco local, evitando erros de empacotamento em tempo de build.

---

Desenvolvido com sofisticação e precisão. 🕶️ **CLOZ Editorial Co.**
