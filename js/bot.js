'use strict';

class Bot {
  constructor(emiter) {
    this.emiter = emiter;
    this.lastAttacked = null;
    this.score = 0;
  }

  placer() {
    while (RandomPlacer.fillGridRandom(PlayerType.Player2) === 'Error') {
      GameEnviroment.clearSea();
    }
  }

  start() {
    this.placer();
  }

  onPlayerAttacked() {
    if (GameEnviroment.GameState == 2) {
      GameUI.updateScore();
      return;
    }
    setTimeout(() => {
      const hit = this.botAttack();
      GameUI.textDrawer('Bot ' + hit);
      if (hit == 'Aimed') {
        this.lastAttacked = null;
        this.missstate = 0;
        this.score++;
        GameUI.updateScore();
        this.onPlayerAttacked();
      } else if (hit !== 'Damaged')
        GameEnviroment.GameState = GameState.Fighting;
      else this.onPlayerAttacked();
    }, 2000);
  }
  randomHit() {
    let x, y, hit;
    this.nextattack = null;
    while (true) {
      x = Math.floor(Math.random() * CFG.gridSize);
      y = Math.floor(Math.random() * CFG.gridSize);
      if (
        GameEnviroment.Cells[PlayerType.Player1][x][y] &&
        GameEnviroment.Cells[PlayerType.Player1][x][y].cellType < 4
      )
        break; //checking if we hadn't already shotted
    }
    hit = GameEnviroment.shot(x, y, PlayerType.Player1);
    if (hit === 'Damaged')
      this.lastAttacked = {
        coords: [[x, y]],
        vector: null,
      };
    return hit;
  }
  vectorHit(PrevCoords) {
    let x, y, anvector, hit;
    const len = PrevCoords.length;
    switch (this.lastAttacked.vector) {
    case 'Vertical': {
      anvector = 'Horizontal';
      x = PrevCoords[len - 1][0];
      if (!PrevCoords[len - 2]) {
        y = (PrevCoords[0][1] - 1);
        if (!GameEnviroment.Cells[PlayerType.Player1][x][y])
          y = (PrevCoords[0][1] + 1);
      } else if ((PrevCoords[len - 1][1] + 1) == PrevCoords[len - 2][1]) y = (PrevCoords[len - 1][1] - 1);
      else y = (PrevCoords[len - 1][1] + 1);
      break;
    }
    case 'Horizontal': {
      anvector = 'Vertical';
      if (!PrevCoords[len - 2]) {
        x = (PrevCoords[0][0] - 1);
        if (!GameEnviroment.Cells[PlayerType.Player1][x])
          x = (PrevCoords[0][0] + 1);
      } else
      if ((PrevCoords[len - 1][0] + 1) == PrevCoords[len - 2][0])
        x = (PrevCoords[len - 1][0] - 1);
      else x = (PrevCoords[len - 1][0] + 1);
      y = PrevCoords[len - 1][1];
      break;
    }
    }
    if (!GameEnviroment.Cells[PlayerType.Player1][x] ||
      !GameEnviroment.Cells[PlayerType.Player1][x][y]) {
      if (this.missstate > 1) this.lastAttacked.vector = anvector;
      else this.missstate++;
      this.lastAttacked.coords = [PrevCoords[0]];
      hit = 'skips round';
    } else {
      hit = GameEnviroment.shot(x, y, PlayerType.Player1);
      switch (hit) {
      case 'Damaged':
        this.lastAttacked.coords.push([x, y]);
        break;
      case 'Error':
        if (PrevCoords.length > 1)
          this.nextattack = [ (PrevCoords[0][0] - (x - PrevCoords[len - 1][0])),
            (PrevCoords[0][1] - (y - PrevCoords[len - 1][1])) ];
        else this.nextattack = [ (PrevCoords[len - 1][0] - (x - PrevCoords[len - 1][0])),
          (PrevCoords[len - 1][1] - (y - PrevCoords[len - 1][1])) ];
        hit = 'Missed';
        break;
      default:
        break;
      }
    }
    return hit;
  }
  noneVectorHit(PrevCoords) {
    let potentialVector, x, y, hit;
    while (true) {
      if (Math.random(2) >= 0.5) {
        potentialVector = 'Vertical';
        if (Math.random(2) >= 0.5) y = PrevCoords[0][1] + 1;
        else y = PrevCoords[0][1] - 1;
        x = PrevCoords[0][0];
      } else {
        potentialVector = 'Horizontal';
        if (Math.random(2) >= 0.5) x = PrevCoords[0][0] + 1;
        else x = PrevCoords[0][0] - 1;
        y = PrevCoords[0][1];
      }
      if (
        GameEnviroment.Cells[PlayerType.Player1][x] &&
        GameEnviroment.Cells[PlayerType.Player1][x][y] &&
        GameEnviroment.Cells[PlayerType.Player1][x][y].cellType < 4
      )
        break;
    }

    hit = GameEnviroment.shot(x, y, PlayerType.Player1);
    switch (hit) {
    case 'Damaged':
      this.lastAttacked.coords.push([x, y]);
      this.lastAttacked.vector = potentialVector;
      break;
    case 'Aimed':
      break;
    default:
      this.lastAttacked.coords = [this.lastAttacked.coords[0]];
      hit = 'Missed';
      break;
    }
    return hit;
  }
  botAttack() {
    let hit, x, y;
    if (this.nextattack && this.lastAttacked) {
      const temporary = this.nextattack;
      this.nextattack = null;
      hit = GameEnviroment.shot(temporary[0], temporary[1], PlayerType.Player1);
      if (hit == 'Damaged') {
        const first = this.lastAttacked.coords[0];
        this.lastAttacked.coords = [ first, temporary ];
      }
    } else if (!this.lastAttacked) {
      hit = this.randomHit();
    } else {
      this.nextattack = null;
      const PrevCoords = this.lastAttacked.coords;
      if (this.lastAttacked.vector) {
        hit = this.vectorHit(PrevCoords);
      } else {
        hit = this.noneVectorHit(PrevCoords);
      }
    }
    return hit;
  }
}
