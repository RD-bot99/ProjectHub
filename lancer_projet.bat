@echo off
echo =========================================
echo   Lancement de ProjectHub (Fullstack)
echo =========================================

echo 1. Lancement du Backend (Laravel) sur le port 8000...
cd projecthub-backend
start "Backend ProjectHub" cmd /k "php artisan serve"
cd ..

echo 2. Lancement du Frontend (Next.js) sur le port 3000...
start "Frontend ProjectHub" cmd /k "npm run dev"

echo Serveurs lances dans de nouvelles fenetres !
echo Laissez ces fenetres ouvertes pendant que vous developpez.
pause
