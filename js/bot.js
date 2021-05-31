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
                if ( GameEnviroment.Cells[ 1 ][ coords[0] ][ coords[1] ].cell_type < 4 ) break; //Refactor to make more understandable
            }
            
        }
        else 
        {

        }
        this.emiter.emit ( "BotAttacked" );
        console.log ( "Bot attacked!" );
    };
    
};

/*
    1. Ships random placing on start
    2. RandomAttack method
    3. LogicAttack method
*/
