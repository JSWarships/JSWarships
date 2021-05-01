'use strict';

/*
const Player = require("./js/player.js");
const Emiter = require("./js/event_emiter.js");
const Bot = require("./js/bot.js");
const Enviroment = require("./js/game_enviroment.js");
*/
const emit = new EventEmitter();
const player1 = new Player(emit, PlayerType.Player2);
const bot = new Bot(emit);
const grid_size = 10;

function main(){
    GameEnviroment.draw_grid(grid_size);
   
    player1.start();
    bot.start();
};

main();