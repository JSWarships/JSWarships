

const PlayerType = {
  Player2: 0,
  Player1: 1
};

const GameState = {
  FillingGrid: 0,
  Fighting: 1
};

const config = ConfigManager.getConfig();
const SHIP_ALIVE_COLOR = config.ShipAliveColor;
const MAX_SHIP_DECKS = config.MaxShipDecks;
const PLAYER = GameEnviroment.Player;

const GridSettings = {
  OneDeck: {
    numberOfShips: 4,
    shipSize: 1
  },

  TwoDeck: {
    numberOfShips: 2,
    shipSize: 2
  },

  ThreeDeck: {
    numberOfShips: 2,
    shipSize: 3
  },

  FourDeck: {
    numberOfShips: 1,
    shipSize: 4
  },

  getShip: index => {
    let i = 0;
    for (const shipSettings in GridSettings) {
      if (index === i) return GridSettings[shipSettings];
      i++;
    }
  }
};

const fillByPlayer = cell => {
  const playerShip = PLAYER.currentShip;
  if (PLAYER.isFillingByPlayer) {
    const currShipType = GridSettings.getShip(PLAYER.currentShipIndex);

    if (!currShipType.shipSize) {
      PLAYER.finishFillingGrid();
      return;
    }

    if (cell.cellType === CellType.Occupied) {
      console.warn('Occupied');
      return;
    }

    const addCellToEnviroment = lastCellPosition => {
      PLAYER.currentShip.add_cell(cell);
      GameEnviroment.add_ship_cell(
        cell,
        PLAYER.playerType,
        lastCellPosition
      );
      GameEnviroment.drawRectangleWithPosition(
        cell.localPosition,
        PLAYER.playerType,
        SHIP_ALIVE_COLOR
      );
    };

    if (!PLAYER.currentShip) {
      if (cell.cellType === CellType.Empty) {
        PLAYER.currentShip = new Ship(currShipType.shipSize);
        addCellToEnviroment(null);
      } else return;
    }

    if (cell.cellType === CellType.Potential) {
      const celsInShip = playerShip.cells.length;
      addCellToEnviroment(playerShip.cells[celsInShip - 1].localPosition);
    }

    if (PLAYER.currentShip.cells.length === currShipType.shipSize) {
      PLAYER.currentShipNumber++;
      GameEnviroment.addShip(PlayerType.Player1, PLAYER.currentShip);
      GameEnviroment.refreshSea(PLAYER.playerType);
      console.log('refreshed');
      PLAYER.currentShip = null;
    }

    if (PLAYER.currentShipNumber === currShipType.numberOfShips) {
      if (PLAYER.currentShipIndex === MAX_SHIP_DECKS - 1) {
        PLAYER.finishFillingGrid();
        return;
      }
      PLAYER.currentShipIndex++;
      PLAYER.currentShipNumber = 0;
      GameUI.placeShipChange(PLAYER.currentShipIndex);
    }
  }
};

const fillRandom = () => {
  RandomPlacer.fillGridRandom(PlayerType.Player1);
  PLAYER.finishFillingGrid();
};

const onPlayerClick = mousePos => {
  let cell = GameEnviroment.findClickedCell(
    mousePos.pageX,
    mousePos.pageY,
    PlayerType.Player1
  );

  //here is some kind of attack we don't have
  switch (GameEnviroment.GameState) {
  case GameState.FillingGrid:
    if (PLAYER.isFillingByPlayer) {
      if (!cell) return;
      fillByPlayer(cell);
    } else {
      fillRandom();
    }
    break;
  case GameState.Fighting:
    cell = GameEnviroment.findClickedCell(
      mousePos.pageX,
      mousePos.pageY,
      PlayerType.Player2
    );
    if (!cell) return;
    PLAYER.attackCell(cell.localPosition);
    break;
  }
};

class Player {
  constructor(emiter, playerType) {
    this.emiter = emiter;
    this.isFillingByPlayer = true;
    this.currentShipIndex = 0;
    this.currentShipNumber = 0;
    this.currentShip = null;
    this.playerType = playerType;
  }

  start() {
    this.emiter.on('BotAttacked', this.onBotAttacked);
    window.addEventListener('click', onPlayerClick, false);
    this.isFillingByPlayer = true;
    console.log('Player initiated!');
    GameUI.textDrawer('Player, place your ships!');
    GameUI.placeShipInit();
    //this.fillGridByPlayer( );
  }

  attackCell(cellPosition) {
    this.emiter.emit('PlayerAttacked', cellPosition);
  }

  fillGridByPlayer() {
    this.isFillingByPlayer = true;
  }

  finishFillingGrid() {
    console.log('Filling is finished, starting the game...');
    GameUI.textDrawer('Starting the game...');
    GameUI.placeShipHide();
    GameEnviroment.GameState = GameState.Fighting;
    this.isFillingByPlayer = false;
    GameEnviroment.Bot.onPlayerAttacked();
  }

  onBotAttacked() {
    console.log('Bot attacked!');
  }
}


module.exports = Player;
