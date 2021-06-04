class GameUI {
  static show ( element ) {
    element.style.visibility = 'visible';
    element.style.opacity = 1;
  }
  static hide ( element ) {
    element.style.visibility = 'hidden';
    element.style.opacity = 0;
  }
  static clear ( element ) {
    element.innerHTML = '';
    element.innerText = '';
  }
  static init() {
    GameUI.theme = localStorage.getItem('theme');
    GameUI.turn = document.getElementsByClassName('turn')[0];
    GameUI.place = document.getElementsByClassName('place')[0];
    GameUI.container = document.getElementsByClassName('container')[0];
  }
  static themeSwitch() {
    document.body.classList.toggle('dark-theme');
    if (document.body.classList.contains('dark-theme'))
      localStorage.setItem('theme', 'dark');
    else localStorage.setItem('theme', 'none');
  }
  static textDrawer(text) {
    GameUI.turn.innerHTML = text;
  }
  static placeShipChange(len) {
    GameUI.show(GameUI.place);
    GameUI.place.innerText = GameUI.place.innerText.slice(
      0,
      GameUI.place.innerText.length - 1
    );
    GameUI.place.innerText = 'Place ship length ' + (len + 1);
  }
  static buttonCreator(text, additional, callback) {
    const button = document.createElement('div');
    button.className = 'btn';
    button.id = additional;
    button.innerText = text;
    button.onclick = callback;
    return button;
  }
  static start() {
    GameUI.init();
    if (GameUI.theme === 'dark') GameUI.themeSwitch();
    GameUI.textDrawer('Select player to play with');
    const startButton = GameUI.buttonCreator('Bot', 'bot', PlayWithBot);
    GameUI.container.appendChild(startButton);
    GameUI.show(GameUI.container);
  }
  static startButtonsHide() {
    GameUI.hide(GameUI.container);
    GameUI.show(document.getElementsByClassName('canvas')[0]);
    GameUI.placeButtons();
  }
  static placeButtons() {
    GameUI.clear(GameUI.container);
    GameUI.container.appendChild(GameUI.buttonCreator('Start', 'start', GM.startGame));
    GameUI.container.appendChild(
      GameUI.buttonCreator('Random', 'random', GM.fillRandom)
    );
    GameUI.container.appendChild(GameUI.buttonCreator('Reset', 'rest', GM.shipsReset));
    GameUI.container.id = 'game';
    GameUI.show(GameUI.container);
  }
  static showScore () {
    GameUI.clear(GameUI.container);
    GameUI.score = document.createElement('h2');
    GameUI.container.appendChild(GameUI.score);
    GameUI.container.id = 'score';
    GameUI.show(GameUI.container);
  }
  static updateScore() {
    const botScore = GameEnviroment.Bot.score;
    const playerScore = GameEnviroment.Player.score;
    if ( botScore < 9 && playerScore < 9 ) GameUI.score.innerText = `${botScore} - ${playerScore}`;
    else {
        GameUI.hide(GameUI.container);
        GameEnviroment.GameState = 2;
        switch ( botScore ) {
          case 9:
            GameUI.textDrawer('Bot WON!');
            break;
          default:
            GameUI.textDrawer('Player WON!');
            break;
        }
    }
  }
}
