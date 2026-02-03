# OpenMold Ops Suite

Nowoczesny, open-source dashboard do pracy z lokalnym botem OpenMold. Projekt uruchamiasz lokalnie, a panel łączy się bezpośrednio z Twoim gateway w sieci LAN, aby pobierać logi, statystyki i wykonywać zadania.

## Najważniejsze funkcje

- Live sync z OpenMold Bot (status, logi, KPI).
- Chat UI do wysyłania promptów bezpośrednio do bota.
- Task manager, biblioteka templatek i szybkie akcje.
- Nowoczesne statystyki i wizualizacje w stylu SaaS.

## Szybki start

```sh
npm i
npm run dev
```

Aplikacja startuje domyślnie jako Vite dev server i jest dostępna w przeglądarce po uruchomieniu lokalnym.

## Połączenie z lokalnym OpenMold Bot

Dashboard domyślnie używa lokalnego gateway:

```
http://192.168.1.1:7331
```

Aby się połączyć:

1. Uruchom OpenMold Bot lokalnie w tej samej sieci.
2. Upewnij się, że API bota odpowiada na powyższym gateway.
3. W panelu „Połączenie z OpenMold” wpisz właściwy adres (jeśli inny) i kliknij „Odśwież połączenie”.
4. Status powinien przejść na „Online”, a logi pojawią się w sekcji „Live logi bota”.

### Endpointy, z których korzysta UI

Dashboard korzysta z poniższych endpointów (wszystkie względem gateway):

- `GET /status` – status połączenia.
- `GET /stats` – statystyki i KPI.
- `GET /logs?limit=6` – najnowsze logi.
- `POST /chat` – wysyłanie wiadomości do bota (`{ "message": "..." }`).

## Tech stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Deploy

Panel można uruchomić lokalnie jako open-source dashboard. Jeśli korzystasz z Lovable, nadal możesz go opublikować z poziomu panelu Share -> Publish.
