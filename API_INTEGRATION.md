# Integração com APIs Gratuitas

## APIs utilizadas

### Ergast F1 API (via mirror jolpi.ca)
**URL base:** `https://api.jolpi.ca/ergast/f1`  
**Chave:** ❌ Não requer  
**Rate limit:** ~4 req/seg  

Endpoints usados:
| Endpoint | Dados |
|---|---|
| `/current/driverStandings/` | Classificação de pilotos da temporada atual |
| `/current/constructorStandings/` | Classificação de construtores |
| `/current/` | Calendário completo da temporada |
| `/current/last/results/` | Resultado da última corrida |

### OpenF1 API
**URL base:** `https://api.openf1.org/v1`  
**Chave:** ❌ Não requer  
**Destaque:** dados em tempo real durante sessões  

Endpoints usados:
| Endpoint | Dados |
|---|---|
| `/sessions?session_key=latest` | Sessão atual / mais recente |
| `/drivers?session_key=latest` | Pilotos + foto (headshot) + cor da equipe |
| `/position?session_key=latest` | Posições em tempo real (polling 5s durante sessão) |
| `/meetings?year=YYYY` | Lista de etapas do ano |

---

## Arquivos criados

```
src/
  services/
    f1Api.ts          ← funções puras de fetch (Ergast + OpenF1)
  hooks/
    useF1Data.ts      ← React Query hooks com cache + fallback
  components/grid/
    ApiStatus.tsx     ← indicador discreto de loading/erro
```

## Páginas atualizadas

| Página | Antes | Depois |
|---|---|---|
| `/` (Home) | dados estáticos | líderes + último resultado via API |
| `/classificacao` | JSON local | standings em tempo real, atualiza a cada 5 min |
| `/calendario` | JSON local | calendário com status calculado dinamicamente |

## Estratégia de cache (React Query)

| Dado | `staleTime` | Comportamento |
|---|---|---|
| Standings | 5 min | Revalida ao montar se mais velho que 5 min |
| Calendário | 1 hora | Raramente muda, cache longo |
| Último resultado | 30 min | Atualiza após corridas |
| Posições ao vivo | 5 seg | Só ativo quando `session.status === "started"` |

## Fallback automático

Se a API falhar (offline, rate limit, etc.), os componentes usam os dados dos JSONs locais em `src/data/`. Um indicador discreto no canto da tela (`ApiStatus`) mostra "Usando dados locais" quando isso ocorre.

## Como manter os dados locais atualizados

Os JSONs em `src/data/` servem como **fallback de emergência**. Recomendado atualizá-los a cada temporada nova (drivers, teams). Os standings e calendário são sempre buscados da API ao vivo.
