'use strict';

class Player{
    constructor(emiter){
        this.emiter = emiter;
    }
    start(){
        this.emiter.on("BotAttacked", this.onBotAttacked);
        console.log("Player initiated!");
    }
    onBotAttacked() {
        console.log("Bot attacked!");
    }
}

module.exports = Player;