'use strict';

const Player = require(".\\player.js");
const Emiter = require(".\\event_emiter.js");
const Bot = require(".\\bot.js");


const emit = new Emiter;
const player = new Player(emit);
const bot = new Bot(emit);

function main(){
    player.start();
    bot.start();
}

main();