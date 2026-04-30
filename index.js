import readline from 'readline/promises';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const c = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m"
};

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

const characters = [
    { id: "1", name: "Mario", vel: 4, des: 3, for: 3, hp: 12, passive: "Sorte: +1 em empates." },
    { id: "2", name: "Luigi", vel: 3, des: 4, for: 4, hp: 10, passive: "Salto: Bônus em Curvas." },
    { id: "3", name: "Peach", vel: 3, des: 4, for: 2, hp: 10, passive: "Coração: Cura em Curvas." },
    { id: "4", name: "Bowser", vel: 5, des: 2, for: 5, hp: 15, passive: "Casco: Defesa em Lutas." },
    { id: "5", name: "Yoshi", vel: 2, des: 4, for: 3, hp: 10, passive: "Língua: Ignora bônus rival." },
    { id: "6", name: "Donkey Kong", vel: 2, des: 2, for: 6, hp: 12, passive: "Bruto: Dano alto em Lutas." }
];

const itemsList = [
    { name: "🍄 Cogumelo", effect: "Cura 4 HP", type: "heal" },
    { name: "⭐ Estrela", effect: "+5 no dado", type: "buff" },
    { name: "🐢 Casco", effect: "Dano -2 no rival", type: "damage" },
    { name: "⚡ Raio", effect: "Debuff -2 no rival", type: "debuff" }
];

async function rollDiceAnimation(playerName) {
    let result = 0;
    for (let i = 0; i < 8; i++) {
        result = Math.floor(Math.random() * 6) + 1;
        process.stdout.write(`\r${c.magenta}🎲 ${playerName} girando: [ ${result} ]${c.reset}`);
        await sleep(80);
    }
    console.log(` -> ${c.yellow}${c.bright}${result}${c.reset}`);
    return result;
}

// 🔥 Loot por rodada + limite de inventário
async function handleLoot(player) {
    if (Math.random() < 0.5) {
        const item = itemsList[Math.floor(Math.random() * itemsList.length)];

        if (player.inventory.length < 2) {
            player.inventory.push(item);
            console.log(`\n${c.green}🎁 ${player.name} encontrou: ${item.name}${c.reset}`);
        } else {
            console.log(`\n${c.yellow}⚠️ ${player.name} achou ${item.name}, mas inventário cheio!${c.reset}`);
        }

        await sleep(800);
    }
}

// 🎮 Menu interativo
async function playTurn(player, opponent) {
    console.log(`\n--- Vez de ${c.cyan}${player.name}${c.reset} ---`);

    while (true) {
        console.log(`\n${c.white}Escolha ação:${c.reset}`);
        console.log(`1 - ⚔️ Atacar`);
        console.log(`2 - 🎒 Usar Item`);
        console.log(`3 - 📦 Ver Inventário`);

        let action = await rl.question("> ");

        if (action === "1") {
            console.log(`${c.yellow}${player.name} decidiu atacar!${c.reset}`);
            break;
        }

        if (action === "2") {
            if (player.inventory.length === 0) {
                console.log(`${c.red}❌ Sem itens!${c.reset}`);
                continue;
            }

            console.log(`\n🎒 Inventário:`);
            player.inventory.forEach((item, i) => {
                console.log(`${i + 1} - ${item.name} (${item.effect})`);
            });

            let choice = await rl.question("Escolha item: ");
            let item = player.inventory[choice - 1];

            if (!item) {
                console.log(`${c.red}❌ Escolha inválida!${c.reset}`);
                continue;
            }

            console.log(`${c.green}✨ ${player.name} usou ${item.name}!${c.reset}`);

            if (item.type === "heal") player.hp += 4;
            if (item.type === "damage") opponent.hp -= 2;
            if (item.type === "buff") player.nextBonus = 5;
            if (item.type === "debuff") opponent.nextBonus = -2;

            player.inventory.splice(choice - 1, 1);
            await sleep(1000);
            break;
        }

        if (action === "3") {
            if (player.inventory.length === 0) {
                console.log(`${c.yellow}📦 Inventário vazio.${c.reset}`);
            } else {
                console.log(`\n📦 Itens:`);
                player.inventory.forEach(item => {
                    console.log(`- ${item.name} (${item.effect})`);
                });
            }
        }
    }
}

async function runGame() {
    console.clear();

    console.log(`${c.yellow}╔══════════════════════════════════════════╗`);
    console.log(`║                MARIO MMO                 ║`);
    console.log(`╚══════════════════════════════════════════╝${c.reset}\n`);

    characters.forEach(char =>
        console.log(`${c.cyan}${char.id}. ${char.name.padEnd(12)}${c.reset} | HP: ${char.hp} | ${char.passive}`)
    );

    let p1Choice = await rl.question('\nEscolha P1 (1-6): ');
    let p2Choice = await rl.question('Escolha P2 (1-6): ');

    let p1 = { ...(characters.find(ch => ch.id === p1Choice) || characters[0]), inventory: [], nextBonus: 0 };
    let p2 = { ...(characters.find(ch => ch.id === p2Choice) || characters[1]), inventory: [], nextBonus: 0 };

    let round = 1;

    while (p1.hp > 0 && p2.hp > 0) {
        console.clear();

        console.log(`${c.yellow}------------------------------------------`);
        console.log(` ROUND ${round} | ${p1.name}: ${p1.hp} HP | ${p2.name}: ${p2.hp} HP`);
        console.log(`------------------------------------------${c.reset}`);

        await handleLoot(p1);
        await handleLoot(p2);

        const terrain = [{ n: "RETA", a: "vel" }, { n: "CURVA", a: "des" }, { n: "LUTA", a: "for" }][Math.floor(Math.random() * 3)];
        console.log(`\n📍 Terreno: ${c.bright}${terrain.n}${c.reset}`);

        await playTurn(p1, p2);
        await playTurn(p2, p1);

        console.log(`\n${c.bright}--- RESULTADO DO TURNO ---${c.reset}`);

        let d1 = await rollDiceAnimation(p1.name);
        let d2 = await rollDiceAnimation(p2.name);

        let t1 = d1 + p1[terrain.a] + p1.nextBonus;
        let t2 = d2 + p2[terrain.a] + p2.nextBonus;

        if (p1.name === "Mario" && t1 === t2) t1++;
        if (p2.name === "Mario" && t1 === t2) t2++;

        console.log(`\n${p1.name} (${t1}) vs ${p2.name} (${t2})`);

        if (t1 > t2) {
            let dmg = terrain.n === "LUTA" ? 2 : 1;
            p2.hp -= dmg;
            console.log(`${c.red}💥 ${p1.name} venceu! (-${dmg} HP)${c.reset}`);
        } else if (t2 > t1) {
            let dmg = terrain.n === "LUTA" ? 2 : 1;
            p1.hp -= dmg;
            console.log(`${c.red}💥 ${p2.name} venceu! (-${dmg} HP)${c.reset}`);
        } else {
            console.log(`${c.blue}🛡️ Empate!${c.reset}`);
        }

        p1.nextBonus = 0;
        p2.nextBonus = 0;

        round++;
        await rl.question(`\nPressione ENTER...`);
    }

    console.clear();

    console.log(`${c.yellow}╔══════════════════════════════════════════╗`);
    console.log(`║             FIM DE JOGO                  ║`);
    console.log(`╚══════════════════════════════════════════╝${c.reset}`);

    console.log(`\n🏆 Vencedor: ${c.green}${p1.hp > 0 ? p1.name : p2.name}${c.reset}\n`);

    rl.close();
}

runGame().catch(console.error);