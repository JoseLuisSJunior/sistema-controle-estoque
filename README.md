# 📦 Sistema de Controle de Estoque (SCE)

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-blue)
![Stack](https://img.shields.io/badge/Stack-Node.js_|_Vanilla_JS_|_PostgreSQL-success)
![License](https://img.shields.io/badge/License-Academic-lightgrey)

> Projeto de Software desenvolvido com foco em um sistema de gerenciamento de inventário, priorizando performance, arquitetura limpa em 3 camadas e facilidade de uso.

---

## 📑 Índice
- [📦 Sistema de Controle de Estoque (SCE)](#-sistema-de-controle-de-estoque-sce)
  - [📑 Índice](#-índice)
  - [🎯 Sobre o Projeto](#-sobre-o-projeto)
  - [🛠️ Arquitetura e Tecnologias](#️-arquitetura-e-tecnologias)
  - [🚀 Funcionalidades e Sprints (Entregas)](#-funcionalidades-e-sprints-entregas)
  - [� Documentação da API](#-documentação-da-api)
    - [📦 Produtos](#-produtos)
  - [⚙️ Como Executar (Ambiente de Desenvolvimento)](#️-como-executar-ambiente-de-desenvolvimento)
    - [Pré-requisitos](#pré-requisitos)
    - [Passo a passo](#passo-a-passo)

---

## 🎯 Sobre o Projeto

O SCE foi projetado para resolver o problema de controle de fluxo de mercadorias. Ele permite o cadastro rápido de produtos e fornecedores, além de registrar o histórico de movimentações (entradas e saídas). A aplicação consolida esses dados para gerar alertas automáticos de estoque baixo, auxiliando na tomada de decisão.

## 🛠️ Arquitetura e Tecnologias

A aplicação segue a **Arquitetura de 3 Camadas** (Client-Server), garantindo a separação de responsabilidades:

**1. Camada de Apresentação (Front-end)**
- HTML5 e CSS3 (Design Responsivo + Dark Mode 🌙)
- JavaScript (Vanilla JS, Single Page Application via manipulação de DOM)
- Comunicação assíncrona com `Fetch API`.

**2. Camada de Negócios (Back-end)**
- **Node.js** com **Express** para criação da API RESTful.
- **CORS** para controle de acesso.

**3. Camada de Persistência (Banco de Dados)**
- **PostgreSQL** (Banco de dados relacional).
- Driver `pg` para gerenciamento do Pool de conexões.

---

## 🚀 Funcionalidades e Sprints (Entregas)

O escopo do projeto foi dividido em 4 fases incrementais:

- [x] **AC1 - Core de Produtos:** CRUD completo de itens no estoque. Cálculo automático de valor total.
- [ ] **AC2 - Gestão de Fornecedores:** CRUD de fornecedores (Nome, CNPJ e Contato).
- [ ] **AC3 - Movimentação:** Lógica transacional de Entrada/Saída e atualização de saldo em tempo real.
- [ ] **Prova Final - BI, Alertas e Controle de categorias:** Dashboard consolidado, formatação de alertas visuais para ruptura de estoque, criação de categorias para separar os itens cadastrados no estoque (Ex.: Mouse > Eletrônicos, Camiseta > Vestuário, entre outros) e entrega do Diagrama de Classes.

---

## 📡 Documentação da API

Abaixo estão os *endpoints* disponíveis para integração. O servidor roda por padrão em `http://localhost:3333`.

### 📦 Produtos
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/produtos` | Retorna a lista de todos os produtos cadastrados. |
| `GET` | `/produtos/:id` | Retorna os detalhes de um produto específico. |
| `POST` | `/produtos` | Cria um novo produto no banco de dados. |
| `PUT` | `/produtos/:id` | Atualiza os dados de um produto existente. |
| `DELETE` | `/produtos/:id` | Remove um produto do sistema. |

---

## ⚙️ Como Executar (Ambiente de Desenvolvimento)

### Pré-requisitos
Certifique-se de ter instalado em sua máquina:
- [Node.js](https://nodejs.org/) (v16 ou superior)
- [PostgreSQL](https://www.postgresql.org/)

### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/JoseLuisSJunior/sistema-controle-estoque.git](https://github.com/JoseLuisSJunior/sistema-controle-estoque.git)
   cd sistema-controle-estoque