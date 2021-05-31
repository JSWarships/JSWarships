'use strict';

const canvas = document.getElementById ( "myCanvas" );
const ctx = canvas.getContext ( '2d' );
const squareSize = 30;
const playerMargin = squareSize * 12;
const dxy = squareSize;
const minDistanceToCell = squareSize * Math.sqrt ( 2 ) - 5;


class Vector2
{
  
  constructor ( x, y )
  {
    this.x = x;
    this.y = y;
  };
  
  static Distance ( vectorFrom, vectorTo )
  {
    return Math.sqrt ( ( vectorFrom.x - vectorTo.x ) ** 2 + ( vectorFrom.y - vectorTo.y ) ** 2 );
  };
  
};

const deltaVector = new Vector2 ( canvas.offsetLeft + canvas.clientLeft, canvas.offsetTop + canvas.clientTop );

const CellType = 
{
  Empty: 0,
  Occupied: 1,
  Blocked : 2,
  Potential: 3,
  Missed: 4,
  Damaged: 5
};

class Cell
{
  
  constructor ( x, y, player )
  {
    this.position = new Vector2 ( player * playerMargin + x * dxy + deltaVector.x, y * dxy + deltaVector.y );
    this.local_position = new Vector2 ( x, y );
    this.cell_type = CellType.Empty;
  };
  
};

class GameEnviroment
{
  static Cells = [ [ ] ];  
  static Ships = [ [ ] ];  
  
  static draw_grid ( size )
  {
    this.clearSea ( );
    for ( let player = 0; player < 2; player++ )
    {
      this.Cells [ player ] = [ ];
      for ( let i = 0; i < size; i++ )
      {
        this.Cells [ player ][ i ] = [ ];
        for ( let j = 0; j < size; j++ )
        {
          this.drawRectangle ( i, j, player, 'LightCyan' );
          this.Cells [ player ][ i ].push ( new Cell ( i, j, player ) );
        };
      };
    };
  };

  static findClickedCell ( x, y, player )
  {
    const mousePos = new Vector2 ( x, y );
    const cells = this.Cells [ player ];
    for ( let i = 0; i < this.Cells[ player ].length; i++ )
    {
        for ( let j = 0; j < cells[ i ].length; j++ )
        {
            if ( Vector2.Distance ( cells[ i ][ j ].position, mousePos ) <= minDistanceToCell )
            {
                console.log ( { x:i, y:j } );
                return cells [ i ][ j ];
            };
        };
    };
    return null;
  };

  static add_ship ( player, ship ) 
  {
    
    if(!this.Ships[player]) this.Ships[player] = [];
    this.Ships[player].push ( ship );
  }

  static drawRectangle = ( i, j, player, color ) => 
  {
    ctx.beginPath ( );
    ctx.fillStyle = 'black';
    ctx.fillRect ( player * playerMargin + j * dxy, i * dxy, squareSize, squareSize );
    ctx.fillStyle = color;
    ctx.fillRect ( player * playerMargin + j * dxy + 0.5,  i * dxy + 0.5, squareSize - 1, squareSize - 1 );
    ctx.fill( );
    ctx.stroke( );
    ctx.closePath( );
  };

  static drawRectangleWithPosition = ( position, player, color ) => 
  {
    ctx.beginPath( );
    ctx.fillStyle = 'black';
    ctx.fillRect ( player * playerMargin + position.x * dxy, position.y * dxy, squareSize, squareSize );
    ctx.fillStyle = color;
    ctx.fillRect ( player * playerMargin + position.x * dxy + 0.5,  position.y * dxy + 0.5, squareSize - 1, squareSize - 1 );
    ctx.fill ( );
    ctx.stroke ( );
    ctx.closePath ( );
  };

  static drawPoint = ( i, j, player, color ) => 
  {
    ctx.beginPath ( );
    ctx.fillStyle = color;
    ctx.arc ( player * 171 + 7 + j * 13, 8 + i * 15, 1, 0, Math.PI * 2, false );
    ctx.fill ( );
    ctx.closePath ( );
  };

  static drawSea = player => 
  {
    for ( let i = 0; i < 10; i++ ) 
    {
      for ( let j = 0; j < 10; j++ ) 
      {
        drawRectangle( i, j, player, 'LightCyan' );
      };
    };
  };

  static add_ship_cell ( cell, player, last_cell_position )
  {
    const x = cell.local_position.x, y = cell.local_position.y;
    this.Cells [ player ][ x ][ y ].cell_type = CellType.Occupied;
    if ( !last_cell_position ) 
    {
      this.setSquearePotential(x, y, player);
    } 
    else
    {
      const difference_vector = new Vector2 ( x - last_cell_position.x, y - last_cell_position.y );
      console.log(last_cell_position );
      console.log(x + difference_vector.x );
      if ( is_in_bounds ( x + difference_vector.x, y + difference_vector.y ) )
      {
        if ( this.Cells [ player ][ x + difference_vector.x ][ y + difference_vector.y ].cell_type == CellType.Empty )
        {
          this.Cells [ player ][ x + difference_vector.x ][ y + difference_vector.y ].cell_type = CellType.Potential;
         
          
        };
      };
      this.surround_cell ( x, y, player );
    };
    for ( let i = -1; i < 2; i+=2 )
    {
      for ( let j = -1; j < 2; j+=2 )
      {
        if ( is_in_bounds ( x + i, y + j ) )
          this.Cells [ player ][ x + i ][ y + j ].cell_type = CellType.Blocked;
      };
    };
  };

