

const emit = new EventEmitter();
const PLAYER = new Player(emit, PlayerType.Player1);
const bot = new Bot(emit);
const GRID_SIZE = ConfigManager.getConfig().GridSize;


document.addEventListener('DOMContentLoaded', () => {
  GameUI.startButtons();
});

function initializePlayers() {
  GameEnviroment.Player = PLAYER;
  GameEnviroment.Bot = bot;
}

function PlayWithBot() {
  GameUI.startButtonsHide();
  GameEnviroment.draw_grid(GRID_SIZE);
  initializePlayers();
  GameEnviroment.GameState = GameState.FillingGrid;
  setTimeout(() => {
    PLAYER.start();
    bot.start();
  }, 100);
}

function GenerateRandomShips() {
  PLAYER.isFillingByPlayer = false;
  onPlayerClick(null);
}

