const emit = new EventEmitter();
const player = new Player(emit, PlayerType.Player1);
const bot = new Bot(emit);

//const GRID_SIZE = 10;//ConfigManager.getConfig().GridSize;

document.addEventListener('DOMContentLoaded', () => {
  GameUI.start();
});

function initializePlayers() {
  GameEnviroment.Player = player;
  GameEnviroment.Bot = bot;
}

function PlayWithBot() {
  GameUI.startButtonsHide();
  GameEnviroment.drawGrid(GRID_SIZE);
  initializePlayers();
  GameEnviroment.GameState = GameState.FillingGrid;
  setTimeout(() => {
    player.start();
    bot.start();
  }, 100);
}

function GenerateRandomShips() {
  player.isFillingByPlayer = false;
  onPlayerClick(null);
}
