

const config = ConfigManager.getConfig();
const SHIP_ALIVE_COLOR = config.ShipAliveColor;
const GRID_SIZE = config.GridSize;

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

  static isAvailable(cellPosition, shipSize, player) {
    const Cells = GameEnviroment.Cells;
    const x = cellPosition.x,
      y = cellPosition.y;
    const cellsNumber = [ 0, 0, 0, 0 ];
    for (let i = 1; i < shipSize; i++) {
      if (checkBounds(x + i, y))
        if (Cells[player][x + i][y].cellType === CellType.Empty)
          cellsNumber[0]++;
      if (checkBounds(x - i, y))
        if (Cells[player][x - i][y].cellType === CellType.Empty)
          cellsNumber[1]++;
      if (checkBounds(x, y + i))
        if (Cells[player][x][y + i].cellType === CellType.Empty)
          cellsNumber[2]++;
      if (checkBounds(x, y - i))
        if (Cells[player][x][y - i].cellType === CellType.Empty)
          cellsNumber[3]++;
    }
    for (let i = 0; i < 4; i++) {
      if (cellsNumber[i] === shipSize - 1) return true;
    }
    return false;
  }

  static fillGridRandom(player) {
    let coords = new Vector2(0, 0);
    let cell = GameEnviroment.Cells[player][coords.x][coords.y];


    for (const shipSettingKey in GridSettings) {
      const shipSetting = GridSettings[shipSettingKey];
      if (shipSetting === GridSettings.getShip()) return;
      for (let i = 0; i < shipSetting.numberOfShips; i++) {
        const ship = new Ship(shipSetting.shipSize);
        while (true) {
          coords = new Vector2(
            Math.floor(Math.random() * GRID_SIZE),
            Math.floor(Math.random() * GRID_SIZE)
          );
          if (this.isAvailable(coords, shipSetting.shipSize, player)) break;
        }

        cell = GameEnviroment.Cells[player][coords.x][coords.y];
        GameEnviroment.addShipCell(cell, player, null);
        ship.addCell(cell);
        GameEnviroment.drawRectangleWithPosition(
          cell.local_position,
          player,
          SHIP_ALIVE_COLOR
        );
        console.log(cell);
        let lastCellPos = cell.local_position;

        for (let j = 0; j < shipSetting.shipSize - 1; j++) {
          const coordsPotential = this.getAllPotential(player);
          console.log(coordsPotential);
          const randomNum = Math.floor(Math.random() * coordsPotential.length);
          cell =
            GameEnviroment.Cells[player][coordsPotential[randomNum].x][
              coordsPotential[randomNum].y
            ];
          console.log(cell);
          GameEnviroment.addShipCell(cell, player, lastCellPos);
          ship.add_cell(cell);
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


module.exports = RandomPlacer;
