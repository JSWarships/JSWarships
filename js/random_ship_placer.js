//const config = ConfigManager.getConfig();
//const SHIP_ALIVE_COLOR = config.ShipAliveColor;
//const GRID_SIZE = config.GridSize;

class RandomPlacer {
  static getPossibleDirections(cellPosition, shipSize, player) {
    const possibleCellsNumber = [0, 0, 0, 0];
    const possibleDirections = [];
    for (let i = 0; i < shipSize; i++) {
      for (let j = 0; j < Vector2.Directions.length; j++) {
        const direction = Vector2.Directions[j];
        const positionToCheck = cellPosition.add(direction.multiply(i));
        if (checkBounds(positionToCheck.x, positionToCheck.y))
          if (
            GameEnviroment.getCell(player, positionToCheck).cellType ===
            CFG.CellType.Empty
          )
            possibleCellsNumber[j]++;
      }
    }
    for (let i = 0; i < possibleCellsNumber.length; i++) {
      if (possibleCellsNumber[i] === shipSize)
        possibleDirections.push(Vector2.Directions[i]);
    }
    return possibleDirections;
  }

  static fillGridRandom(player) {
    let coords = new Vector2(0, 0);
    let cell = GameEnviroment.Cells[player][coords.x][coords.y];
    GameEnviroment.startSea(player);
    for (const shipSettingKey in CFG.GridSettings) {
      const shipSetting = CFG.GridSettings[shipSettingKey];
      if (shipSetting === CFG.GridSettings.getShip()) return;
      for (let i = 0; i < shipSetting.numberOfShips; i++) {
        const ship = new Ship(shipSetting.shipSize);
        let possibleDirections;
        while (true) {
          coords = new Vector2(
            Math.floor(Math.random() * CFG.GridSize),
            Math.floor(Math.random() * CFG.GridSize)
          );
          possibleDirections = this.getPossibleDirections(
            coords,
            shipSetting.shipSize,
            player
          );
          if (possibleDirections.length > 0) break;
        }

        cell = GameEnviroment.Cells[player][coords.x][coords.y];
        GameEnviroment.addShipCell(cell, player, null);
        ship.addCell(new Cell(cell.localPosition.x, cell.localPosition.y, player));
        if (player === CFG.PlayerType.Player1) {
          GameEnviroment.drawRectangle(
            cell.localPosition,
            player,
            CFG.Colors[CFG.CellType.Occupied]
          );
        }
        let lastCellPos = cell.localPosition;
        const direction =
          possibleDirections[
            Math.floor(Math.random() *
            possibleDirections.length)
          ];
        for (let j = 0; j < shipSetting.shipSize - 1; j++) {
          cell = GameEnviroment.getCell(player, lastCellPos.add(direction));

          ship.addCell(
            new Cell(cell.localPosition.x, cell.localPosition.y, player)
          );
          GameEnviroment.addShipCell(cell, player, lastCellPos);
          if (player === CFG.PlayerType.Player1) {
            GameEnviroment.drawRectangle(
              cell.localPosition,
              player,
              CFG.Colors[CFG.CellType.Occupied]
            );
          }
          lastCellPos = cell.localPosition;
        }
        GameEnviroment.addShip(player, ship);
        GameEnviroment.refreshSea(player);
      }
    }
  }
}

//module.exports = RandomPlacer;
