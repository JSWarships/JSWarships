'use strict';

class Bot
{
    constructor ( emiter )
    {
        this.emiter = emiter;
    };

    start ( )
    {
        this.lastAttacked = undefined;
        this.emiter.on ( "PlayerAttacked", this.onPlayerAttacked );
    };
    
    onPlayerAttacked ( )
    {
        if ( !this.lastAttacked )
        {
            let coords;
            while ( true )
            {
                coords = [ Math.random ( grid_size ), Math.random ( grid_size ) ];
                if ( GameEnviroment.Cells[ 1 ][ coords[0] ][ coords[1] ].cell_type < 4 ) break; 
            }
            
        }
        else 
        {

        }
        this.emiter.emit ( "BotAttacked" );
        console.log ( "Bot attacked!" );
    };
    
    fillGridRandom ( )
    {
        let coords = [];
        let cell = GameEnviroment.Cells[1][coords[0]][coords[1]];
        let random_num =1;
        let coords_potential = []; //потенциальные клетки

        for (let ship_setting in GridSettings)
        {
            for (let i = 0; i < shipSettings.numberOfShips; i++)
            {
                while (true) {
                    coords = [Math.floor(Math.random() * grid_size), Math.floor(Math.random() * grid_size)];
                    if (GameEnviroment.Cells[1][coords[0]][coords[1]].cell_type === 0) break;
                }
                cell = GameEnviroment.Cells[1][coords[0]][coords[1]];
                GameEnviroment.add_ship_cell(cell, player1.player_type, null);
                cell = GameEnviroment.Cells[1][coords[0]][coords[1]];
                for (let j = 0; j < shipSize.numberOfShips; j++) {
                    for (let i = 0; i < grid_size; i++) {
                        for (let j = 0; j < grid_size; j++) {
                            if (cell_type == CellType.Potential) (coords_potential.push({
                                x: coords[0],
                                y: coords[1],
                            }));
                        }
                    }
                    random_num = Math.floor(Math.random() * coords_potential.length);
                    cell = GameEnviroment.Cells[1][coords_potential.x[random_num]][coords_potential.y[random_num]];
                    GameEnviroment.add_ship_cell(cell, player1.player_type, cell);
                    coords_potential.length = 0;
                }
            }
        }
    }
    
};

/*
    1. Ships random placing on start
    2. RandomAttack method
    3. LogicAttack method
*/
