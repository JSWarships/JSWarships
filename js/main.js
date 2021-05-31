'use strict';

const emit = new EventEmitter ( );
const player1 = new Player ( emit, PlayerType.Player2 );
const bot = new Bot ( emit );
const grid_size = 10;

document.addEventListener ( 'DOMContentLoaded', ( ) => {
    GameUI.startButtons ( );
} );


function PlayWithBot (  )
{
    GameUI.startButtonsHide ( );
    GameEnviroment.draw_grid ( grid_size );
    player1.start ( );
    bot.start ( );
}