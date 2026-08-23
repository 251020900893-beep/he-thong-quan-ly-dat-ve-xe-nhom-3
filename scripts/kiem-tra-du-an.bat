@echo off
chcp 65001 > nul
title Kiem Tra Toan Bo Du An - Unit Test & Build
echo ========================================================
echo   KIEM TRA CHAT LUONG DU AN - UNIT TEST VA BUILD CHECK
echo ========================================================
echo.

echo [1/3] Dang chay Unit Test Backend...
cd /d "%~dp0..\backend"
call mvnw.cmd clean test
if %errorlevel% neq 0 goto loi

echo -> Backend test: PASS thanh cong!
echo.

echo [2/3] Dang kiem tra Typecheck Frontend...
cd /d "%~dp0..\frontend"
call npm run typecheck
if %errorlevel% neq 0 goto loi

echo -> Frontend typecheck: PASS thanh cong!
echo.

echo [3/3] Dang thu nghiem Build Production Frontend...
call npm run build
if %errorlevel% neq 0 goto loi

echo -> Build Frontend: PASS thanh cong!
echo.
echo ========================================================
echo   XAC NHAN: TAT CA KIEM TRA DEU HOAN HAO (ALL PASS)!
echo ========================================================
pause
exit /b 0

:loi
echo.
echo [THAT BAI] Qua trinh kiem tra co loi!
pause
exit /b 1