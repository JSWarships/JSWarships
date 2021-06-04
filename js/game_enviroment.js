'use strict';

class GameEnviroment {
  static Cells = [[]];
  static Ships = [[]];
  static Player;
  static Bot;
  static GameState;

  static checkLose(player) {
    const filtered = Ships[player].filter(ship => ship.isAlive);
    return filtered === 0;
  }

  static drawGrid() {
    this.clearSea();
    for (let player = 0; player < 2; player++) {
      this.startSea(player);
    }
  }

  static getCell(player, position) {
    return this.Cells[player][position.x][position.y];
  }

  static findClickedCell(x, y, player) {
    const mousePos = new Vector2(x, y);
    const cells = this.Cells[player];
    for (let i = 0; i < this.Cells[player].length; i++) {
      for (let j = 0; j < cells[i].length; j++) {
        if (
          Vector2.distance(cells[i][j].position, mousePos) <= CFG.minDistanceToCell
        ) {
          return cells[i][j];
        }
      }
    }
    return null;
  }

  static addShip(player, ship) {
    if (!this.Ships[player]) this.Ships[player] = [];
    this.Ships[player].push(ship);
  }

  static drawRectangle = (position, player, color) => {
    CFG.ctx.beginPath();
    CFG.ctx.fillStyle = 'black';
    CFG.ctx.fillRect(
      player * CFG.playerMargin + position.x * CFG.dxy,
      position.y * CFG.dxy,
      CFG.squareSize,
      CFG.squareSize
    );
    CFG.ctx.fillStyle = color;
    CFG.ctx.fillRect(
      player * CFG.playerMargin + position.x * CFG.dxy + 0.5,
      position.y * CFG.dxy + 0.5,
      CFG.squareSize - 1,
      CFG.squareSize - 1
    );
    CFG.ctx.fill();
    CFG.ctx.stroke();
    CFG.ctx.closePath();
  };

  static drawPoint = (position, player, color) => {
    CFG.ctx.beginPath();
    CFG.ctx.fillStyle = color;
    CFG.ctx.fillRect(
      player * CFG.playerMargin + position.x * CFG.dxy + CFG.squareSize / 3,
      position.y * CFG.dxy + CFG.squareSize / 3,
      CFG.squareSize / 4,
      CFG.squareSize / 4
    );
    CFG.ctx.fill();
    CFG.ctx.closePath();
  };

