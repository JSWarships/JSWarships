'use strict';

const Vector = {
	Horizontal: 0,
	Vertical: 1
};
//Переписать шип на целлс хранить состояния и состояние уничтоженый или нет
class Ship
{
	constructor ( size )
	{
		this.cells = [];
		this.size = size;
		this.is_alive = true;
	};

	add_cell ( cell_coord )
	{
		this.cells.push ( cell_coord );
	};

	get_cell ( cell_position )
	{
		for( let ship_cell in cells )
		{
			if( ship_cell.localPosition.x == cell_position.x && ship_cell.localPosition.y == cell_position.y )
			{
				return ship_cell;
			}
		}	
	}

	kill_cell( cell_position )
	{
		const cell = this.get_cell( cell_position );
		cell.cell_type = CellType.Damaged;
	};

	get_cell_type = ( cell_position ) => this.get_cell( cell_position ).cell_type;
};

