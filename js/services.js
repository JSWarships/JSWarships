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
  CFG.Canvas.offsetLeft + CFG.Canvas.clientLeft,
  CFG.Canvas.offsetTop + CFG.Canvas.clientTop
);

const checkBounds = (x, y) => {
  if (x < 0 || y < 0) return false;
  return x < CFG.GridSize && y < CFG.GridSize;
};

class Cell {
  constructor(x, y, player) {
    this.position = new Vector2(
      player * CFG.PlayerMargin + x * CFG.Dxy + deltaVector.x,
      y * CFG.Dxy + deltaVector.y
    );
    this.localPosition = new Vector2(x, y);
    this.cellType = CFG.CellType.Empty;
  }
}
