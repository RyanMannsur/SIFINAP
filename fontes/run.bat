@echo off
title SIFINAP - Inicializador Unificado
echo ==========================================
echo    Iniciando ecossistema SIFINAP...
echo ==========================================

echo.
echo [1/3] Subindo banco PostgreSQL no Docker...
docker-compose up -d postgres

echo.
echo [2/3] Iniciando Backend Spring Boot...
start "SIFINAP Backend" cmd /k "cd /d C:\projetos\SIFINAP\fontes\backend && mvnw spring-boot:run"

echo.
echo [3/3] Iniciando Frontend Angular...
start "SIFINAP Frontend" cmd /k "cd /d C:\projetos\SIFINAP\fontes\frontend && npm start"

echo.
echo ==========================================
echo    SIFINAP iniciado com sucesso!
echo    Frontend: http://localhost:4200
echo    Backend:  http://localhost:8080/api
echo ==========================================
