let allowedMovement=[];
let currentPlayer=players[0];
let moveLimit = 3;
let gaulsBtns= $('#gaulsBtns');
let gaulsTitle=$('#player1 .team-name');
let romansBtns= $('#romansBtns');
let romansTitle=$('#player2 .team-name');

/* Get an objet by id from an array of object */
function getObjectById (id,array) {
    for (let i=0;i<array.length;i++){
        if (array[i].id===id){
            return array[i];
        }
    }
}

/* Get Horizontal allowed movements, direction: left (-1) , right(1)*/
const getHorizontalMovements=(position,direction) =>{
    let x=position.x;
    let y=position.y;
    for (let i=1; i< moveLimit+1;i++){
        if(gameBoard.isValidPosition(x+ i*Number(direction),y) && !gameBoard.getBox(x+i*Number(direction),y).isObstacle() && !gameBoard.getBox(x+i*Number(direction),y).isPlayer()){
            allowedMovement.push(gameBoard.boxes[y][x+i*direction]);
        }
        else{
            break;
        }
    }
}

/* Get vertical allowed movements, direction: up(-1) , down(1)*/
const getVerticalMovements=(position,direction)=>{
    let x=position.x;
    let y=position.y;
    for (let i=1; i<moveLimit+1;i++){
        if(gameBoard.isValidPosition(x,y + i*direction) && !gameBoard.getBox(x,y + i*direction).isObstacle() && !gameBoard.getBox(x,y + i*direction).isPlayer() ){
            allowedMovement.push(gameBoard.boxes[y + i*direction][x]);
        }
        else{
            break;
        }
    }
}

/* Get allowed boxes to move and highlight them */
const getBoxesToMove = (player)=>{      
    allowedMovement=[];
    let position= player.position;
    getHorizontalMovements(position,1);
    getHorizontalMovements(position,-1);
    getVerticalMovements(position,1);
    getVerticalMovements(position,-1);
    allowedMovement.forEach( element => {element.highlightBox()});     
}

/* Move the player */
function moveHandler(player,destinationBox) {
    // Remove the hightlight class from the previous allowed movements
    removeHighlightBoxes();
    
    //Get the box of the player
    let playerBox=gameBoard.getBox(player.position.x,player.position.y);

    //Remove player from old box
    playerBox.setBoxProperties(boxState[0],null,null,playerBox.trackedWeaponId);
    
    //Replace the weapon  with the new one if there is any
    let lastWeaponInBox=null;
    if (detectWeapon(player.position,destinationBox.position)) {
        replaceWeapon(player,destinationBox.position);
        lastWeaponInBox=destinationBox.trackedWeaponId;
    }
    
    //Set the new position of the player    
    player.setPosition(destinationBox.position.x,destinationBox.position.y);
    
    //Update the box with the player
    destinationBox.setBoxProperties(boxState[1],boxContent[2],player.id,lastWeaponInBox);    
    $('#' + playerBox.id).html(' ');
    destinationBox.createImage(player.image);  

    // Leave the old weapon of the player on the box when the player leave the box
    if (playerBox.trackedWeaponId!==null && !playerBox.isPlayer()){
        playerBox.createImage(getObjectById(playerBox.trackedWeaponId,weapons).image);
        playerBox.setBoxProperties(boxState[1],boxContent[1],playerBox.trackedWeaponId,null);
    }

    //Switch player
    switchPlayer(player);  
    
    /* Check if the players are allowed to fight */
    if(gameBoard.isAdjacent(destinationBox,gameBoard.getBox(currentPlayer.position.x,currentPlayer.position.y))) {
        uiBattleMode(currentPlayer);
    }
    else {         
        getBoxesToMove(currentPlayer);    
        movePlayer();
    }
}

/* Remove hightlight class from allowed movements*/
const removeHighlightBoxes = () =>{    
    allowedMovement.forEach((box) => {
         box.removeHighlightBox ();
    });    
}

/* Move the player when a box is clicked */
const movePlayer = () =>{    
    boardLocation.one('click', '.highlight',function(event){        
        let destinationBox= gameBoard.getBoxByTdEltId(event.target.id);
        moveHandler(currentPlayer,destinationBox);                      
    });    
}

// Switch the turn of the players
const switchPlayer = (player) => {    
    $('#' + player.id).removeClass('turn');
    currentPlayer=player.id === players[0].id ? players[1] : players[0];
    $('#' + currentPlayer.id).addClass('turn');
    return currentPlayer;
}

/* Detect the weapon between 2 positions (newPosition included) and return the box*/
const detectWeapon =(oldPosition,newPosition)=>{
    let distanceX=Number(oldPosition.x)-Number(newPosition.x);
    let distanceY=Number(oldPosition.y)-Number(newPosition.y);
    let firstIndex,secondIndex,difference;  
	let weaponBoxes=[];
    if (distanceX===0){
        difference=distanceY;
        secondIndex=oldPosition.x;
    }
    else if(distanceY===0){
        difference=distanceX;
        firstIndex=oldPosition.y;
    }
    for (let i=1; i<Math.abs(difference)+1; i++){
        if (distanceX===0 && distanceY>0  ){
            firstIndex=oldPosition.y - i;            
        }
        else if(distanceX===0 && distanceY<0){
            firstIndex=oldPosition.y + i
        }  
        else if(distanceY===0 && distanceX>0){
            secondIndex=oldPosition.x -i
        }
        else if(distanceY===0 && distanceX<0 ){
            secondIndex=oldPosition.x + i;
        }              
        if (gameBoard.boxes[firstIndex][secondIndex].isWeapon()){
            weaponBoxes.push(gameBoard.boxes[firstIndex][secondIndex]);
        }
    }
	return weaponBoxes;
}

/* Replace the weapon with the new one and leave the current weapon on site */
const replaceWeapon = (player,newPosition)=>{
    let weaponBoxes = detectWeapon(player.position,newPosition);
    let oldWeapon, newWeapon;
    weaponBoxes.forEach( weaponBox =>{
        oldWeapon=player.weapon;
        newWeapon=weaponBox.contentId;

        // Leave the player's weapon on the box
        weaponBox.contentId=oldWeapon;
        if(weaponBox.position.x===newPosition.x && weaponBox.position.y===newPosition.y){
            weaponBox.trackedWeaponId=oldWeapon;
        }
        weaponBox.createImage(getObjectById(weaponBox.contentId,weapons).image); 

        // Replace the player's weapon
        player.setWeapon(newWeapon);
    });
    player.setUiInfo();
}

const game = () => {
    players[0].setUiInfo();
    players[1].setUiInfo();
    $('#' + currentPlayer.id).addClass('turn');
    getBoxesToMove(currentPlayer);
    movePlayer();
}

game();

