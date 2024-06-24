let grid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
let moveNum = 1;
const cross = 1;
const circle = 2;
let message1 = document.getElementById("p1");
let message2 = document.getElementById("p2");

//function to handle player click
let onClick = function(event){
    const box = event.target.closest('.box');
    const index = Array.from(box.parentNode.children).indexOf(box); 
    playerMove(index+1);
    box.style.cursor = "auto";
    box.removeEventListener("click",onClick);
    displayMessage();
    if(terminal(grid)){
        //prevent player's move upon game end
        document.querySelectorAll(".box").forEach(box=>{
            box.style.cursor = "auto";
        });
        removeEventListeners();
        endGame(winner(grid));
    } 
    else{
        setTimeout(()=>{
            computerMove();
            displayMessage();
            if(terminal(grid)){
                //prevent player's move upon game end
                document.querySelectorAll(".box").forEach(box=>{
                    box.style.cursor = "auto";
                });
                removeEventListeners();
                endGame(winner(grid));
            }
        },500);  
    }
}

//function to determine the alert message on game end
function endGame(winner){
    if(winner === cross){
        alertPlayer("Player wins! Do you wish to play another game? (Y/n)");
    } 
    else if(winner === circle){
        alertPlayer("Computer wins! Do you wish to play another game? (Y/n)");
    } 
    else{
        alertPlayer("It's a draw! Do you wish to play another game? (Y/n)");
    }
}

//function to alert the player and obtain rematch input
function alertPlayer(message){
    setTimeout(()=>{
        const choice = prompt(message);
        if(choice && choice.toLowerCase() === 'y'){
            resetGrid();
            activateEventListeners();
        }
    },1000);
}

//function to activate all the box click event listeners
function activateEventListeners(){
    document.querySelectorAll(".box").forEach(box=>{
        box.addEventListener("click",onClick);
    });
}

//function to remove all the box click event listeners
function removeEventListeners(){
    document.querySelectorAll(".box").forEach(box=>{
        box.removeEventListener("click",onClick);
    });
}

//function to reset the grid on rematch
function resetGrid(){
    moveNum = 1;
    grid = [[0,0,0],[0,0,0],[0,0,0]];
    document.querySelectorAll(".box img").forEach((img)=>{
        img.style.display = "none";
    });
    document.querySelectorAll(".box").forEach((box)=>{
        box.style.cursor = "pointer";
        console.log("Done");
    });
    displayMessage();
}

//activating the event listeners on DOM load
document.addEventListener("DOMContentLoaded", () => {
    activateEventListeners();
})

//function to process a player move
function playerMove(boxNum){
    let img = document.getElementById(`cross${boxNum}`);
    grid[Math.floor((boxNum-1)/3)][(boxNum-1)%3] = cross;
    img.style.display = "inline-block";
    moveNum++;
}

//function to move on behalf of the program
function computerMove(){
    const movePair = minimax();
    console.log(movePair);
    const rowNum = movePair[0];
    const colNum = movePair[1];
    const boxNum = (3*rowNum+colNum)+1;
    let img = document.getElementById(`circle${boxNum}`);
    grid[rowNum][colNum] = circle;
    img.style.display = "inline-block";
    let box = document.getElementById(`box${boxNum}`);
    box.style.cursor = "auto";
    box.removeEventListener("click",onClick);
    moveNum++;
}

//minimax helper function
function minValue(board){
    if(terminal(board)){
        return utility(board);
    }
    
    let minVal = Infinity;
    actions(board).forEach((action)=>{
        if(maxValue(result(board,action))<minVal){
            minVal = maxValue(result(board,action));
        }
    })

    return minVal;
}

//minimax helper function
function maxValue(board){
    if(terminal(board)){
        return utility(board);
    }
    
    let maxVal = -Infinity;
    actions(board).forEach((action)=>{
        if(minValue(result(board,action))>maxVal){
            maxVal = minValue(result(board,action));
        }
    })

    return maxVal;
}

//function to determine the optimal move
function minimax(){
    const actionArray = actions(grid);
    for(let i=0;i<actionArray.length;i++){
        if(maxValue(result(grid,actionArray[i])) === minValue(grid)){
            return actionArray[i];
        }
    }
}

//function to determine the winner of the game, if present
function winner(board){
    if(checkWin(board,cross)){
        return cross;
    }
    else if(checkWin(board,circle)){
        return circle;
    }
    else{
        return null;
    }
}

//function to determine whether game has ended
function terminal(board){
    if(checkWin(board,cross) || checkWin(board,circle)){
        return true;
    }
    let isDraw = true;
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            if(board[i][j] === 0){
                isDraw = false;
            }
        }
    }
    return isDraw;
}

//function to determine the utility value of a terminal board state
function utility(board){
    if(winner(board) === cross){
        return 1;
    }
    else if(winner(board) === circle){
        return -1;
    }
    else{
        return 0;
    }
}

//function to determine the player depending on the board configuration
function player(board){
    let numNonEmpty = 0
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            if(board[i][j] !== 0){
                numNonEmpty++;
            }
        }
    }
    if(numNonEmpty%2){
        return circle;
    }
    else{
        return cross;
    }
}

//function to check whether a player has won
function checkWin(board,value){
    if((board[0][0] === value && board[1][1] === value && board[2][2] === value) || (board[0][2] === value && board[1][1] === value && board[2][0] === value) || (board[0][0] === value && board[0][1] === value && board[0][2] === value) || (board[1][0] === value && board[1][1] === value && board[1][2] === value) || (board[2][0] === value && board[2][1] === value && board[2][2] === value) || (board[0][0] === value && board[1][0] === value && board[2][0] === value) || (board[0][1] === value && board[1][1] === value && board[2][1] === value) || (board[0][2] === value && board[1][2] === value && board[2][2] === value)){
      return true;
    }
    else{
      return false;
    }
}

//fucntion to return an array consisting of all possible moves
function actions(board){
    const actionArray = [];
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            if(board[i][j] == 0){
                actionArray.push([i,j]);
            }
        }
    }

    return actionArray;
}

//function to determine the board if given action takes place
function result(board,action){
    let boardCopy = board.map(row=>[...row])
    if(board[action[0]][action[1]] != 0){
        throw Error;
    }
    else if(player(board) === cross){  //turn of player (cross)
        boardCopy[action[0]][action[1]] = cross;
    }
    else{
        boardCopy[action[0]][action[1]] = circle;
    }

    return boardCopy;
}

//alternate the messages between turns
function displayMessage(){
    if(moveNum%2){  //odd numbered move
        message1.style.color="white";
        message2.style.color="black";
    }
    else{
        message1.style.color="black";
        message2.style.color="white";
    }
}
