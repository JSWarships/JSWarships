'use strict';

const Vector = {
	Horizontal: 0,
	Vertical: 1
};

class Ship
{
	constructor(size)
	{
		this.localPositions = [];
		this.size = size;
	}

    static DefaultShip = {
        localPositions:[
			{x: -1,
			y: -1
		}],
        size: -1
    };

    add_cell(cell_coord)
	{
		this.localPositions.push(cell_coord);
	}
}

