# ZKPVP Backend

API Express + TypeScript + PostgreSQL.

```bash
npm install
cp .env.example .env
# Configure DATABASE_URL, Discord OAuth e demais segredos
npm run dev
```

Produção: `npm run build` e `npm start`. Não publique o arquivo `.env`.


## Roleplay / Whitelist

A migration `010_roleplay_whitelist.sql` cria a fila de solicitações de whitelist. O jogador autentica pelo Discord e envia
personagem, idade, experiência e história. A equipe revisa as solicitações em `/staff` (aba Whitelist RP), registrando
aprovação/reprovação e notas. O endpoint legado `/api/link` de vinculação por token foi desativado no servidor HTTP.
