//const config = ConfigManager.getConfig();
//const GRID_SIZE = config.getConfig().GridSize;
//const PLAYER = GameEnviroment.Player;

class Bot {
  constructor(emiter) {
    this.emiter = emiter;
    this.lastAttacked = null;
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
    //x, y, player1.player_type
    setTimeout(() => {
      const hit = this.botAttack();
      GameUI.textDrawer('Bot ' + hit);
      if (hit !== 'Aimed' && hit !== 'Damaged')
        GameEnviroment.GameState = GameState.Fighting;
      else this.onPlayerAttacked();
    }, 2000);
  }
  botAttack() {
    let hit;
    if (this.nextattack) {
      const temporary = this.nextattack;
      this.nextattack = null;
      hit = GameEnviroment.shot(temporary[0], temporary[1], PlayerType.Player1);
    } else if (!this.lastAttacked) {
      let x, y;
      while (true) {
        x = Math.floor(Math.random() * GRID_SIZE);
        y = Math.floor(Math.random() * GRID_SIZE);
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
    } else {
      const PrevCoords = this.lastAttacked.coords;
      //console.log('Prev coords: ' + PrevCoords[PrevCoords.length - 1]);
      //console.log('Vector:' + this.lastAttacked.vector)
      if (this.lastAttacked.vector) {
        let x, y, anvector;
        const len = PrevCoords.length;
        switch (this.lastAttacked.vector) {
        case 'Vertical': {
          anvector = 'Horizontal';
          if (PrevCoords[len - 1][1] + 1 === PrevCoords[len - 2][1])
            y = PrevCoords[len - 1][1] - 1;
          else y = PrevCoords[len - 1][1] + 1;
          x = PrevCoords[len - 1][0];
          break;
        }
        case 'Horizontal': {
          anvector = 'Vertical';
          if (PrevCoords[len - 1][0] + 1 === PrevCoords[len - 2][0])
            x = PrevCoords[len - 1][0] - 1;
          else x = PrevCoords[len - 1][0] + 1;
          y = PrevCoords[len - 1][1];
          break;
        }
        }
        if (
          !GameEnviroment.Cells[PlayerType.Player1][x] ||
          !GameEnviroment.Cells[PlayerType.Player1][x][y]
        ) {
          if (this.missstate > 2) this.lastAttacked.vector = anvector;
          else this.missstate++;
          this.lastAttacked.coords = [PrevCoords[0]];
          hit = 'doesn\'t know what to hit';
        } else {
          hit = GameEnviroment.shot(x, y, PlayerType.Player1);
          switch (hit) {
          case 'Damaged':
            this.lastAttacked.coords.push([x, y]);
            break;
          case 'Aimed':
            this.lastAttacked = null;
            this.nextattack = null;
            this.missstate = 0;
            break;
          case 'Missed': //if missed - return to start point
            break;
          case 'Error':
            if (PrevCoords.length > 2)
              this.nextattack = [
                PrevCoords[0][0] - (x - PrevCoords[len - 1][0]),
                PrevCoords[0][1] - (y - PrevCoords[len - 1][1]),
              ];
            else
              this.nextattack = [
                PrevCoords[len - 1][0] - (x - PrevCoords[len - 1][0]),
                PrevCoords[len - 1][1] - (y - PrevCoords[len - 1][1]),
              ];
            hit = 'Missed';
            break;
          }
        }
      } else {
        //console.log('no vector')
        let potentialVector, x, y;
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
          this.lastAttacked = null;
          this.nextattack = null;
          this.missstate = 0;
          break;
        default:
          this.lastAttacked.coords = [this.lastAttacked.coords[0]];
          hit = 'Missed';
          break;
        }
      }
    }

    return hit;
  }
}
