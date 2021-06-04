'use strict';

class Ship {
  constructor(size) {
    this.cells = [];
    this.size = size;
    this.isAlive = true;
  }

  addCell(cell) {
    this.cells.push(cell);
  }

  getCell(cellPosition) {
    for (let i = 0; i < this.cells.length; i++) {
      const shipCell = this.cells[i];
      if (
        shipCell.localPosition.x === cellPosition.x &&
        shipCell.localPosition.y === cellPosition.y
      ) {
        return shipCell;
      }
    }
  }

  checkAlive() {
    const filtered = this.cells.filter(
      shipCell => shipCell.cellType !== CFG.CellType.Damaged
    );
    return filtered.length > 0;
  }

  killCell(cellPosition) {
    const cell = this.getCell(cellPosition);
    cell.cellType = CFG.CellType.Damaged;
    this.isAlive = this.checkAlive();
  }

  getCellType(cellPosition) {
    return this.getCell(cellPosition).cellType;
  }
}

//module.exports = Ship;
