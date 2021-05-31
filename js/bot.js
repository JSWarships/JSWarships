'use strict';

class Bot
{
    constructor ( emiter )
    {
        this.emiter = emiter;
        this.lastAttacked = null;
    };

    start ( )
    {
        this.emiter.on ( "PlayerAttacked", this.onPlayerAttacked );
    };
    
    onPlayerAttacked ( )
    {
        //x, y, player1.player_type
        if ( !this.lastAttacked )
        {
            let x, y;
            while ( true )
            {
                x = Math.random ( grid_size );
                y = Math.random ( grid_size );
                if ( GameEnviroment.Cells[ player1.player_type ][ x ][ y ].cell_type < 4 ) break; //checking if we hadn't already shotted
            }
            const hit = GameEnviroment.shot ( x, y, player1.player_type );
            if ( hit == 'Damaged' ) 
                this.lastAttacked = {
                    coords: [ [ x, y ] ],
                    vector: null
                };
        }
        else 
        {
            const PrevCoords = this.lastAttacked.coords;
            if ( this.lastAttacked.vector )
            {
                let x, y;
                const len = PrevCoords.length;
                switch ( this.lastAttacked.vector )
                {
                    case 'Vertical':
                        const deltaY = PrevCoords [ len - 1 ] [ 1 ] - PrevCoords [ len - 2 ] [ 1 ];
                        if ( deltaY > 0 ) y = PrevCoords [ len - 1 ] [ 1 ]++;
                        else PrevCoords [ len - 1 ] [ 1 ]--;
                        x = PrevCoords [ len - 1 ] [ 0 ];
                        break;
                    case 'Horizontal':
                        const deltaX = PrevCoords [ len - 1 ] [ 0 ] - PrevCoords [ len - 2 ] [ 0 ];
                        if ( deltaX > 0 ) x = PrevCoords [ len - 1 ] [ 0 ]++;
                        else PrevCoords [ len - 1 ] [ 0 ]--;
                        y = PrevCoords [ len - 1 ] [ 1 ];
                        break;
                }
                const hit = GameEnviroment.shot ( x, y, player1.player_type );
                switch ( hit )
                {
                    case 'Damaged':
                        this.lastAttacked.coords.push ( [ x, y ] );
                        break;
                    case 'Aimed':
                        this.lastAttacked = null;
                        break;
                    case 'Missed':
                        this.lastAttacked.coords.push ( PrevCoords [ len - 1 ] ); //if missed - return to start point
                        break;
                    case 'Error':
                        console.log( 'Bot isn\'t right...' );
                        break;
                }
            }
            else
            {
                let potentialVector, x, y;
                if ( Math.random ( 2 ) )
                {
                    potentialVector = 'Vertical';
                    if ( Math.random ( 2 ) ) y = PrevCoords [ 0 ] [ 1 ]++;
                    else  y = PrevCoords [ 0 ] [ 1 ]--;
                    x = PrevCoords [ 0 ] [ 0 ];
                }
                else 
                {
                    potentialVector = 'Horizontal';
                    if ( Math.random ( 2 ) ) x = PrevCoords [ 0 ] [ 0 ]++;
                    else  x = PrevCoords [ 0 ] [ 0 ]--;
                    y = PrevCoords [ 0 ] [ 1 ];
                }
                const hit = GameEnviroment.shot ( x, y, player1.player_type );
                switch ( hit )
                {
                    case 'Damaged':
                        this.lastAttacked.coords.push ( [ x, y ] );
                        this.lastAttacked.vector = potentialVector;
                        break;
                    case 'Aimed':
                        this.lastAttacked = null;
                        break;
                    default:
                        break;
                };
            }
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
                    if ( !GameEnviroment.Cells[1][coords[0]][coords[1]].cell_type ) break;
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
