'use strict';

class CFG {
 static Canvas = document.getElementById('myCanvas');
 static Ctx = CFG.Canvas.getContext('2d');
 static SquareSize = 30;
 static PlayerMargin = CFG.SquareSize * 12;
 static Dxy = CFG.SquareSize;
 static MinDistanceToCell = CFG.SquareSize * Math.sqrt(2) - 5;
 static GridSize = 10;

 static Colors = {
   0: 'LightCyan',
   1: 'DeepSkyBlue',
   2: 'LightCyan',
   4: 'black',
   5: 'red',
 };

static CellType = {
  Empty: 0,
  Occupied: 1,
  Blocked: 2,
  Potential: 3,
  Missed: 4,
  Damaged: 5,
};

static PlayerType = {
  Player1:1,
  Player2:0
};

static MaxShipDecks = 4;

static staticPlayerType = {
  Player2: 0,
  Player1: 1,
};

static GameState = {
  FillingGrid: 0,
  Fighting: 1,
};

static GridSettings = {
  OneDeck: {
    numberOfShips: 4,
    shipSize: 1,
  },

  TwoDeck: {
    numberOfShips: 2,
    shipSize: 2,
  },

  ThreeDeck: {
    numberOfShips: 2,
    shipSize: 3,
  },

  FourDeck: {
    numberOfShips: 1,
    shipSize: 4,
  },

  getShip: index => {
    let i = 0;
    for (const shipSettings in CFG.GridSettings) {
      if (index === i) return CFG.GridSettings[shipSettings];
      i++;
    }
  }
};
}
