var gameBoard;
const player = "O";
const computer = "X";
const winCombo =
    [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,4,8],
        [6,4,2],
        [1,4,7],
        [2,5,8],
        [0,3,6]
    ];
const cells_td = document.querySelectorAll(".cells");
const endGame_button = document.querySelector(".endgame");
const endGame_text = document.querySelector(".endgame .text");
let playerScore = 1;
let compScore = 1;
const playerScore_span = document.getElementById("user-score");
const compScore_span = document.getElementById("comp-score");


startGame();

function startGame(){
    endGame_button.style.display = "none";//El estilo ya esta definido en none, pero cada vez que se reinicie el juego, el valor cambiara
    gameBoard = Array.from(Array(9).keys());//Se genera un arreglo con una clave, en este caso de 0 a 8

    /*
        El for recorre el largo que tiene cells_td, que en este caso serian 9 elementos, los cuales se limpian cuando hay un reseteo,
        se remueve el color que tiene cuando un usuario gana y se le agrega un evento al hacer click, que nos permite
        ejecutar una función.
    */
    for (let i = 0; i < cells_td.length; i++) {
        cells_td[i].innerHTML = "";
        cells_td[i].style.removeProperty("background-color");
        cells_td[i].addEventListener('click', cellClick);
        cells_td[i].className = "cells";
    }
}

function cellClick(result){
    if (typeof gameBoard[result.target.id] == 'number') { //Si el tipo que se encuentra en el array es un number, entonces se puede jugar
        letsPlay(result.target.id, player); //ejecutamos una nueva funcion, y le pasamos por parametro la id y el jugador
        
        if (!checkWin(gameBoard,player) && !checkGameBoard()) letsPlay(computerChoice(), computer);
    }
}


function letsPlay(option, player){
    gameBoard[option] = player; //seteamos los valores por el jugador
    document.getElementById(option).innerHTML = player;
    let gameWon = checkWin(gameBoard, player);
    if (gameWon) gameOver(gameWon);
}


function checkGameBoard(){
    if (checkEmptyCells().length == 0) {
        for (let i = 0; i < gameBoard.length; i++) {
            cells_td[i].style.backgroundColor = '#2E4756';
            cells_td[i].removeEventListener('click', cellClick);
            cells_td[i].className = "gameDraw";
        }
        winnerMessege("¡Draw!");
        return true;
    }
    return false;
}

function winnerMessege(winner){
    endGame_button.style.display = "block";
    endGame_text.innerHTML = winner;
}

function computerChoice(){
    return checkEmptyCells()[0]; //nos retorna el primer valor del arreglo que encuentra esa función
}

function checkEmptyCells(){
    return gameBoard.filter(e => typeof e == 'number');
}

function checkWin(board, player){
    /*
        Se recorre el arreglo del juego, en caso de que el elemento sea igual a player, se concatena con el index del arreglo,
        en caso de que el elemento no sea igual a player no se concatena nada.
    */
    let put = board.reduce((acc,e,i) => //La funcion reduce nos sirve para generar un arreglo nuevo, por lo que la variable
                                        //put pasaria a ser rellanado con un array, en base al index del arreglo
    (e === player) ? acc.concat(i) : acc, []);
    let gameWon = null;
    for (const [index, result] of winCombo.entries()) { //Se rescata el index y los valores para ganar del arreglo winCombo
        /*
            Por cada elemento que se encuentra en result, en este caso [0,1,2],
            se verficiara si la variable put tiene un valor mayor a 0, para eso nos sirve indexOf.
            Encuentra el primer valor que sea mayor a -1. De esta manera se determina si el jugador
            hizo click en las casillas en las que puede ganar.
        */
        if (result.every(elem => put.indexOf(elem) > -1)) { 
            gameWon = {index : index, player : player}; //con esta variable sabemos, cual es el index del combo con el que se gano y el player.
            break;
        }
    }
    return gameWon;
}

function gameOver(game){
    for (const index of winCombo[game.index]) {
        document.getElementById(index).className = 
            game.player == player ? 'gameWin' : 'gameLose';
    }

    for (let i = 0; i < cells_td.length; i++) {
        cells_td[i].removeEventListener('click', cellClick);
    }

    winnerMessege(game.player == player ? "¡You win!" : "¡You lose!");
    getScore(game.player);
}

function getScore(playerWon){
    return playerWon == player ?  playerScore_span.innerHTML = playerScore++ : compScore_span.innerHTML = compScore++; 
}



