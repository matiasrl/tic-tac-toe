var gameBoard;
const player = "O";
const computer = "X";
const winCombo =
    [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [6, 4, 2]
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


function letsPlay(option, players){
    gameBoard[option] = players; //seteamos los valores por el jugador
    document.getElementById(option).innerHTML = players;
    let gameWon = checkWin(gameBoard, players);
    if (gameWon) gameOver(gameWon);
}


function checkGameBoard(){
    if (checkEmptyCells().length == 0) {
        for (let i = 0; i < gameBoard.length; i++) {
            cells_td[i].style.backgroundColor = '#2E4756';
            cells_td[i].removeEventListener('click', cellClick);
            cells_td[i].className = "gameDraw";
        }
        winnerMessege("¡Tie!");
        return true;
    }
    return false;
}

function winnerMessege(winner){
    endGame_button.style.display = "block";
    endGame_text.innerHTML = winner;
}

function computerChoice(){
    //return checkEmptyCells()[0]; //nos retorna el primer valor del arreglo que encuentra esa función
    //Minimax Algorithm, nos sirve para que la el nivel de IA sea más complejo y el usuario no pueda ganar nunca.
    return miniMax(gameBoard, computer).index;
}


function miniMax(newBoard, players){
    var availCells = checkEmptyCells(); //Seteamos una variable con las celdas que no han sido jugadas
 
    if (checkWin(newBoard, player)) {
        return {score: -10}; //Si el humano gana con esa posición se retorna un score de -10
    }else if(checkWin(newBoard, computer)) {
        return {score: 10}; //Si la AI gana se retorna un score de +10
    }else if(availCells.length === 0) {
        return {score: 0}; //Si hay un empate se retorna un score de 0
    } 

    var moves = [];

    for (var i = 0; i < availCells.length; i++) {
        var move = {};
        move.index = newBoard[availCells[i]];//Le seteamos el index con la celda que no ha sido seleccionada
        newBoard[availCells[i]] = players; //seteamos la celda con el player, en este caso usuario o computadora.
        
        if (players == computer) {
            var result = miniMax(newBoard, player);
            move.score = result.score;
        }
        else{
            var result = miniMax(newBoard, computer);
            move.score = result.score;
        }

        newBoard[availCells[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if (players == computer) {
        var bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    else {
        var bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}



function checkEmptyCells(){
    return gameBoard.filter(e => typeof e == 'number');//Realiza un filtro al arreglo para saber si los datos son de tipo number
}

function checkWin(board, player){
    /*
        Se recorre el arreglo del juego, en caso de que el elemento sea igual a player, se concatena con el index del arreglo,
        en caso de que el elemento no sea igual a player no se concatena nada.
    */
    
    let put = board.reduce((acc,e,i) => //La funcion reduce nos sirve para generar un arreglo nuevo, por lo que la variable
                                        //put pasaria a ser rellanado con un array, en base al index del arreglo
    (e == player) ? acc.concat(i) : acc, []);
    let gameWon = null;
    for (let [index, result] of winCombo.entries()) { //Se rescata el index y los valores para ganar del arreglo winCombo
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
    for (let index of winCombo[game.index]) {
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

function restartScore(){
    playerScore = 1;
    compScore = 1;
    playerScore_span.innerHTML = 0;
    compScore_span.innerHTML = 0;
}



