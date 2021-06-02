//const config = ConfigManager.getConfig();
//const SHIP_ALIVE_COLOR = config.ShipAliveColor;
//const GRID_SIZE = config.GridSize;

class RandomPlacer {
  static getAllPotential(player) {
    const potential = [];
    const Cells = GameEnviroment.Cells;
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (Cells[player][i][j].cellType === CellType.Potential) {
          potential.push(new Vector2(i, j));
        }
      }
    }
    return potential;
  }
  static Directions = [Vector2.Up, Vector2.Left, Vector2.Right, Vector2.Down];

  static getPossibleDirections(cellPosition, shipSize, player) {
    const possibleCellsNumber = [0, 0, 0, 0];
    const possibleDirections = [];
    for (let i = 0; i < shipSize; i++) {
      for (let j = 0; j < this.Directions.length; j++) {
        const direction = this.Directions[j];
        const positionToCheck = cellPosition.add(direction.multiply(i));
        //console.log(positionToCheck);
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
        possibleDirections.push(this.Directions[i]);
    }
    return possibleDirections;
  }

  static fillGridRandom(player) {
    let coords = new Vector2(0, 0);
    const Cells = GameEnviroment.Cells;
    let cell = GameEnviroment.Cells[player][coords.x][coords.y];
    for (let i=0; i<10; i++){
      for (let j=0; j<10; j++){
        Cells[player][i][j].cellType = CellType.Empty;
        GameEnviroment.drawRectangle(i, j, player, 'LightCyan');
      }
    }
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
          //console.log({ coords });
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
        GameEnviroment.drawRectangleWithPosition(
          cell.localPosition,
          player,
          SHIP_ALIVE_COLOR
        );

        let lastCellPos = cell.localPosition;
        const direction =
          possibleDirections[
            Math.floor(Math.random() * possibleDirections.length)
          ];
        //console.log(direction);
        for (let j = 0; j < shipSetting.shipSize - 1; j++) {
          cell = GameEnviroment.getCell(player, lastCellPos.add(direction));

          ship.addCell(cell);
          GameEnviroment.addShipCell(cell, player, lastCellPos);
          GameEnviroment.drawRectangleWithPosition(
            cell.localPosition,
            player,
            SHIP_ALIVE_COLOR
          );
          lastCellPos = cell.localPosition;
        }
        GameEnviroment.addShip(player, ship);
        GameEnviroment.refreshSea(player);
      }
    }
  }
}

//module.exports = RandomPlacer;
