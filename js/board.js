let boardLocation = $('#gameBoard');
let boxState= ['empty','occupied'];
let boxContent=['obstacle','weapon','player'];
let gameBoard;

/* Board
------------------------------------------------------------- */
class Board {
    constructor(cols,rows){
        this.numberOfCols=cols;
        this.numberOfRows=rows;
        this.boxes=[];
        this.createBoard();
    }

    /* Create the board */
    createBoard (){
        let tableElt=document.createElement('table');
        for (let i = 0; i < this.numberOfRows; i++){   
            let rowElt= document.createElement('tr');
            rowElt.className = 'row';  
            this.boxes.push([]);   
            for (let j = 0; j < this.numberOfCols; j++){            
                let boxElt = document.createElement('td');
                this.boxes[i][j]= new Box('line-'+ (Number(i)+1) + '-' + Number(j+1),'box',boxState[0],{x: j, y:i},null,null,null);
                boxElt.id=this.boxes[i][j].id;
                boxElt.className=this.boxes[i][j].boxClass;
                rowElt.append(boxElt);
            }
           tableElt.append(rowElt);
        } 
        boardLocation.append(tableElt)  ;
    }

    /* Generate x different random numbers from 0 to the length of the array*/
    generateRandomNumbers (array, number){
        let randomNbArray= new Array();
        while(randomNbArray.length < number){
            let random = Math.floor(Math.random() * array.length);
            if(randomNbArray.indexOf(random)==-1) {
                randomNbArray.push(random);
            }
        }
        return randomNbArray;
    }
    
    /* Get empty boxes */
    getEmptyBoxes() {
        let emptyBoxes=new Array();
        for (let i=0; i<this.numberOfRows;i++){
            for(let j=0;j<this.numberOfCols;j++){
                if (this.boxes[i][j].isEmpty()){
                    emptyBoxes.push(this.boxes[i][j]);
                }
            }   
        }
        return emptyBoxes;
    }
    
    /* Get x random empty boxes */
    getRandomBoxes (digit){
        let emptyBoxes=this.getEmptyBoxes();
        let randomNbArray = this.generateRandomNumbers(emptyBoxes,digit);    
        let randomBoxes= new Array();    
        for (let i=0;i<randomNbArray.length;i++){
            let index=randomNbArray[i];
            randomBoxes.push(emptyBoxes[index]);}
        return randomBoxes;
    }
    
    /* Get box object by td's id */
    getBoxByTdEltId(boxEltId){
        for (let i = 0; i < this.numberOfRows; i++){              
            for (let j = 0; j < this.numberOfCols; j++){ 
                if (this.boxes[i][j].id===boxEltId){
                    return this.boxes[i][j];
                }
            }
        }
    }

    /* Create x obstacle(s), min:7 and max:25 */
    createObstacle (digit) {   
        if (digit<7){
            digit=7;
        }
        else if (digit>25){
            digit=25;
        }         
        let randomBoxes=this.getRandomBoxes(digit);
        for (let i=0; i< randomBoxes.length;i++){
            randomBoxes[i].setBoxProperties(boxState[1],boxContent[0]);
            randomBoxes[i].createImage('images/wall.png');
        }
    }

    /* Place x weapon(s) on the board */
     placeWeapon ()  {
        let randomBoxes= this.getRandomBoxes(4);
        for (let i=0;i<randomBoxes.length;i++){
            randomBoxes[i].setBoxProperties(boxState[1],boxContent[1],weapons[i].id);
            randomBoxes[i].createImage(weapons[i].image);
        }
    }
    
    /* Place x player(s) on the board */
    placePlayer(){
        let randomBoxes = this.getRandomBoxes(2);
        while(this.isClose(randomBoxes[0],randomBoxes[1])){
            randomBoxes=this.getRandomBoxes(2);
        }
        for (let i=0;i<randomBoxes.length;i++){
            randomBoxes[i].setBoxProperties(boxState[1],boxContent[2],players[i].id);
            players[i].setPosition(randomBoxes[i].position.x , randomBoxes[i].position.y);
            randomBoxes[i].createImage(players[i].image);
        }
    }

    /* Check if 2 boxes are adjacent */
    isAdjacent (box1, box2) {
        if(box1.position.x === box2.position.x && Math.abs(box1.position.y - box2.position.y) <2 || box1.position.y === box2.position.y && Math.abs(box1.position.x - box2.position.x)<2){
            return true;
        }
        else{
            return false;
        }
    }
    
    /* Check if 2 boxes are close to each other */
    isClose (box1, box2) {
        if(this.isAdjacent(box1,box2) || Math.abs(box1.position.x - box2.position.x) <2 && Math.abs(box1.position.y - box2.position.y)<2){
            return true;
        }
        else{
            return false;
        }
    }

    /* Check if a position is valid */
    isValidPosition(x,y){
        let valid = x>=0 && x<this.numberOfCols && y>=0 && y<this.numberOfRows;
        return valid  
    }

    /* Get an object box given the coordonates */
    getBox(x,y){
        return this.boxes[y][x];
    }
}

