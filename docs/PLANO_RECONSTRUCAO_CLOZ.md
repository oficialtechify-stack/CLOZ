# CLOZ — Plano de reconstrução fiel (fase visual)

## Fonte principal e limites
- Interface original do protótipo Gemini: manter `LandingPage.tsx`, `ArmarioDigitalView.tsx`, identidade tipográfica, paleta, imagens e comportamento existentes.
- Base44 Cloz: referência funcional recuperada de **12 modelos de dados**. O código e as telas originais não estão disponíveis para exportação no plano atual; não declarar identidade visual exata sem capturas/referências reais.
- `SocialApp.tsx` é um rascunho de demonstração e **não** integra o aplicativo até a revisão de fidelidade.
- Firebase `cloz-d1982`: não ler, escrever nem migrar dados nesta fase. Regras de produção bloqueadas até projeto de permissões e testes.

## Funcionalidades conhecidas do Base44 para reconstruir
| Área | Base44 / entidades | Fluxos visuais necessários | Estado |
|---|---|---|---|
| Perfil e conta | User, UserProfile | onboarding, perfil público, edição, tema de perfil, privacidade, seguir/bloquear | A mapear visual |
| Feed de looks | Look | publicar imagem/vídeo, música, tags, estilo, cores, curtir, comentar, explorar | A mapear visual |
| Stories | Story, StoryView | criar story, abrir, avançar, visualizar espectadores | A mapear visual |
| Closet | ClosetItem | peças possuídas/desejadas, vincular peças a looks, organizar por categoria | A mapear visual |
| Chat | Message | conversas privadas e fotos, não lidas | A mapear visual |
| Música | MusicLibrary, Playlist | buscar faixa, criar playlist e visualizar faixas | A mapear visual |
| Listening together | SyncInvite, SyncGroup | convite, aceite, grupo e sincronização | A mapear visual |
| Notificações | Notification | seguir, curtir, lidas/não lidas | A mapear visual |

## Ordem de implementação
1. Conservar landing e closet visual do protótipo Gemini.
2. Recriar navegação e layout social coerentes com as referências de tela do Base44, substituindo o rascunho atual.
3. Implementar fluxo local funcional, com dados de exemplo explicitamente rotulados e sem banco: feed, perfil, publicador de look, stories, closet, chat, playlists/sync, notificações.
4. Validar responsividade em desktop e celular, acessibilidade e build.
5. Após aprovação visual, integrar Auth/Firestore/Storage com regras por usuário; migrar dados com identificação consistente dos IDs e plano específico de credenciais.

## Restrições
- Não substituir `main` ou publicar nova versão sem solicitar/receber autorização específica.
- Não importar dados de usuários do Base44 para ambiente de demonstração.
- Não criar interfaces genéricas novas que distorçam a identidade do protótipo existente.


## Direção de produto aprovada — rede universal, lançamento focado em devs
- CLOZ será uma **rede social universal**; programação é a comunidade inicial, **não** um limite de cadastro ou publicação.
- Preservar nome, identidade visual, tipografia e estética original do protótipo Gemini. Não trocar por aparência genérica de ferramenta para programadores.
- Feed admite formatos `texto`, `imagem`, `vídeo`, `projeto` e tópicos opcionais; uma conta pode acompanhar múltiplos interesses (desenvolvimento, moda, música, games etc.).
- Explorar por interesse e descobrir comunidades; não filtrar nem bloquear usuários de outros nichos.
- Perfis universais com seções opcionais: portfólio de projetos e linguagens para devs; closet e looks para moda; ambas podem coexistir.
- Fluxos sociais comuns: seguir, comentar, curtir, salvar, mensagens, stories e notificações.
- Comunidades de tecnologia, moda e outras categorias usam a mesma arquitetura; evitar coleções Firebase separadas por nicho.
- Destaque inicial para comunidade dev com cartões de projetos, repositórios GitHub e colaboração. GitHub OAuth/API é integração futura, não requisito para navegação.
- IA desativada até escolher um provedor; falha de IA nunca impede uso das outras funções.
- Na fase atual, desenvolver estrutura visual **sem importar usuários ou abrir regras do banco**; qualquer conteúdo de amostra deve ser rotulado demonstração.

### Nova sequência visual
1. Navegação e feed universais respeitando o design já existente.
2. Perfil universal configurável e conteúdos em múltiplas categorias.
3. Comunidades e vitrine de projetos dos desenvolvedores.
4. Stories, mensagens, música e notificações.
5. Módulos opcionais de moda/closet, preservando funcionalidades herdadas do Base44.
6. Revisão de fidelidade visual e testes responsivos antes de conectar Firebase e migrar dados.
