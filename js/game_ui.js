class GameUI {
  static themeSwitch() {
    document.body.classList.toggle('dark-theme');
    if (document.body.classList.contains('dark-theme'))
      localStorage.setItem('theme', 'dark');
    else localStorage.setItem('theme', 'none');
  }
  static textInit() {
    this.turn = document.getElementsByClassName('turn')[0];
    this.place = document.getElementsByClassName('place')[0];
  }
  static textDrawer(text) {
    this.turn.innerHTML = text;
  }
  static placeShipChange(len) {
    this.placeShipShow();
    this.place.innerText = this.place.innerText.slice(
      0,
      this.place.innerText.length - 1
    );
    this.place.innerText = 'Place ship length ' + (len + 1);
  }
  static placeShipShow() {
    this.place.style.display = 'block';
  }
  static placeShipHide() {
    this.place.style.display = 'none';
  }
  static buttonCreator(text, additional, callback) {
    const button = document.createElement('div');
    button.className = 'btn';
    button.id = additional;
    button.innerText = text;
    button.onclick = callback;
    return button;
  }
  static startButtons() {
    this.theme = localStorage.getItem('theme');
    if (this.theme === 'dark') this.themeSwitch();
    this.textInit();
    this.textDrawer('Select player to play with');
    this.container = document.createElement('div');
    this.container.className = 'container';
    const startButton = this.buttonCreator('Bot', 'bot', PlayWithBot);
    this.container.appendChild(startButton);
    document.body.appendChild(this.container);
  }
  static startButtonsHide() {
    this.containerHide();
    this.showGrid();
    this.placeButtons();
  }
  static placeButtons() {
    this.container.appendChild(this.buttonCreator('Start', 'start', startGame));
    this.container.appendChild(
      this.buttonCreator('Random', 'random', fillRandom)
    );
    this.container.appendChild(this.buttonCreator('Reset', 'rest', shipsReset));
    this.container.id = 'game';
    this.containerShow();
  }
  static containerHide() {
    GameUI.container.style.opacity = 0;
    GameUI.container.style.visibility = 'hidden';
    GameUI.container.innerHTML = '';
  }
  static containerShow() {
    GameUI.container.style.opacity = 1;
    GameUI.container.style.visibility = 'visible';
  }
  static showGrid() {
    const canvas = document.getElementsByClassName('canvas')[0];
    canvas.style.visibility = 'visible';
    canvas.style.opacity = '1';
  }
  static showScore () {
    GameUI.score = document.createElement('h2');
    GameUI.container.appendChild(this.score);
    GameUI.container.id = 'score';
    GameUI.containerShow();
  }
  static updateScore() {
    const botScore = GameEnviroment.Bot.score;
    const playerScore = GameEnviroment.Player.score;
    if ( botScore < 9 && playerScore < 9 ) GameUI.score.innerText = `${botScore} - ${playerScore}`;
    else {
        GameUI.containerHide();
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
