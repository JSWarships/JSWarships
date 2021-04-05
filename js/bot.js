'use strict';

class Bot{
    constructor(emiter){
        this.emiter = emiter;
    }
    start(){
        this.emiter.on("PlayerAttacked", this.onPlayerAttacked);
        console.log("Bot initiated!");
        this.emiter.emit("BotAttacked");
    }
    onPlayerAttacked() {
        console.log("Bot attacked!");
    }
}

module.exports = Bot;