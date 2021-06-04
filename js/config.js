'use strict';

const CellType = {
    Empty: 0,
    Occupied: 1,
    Blocked: 2,
    Potential: 3,
    Missed: 4,
    Damaged: 5
  };

  const PlayerType = {
    Player1: 1,
    Player2: 0
  };

  const GameState = {
    FillingGrid: 0,
    Fighting: 1
  };

const CFG = {
  "canvas": document.getElementById('myCanvas'),
  "ctx": document.getElementById('myCanvas').getContext('2d'),
  "squareSize": 30,
  "playerMargin": 30 * 12,
  "dxy": 30,
  "minDistanceToCell": 30 * Math.sqrt(2) - 5,
  "gridSize": 10,
  "maxShipDecks": 4,

  "colors":{
    0: 'LightCyan',
    1: 'DeepSkyBlue',
    2: 'LightCyan',
    4: 'black',
    5: 'red',
  }, 
  
  "gridSettings": {
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
    }
  }
}
