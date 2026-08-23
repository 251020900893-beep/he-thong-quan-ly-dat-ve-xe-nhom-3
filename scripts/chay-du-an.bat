@echo off
chcp 65001 > nul
title Khoi Chay Toan Bo He Thong - Nhom 03
echo ========================================================
echo   HE THONG QUAN LY DAT VE XE KHACH HN - HP
echo   DANG BAT DAU KHOI DONG BACKEND VA FRONTEND
echo ========================================================
echo.

echo [1/2] Dang khoi chay Backend Spring Boot (Port 8080)...
start "Backend Spring Boot" cmd /c "%~dp0chay-backend.bat"

echo [2/2] Dang khoi chay Frontend React (Port 5173)...
start "Frontend React" cmd /c "%~dp0chay-frontend.bat"

echo.
echo ========================================================
echo   HE THONG SE TU DONG BAT TRINH DUYET KHI SAN SANG!
echo ========================================================
pause