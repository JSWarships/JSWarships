'use strict';

const Vector = {
	Horizontal: 0,
	Vertical: 1
};

class Ship
{
	constructor ( size )
	{
		this.cells = [];
		this.size = size;
		this.is_alive = true;
	};

	add_cell ( cell )
	{
		this.cells.push ( cell );
	};

	get_cell ( cell_position )
	{
		for( let ship_cell in cells )
		{
			if( ship_cell.local_position.x == cell_position.x && ship_cell.local_position.y == cell_position.y )
			{
				return ship_cell;
			}
		}	
	};

	kill_cell ( cell_position )
	{
		const cell = this.get_cell( cell_position );
		cell.cell_type = CellType.Damaged;
		this.is_alive - this.check_alive ( );
	};

	check_alive ( )
	{
		const filtered = this.cells.filter ( ( ship_cell ) => ship_cell.cell_type != CellType.Damaged );
		return filtered.length > 0;
	};

	get_cell_type = ( cell_position ) => this.get_cell( cell_position ).cell_type;
};

