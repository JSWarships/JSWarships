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
  isCellExist(x, y) {
    return  (GameEnviroment.Cells[PlayerType.Player1][x] && 
      GameEnviroment.Cells[PlayerType.Player1][x][y] && 
      GameEnviroment.Cells[PlayerType.Player1][x][y].cellType < 4);
  }
  setCoordinates(x, y, reset = false) {
    if (reset) this.lastAttacked.coords = [];
    this.lastAttacked.coords.push({
      x: x,
      y: y
    });
  }
  randomHit() {
    let x, y, hit;
    this.nextattack = null;
    while (true) {
      x = Math.floor(Math.random() * CFG.gridSize);
      y = Math.floor(Math.random() * CFG.gridSize);
      if (
        this.isCellExist(x, y)
      )
        break; //checking if we hadn't already shotted
    }
    hit = GameEnviroment.shot(x, y, PlayerType.Player1);
    if (hit === 'Damaged') {
      this.lastAttacked = {
        vector: null
      };
      this.setCoordinates(x, y, true);
    }
    return hit;
  }
  vectorHit(PrevCoords) {
    let x, y, anvector, hit;
    const lastIndex = PrevCoords.length - 1;
    const firstShot = PrevCoords[0];
    const lastShot = PrevCoords[lastIndex];
    const beforeLastShot = PrevCoords[lastIndex - 1];
    switch (this.lastAttacked.vector) {
    case 'Vertical': {
      anvector = 'Horizontal';
      x = lastShot.x;
      if (!beforeLastShot) {
        y = (firstShot.y - 1);
        if (!this.isCellExist(x, y))
          y = (firstShot.y + 1);
      } else if ((lastShot.y + 1) == beforeLastShot.y) y = (lastShot.y - 1);
      else y = (lastShot.y + 1);
      break;
    }
    case 'Horizontal': {
      anvector = 'Vertical';
      y = lastShot.y;
      if (!beforeLastShot) {
        x = (firstShot.x - 1);
        if (!this.isCellExist(x,y))
          x = (firstShot.x + 1);
      } else
      if ((lastShot.x + 1) == beforeLastShot.x)
        x = (lastShot.x - 1);
      else x = (lastShot.x + 1);
      break;
    }
    }
    if (!this.isCellExist(x, y)) {
      if (this.missstate > 1) this.lastAttacked.vector = anvector;
      else this.missstate++;
      this.lastAttacked.coords = [firstShot];
      hit = 'skips round';
    } else {
      hit = GameEnviroment.shot(x, y, PlayerType.Player1);
      switch (hit) {
      case 'Damaged':
        this.setCoordinates(x, y);
        break;
      case 'Error':
        if (lastIndex)
          this.nextattack = [ (firstShot.x - (x - lastShot.x)),
            (firstShot.y - (y - lastShot.y)) ];
        else this.nextattack = [ (lastShot.x - (x - lastShot.x)),
          (lastShot.y - (y - lastShot.y)) ];
        hit = 'Missed';
        break;
      }
    }
    return hit;
  }
  noneVectorHit(PrevCoords) {
    const firstShot = PrevCoords[0];
    let potentialVector, x, y, hit;
    const randomChoise = () => Math.random(2) >= 0.8;
    while (true) {
      if (randomChoise()) {
        potentialVector = 'Vertical';
        if (randomChoise()) y = firstShot.y + 1;
        else y = firstShot.y - 1;
        x = firstShot.x;
      } else {
        potentialVector = 'Horizontal';
        if (randomChoise()) x = firstShot.x + 1;
        else x = firstShot.x - 1;
        y = firstShot.y;
      }
      if (
        this.isCellExist(x, y)
      )
        break;
    }

    hit = GameEnviroment.shot(x, y, PlayerType.Player1);
    if ( hit == 'Damaged' ) {
      this.setCoordinates(x, y);
      this.lastAttacked.vector = potentialVector;
    }
    else if ( hit != 'Aimed' ) {
      this.lastAttacked.coords = [firstShot];
      hit = 'Missed';
    }
    return hit;
  }
  botAttack() {
    let hit;
    if (this.nextattack && this.lastAttacked) {
      const temporary = this.nextattack;
      this.nextattack = null;
      hit = GameEnviroment.shot(temporary.x, temporary.y, PlayerType.Player1);
      if (hit == 'Damaged') {
        const firstShot = this.lastAttacked.coords[0];
        this.lastAttacked.coords = [ firstShot, temporary ];
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
