#!/bin/bash

echo "🔄 Pulizia processi..."
pkill -f "tsx.*server" 2>/dev/null
pkill -f "check-db" 2>/dev/null
sleep 2

echo "🚀 Avvio server..."
cd /home/ubuntu/portale-assicurativo-live
pnpm dev &

sleep 5
echo "✅ Server avviato!"

# Verifica
if netstat -tlnp 2>/dev/null | grep -q 3000; then
  echo "✅ Server in ascolto sulla porta 3000"
else
  echo "❌ Errore: server non in ascolto"
fi

