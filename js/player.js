'use strict';

const fillByPlayer = cell => {
  const playerShip = GameEnviroment.Player.currentShip;
  if (GameEnviroment.Player.isFillingByPlayer) {
    const currShipType = getShip(GameEnviroment.Player.currentShipIndex);
    if (GM.areAllShips()) return;

    if (cell.isOccupied()) {
      console.warn('Occupied');
      return;
    }

    const addCellToEnviroment = lastCellPosition => {
      GameEnviroment.Player.currentShip.addCell(cell);
      GameEnviroment.addShipCell(cell, GameEnviroment.Player.playerType, lastCellPosition);
      GameEnviroment.drawRectangle(
        cell.localPosition,
        player.playerType,
        CFG.colors[CellType.Occupied]
      );
    };

    if (!GameEnviroment.Player.currentShip) {
      if (cell.isEmpty()) {
        GameEnviroment.Player.currentShip = new Ship(currShipType.shipSize);
        addCellToEnviroment(null);
      } else return;
    }

    if (cell.isPotential()) {
      const celsInShip = playerShip.cells.length;
      addCellToEnviroment(playerShip.cells[celsInShip - 1].localPosition);
    }

    if (
      GameEnviroment.Player.currentShip.cells.length === currShipType.shipSize
    ) {
      GameEnviroment.Player.currentShipNumber++;
      GameEnviroment.addShip(
        PlayerType.Player1, GameEnviroment.Player.currentShip
      );
      GameEnviroment.refreshSea(GameEnviroment.Player.playerType);
      console.log('refreshed');
      GameEnviroment.Player.currentShip = null;
    }

    if (GameEnviroment.Player.currentShipNumber === currShipType.numberOfShips) {
      if (GameEnviroment.Player.currentShipIndex === CFG.maxShipDecks - 1) {
        return;
      }
      GameEnviroment.Player.currentShipIndex++;
      GameEnviroment.Player.currentShipNumber = 0;
      GameUI.placeShipChange(GameEnviroment.Player.currentShipIndex);
    }
  }
};

const onPlayerClick = mousePos => {
  let cell = GameEnviroment.findClickedCell(
    mousePos.pageX,
    mousePos.pageY,
    PlayerType.Player1
  );
  switch (GameEnviroment.GameState) {
  case GameState.FillingGrid:
    if (GameEnviroment.Player.isFillingByPlayer) {
      if (!cell) return;
      fillByPlayer(cell);
    }
    break;
  case GameState.Fighting:
    cell = GameEnviroment.findClickedCell(
      mousePos.pageX,
      mousePos.pageY,
      PlayerType.Player2
    );
    if (!cell) return;
    GameEnviroment.Player.attackCell(cell.localPosition);
    break;
  }
};

class Player {
  constructor(emiter, playerType) {
    this.emiter = emiter;
    this.isFillingByPlayer = true;
    this.currentShipIndex = 0;
    this.currentShipNumber = 0;
    this.score = 0;
    this.currentShip = null;
    this.playerType = playerType;
  }

  start() {
    GM.shipsReset();
    window.addEventListener('click', onPlayerClick, false);
    console.log('Player initiated!');
    GameUI.textDrawer('Player, place your ships!');
  }

  attackCell(cellPosition) {
    const hit = GameEnviroment.shot(
      cellPosition.x,
      cellPosition.y,
      PlayerType.Player2
    );
    if (hit === 'Error') return;
    GameUI.textDrawer('You ' + hit);
    if (hit === 'Aimed') {
      this.score++;
      GameUI.updateScore();
    }
    if (hit === 'Missed') {
      GameEnviroment.Bot.onPlayerAttacked();
      GameEnviroment.GameState = GameState.FillingGrid;
    }
  }

  fillGridByPlayer() {
    this.isFillingByPlayer = true;
  }

  finishFillingGrid() {
    console.log('Filling is finished, starting the game...');
    GameUI.textDrawer('Starting the game...');
    GameUI.hide(GameUI.place);
    GameUI.hide(GameUI.container);
    GameUI.showScore();
    this.isFillingByPlayer = false;
    GameEnviroment.Bot.onPlayerAttacked();
  }

  onBotAttacked() {
    console.log('Bot attacked!');
  }
}
