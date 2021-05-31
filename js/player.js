'use strict';

const PlayerType = 
{
    Player1: 0,
    Player2: 1
};

const shipAliveColor = "blue";

const GridSettings = 
{
    OneDeck: {
        numberOfShips: 4,
        shipSize: 1
    },
    
    TwoDeck:{
        numberOfShips: 2,
        shipSize: 2
    },
    
    ThreeDeck:{
        numberOfShips: 2,
        shipSize: 3
    },
    
    FourDeck:{
        numberOfShips: 1,
        shipSize: 4
    },
    
    getShip: ( index ) =>
    {
        let i = 0;
        for ( let shipSettings in GridSettings )
        {
            if ( index == i ) return GridSettings [ shipSettings ];
            i++;
        };
    }
};

const onPlayerClick = ( e ) =>
{
        const cell = GameEnviroment.findClickedCell ( e.pageX, e.pageY, player1.player_type );
        const player_ship = player1.currentShip;
        if ( !cell ) return;
        if( player1.isFillingByPlayer )
        {
            const currShipType = GridSettings.getShip ( player1.currentShipIndex );

            if( !currShipType.shipSize )
            {
                player1.finish_filling_grid( );
                return;
            };
            
            if( cell.cell_type == CellType.Occupied )
            {
                console.warn ( "Occupied" );
                return;
            };
            
            const add_cell_to_enviroment = (last_cell_position) => {
                player1.currentShip.add_cell ( cell );
                GameEnviroment.add_ship_cell ( cell.localPosition, player1.player_type, null );
                GameEnviroment.drawRectangleWithPosition ( cell.localPosition, player1.player_type, shipAliveColor );
            };

            if( !player1.currentShip )
            {
                if( cell.cell_type == CellType.Empty )
                {
                    player1.currentShip = new Ship ( currShipType.shipSize );
                    add_cell_to_enviroment(null);
                }
                else return;
            };
            
            if ( cell.cell_type == CellType.Potential )
            {
                const cels_in_ship = player_ship.localPositions.length;
                add_cell_to_enviroment(player_ship.localPositions [cels_in_ship - 1]);
            };
            
            if ( player1.currentShip.localPositions.length == currShipType.shipSize )
            {
                player1.currentShipNumber++;
                console.log ( "refreshed" );
                GameEnviroment.refresh_sea ( player1.player_type );
                player1.currentShip = null;
            } ;
            
            if ( player1.currentShipNumber == currShipType.numberOfShips )
            {
                player1.currentShipIndex++;
                player1.currentShipNumber = 0;
                console.log ( "next type" );
                GameUI.placeShipChange ( player1.currentShipIndex );
            };

            if( !currShipType.shipSize )
            {
              player1.finish_filling_grid( );
              return;
            };
        };
        
        //this.grid.add_ship ( new Ship ( cell.localPosition, ) );
        //GameEnviroment.drawPoint ( cell.localPosition.x, cell.localPosition.y, PlayerType.Player2, 'black' );
};

class Player
{
    constructor ( emiter, player_type )
    {
        this.emiter = emiter;
        this.isFillingByPlayer = true;
        this.currentShipIndex = 0;
        this.currentShipNumber = 0;
        this.currentShip = null;
        this.player_type = player_type;
    };

    start ( )
    {
        this.emiter.on ( "BotAttacked", this.onBotAttacked );
        window.addEventListener ( 'click', onPlayerClick, false );
        this.grid = new ShipGrid( );
        console.log ( "Player initiated!" );
        GameUI.textDrawer ( "Player, place your ships!" ); 
        GameUI.placeShipInit ( );
        this.fillGridByPlayer( );
    };

    fillGridByPlayer( )
    {
        this.isFillingByPlayer = true;
    };

    finish_filling_grid( )
    {
        console.log ( "Filling is finished, starting the game..." );
        GameUI.textDrawer ( "Starting the game..." );
        GameUI.placeShipHide ( );
        this.isFillingByPlayer = false;
    };

    onBotAttacked( ) 
    {
        console.log ( "Bot attacked!" );
    };
};

//Pomenyat onClick dlya dwoih sostoyaniy