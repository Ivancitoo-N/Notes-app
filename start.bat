@echo off
TITLE NotasApp - Servidor de Desarrollo
SETLOCAL
cd /d "%~dp0"

echo [1/4] Verificando dependencias...
if not exist "node_modules\" (
    echo [INFO] Instalando dependencias por primera vez...
    call npm install
)

echo [3/4] Preparando base de datos...
:: Matamos procesos que puedan estar bloqueando la DB
taskkill /F /IM node.exe /T 2>nul
:: Genera el cliente y sincroniza las tablas forzosamente
call npx prisma generate
echo [INFO] Sincronizando tablas...
call npx prisma db push --accept-data-loss --skip-generate

echo [4/4] Iniciando NotasApp...
start http://localhost:3000
npm run dev
pause
ENDLOCAL
