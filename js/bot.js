//const config = ConfigManager.getConfig();
//const GRID_SIZE = config.getConfig().GridSize;
//const PLAYER = GameEnviroment.Player;

class Bot {
  constructor(emiter) {
    this.emiter = emiter;
    this.lastAttacked = null;
  }

  placer() {
    while (RandomPlacer.fillGridRandom(PlayerType.Player2) == 'Error') {
      GameEnviroment.clearSea();
    }
  }

  start() {
    this.placer();
  }

  onPlayerAttacked() {
    //x, y, player1.player_type
    setTimeout(() => {
      let hit = this.botAttack();
      GameUI.textDrawer('Bot ' + hit);
      GameEnviroment.GameState = GameState.Fighting;
    }, 2000);
  }
  botAttack()
  {
    let hit;
    if (!this.lastAttacked) {
      let x, y;
      while (true) {
        x = Math.floor(Math.random() * GRID_SIZE);
        y = Math.floor(Math.random() * GRID_SIZE);
        if (GameEnviroment.Cells[PlayerType.Player1][x][y] && GameEnviroment.Cells[PlayerType.Player1][x][y].cellType < 4) break; //checking if we hadn't already shotted
      }
      hit = GameEnviroment.shot(x, y, PlayerType.Player1);
      if (hit == 'Damaged')
        this.lastAttacked = {
          coords: [[x, y]],
          vector: null,
        };
    } else {
      const PrevCoords = this.lastAttacked.coords;
      if (this.lastAttacked.vector) {
        let x, y, anvector;
        const len = PrevCoords.length;
        switch (this.lastAttacked.vector) {
          case 'Vertical': {
            anvector = 'Horizontal';
            const deltaY = PrevCoords[len - 1][1] - PrevCoords[len - 2][1];
            if (deltaY > 0) y = PrevCoords[len - 1][1]--;
            else PrevCoords[len - 1][1]++;
            x = PrevCoords[len - 1][0];
            break;
          }
          case 'Horizontal': {
            anvector = 'Vertical';
            const deltaX = PrevCoords[len - 1][0] - PrevCoords[len - 2][0];
            if (deltaX > 0) x = PrevCoords[len - 1][0]--;
            else PrevCoords[len - 1][0]++;
            y = PrevCoords[len - 1][1];
            break;
          }
        }
        if (!GameEnviroment.Cells[PlayerType.Player1][x][y])
        {
          this.lastAttacked.coords.push(PrevCoords[len - 2]);
          let possible = this.botAttack();
          if ( possible != 'Damaged' || possible != 'Aimed' ) this.lastAttacked.vector = anvector;
          hit = 'doesn\'t know what to hit';
        }
        else {
          hit = GameEnviroment.shot(x, y, PlayerType.Player1);
          switch (hit) {
            case 'Damaged':
              this.lastAttacked.coords.push([x, y]);
              break;
            case 'Aimed':
              this.lastAttacked = null;
              break;
            case 'Missed': //if missed - return to start point
              this.lastAttacked.coords.push(PrevCoords[len - 1]);
              break;
            case 'Error':
              console.log("Bot isn't right...");
              break;
          }
        }
      } else {
        let potentialVector, x, y;
        while (true)
        {
          if (Math.random(2) >= 0.5) {
            potentialVector = 'Vertical';
            if (Math.random(2) >= 0.5) y = PrevCoords[0][1]++;
            else y = PrevCoords[0][1]--;
            x = PrevCoords[0][0];
          } else {
            potentialVector = 'Horizontal';
            if (Math.random(2) >= 0.5) x = PrevCoords[0][0]++;
            else x = PrevCoords[0][0]--;
            y = PrevCoords[0][1];
          }
          if (GameEnviroment.Cells[PlayerType.Player1][x][y] && GameEnviroment.Cells[PlayerType.Player1][x][y].cellType < 4) break; 
        }
        
        hit = GameEnviroment.shot(x, y, PlayerType.Player1);
        switch (hit) {
          case 'Damaged':
            this.lastAttacked.coords.push([x, y]);
            this.lastAttacked.vector = potentialVector;
            break;
          case 'Aimed':
            this.lastAttacked = null;
            break;
          case 'Error':
            console.log(this.lastAttacked.coords + '\n' + this.lastAttacked.vector)
            break;
        }
      }
    }
    return hit;
  }
}
