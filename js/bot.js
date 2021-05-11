'use strict';

class Bot
{
    constructor( emiter )
    {
        this.emiter = emiter;
    };
    
    start ( )
    {
        this.emiter.on ( "PlayerAttacked", this.onPlayerAttacked );
        
        this.emiter.emit ( "BotAttacked" );
    };
    
    onPlayerAttacked ( ) 
    {
        console.log ( "Bot attacked!" );
    };
    
};
