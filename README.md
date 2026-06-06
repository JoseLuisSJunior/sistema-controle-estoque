# 📦 Sistema de Controle de Estoque (SCE)

![Status](https://img.shields.io/badge/Status-Concluído-success)
![Stack](https://img.shields.io/badge/Stack-Node.js_|_Vanilla_JS_|_PostgreSQL_|_Chart.js-blue)
![License](https://img.shields.io/badge/License-Academic-lightgrey)

> Projeto de Software desenvolvido com foco em um sistema de gerenciamento de inventário, priorizando performance, arquitetura limpa em 3 camadas e facilidade de uso.

---

## 📑 Índice
- [📦 Sistema de Controle de Estoque (SCE)](#-sistema-de-controle-de-estoque-sce)
  - [📑 Índice](#-índice)
  - [🎯 Sobre o Projeto](#-sobre-o-projeto)
  - [🛠️ Arquitetura e Tecnologias](#️-arquitetura-e-tecnologias)
  - [🚀 Funcionalidades e Sprints (Entregas)](#-funcionalidades-e-sprints-entregas)
  - [📡 Documentação da API](#-documentação-da-api)
    - [📦 Produtos](#-produtos)
    - [🏢 Fornecedores](#-fornecedores)
    - [🏷️ Categorias](#️-categorias)
    - [🔄 Movimentações e Dashboard](#-movimentações-e-dashboard)
  - [⚙️ Como Executar (Ambiente de Desenvolvimento)](#️-como-executar-ambiente-de-desenvolvimento)
    - [Pré-requisitos](#pré-requisitos)
    - [Passo a passo](#passo-a-passo)

---

## 🎯 Sobre o Projeto

O SCE foi projetado para resolver o problema de controle de fluxo de mercadorias. Ele permite o cadastro rápido de produtos, categorias e fornecedores, além de registrar o histórico de movimentações (entradas e saídas) com controle transacional rigoroso. A aplicação consolida esses dados em um Dashboard Executivo para gerar alertas automáticos de estoque baixo, auxiliando na tomada de decisão.

## 🛠️ Arquitetura e Tecnologias

A aplicação segue a **Arquitetura de 3 Camadas** (Client-Server), garantindo a separação de responsabilidades:

**1. Camada de Apresentação (Front-end)**
- HTML5 e CSS3 (Design Responsivo + Dark Mode 🌙).
- JavaScript (Vanilla JS, Single Page Application via manipulação de DOM).
- **Chart.js** para renderização de gráficos em tempo real.
- Comunicação assíncrona com `Fetch API`.

**2. Camada de Negócios (Back-end)**
- **Node.js** com **Express** para criação da API RESTful.
- **CORS** para controle de acesso e segurança de payload.

**3. Camada de Persistência (Banco de Dados)**
- **PostgreSQL** (Banco de dados relacional).
- Driver `pg` para gerenciamento do Pool de conexões.

---

## 🚀 Funcionalidades e Sprints (Entregas)

O escopo do projeto foi dividido e entregue em 4 fases incrementais:

- [x] **AC1 - Core de Produtos:** CRUD completo de itens no estoque. Cálculo automático de valor total.
- [x] **AC2 - Gestão de Fornecedores:** CRUD de fornecedores (Nome, CNPJ e Contato) com travas de exclusão.
- [x] **AC3 - Movimentação:** Lógica transacional de Entrada/Saída e atualização de saldo em tempo real com registro de histórico.
- [x] **Prova Final - BI, Alertas e Controle de Categorias:** Dashboard consolidado, formatação de alertas visuais para ruptura de estoque, criação de categorias para separação de itens e entrega dos diagramas estruturais.

---

## 📡 Documentação da API

Abaixo estão os *endpoints* disponíveis para integração. O servidor roda por padrão em `http://localhost:3333`.

### 📦 Produtos
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/produtos` | Retorna a lista de produtos ativos com status de estoque. |
| `POST` | `/produtos` | Cria um novo produto no banco de dados. |
| `PUT` | `/produtos/:id` | Atualiza os dados de um produto existente. |
| `DELETE` | `/produtos/:id` | Realiza o *soft delete* de um produto. |

### 🏢 Fornecedores
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/fornecedores` | Retorna a lista de fornecedores ativos. |
| `POST` | `/fornecedores` | Cadastra um novo fornecedor. |
| `PUT` | `/fornecedores/:id` | Atualiza os dados do fornecedor. |
| `DELETE` | `/fornecedores/:id` | Inativa o fornecedor (bloqueado se houver vínculo com produtos). |

### 🏷️ Categorias
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/categorias` | Retorna as categorias disponíveis. |
| `POST` | `/categorias` | Cria uma nova categoria de agrupamento. |
| `PUT` | `/categorias/:id` | Atualiza o nome da categoria. |
| `DELETE` | `/categorias/:id` | Inativa a categoria (bloqueado se houver vínculo). |

### 🔄 Movimentações e Dashboard
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| `GET` | `/movimentacoes` | Retorna o histórico de entradas e saídas. |
| `POST` | `/movimentacoes` | Registra uma transação e atualiza o saldo do produto. |
| `GET` | `/dashboard/geral` | Retorna os KPIs financeiros e dados agregados para os gráficos. |

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