'use strict';

class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(another) {
    return new Vector2(this.x + another.x, this.y + another.y);
  }

  multiply(number) {
    return new Vector2(this.x * number, this.y * number);
  }
  
  compare(another){
    return this.x === another.x && this.y === another.y;
  }

  static distance(vectorFrom, vectorTo) {
    return Math.sqrt(
      (vectorFrom.x - vectorTo.x) ** 2 + (vectorFrom.y - vectorTo.y) ** 2
    );
  }

  static Up = new Vector2(0, 1);
  static Right = new Vector2(1, 0);
  static Left = new Vector2(-1, 0);
  static Down = new Vector2(0, -1);
  static Directions = [Vector2.Up, Vector2.Left, Vector2.Right, Vector2.Down];
}

const deltaVector = new Vector2(
  CFG.canvas.offsetLeft + CFG.canvas.clientLeft,
  CFG.canvas.offsetTop + CFG.canvas.clientTop
);

const checkBounds = (x, y) => {
  if (x < 0 || y < 0) return false;
  return x < CFG.gridSize && y < CFG.gridSize;
};

class Cell {
  constructor(x, y, player) {
    this.position = new Vector2(
      player * CFG.playerMargin + x * CFG.dxy + deltaVector.x,
      y * CFG.dxy + deltaVector.y
    );
    this.localPosition = new Vector2(x, y);
    this.cellType = CellType.Empty;
  }

  isEmpty()
  {
    return this.cellType === CellType.Empty;
  }

  isDamaged()
  {
    return this.cellType === CellType.Damaged;
  }

  isOccupied()
  {
    return this.cellType === CellType.Occupied;
  }

  isMissed()
  {
    return this.cellType === CellType.Missed;
  }

  isPotential()
  {
    return this.cellType === CellType.Potential;
  }
  
  isBlocked()
  {
    return this.cellType === CellType.Blocked;
  }

}

const getShip  = (index) =>
{
  let i = 0;
  for (const shipSettings in CFG.gridSettings) {
    if (index === i) return CFG.gridSettings[shipSettings];
    i++;
  }
};
