'use strict';

const emit = new EventEmitter();
const player = new Player(emit, CFG.PlayerType.Player1);
const bot = new Bot(emit);

document.addEventListener('DOMContentLoaded', () => {
  GameUI.start();
});

function initializePlayers() {
  GameEnviroment.Player = player;
  GameEnviroment.Bot = bot;
}

function PlayWithBot() {
  GameUI.startButtonsHide();
  GameEnviroment.drawGrid();
  initializePlayers();
  GameEnviroment.GameState = CFG.GameState.FillingGrid;
  setTimeout(() => {
    player.start();
    bot.start();
  }, 100);
}

function GenerateRandomShips() {
  player.isFillingByPlayer = false;
  onPlayerClick(null);
}
