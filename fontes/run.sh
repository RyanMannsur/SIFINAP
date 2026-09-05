#!/bin/bash
# Script Shell/Git Bash para rodar toda a aplicação SIFINAP (PostgreSQL, Backend e Frontend)

echo -e "\033[1;36m==========================================\033[0m"
echo -e "\033[1;36m   Iniciando ecossistema SIFINAP...       \033[0m"
echo -e "\033[1;36m==========================================\033[0m"

# 1. Iniciar Banco PostgreSQL via Docker
echo -e "\n\033[1;33m[1/3] Subindo banco PostgreSQL no Docker...\033[0m"
docker-compose up -d postgres

if [ $? -ne 0 ]; then
    echo -e "\033[1;31mErro ao iniciar o container do PostgreSQL no Docker.\033[0m"
    exit 1
fi

echo -e "\033[1;32mPostgreSQL rodando com sucesso na porta 5433!\033[0m"

# 2. Iniciar Backend em novo terminal
echo -e "\n\033[1;33m[2/3] Iniciando Backend Spring Boot...\033[0m"
start cmd /k "cd /d C:\\projetos\\SIFINAP\\fontes\\backend && mvnw spring-boot:run"

# 3. Iniciar Frontend em novo terminal
echo -e "\n\033[1;33m[3/3] Iniciando Frontend Angular...\033[0m"
start cmd /k "cd /d C:\\projetos\\SIFINAP\\fontes\\frontend && npm start"

echo -e "\n\033[1;36m==========================================\033[0m"
echo -e "\033[1;32m   SIFINAP iniciado com sucesso!           \033[0m"
echo -e "\033[1;36m   Frontend: http://localhost:4200        \033[0m"
echo -e "\033[1;36m   Backend:  http://localhost:8080/api    \033[0m"
echo -e "\033[1;36m==========================================\033[0m"
