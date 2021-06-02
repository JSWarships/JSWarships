class GameUI {
  static themeSwitch() {
    document.body.classList.toggle('dark-theme');
    if (document.body.classList.contains('dark-theme'))
      localStorage.setItem('theme', 'dark');
    else localStorage.setItem('theme', 'none');
  }
  static textInit() {
    this.turn = document.getElementsByClassName('turn')[0];
  }
  static textDrawer(text) {
    this.turn.innerHTML = text;
  }
  static placeShipInit() {
    this.place = document.createElement('h3');
    this.place.className = 'place';
    this.place.innerText = 'Place ship length 1';
    document.body.appendChild(this.place);
  }
  static placeShipChange(len) {
    this.place.innerText = this.place.innerText.slice(
      0,
      this.place.innerText.length - 1
    );
    this.place.innerText += ' ' + (len + 1);
  }
  static placeShipHide() {
    this.place.style.display = 'none';
  }
  static buttonCreator (text, additional, callback) {
    const button = document.createElement('div');
    button.className = 'btn';
    button.id = additional;
    button.innerText = text;
    button.onclick = callback;
    return button;
  }
  static startButtons() {
    this.theme = localStorage.getItem('theme');
    if (this.theme == 'dark') this.themeSwitch();
    this.textInit();
    this.textDrawer('Select player to play with');
    this.container = document.createElement('div');
    this.container.className = 'container';
    const startButton = this.buttonCreator ( 'Bot', 'bot', PlayWithBot );
    this.container.appendChild(startButton);
    document.body.appendChild(this.container);
  }
  static startButtonsHide() {
    this.containerHide()
    this.showGrid();
    this.placeButtons();
  }
  static placeButtons() {
    this.container.appendChild(this.buttonCreator ( 'Start', 'start', startGame ));
    this.container.appendChild(this.buttonCreator ( 'Random', 'random', fillRandom ));
    this.container.appendChild(this.buttonCreator ( 'Reset', 'rest', shipsReset ));
    this.container.id = 'game';
    this.container.style.display = 'inline-flex';
  }
  static containerHide() {
    GameUI.container.innerHTML = '';
    GameUI.container.style.display = 'none';
  }
  static showGrid() {
    const canvas = document.getElementsByClassName('canvas')[0];
    canvas.style.visibility = 'visible';
    canvas.style.opacity = '1';
  }
}

//module.exports = GameUI;
