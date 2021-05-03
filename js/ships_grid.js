'use strict';

class ShipGrid{
    ships = [];

    constructor(){
        this.ships[0] = Ship.DefaultShip;
    };
    add_ship(ship){
        this.ships[this.ships.size()] = ship;
        this.ships[this.ships.size()] = DefaultShip;
    };
    
    add_ship_cell(cell, isFirst)
    {
        if(isFirst){
            
        }
    }
};
