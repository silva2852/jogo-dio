# 🎮 Mario MMO (Terminal Game)

Um jogo de batalha por turnos inspirado no universo Mario, rodando diretamente no terminal com Node.js. Dois jogadores escolhem personagens, coletam itens e competem em terrenos aleatórios até que apenas um sobreviva.

---

## 🧠 Conceito do Projeto

O projeto foi desenvolvido como um jogo simples em linha de comando, focado em:

* Lógica de turnos
* Interatividade via terminal
* Uso de Promises e async/await
* Estrutura de dados com objetos e arrays
* Simulação de combate com elementos aleatórios

A ideia central é misturar mecânicas de RPG leve com elementos clássicos do Mario (personagens, itens e sorte).

---

## ⚙️ Tecnologias Utilizadas

* **JavaScript (ES Modules)**
* **Node.js**
* Módulo nativo:

  * `readline/promises` → entrada de dados interativa no terminal
* ANSI Escape Codes → para cores no terminal

---

## 🏗️ Estrutura do Código

### 1. Interface de Entrada

O jogo utiliza `readline/promises` para capturar inputs do jogador de forma assíncrona:

```js
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
```

---

### 2. Sistema de Personagens

Os personagens são definidos em um array de objetos:

```js
const characters = [
  { name: "Mario", vel: 4, des: 3, for: 3, hp: 12 }
];
```

Cada personagem possui:

* **vel (velocidade)** → vantagem em retas
* **des (destreza)** → vantagem em curvas
* **for (força)** → vantagem em combate
* **hp (vida)** → pontos de vida
* **passiva** → habilidade especial

---

### 3. Sistema de Itens

Itens são gerados aleatoriamente a cada rodada:

```js
const itemsList = [
  { name: "🍄 Cogumelo", type: "heal" }
];
```

Tipos de efeito:

* `heal` → cura
* `damage` → dano direto
* `buff` → bônus temporário
* `debuff` → penalidade no oponente

Cada jogador pode carregar até **2 itens**.

---

### 4. Sistema de Turnos

O fluxo de um turno é:

1. Jogadores recebem loot (chance de 50%)
2. Terreno é sorteado:

   * RETA → usa velocidade
   * CURVA → usa destreza
   * LUTA → usa força
3. Cada jogador escolhe:

   * Atacar
   * Usar item
   * Ver inventário
4. Ambos rolam um dado (1–6)
5. Resultado final:

   ```
   dado + atributo + bônus
   ```
6. Quem tiver maior valor causa dano

---

### 5. Sistema de Combate

* Empates podem ser quebrados por habilidades (ex: Mario)
* Dano:

  * Normal → 1 HP
  * LUTA → 2 HP

---

### 6. Animação de Dados

Simulação visual de rolagem:

```js
for (let i = 0; i < 8; i++) {
  result = Math.random() * 6;
}
```

Isso cria uma sensação de "giro" no terminal.

---

### 7. Controle Assíncrono

O jogo usa:

* `async/await`
* `sleep()` com `setTimeout`

Para controlar:

* tempo entre ações
* fluidez da experiência

---

## ▶️ Como Executar

### 1. Instale o Node.js (versão 18+)

### 2. Salve o arquivo como:

```
mario-mmo.mjs
```

### 3. Execute:

```bash
node mario-mmo.mjs
```

---

## 🎮 Como Jogar

* Escolha dois personagens (P1 e P2)
* A cada rodada:

  * Use itens estrategicamente
  * Aproveite o terreno
* O jogo termina quando um jogador chega a **0 HP**

---

## 🧩 Possíveis Melhorias

* 🤖 Modo singleplayer (IA)
* 🌐 Multiplayer online
* 💾 Sistema de save
* 🖥️ Interface gráfica (Electron ou Web)
* 🔊 Sons e efeitos
* ⚖️ Balanceamento de personagens

---

## 📚 Aprendizados

Este projeto ajuda a praticar:

* Programação assíncrona em JavaScript
* Manipulação de entrada/saída no terminal
* Estruturação de jogos simples
* Organização de código em funções reutilizáveis

---

## 🏁 Conclusão

O **Mario MMO (Terminal Edition)** é um exemplo de como criar um jogo completo usando apenas Node.js e criatividade, explorando mecânicas simples mas divertidas dentro do terminal.

---
