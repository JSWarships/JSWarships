'use strict';

class GameUI
{
    static textInit ( )
    {
        this.turn = document.getElementsByClassName( 'turn' )[0];
    }
    static textDrawer ( text )
    {
        this.turn.innerHTML = text;
    }
    static startButtons ( )
    {
        this.textInit ( );
        this.textDrawer ( 'Select player to play with' );
        this.container = document.createElement ( 'div' );
            this.container.className = 'container';
        const botButton = document.createElement ( 'div' );
            botButton.className = 'btn';
            botButton.innerText = 'Bot';
            botButton.onclick = PlayWithBot;
        this.container.appendChild ( botButton );
        document.body.appendChild ( this.container );
    }
    static startButtonsHide ( )
    {
        this.container.style.display = 'none';
        this.showGrid ( );
    }
    static showGrid ( )
    {
        document.getElementsByClassName ( 'canvas' )[0].style.display = 'block';
    }
}


