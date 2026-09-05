# Script Powershell para rodar toda a aplicação SIFINAP simultaneamente (PostgreSQL, Backend e Frontend)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   Iniciando ecossistema SIFINAP...       " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Iniciar Banco PostgreSQL via Docker
Write-Host "`n[1/3] Subindo banco PostgreSQL no Docker..." -ForegroundColor Yellow
docker-compose up -d postgres

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro ao iniciar o container do PostgreSQL no Docker." -ForegroundColor Red
    exit 1
}

Write-Host "PostgreSQL rodando com sucesso na porta 5433!" -ForegroundColor Green

# 2. Iniciar Backend em nova janela do PowerShell
Write-Host "`n[2/3] Iniciando Backend Spring Boot em segundo plano..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendPath'; Write-Host '=== INICIANDO BACKEND SPRING BOOT ===' -ForegroundColor Green; .\mvnw spring-boot:run"

# 3. Iniciar Frontend em nova janela do PowerShell
Write-Host "`n[3/3] Iniciando Frontend Angular em segundo plano..." -ForegroundColor Yellow
$frontendPath = Join-Path $PSScriptRoot "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendPath'; Write-Host '=== INICIANDO FRONTEND ANGULAR ===' -ForegroundColor Green; npm start"

Write-Host "`n==========================================" -ForegroundColor Cyan
Write-Host "   SIFINAP iniciado com sucesso!           " -ForegroundColor Green
Write-Host "   Frontend: http://localhost:4200        " -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:8080/api    " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
