

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
  static startButtons() {
    this.theme = localStorage.getItem('theme');
    if (this.theme == 'dark') this.themeSwitch();
    this.textInit();
    this.textDrawer('Select player to play with');
    this.container = document.createElement('div');
    this.container.className = 'container';
    const botButton = document.createElement('div');
    botButton.className = 'btn';
    botButton.innerText = 'Bot';
    botButton.onclick = PlayWithBot;
    this.container.appendChild(botButton);
    document.body.appendChild(this.container);
  }
  static startButtonsHide() {
    this.container.style.display = 'none';
    this.showGrid();
  }
  static showGrid() {
    const canvas = document.getElementsByClassName('canvas')[0];
    canvas.style.visibility = 'visible';
    canvas.style.opacity = '1';
  }
}

//module.exports = GameUI;
