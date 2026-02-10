@echo off
TITLE NotasApp - Servidor de Desarrollo
cd /d "%~dp0"

echo [1/3] Limpiando procesos antiguos...
:: Mata cualquier proceso de node que pueda estar bloqueando el puerto o la carpeta .next
taskkill /F /IM node.exe /T 2>nul

echo [2/3] Borrando bloqueos de cache...
if exist ".next\dev\lock" del /f /q ".next\dev\lock"

echo [3/3] Iniciando NotasApp...
start http://localhost:3000
npm run dev
pause