  static surround_cell_block_potential ( x, y, player )
  {
    if ( this.Cells [ player ][ x ][ y ].cell_type == CellType.Occupied )
    {
      for ( let k = -1; k <= 1; k++ )
      {
        for ( let m = -1; m <= 1; m++ )
        {
          if ( !is_in_bounds ( x + k, y + m ) ) continue;
          const cell_type = this.Cells [ player ][ x + k ][ y + m ].cell_type;
          if ( cell_type == CellType.Occupied ) continue;
          this.Cells [ player ][ x + k ][ y + m ].cell_type = CellType.Blocked;
        };
      };
    };
  };

  static surround_cell ( x, y, player )
  {
    if ( this.Cells [ player ][ x ][ y ].cell_type == CellType.Occupied )
    {
      for ( let k = -1; k <= 1; k++ )
      {
        for( let m = -1; m <= 1; m++ )
        {
          if ( !is_in_bounds ( x + k, y + m ) ) continue;
          const cell_type = this.Cells [ player ][ x + k ][ y + m ].cell_type;
          if ( cell_type == CellType.Occupied || cell_type == CellType.Potential ) continue;
          this.Cells [ player ][ x + k ][ y + m ].cell_type = CellType.Blocked;
        };
      };
    };
  };

  static refresh_sea ( player )
  {
    for ( let i = 0; i < grid_size; i++ )
    {
      for ( let j = 0; j < grid_size; j++ )
      {
        this.surround_cell_block_potential ( i, j, player );
      };
    };
  };

  static is_blocked ( x, y, player )
  {
    return this.Cells [ player ][ x ][ y ].cell_type == CellType.Blocked;
  };

  static setSquearePotential ( x, y, player )
  {
    if ( x + 1 < grid_size && !this.is_blocked ( x + 1, y, player ) )
      this.Cells [ player ][ x + 1 ][ y ].cell_type = CellType.Potential;
    if ( x - 1 > 0 && !this.is_blocked ( x - 1, y, player ) )
      this.Cells [ player ][ x - 1 ][ y ].cell_type = CellType.Potential;
    if ( y + 1 < grid_size && !this.is_blocked ( x, y + 1, player ) )
      this.Cells [ player ][ x ][ y + 1 ].cell_type = CellType.Potential;
    if ( y - 1 > 0 && !this.is_blocked ( x, y - 1, player ) )
      this.Cells [ player ][ x ][ y - 1 ].cell_type = CellType.Potential;
  };


  static clearSea = ( ) => 
  {
    ctx.clearRect ( 0, 0, 700, 300 );
  };

  /*static drawShips = player => 
  {
    for ( let i = 0; i < 10; i++ ) 
    {
      Ships [ player ][ i ].drawShip( );
    };
  };

  static drawKilledShipsAndMask = ( ) => 
  {
    fields [ 0 ].drawMask( );
    fields [ 1 ].drawMask( );
    for ( let i = 0; i < 10; i++ ) 
    {
      Ships [ 0 ][ i ].drawKilled( );
      Ships [ 1 ][ i ].drawKilled( );
    };
  };
*/
  
  static getShip ( x, y, player )
  {
    const ships = this.Ships[ player ];
    for ( let i = 0; i < ships.length; i++ )
    {
      let ship = ships[ i ];
      let shipCells = ship.cells;
      for ( let j = 0; j < shipCells.length; j++ )
      {
        let cellOfShip = shipCells[i];
        if ( cellOfShip.local_position.x === x && cellOfShip.local_position.y === y )
          return ship;
      };
    };
  };
  
  static miss ( cell, player )
  {
    cell.cell_type = CellType.Missed;
    result = "Missed";
    // рисуем крестик
  };
  
  static hit ( cell, player )
  {
    cell.cell_type = CellType.Damaged;
    result = "Damaged";
    this.drawRectangleWithPosition( cell.local_position.x, cell.local_position.y, player, 'red' );
    const ship = this.getShip( cell.local_position.x, cell.local_position.y, player );
        ship.kill_cell( cell.position );
        if ( !ship.check_alive() )
        {
          this.refresh_sea( player );
          result = "Aimed";
        }
  };
  
  static shot ( x, y, player )
  {
    const result; 
    const cell = this.Cells[ player ][ x ][ y ];
    switch ( cell.cell_type )
    {
      case 1:
        hit ( cell, player );
        break;
      case 4:
      case 5:
        result = "Error";
        break;
      default:
        miss ( cell, player );
        break;
    }
    return result;
  };

};

const is_in_bounds = ( x, y ) => x > -1 && y > -1 && x < grid_size && y < grid_size;
