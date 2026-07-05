#!/usr/bin/env bash
# Deploy staging — build + smoke test local
set -euo pipefail

echo "==> GlowUP staging deploy"

echo "==> Running unit tests..."
npm test

echo "==> Running integration tests..."
npm run test:integrations

echo "==> Building..."
npm run build

echo "==> Build OK — dist/ pronto para deploy"
echo ""
echo "Próximo passo: enviar dist/ ao host de staging (Vercel/Railway/VPS)."
echo "Exemplo Vercel: vercel deploy --prebuilt"
echo "Exemplo Railway: railway up"
