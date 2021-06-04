class GM {
  static areAllShips() {
    return GameEnviroment.Ships[CFG.PlayerType.Player1].length > 8;
  }
  static fillRandom() {
    GameUI.hide(GameUI.place);
    RandomPlacer.fillGridRandom(CFG.PlayerType.Player1);
  }
  static shipsReset() {
    GameEnviroment.Ships[CFG.PlayerType.Player1] = [];
    GameEnviroment.drawGrid(CFG.GridSize);
    GameUI.placeShipChange(0);
    GameEnviroment.Player.currentShipIndex = 0;
    GameEnviroment.Player.currentShipIndex = 0;
    GameEnviroment.Player.currentShip = null;
    GameEnviroment.Bot.placer();
  }
  static startGame() {
    if (!GM.areAllShips()) GameUI.textDrawer('Not all the ships placed!');
    else GameEnviroment.Player.finishFillingGrid();
  }
}
