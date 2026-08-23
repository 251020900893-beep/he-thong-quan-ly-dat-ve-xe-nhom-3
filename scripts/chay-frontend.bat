@echo off
chcp 65001 > nul
title Frontend - He Thong Dat Ve Xe
echo ========================================================
echo   DANG KHOI CHAY FRONTEND - REACT VITE PORT 5173
echo ========================================================
cd /d "%~dp0..\frontend"
if not exist node_modules call npm install
call npm run dev -- --open
pause