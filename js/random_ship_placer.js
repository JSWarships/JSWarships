
class RandomPlacer
{
    static get_all_potential ( player )
    {
        const potential = [];
        const Cells = GameEnviroment.Cells;
            for (let i = 0; i < grid_size; i++) {
                for (let j = 0; j < grid_size; j++) {
                    if (Cells[player][i][j].cell_type == CellType.Potential)
                    {
                        potential.push(new Vector2 (i, j));
                    }
                }
            }
        return potential;
    };

    static is_available ( cell_position, ship_size, player)
    {
        const Cells = GameEnviroment.Cells;
        let x = cell_position.x, y = cell_position.y;
        let number_of_cells = [0,0,0,0];
        for (let i = 1; i < ship_size; i++)
        {
            if(is_in_bounds(x + i, y))
                if (Cells[player][x + i][y].cell_type == CellType.Empty) number_of_cells[0]++;
            if(is_in_bounds(x - i, y))    
                if (Cells[player][x - i][y].cell_type == CellType.Empty) number_of_cells[1]++;
            if(is_in_bounds(x, y + i))
                if (Cells[player][x][y + i].cell_type == CellType.Empty) number_of_cells[2]++;
            if(is_in_bounds(x, y - i))
                if (Cells[player][x][y - i].cell_type == CellType.Empty) number_of_cells[3]++;
        }
        for (let i = 0; i < 4; i++)
        {
            if(number_of_cells[i] == ship_size-1) return true;
        }
        return false;
    };
    
    static fillGridRandom ( player )
    {
        const Cells = GameEnviroment.Cells;
        let coords = new Vector2 ( 0, 0 );
        let cell = Cells[ player ][ coords.x ][ coords.y ];
        let random_num = 1;

        for (let ship_setting_key in GridSettings)
        {
            const ship_setting = GridSettings[ship_setting_key];
            for (let i = 0; i < ship_setting.numberOfShips; i++)
            {
                while (true) {
                    coords = new Vector2 ( Math.floor( Math.random() * grid_size), Math.floor(Math.random() * grid_size) );
                    if (this.is_available( coords, ship_setting.shipSize, player )) break;
                }
                
                cell = Cells[player][coords.x][coords.y];
                GameEnviroment.add_ship_cell(cell, player, null);
                
                GameEnviroment.drawRectangleWithPosition ( cell.local_position, player, ship_alive_color );
                console.log(cell);
                let last_cell = cell;

                for(let j = 0; j < ship_setting.shipSize - 1; j++)
                {
                    const coords_potential = this.get_all_potential( player ); 
                    console.log(coords_potential);
                    random_num = Math.floor(Math.random() * coords_potential.length);
                    cell = Cells[player][coords_potential[random_num].x][coords_potential[random_num].y];
                    console.log(cell);
                    GameEnviroment.add_ship_cell(cell, player, last_cell.local_position);
                    GameEnviroment.drawRectangleWithPosition ( cell.local_position, player, ship_alive_color );
                    last_cell = cell;
                }
                GameEnviroment.refresh_sea( player );
            }
        }
    };
}