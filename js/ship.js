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
      if (shipCell.localPosition.compare(cellPosition)){
        return shipCell;
      }
    }
  }

  checkAlive() {
    const filtered = this.cells.filter(
      (shipCell) => !shipCell.isDamaged()
    );
    return filtered.length > 0;
  }

  killCell(cellPosition) {
    const cell = this.getCell(cellPosition);
    cell.cellType = CellType.Damaged;
    this.isAlive = this.checkAlive();
  }

  getCellType(cellPosition) {
    return this.getCell(cellPosition).cellType;
  }
}

//module.exports = Ship;
