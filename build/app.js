'use strict';

let Game = React.createClass({
  displayName: 'Game',


  getInitialState() {
    return {
      tiles: ['', '', '', '', '', '', '', '', ''],
      turn: 'o',
      winner: 'n',
      mode: 'single'
    };
  },

  componentWillMount() {
    if (JSON.parse(localStorage.state).tiles.join('').length > 0) {
      this.setState({ tiles: JSON.parse(localStorage.state).tiles });
    }
  },

  componentDidUpdate() {
    localStorage.state = JSON.stringify(this.state);
  },

  checkBoard() {
    const t = this.state.tiles;
    const check = function (a, b, c) {
      return a + b + c === 'xxx' || a + b + c === 'ooo';
    };
    if (check(t[0], t[1], t[2])) return t[0];
    if (check(t[3], t[4], t[5])) return t[3];
    if (check(t[6], t[7], t[8])) return t[6];

    if (check(t[0], t[3], t[6])) return t[0];
    if (check(t[1], t[4], t[7])) return t[1];
    if (check(t[2], t[5], t[8])) return t[2];

    if (check(t[0], t[4], t[8])) return t[0];
    if (check(t[2], t[4], t[6])) return t[2];

    if (t.join('').length === 9) return 'd';
    return 'n';
  },

  tileClick(position, player) {
    const tiles = this.state.tiles;
    if (tiles[position] === 'x' || tiles[position] === 'o' || this.state.winner !== 'n') return;
    tiles[position] = player;
    this.setState({ tiles: tiles, turn: player === 'o' ? 'x' : 'o', winner: this.checkBoard() });
    if (this.state.mode === 'single') {
      const that = this;
      setTimeout(function () {
        that.tileClickByComputer(player);
      }, 200);
    }return;
  },

  tileClickByComputer(player) {
    const tiles = this.state.tiles;
    if (this.state.winner !== 'n') return;
    player = player === 'o' ? 'x' : 'o';
    let tileIndex = [];
    tiles.forEach(function (e, i) {
      if (e === '') {
        tileIndex.push(i);
      }
    });
    let newValue = tileIndex[Math.floor(tileIndex.length * Math.random())];
    tiles[newValue] = player;
    this.setState({ tiles: tiles, turn: player === 'o' ? 'x' : 'o', winner: this.checkBoard() });
  },

  resetGame() {
    this.setState(this.getInitialState());
    localStorage.state = JSON.stringify(this.getInitialState());
  },

  changeMode() {
    this.setState({ mode: this.state.mode === 'single' ? 'multi' : 'single' });
  },

  render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { id: 'game' },
        this.state.tiles.map(function (tile, pos) {
          return React.createElement(Tile, { status: tile, key: pos, id: pos, turn: this.state.turn, tileClick: this.tileClick });
        }, this)
      ),
      React.createElement(Menu, { turn: this.state.turn, winner: this.state.winner, resetAction: this.resetGame, changeMode: this.changeMode, mode: this.state.mode })
    );
  }
});

let Tile = React.createClass({
  displayName: 'Tile',

  clickHandler() {
    this.props.tileClick(this.props.id, this.props.turn);
  },
  render() {
    return React.createElement(
      'div',
      { className: this.props.status === '' ? 'tile' : 'tile status-' + this.props.status, onClick: this.clickHandler },
      this.props.status
    );
  }
});

let Menu = React.createClass({
  displayName: 'Menu',

  render() {
    return React.createElement(
      'div',
      { id: 'menu' },
      React.createElement(
        'h3',
        { className: this.props.winner === 'n' ? 'visible' : 'hidden' },
        'player ',
        this.props.turn,
        '  turn'
      ),
      React.createElement(
        'h3',
        { className: this.props.winner === 'n' || this.props.winner === 'd' ? 'hidden' : 'visible' },
        'player ',
        this.props.winner,
        ' won!'
      ),
      React.createElement(
        'h3',
        { className: this.props.winner === 'd' ? 'visible' : 'hidden' },
        'draw game :('
      ),
      React.createElement(
        'button',
        { className: 'btn btn-default', onClick: this.props.resetAction },
        'reset game'
      ),
      React.createElement(
        'button',
        { className: 'btn btn-default', onClick: this.props.changeMode },
        'mode: ',
        this.props.mode
      )
    );
  }
});

ReactDOM.render(React.createElement(Game, null), document.querySelector('.main'));