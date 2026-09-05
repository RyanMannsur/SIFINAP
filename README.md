# SIFINAP — Sistema de Finanças Pessoais

Aplicação completa de finanças pessoais desenvolvida em Java (Spring Boot), PostgreSQL (Docker) e Angular (Bootstrap + Material Icons).

---

## 🚀 Como Executar Toda a Aplicação (Com Apenas 1 Comando)

Disponibilizamos scripts prontos de um clique na pasta raiz `fontes/`.

### Opção 1: No Git Bash (MINGW64)
No terminal do Git Bash dentro da pasta `fontes/`, execute:
```bash
./run.sh
```
*(ou `./run.bat`)*

### Opção 2: No Prompt de Comando do Windows (CMD)
No CMD dentro da pasta `fontes/`, execute:
```cmd
run.bat
```
*(ou dê dois cliques no arquivo `run.bat` na pasta pelo Windows Explorer)*

### Opção 3: No PowerShell
No PowerShell dentro da pasta `fontes/`, execute:
```powershell
.\run.ps1
```

### Opção 3: Executar via Docker Compose Completo
Se preferir rodar todos os containers isolados via Docker:
```bash
docker-compose up --build -d
```

---

## 🌐 Endereços de Acesso

Após executar a aplicação, acesse no navegador:

- **Frontend (Interface Web)**: [http://localhost:4200](http://localhost:4200) (ou `http://localhost`)
- **Backend (API REST)**: [http://localhost:8080/api](http://localhost:8080/api)
- **Banco de Dados (PostgreSQL)**: `localhost:5433` (Usuário: `sifinap`, Senha: `sifinap123`, Banco: `sifinap`)

---

## 🛠️ Tecnologias Utilizadas

- **Backend**: Java 21, Spring Boot 3.4.1, Spring Data JPA, Flyway Migration, Lombok.
- **Banco de Dados**: PostgreSQL 16 rodando via Docker.
- **Frontend**: Angular 22, Bootstrap 5, Material Icons, RxJS, TypeScript.

---

## 📋 Funcionalidades Principais

1. **Dashboard Financeiro do Mês**:
   - Visualização de Total do Mês, Já Pago, Falta Pagar e Próximas a Vencer.
   - Navegação simples entre meses anteriores e futuros.
   - Tabela clara no estilo planilha Excel com filtro por vencimento e status.

2. **Gestão de Cartões de Crédito**:
   - Tela exclusiva em `/cartoes` para cadastrar cartões fixos recorrentes.
   - O cartão fica presente automaticamente em todos os meses.
   - **Cópia Automática**: O valor da fatura digitado no mês anterior é copiado para o novo mês.

3. **Dívidas Diversas & Repasses**:
   - Cadastro de dívidas Pontuais, Parceladas, Empréstimos ou Repasses para terceiros.
