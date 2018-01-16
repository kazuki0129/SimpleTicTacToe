import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';


// Class Square consists only render() then we can use functional components like below.
function Square(props){
    return (
        <button className="square" onClick={ props.onClick }>
            { props.value }
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
                value={ this.props.squares[i] }
                onClick={ () => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            history : [{
                squares: Array(9).fill(null),
                selectedPos: null
            }],
            stepNumber: 0,
            xIsNext: true
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                selectedPos: i
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    // checkLocation() {
    //     const locations = this.state.selectedLoc;
    //     let loc = [];
    //
    //     console.log(loc);
    //     switch (locations){
    //
    //         case 0:
    //             loc.push(' (col: 1, row: 1)');
    //             return loc;
    //         case 1:
    //             loc.push(' (col: 2, row: 1)');
    //             return loc;
    //         case 2:
    //             loc.push(' (col: 3, row: 1)');
    //             return loc;
    //         case 3:
    //             loc.push(' (col: 1, row: 2)');
    //             return loc;
    //
    //         case 4:
    //             loc.push(' (col: 2, row: 2)');
    //             return loc;
    //         case 5:
    //             loc.push(' (col: 3, row: 2)');
    //             return loc;
    //         case 6:
    //             loc.push(' (col: 1, row: 3)');
    //             return loc;
    //         case 7:
    //             loc.push(' (col: 2, row: 3)');
    //             return loc;
    //         case 8:
    //             loc.push(' (col: 3, row: 3)');
    //             return loc;
    //         default:
    //             return '';
    //     }
    // }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            // const desc = move ?
            //     'Go to move #' + move :
            //     'Go to game start';
            
            let desc;
            let pos;
            if(move){
                const selectedPos = this.state.history[move].selectedPos;

                switch (selectedPos){

                    case 0:
                        pos = ' - (1, 1)';
                        break;
                    case 1:
                        pos = ' - (2, 1)';
                        break;
                    case 2:
                        pos = ' - (3, 1)';
                        break;
                    case 3:
                        pos = ' - (1, 2)';
                        break;
                    case 4:
                        pos = ' - (2, 2)';
                        break;
                    case 5:
                        pos = ' - (3, 2)';
                        break;
                    case 6:
                        pos = ' - (1, 3)';
                        break;
                    case 7:
                        pos = ' - (2, 3)';
                        break;
                    case 8:
                        pos = ' - (3, 3)';
                        break;
                    default:
                        break;
                }

                desc = 'Go to move #' + move + pos;

                return (
                    <p key={move} className="game-history">
                        <button className="btn-style" onClick={() => this.jumpTo(move)}>{desc}</button>
                    </p>
                );

            }else{
                desc = 'Reset The Game';
                return (
                    <p key={move}>
                        <button className="btn-style" onClick={() => this.jumpTo(move)}>{desc}</button>
                    </p>
                );
            }
            
            // return (
            //     <li key={move}>
            //         <button onClick={() => this.jumpTo(move)}>{desc}</button>
            //     </li>
            // );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <div className="status-info">{status}</div>
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <p className="status-title"> Game Status</p>
                    <div>{moves}</div>
                </div>
            </div>
        );
    }
}


class App extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            title: 'TicTacToe in React'
        }
    }

    render(){
        return (
            <div className="Wrapper">

                <div className="header">
                    {this.state.title}
                </div>

                <div>
                    <Game />
                </div>
            </div>
        )
    }
}


function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
