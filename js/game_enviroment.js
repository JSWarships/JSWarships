

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
          Vector2.distance(cells[i][j].position, mousePos) <= CFG.MinDistanceToCell
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
    CFG.Ctx.beginPath();
    CFG.Ctx.fillStyle = 'black';
    CFG.Ctx.fillRect(
      player * CFG.PlayerMargin + position.x * CFG.Dxy,
      position.y * CFG.Dxy,
      CFG.SquareSize,
      CFG.SquareSize
    );
    CFG.Ctx.fillStyle = color;
    CFG.Ctx.fillRect(
      player * CFG.PlayerMargin + position.x * CFG.Dxy + 0.5,
      position.y * CFG.Dxy + 0.5,
      CFG.SquareSize - 1,
      CFG.SquareSize - 1
    );
    CFG.Ctx.fill();
    CFG.Ctx.stroke();
    CFG.Ctx.closePath();
  };

  static drawPoint = (position, player, color) => {
    CFG.Ctx.beginPath();
    CFG.Ctx.fillStyle = color;
    CFG.Ctx.fillRect(
      player * CFG.PlayerMargin + position.x * CFG.Dxy + CFG.SquareSize / 3,
      position.y * CFG.Dxy + CFG.SquareSize / 3,
      CFG.SquareSize / 4,
      CFG.SquareSize / 4
    );
    CFG.Ctx.fill();
    CFG.Ctx.closePath();
  };

  static drawSea = player => {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const cell = this.getCell(player, new Vector2(i, j));
        if (cell.cellType === CFG.CellType.Missed) {
          this.drawPoint(
            cell.localPosition,
            player,
            CFG.Colors[cell.cellType]
          );
          continue;
        }
        if (cell.cellType !== CFG.CellType.Occupied)
          this.drawRectangle(
            new Vector2(i, j),
            player,
            CFG.Colors[cell.cellType]
          );
      }
    }
  };

  static addShipCell(cell, player, lastCellPosition) {
    const x = cell.localPosition.x,
      y = cell.localPosition.y;
    this.Cells[player][x][y].cellType = CFG.CellType.Occupied;
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
        if (nextCell.cellType === CFG.CellType.Empty) {
          this.getCell(player, differenceVector).cellType = CFG.CellType.Potential;
        }
      }

      this.surroundCell(new Vector2(x, y), player, false, CFG.CellType.Blocked);
    }
    for (let i = -1; i < 2; i += 2) {
      for (let j = -1; j < 2; j += 2) {
        if (checkBounds(x + i, y + j))
          this.Cells[player][x + i][y + j].cellType = CFG.CellType.Blocked;
      }
    }
  }

  static surroundCell(position, player, isBlockingPotential, typeToSurround) {
    for (let k = -1; k <= 1; k++) {
      for (let m = -1; m <= 1; m++) {
        if (!checkBounds(position.x + k, position.y + m)) continue;
        //console.log(position);
        const cellType =
          this.Cells[player][position.x + k][position.y + m].cellType;
        if (
          cellType === CFG.CellType.Occupied ||
          (cellType === CFG.CellType.Potential && !isBlockingPotential) ||
          cellType === CFG.CellType.Damaged ||
          cellType === CFG.CellType.Missed
        ) {
          continue;
        }
        this.Cells[player][position.x + k][position.y + m].cellType =
          typeToSurround;
      }
    }
  }

  static refreshSea(player) {
    for (let i = 0; i < CFG.GridSize; i++) {
      for (let j = 0; j < CFG.GridSize; j++) {
        if (this.Cells[player][i][j].cellType === CFG.CellType.Occupied) {
          this.surroundCell(
            new Vector2(i, j), player, true, CFG.CellType.Blocked
          );
        }
      }
    }
  }

  static isCellBlocked(cell) {
    return cell.cellType === CFG.CellType.Blocked;
  }

  static setSquearePotential(position, player) {
    for (let i = 0; i < Vector2.Directions.length; i++) {
      const modedPosition = Vector2.Directions[i].add(position);

      if (checkBounds(modedPosition.x, modedPosition.y)) {
        const cell = this.getCell(player, modedPosition);
        if (!this.isCellBlocked(cell)) {
          cell.cellType = CFG.CellType.Potential;
        }
      }
    }
  }
  static startSea(player) {
    this.Ships[player] = [];
    this.Cells[player] = [];
    for (let i = 0; i < CFG.GridSize; i++) {
      this.Cells[player][i] = [];
      for (let j = 0; j < CFG.GridSize; j++) {
        this.Cells[player][i].push(new Cell(i, j, player));
        this.drawRectangle(new Vector2(i, j), player, 'LightCyan');
      }
    }
  }
  static clearSea = () => {
    CFG.Ctx.clearRect(0, 0, 700, 300);
  };

  static getShip(position, player) {
    const ships = this.Ships[player];
    for (let i = 0; i < ships.length; i++) {
      const ship = ships[i];
      const shipCells = ship.cells;
      for (let j = 0; j < shipCells.length; j++) {
        const cellOfShip = shipCells[j];
        if (
          cellOfShip.localPosition.x === position.x &&
          cellOfShip.localPosition.y === position.y
        ) {
          return ship;
        }
      }
    }
  }

  static surroundKilledShip(ship, player) {
    const cells = ship.cells;
    for (let i = 0; i < cells.length; i++) {
      const position = cells[i].localPosition;
      this.surroundCell(position, player, false, CFG.CellType.Missed);
    }
    console.log('surround');
    this.drawSea(player);
  }

  static miss(cell, player) {
    cell.cellType = CFG.CellType.Missed;
    const result = 'Missed';
    this.drawPoint(cell.localPosition, player, 'black');
    return result;
  }

  static hit(cell, player) {
    let result = 'Damaged';
    cell.cellType = CFG.CellType.Damaged;
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
      if (cell.cellType === CFG.CellType.Empty ||
         cell.cellType === CFG.CellType.Blocked) {
        return this.miss(cell, player);
      } else {
        return 'Error';
      }
    }

    if (cell.cellType === CFG.CellType.Damaged) {
      return 'Error';
    }
    const result = this.hit(cell, player);
    if (result === 'Aimed') {
      this.surroundKilledShip(this.getShip(new Vector2(x, y), player), player);
    }
    return result;
  }
}
