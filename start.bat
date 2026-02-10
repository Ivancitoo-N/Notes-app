@echo off
TITLE NotasApp - Servidor de Desarrollo
SETLOCAL
cd /d "%~dp0"

echo [1/4] Verificando dependencias...
if not exist ".env" (
    if exist ".env.example" (
        echo [INFO] Creando archivo .env desde .env.example...
        copy .env.example .env >nul
    ) else (
        echo DATABASE_URL="file:./dev.db" > .env
    )
)

if not exist "node_modules\" (
    echo [INFO] Instalando dependencias por primera vez...
    call npm install
)

echo [3/4] Preparando base de datos...
:: Matamos procesos que puedan estar bloqueando la DB
taskkill /F /IM node.exe /T 2>nul
:: Genera el cliente y sincroniza las tablas
echo [INFO] Generando cliente de base de datos...
call node node_modules\prisma\build\index.js generate
echo [INFO] Sincronizando tablas...
call node node_modules\prisma\build\index.js db push --accept-data-loss

echo [4/4] Iniciando NotasApp...
start http://localhost:3000
npm run dev
pause
ENDLOCAL
