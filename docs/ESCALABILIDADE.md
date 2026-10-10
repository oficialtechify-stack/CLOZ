# CLOZ — arquitetura para crescimento (proposta técnica)

Objetivo: preparar a plataforma para **milhares de contas**, sem prometer capacidade sem testes de carga. Este arquivo é planejamento; nada foi implantado no Firebase ou na Vercel.

## Regras de projeto
- Autenticação Firebase Auth; todo dado privado vinculado a `uid`, nunca a nome de exibição ou ID aleatório de perfil.
- Firestore: feed público em coleção `posts`, com `createdAt` e índices adequados. Paginar por cursor (`limit` + `startAfter`) com 15–20 posts, nunca carregar toda a coleção, nunca listener global no feed.
- Dividir dados: `users/{uid}` privado; `profiles/{uid}` público; `posts/{postId}`; `users/{uid}/saved/{postId}` privado; `posts/{postId}/comments/{commentId}` com paginação; `users/{uid}/following/{targetUid}`; `notifications` particionadas pelo destinatário. Mensagens privadas por conversa, com autorização de participantes.
- Curtidas e reposts: registros idempotentes por `uid` (documento fixo), não arrays crescentes no post. Contagens agregadas, evitar escrita concorrente no mesmo documento; para tráfego alto, contadores distribuídos e processadores idempotentes.
- Não usar `onSnapshot` em coleções globais. Listener apenas para conversa ativa ou pequenas páginas de notificações. Cancelar listeners ao sair das telas.
- Cache de dados por cursor, deduplicação de solicitações, debounce na pesquisa; buscas textuais relevantes usam índice/serviço de busca, não varredura total do Firestore.
- Imagens/vídeos em Cloud Storage, upload com limites de tipo/tamanho, derivados comprimidos/miniaturas, CDN e lazy loading. Não guardar mídia como base64 no Firestore.
- Backend para operações privilegiadas (webhooks, moderação, processamento de mídia, IA); validar usuário, autorização e rate limits no servidor. Nunca confiar em contagens ou IDs passados pelo cliente.
- Regras deny-all até testadas no emulator com casos de terceiros, donos, contas não autenticadas e leitura privada; Storage rules independentes.
- Monitorar leituras, escritas, custos, latência, erros, índices, tamanho de payload e quotas. Alertas de orçamento e limitação de operações abusivas.
- Testar com carga progressiva e concorrência (100 → 1.000 → 10.000 sessões simuladas) sem dados reais, medir p95, custos e erros. Ajustar arquitetura antes de declarar prontidão.
- Nenhuma migração de usuários do Base44 antes de estratégia de vinculação segura à Auth e consentimento adequado.

## Etapas
1. UI offline e modelagem tipada — atual.
2. Repositórios paginados e data access desacoplado de componentes.
3. Regras Firestore/Storage, índices, testes do emulator e Auth.
4. Importação segura e verificação de consistência.
5. Teste de carga, observabilidade, otimização de custos e lançamento gradual.

**Não publicar nem criar preview sem autorização explícita.**