/* Box
------------------------------------------------------------- */
class Box {
    constructor(id,boxClass,state,position,content,contentId,weaponId) {
      this.id = id;
      this.boxClass=boxClass;
      this.state=state;
      this.position= position;
      this.content=content;
      this.contentId=contentId;
      this.trackedWeaponId=weaponId;
    }

    /* Create an image inside a box */
    createImage (imageUrl){
        let imgElt=document.createElement('img');
        imgElt.src= imageUrl;  
        $('#' + this.id).html(' ');
        $('#' + this.id).append(imgElt);
    }

    /* Check if a box is empty */
    isEmpty(){
        return this.state===boxState[0];
    }

    /* Check if a box contains an obstacle*/
    isObstacle(){
        return this.content===boxContent[0];
    }

    /* Check if a box contains a player */
    isPlayer(){
        return this.content===boxContent[2];
    }

    /* Check if a box contains a weapon */
    isWeapon(){
        return this.content===boxContent[1];
    } 
        
    /* Add a highlight class to the td element relative to a box */
    highlightBox () {
        $('#' + this.id).addClass("highlight");
        }
    
    /* Remove the 'highlight' class to the td element relative to a box */
    removeHighlightBox (){
       $('#' + this.id).removeClass("highlight");
    }

    /* Update the state, content, contentId, trackedWeaponId properties of a box */
    setBoxProperties(state,content,contentId=null,trackedWeaponId=null){
        this.state=state;
        this.content=content;
        this.contentId=contentId;
        this.trackedWeaponId=trackedWeaponId;
    }
}

/* Weapon
------------------------------------------------------------- */
class Weapon {
    constructor(id,name,damage,image) {
        this.id=id;
        this.name = name;
        this.damage=damage;
        this.image=image;
    }
}

/* Player
------------------------------------------------------------- */
class Player {
    constructor(id,name,weapon,life,image,position) {
        this.id=id;
        this.name = name;
        this.weapon=weapon;
        this.life=life;
        this.image=image;
        this.position=position;
        this.defense=false
    }

    /* Get a game object by id */
    getObjectById (id,array) {
        for (let i=0;i<array.length;i++){
            if (array[i].id===id){
                return array[i];
            }
        }
    }

    /* Update the position */
    setPosition(x,y){
        this.position={x:x,y:y};
    }
    
    /* Update the weapon */
    setWeapon(newWeapon){
        this.weapon=newWeapon;
    }

    // Update UI infos 
    setUiInfo (){
        if (this.id===players[0].id){
            let gaulsLife=$('#gauls_life');
            let gaulssWeapon=$('#gauls_weapon');
            let gaulsWeaponDamage=$('#gauls_weaponDamage'); 
            gaulsLife.html(this.life);           
            gaulssWeapon.html(this.getObjectById(this.weapon,weapons).name);
            gaulsWeaponDamage.html(this.getObjectById(this.weapon,weapons).damage);            
        }
        else{
            let romansLife=$('#romans_life');
            let romansWeapon=$('#romans_weapon');
            let romansWeaponDamage=$('#romans_weaponDamage');  
            romansLife.html(this.life);          
            romansWeapon.html(this.getObjectById(this.weapon,weapons).name);    
            romansWeaponDamage.html(this.getObjectById(this.weapon,weapons).damage);            
        }    
    }

    // A player attacks a player
    attack(opponent){ 
        let damage=this.getObjectById(this.weapon,weapons).damage; 
        if (opponent.defense===true)   
        {
            opponent.life = opponent.life -damage/2;
            opponent.defense=false;
        } 
        else{   
            opponent.life = opponent.life -damage;
        }
        return opponent.life;
    }

    // A player defends himself
    defend (){
        this.defense=true;
        return this.defense;
    }
}

// Create array of  weapons
let weapons=[
    new Weapon('weapon1','sword', 10,'images/sword.png'),
    new Weapon('weapon2','shield',15,'images/shield.png'),
    new Weapon('weapon3','catapult',20,'images/catapult.png'),
    new Weapon('weapon4','magic potion',30,'images/magicpotion.png')
];

// Create array of  players
let players = [
    new Player('player1','Astérix',weapons[0].id,100,'images/asterix.png',{x:null,y:null}),
    new Player('player2','Caezar',weapons[0].id,100,'images/caezar.png',{x:null,y:null})
];

/* Game instructions
------------------------------------------------------------- */
$('#modalOpenBtn').on('click', function () {
    $('.modal').show();
    closeModalOnOutsideClick();
});

$('#modalCloseBtn').on('click', function () {
    $('.modal').hide();
});

function closeModalOnOutsideClick() {
    $('.modal').on('click', function () {
        $('.modal').hide();
    });
};

// The user clicks on the modal content
$(".modal-content").click(function (event) {
    event.stopPropagation();
});

/* Start the game
------------------------------------------------------------- */
const startGame = () =>{
    gameBoard=new Board(10,10);
    gameBoard.createObstacle(20);
    gameBoard.placeWeapon();
    gameBoard.placePlayer();   
}

startGame();