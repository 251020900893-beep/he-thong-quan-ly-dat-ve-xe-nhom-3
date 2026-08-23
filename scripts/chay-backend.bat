@echo off
chcp 65001 > nul
title Backend - He Thong Dat Ve Xe
echo ========================================================
echo   DANG KHOI CHAY BACKEND - SPRING BOOT PORT 8080
echo ========================================================
cd /d "%~dp0..\backend"
call mvnw.cmd spring-boot:run
pause