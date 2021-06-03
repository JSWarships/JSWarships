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
            CellType.Empty
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

  static cleanGrid(player) {
    const coords = new Vector2(0, 0);
    const Cells = GameEnviroment.Cells;
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        Cells[player][i][j].cellType = CellType.Empty;
        GameEnviroment.drawRectangle(new Vector2(i, j), player, 'LightCyan');
      }
    }
  }

  static fillGridRandom(player) {
    let coords = new Vector2(0, 0);
    let cell = GameEnviroment.Cells[player][coords.x][coords.y];
    this.cleanGrid(player);
    for (const shipSettingKey in GridSettings) {
      const shipSetting = GridSettings[shipSettingKey];
      if (shipSetting === GridSettings.getShip()) return;
      for (let i = 0; i < shipSetting.numberOfShips; i++) {
        const ship = new Ship(shipSetting.shipSize);
        let possibleDirections;
        while (true) {
          coords = new Vector2(
            Math.floor(Math.random() * GRID_SIZE),
            Math.floor(Math.random() * GRID_SIZE)
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
        ship.addCell(cell);
        if (player === PlayerType.Player1) {
          GameEnviroment.drawRectangle(
            cell.localPosition,
            player,
            SHIP_ALIVE_COLOR
          );
        }
        let lastCellPos = cell.localPosition;
        const direction =
          possibleDirections[
            Math.floor(Math.random() * possibleDirections.length)
          ];
        for (let j = 0; j < shipSetting.shipSize - 1; j++) {
          cell = GameEnviroment.getCell(player, lastCellPos.add(direction));

          ship.addCell(cell);
          GameEnviroment.addShipCell(cell, player, lastCellPos);
          if (player === PlayerType.Player1) {
            GameEnviroment.drawRectangle(
              cell.localPosition,
              player,
              SHIP_ALIVE_COLOR
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
