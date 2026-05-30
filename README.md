# IoT Sentinel Pro — Painel de Telemetria Industrial

## 📌 Contexto do Desafio
Na era da Indústria 4.0, o monitoramento de ativos em tempo real é vital para evitar paradas não programadas e acidentes. O **IoT Sentinel Pro** é um dashboard de telemetria industrial desenvolvido para permitir que operadores de campo cadastrem diferentes tipos de sensores, monitorem se os valores estão dentro da margem de segurança operacional e visualizem estatísticas gráficas das médias de operação de toda a planta industrial.

Este projeto compõe a **Atividade Prática Final** da grade de desenvolvimento de software.

---

## 🚀 Recursos e Funcionalidades
- **Provisionamento de Ativos:** Cadastro dinâmico de sensores via formulário lateral.
- **UX Industrial Reativa:** Higienização automática de entradas (`.trim()`) através de manipuladores de eventos (`onblur`).
- **Alertas Críticos Visuais:** Identificação visual instantânea de anomalias com bordas pulsantes e alertas baseados em *CSS Keyframes*.
- **Estatísticas em Tempo Real:** Gráfico de barras interativo que plota a média aritmética de cada categoria técnica.
- **Persistência Local:** Armazenamento do estado da planta através da API do `LocalStorage`, retendo os dados após o recarregamento da página (F5).

---

## 🛠️ Regras de Negócio (Limites Operacionais)
O sistema valida o status de operação do dispositivo como **NORMAL** ou **CRÍTICO** baseado nas seguintes faixas técnicas de engenharia:
* **Temperatura:** Crítico se o valor medido for maior que **50°C**.
* **Pressão:** Crítico se o valor medido for maior que **100 Bar**.
* **Umidade:** Crítico se o valor medido for menor que **30%** ou maior que **80%**.

---

## 💻 Tecnologias e Requisitos Técnicos Implementados

O ecossistema do projeto foi construído estritamente sob as exigências técnicas da rubrica de avaliação:

1. **Programação Orientada a Objetos (POO):** Utilização da estrutura de `class` com `constructor` e métodos encapsulados para gerenciar o ciclo de vida e a lógica de status de cada sensor.
2. **Gestão de Memória Moderna:** Uso exclusivo de escopos de variáveis estruturais `const` e `let`, abolindo completamente o uso de `var`.
3. **Persistência de Dados:** Implementação da API do `LocalStorage` para o espelhamento do estado da aplicação, com remapeamento de objetos JSON para instâncias de classe na inicialização do DOM.
4. **Manipulação Avançada de Arrays:** Uso encadeado de métodos funcionais de iteração:
   - `.forEach()` para a renderização limpa e montagem dinâmica dos cards no DOM.
   - `.filter()` para segregar e isolar os dispositivos por categoria técnica.
   - `.reduce()` para consolidar a soma e o cálculo das médias aritméticas de operação.
5. **Visualização de Dados (Gráficos):** Integração com a biblioteca externa **Chart.js** via CDN para plotagem de gráficos dinâmicos de barras.
6. **Interface Semântica e Responsiva:** Estruturação em HTML5 semântico, layout moderno em CSS Grid e Flexbox com suporte a visual *Dark Mode*.

---

## 📁 Estrutura de Arquivos

```text
├── index.html       # Estrutura semântica HTML5 e importações de bibliotecas (Chart.js / Fonts)
├── style.css        # Estilização sob os padrões de Dashboard (Grid Layout, Dark Mode e Keyframes)
└── script.js        # Lógica de negócio, modelo de classes, manipulação de arrays e eventos do DOM