  static drawSea = player => {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const cell = this.getCell(player, new Vector2(i, j));
        if (cell.isMissed()) {
          this.drawPoint(
            cell.localPosition,
            player,
            CFG.colors[cell.cellType]
          );
          continue;
        }
        if (!cell.isOccupied())
          this.drawRectangle(
            new Vector2(i, j),
            player,
            CFG.colors[cell.cellType]
          );
      }
    }
  };

  static addShipCell(cell, player, lastCellPosition) {
    const x = cell.localPosition.x,
      y = cell.localPosition.y;
    this.Cells[player][x][y].cellType = CellType.Occupied;
    if (!lastCellPosition) {
      this.setSquearePotential(cell.localPosition, player);
    } else {
      let differenceVector = new Vector2(
        x - lastCellPosition.x,
        y - lastCellPosition.y
      );
      if (checkBounds(x + differenceVector.x, y + differenceVector.y)) {
        differenceVector = differenceVector.add(cell.localPosition);
        const nextCell = this.getCell(player, differenceVector);
        if (nextCell.isEmpty()) {
          this.getCell(player, differenceVector).cellType = CellType.Potential;
        }
      }

      this.surroundCell(new Vector2(x, y), player, false, CellType.Blocked);
    }
    for (let i = -1; i < 2; i += 2) {
      for (let j = -1; j < 2; j += 2) {
        if (checkBounds(x + i, y + j))
          this.Cells[player][x + i][y + j].cellType = CellType.Blocked;
      }
    }
  }

  static surroundCell(position, player, isBlockingPotential, typeToSurround) {
    for (let k = -1; k <= 1; k++) {
      for (let m = -1; m <= 1; m++) {
        if (!checkBounds(position.x + k, position.y + m)) continue;
        const modedPosition = position.add(new Vector2(k, m));
        const cell = this.getCell(player, modedPosition);

        const isPotential = (cell.isPotential() && !isBlockingPotential);
        const isOccupiedOrPotential = cell.isOccupied() || isPotential;
        const isDamagedOrMissed = cell.isDamaged() || cell.isMissed();

        if (isOccupiedOrPotential || isDamagedOrMissed) continue;
        
        cell.cellType = typeToSurround;
      }
    }
  }

  static refreshSea(player) {
    for (let i = 0; i < CFG.gridSize; i++) {
      for (let j = 0; j < CFG.gridSize; j++) {
        if (this.Cells[player][i][j].isOccupied()) {
          this.surroundCell(
            new Vector2(i, j), player, true, CellType.Blocked
          );
        }
      }
    }
  }

  static isCellBlocked(cell) {
    return cell.cellType === CellType.Blocked;
  }

  static setSquearePotential(position, player) {
    for (let i = 0; i < Vector2.Directions.length; i++) {
      const modedPosition = Vector2.Directions[i].add(position);

      if (checkBounds(modedPosition.x, modedPosition.y)) {
        const cell = this.getCell(player, modedPosition);
        if (!cell.isBlocked()) {
          cell.cellType = CellType.Potential;
        }
      }
    }
  }
  static startSea(player) {
    this.Ships[player] = [];
    this.Cells[player] = [];
    for (let i = 0; i < CFG.gridSize; i++) {
      this.Cells[player][i] = [];
      for (let j = 0; j < CFG.gridSize; j++) {
        this.Cells[player][i].push(new Cell(i, j, player));
        this.drawRectangle(new Vector2(i, j), player, 'LightCyan');
      }
    }
  }
  static clearSea = () => {
    CFG.ctx.clearRect(0, 0, 700, 300);
  };

  static getShip(position, player) {
    const ships = this.Ships[player];
    for (let i = 0; i < ships.length; i++) {
      const ship = ships[i];
      const shipCells = ship.cells;
      for (let j = 0; j < shipCells.length; j++) {
        const cellOfShip = shipCells[j];
        if (cellOfShip.localPosition.compare(position))
        {
          return ship;
        }
      }
    }
  }

  static surroundKilledShip(ship, player) {
    const cells = ship.cells;
    for (let i = 0; i < cells.length; i++) {
      const position = cells[i].localPosition;
      this.surroundCell(position, player, false, CellType.Missed);
    }
    console.log('surround');
    this.drawSea(player);
  }

  static miss(cell, player) {
    cell.cellType = CellType.Missed;
    const result = 'Missed';
    this.drawPoint(cell.localPosition, player, 'black');
    return result;
  }

  static hit(cell, player) {
    let result = 'Damaged';
    cell.cellType = CellType.Damaged;
    result = 'Damaged';
    this.drawRectangle(cell.localPosition, player, 'red');
    const ship = this.getShip(cell.localPosition, player);
    ship.killCell(cell.localPosition);
    if (!ship.checkAlive()) {
      result = 'Aimed';
    }
    return result;
  }

  static shot(x, y, player) {
    
    const cell = this.Cells[player][x][y];
    const ship = this.getShip(cell.localPosition, player);
    if (!ship) {
      if (cell.isEmpty() || cell.isBlocked()) {
        return this.miss(cell, player);
      } else {
        return 'Error';
      }
    }

    if (cell.isDamaged()) {
      return 'Error';
    }
    const result = this.hit(cell, player);
    if (result === 'Aimed') {
      this.surroundKilledShip(this.getShip(new Vector2(x, y), player), player);
    }
    return result;
  }
}
