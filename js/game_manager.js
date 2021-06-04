class GM 
{
    static areAllShips () {
        return GameEnviroment.Ships[PlayerType.Player1].length > 8;
    }
    static fillRandom () {
        GameUI.hide(GameUI.place);
        RandomPlacer.fillGridRandom(PlayerType.Player1);
    }
    static shipsReset () {
        GameEnviroment.Ships[PlayerType.Player1] = [];
        GameEnviroment.drawGrid(GRID_SIZE);
        GameUI.placeShipChange(0);
        GameEnviroment.Player.currentShipIndex = 0;
        GameEnviroment.Player.currentShipIndex = 0;
        GameEnviroment.Player.currentShip = null;
        GameEnviroment.Bot.placer();
    }
    static startGame () {
        if (!GM.areAllShips()) GameUI.textDrawer('Not all the ships placed!');
        else GameEnviroment.Player.finishFillingGrid();
    }
}