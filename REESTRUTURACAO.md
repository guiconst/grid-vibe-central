# Reestruturação do projeto — guia rápido

Este documento explica a nova organização de pastas do **Central do Grid**,
depois da reorganização por *features*.

## Por que mudou

Antes, o projeto tinha tudo solto em pastas genéricas (`pages/`, `components/grid/`,
`data/`, `hooks/`, `services/`), sem relação direta entre um arquivo e o assunto
que ele resolve. Isso causava bugs "silenciosos" — por exemplo, uma página de
detalhe escondida dentro do mesmo arquivo da listagem, fácil de esquecer ao
atualizar algo.

Agora cada assunto (piloto, equipe, calendário, notícia, classificação, home,
sobre) tem sua própria pasta dentro de `src/features/`, com tudo que é
específico dele: página(s), componentes e dados.

## Nova estrutura

```
src/
  app/
    App.tsx                 # componente raiz + rotas

  features/                 # uma pasta por assunto do site
    home/
      pages/Home.tsx
    news/
      pages/News.tsx
      components/NewsCard.tsx
      data/news.json
    drivers/
      pages/DriversList.tsx  # /pilotos
      pages/DriverDetail.tsx # /pilotos/:id
      components/DriverCard.tsx
      data/drivers.json
      data/driverBios.ts
    teams/
      pages/TeamsList.tsx    # /equipes
      pages/TeamDetail.tsx   # /equipes/:id
      components/TeamCard.tsx
      data/teams.json
    standings/
      pages/Standings.tsx    # /classificacao
    calendar/
      pages/Calendar.tsx     # /calendario
      components/Countdown.tsx
      data/calendar.json
    about/
      pages/About.tsx        # /sobre

  shared/                   # código usado por mais de uma feature
    components/
      layout/GridShell.tsx   # header/footer/navegação
      ApiStatus.tsx
      NavLink.tsx
    context/GridContext.tsx  # idioma, tema, equipe favorita
    hooks/useF1Data.ts       # hooks React Query (standings, calendário, etc)
    services/
      f1Api.ts                # chamadas fetch cru às APIs (Ergast + OpenF1)
      f1Mappings.ts            # mapeamento de IDs Ergast → IDs do app

  lib/
    entities.ts               # acesso aos dados (teamById, driverById...)
    types.ts                  # tipos compartilhados (Team, Driver, Race)
    utils.ts                  # ⚠️ não mexer — convenção do shadcn/ui

  hooks/
    use-toast.ts               # ⚠️ não mexer — convenção do shadcn/ui
    use-mobile.tsx              # ⚠️ não mexer — convenção do shadcn/ui

  components/ui/               # componentes shadcn/ui — não tocado, é vendor

  data/
    standings.json              # fallback compartilhado (pilotos + construtores)

  pages/
    NotFound.tsx                 # única página genérica de verdade (404)

  i18n/                          # pt.json / en.json — inalterado
  test/                          # inalterado
```

## Por que `components/ui`, `lib/utils.ts`, `hooks/use-toast.ts` e
## `hooks/use-mobile.tsx` continuam nos lugares antigos

Esses arquivos seguem a convenção do **shadcn/ui**, configurada em
`components.json` (`aliases.utils`, `aliases.hooks`, `aliases.ui`). Se algum
dia você rodar `npx shadcn add <componente>` para adicionar um novo componente
de UI, o CLI vai procurar exatamente nesses caminhos. Movê-los quebraria esse
fluxo — por isso ficaram de fora da reorganização por features.

## O que foi removido (código morto)

- `src/pages/Index.tsx` — sobra do template inicial da Lovable, nunca importado.
- `src/App.css` — CSS do template Vite padrão, nunca importado (o app usa `index.css`).
- `TeamCard` e `StatPill` antigos em `components/grid/Cards.tsx` — não eram
  usados em nenhuma página (o `TeamCard` real, usado em `/equipes`, tinha um
  nome diferente: `TeamLogoCard`, hoje renomeado para `TeamCard` dentro de
  `features/teams/components/`).

## O que foi dividido

- `Drivers.tsx` (listagem + detalhe no mesmo arquivo) → `DriversList.tsx` +
  `DriverDetail.tsx`.
- `Teams.tsx` (idem) → `TeamsList.tsx` + `TeamDetail.tsx`.
- `Cards.tsx` (4 componentes genéricos num arquivo só) → um componente por
  feature (`NewsCard`, `DriverCard`, `TeamCard`).
- `gridData.ts` (tipos + dados + funções de acesso, tudo junto) →
  `lib/types.ts` (só tipos) + `lib/entities.ts` (dados e funções de busca).
- `f1Api.ts` (fetch + mapeamento de IDs, tudo junto) → `f1Api.ts` (só fetch) +
  `f1Mappings.ts` (só os mapas de ID, que crescem a cada temporada nova).

## Validação

Depois da reorganização, foram checados:
- `npx tsc --noEmit` → sem erros
- `npm run build` → build de produção passa
- `npx vitest run` → testes passam
- As 9 rotas do app testadas via `vite preview` → todas retornam 200 e
  carregam o bundle correto
