'use strict';

const emit = new EventEmitter ( );
const player1 = new Player ( emit, PlayerType.Player1 );
const bot = new Bot ( emit );
const grid_size = 10;
let game_state = GameState.FillingGrid;

document.addEventListener ( 'DOMContentLoaded', ( ) => {
    GameUI.startButtons ( );
} );


function PlayWithBot (  )
{
    GameUI.startButtonsHide ( );
    GameEnviroment.draw_grid ( grid_size );
    setTimeout ( ( ) => {
        player1.start ( );
        bot.start ( );
    }, 100 ); 
}

function GenerateRandomShips () 
{
    player1.isFillingByPlayer = false;
    onPlayerClick(null);
}