@echo off
TITLE NotasApp - Servidor de Desarrollo
SETLOCAL
cd /d "%~dp0"

echo [1/4] Verificando dependencias...
if not exist "node_modules\" (
    echo [INFO] Instalando dependencias por primera vez...
    call npm install
)

echo [2/4] Preparando base de datos...
call npx prisma generate
if not exist "dev.db" (
    echo [INFO] Creando base de datos inicial...
    call npx prisma migrate dev --name init
)

echo [3/4] Limpiando procesos antiguos...
taskkill /F /IM node.exe /T 2>nul

echo [4/4] Iniciando NotasApp...
start http://localhost:3000
npm run dev
pause
ENDLOCAL
