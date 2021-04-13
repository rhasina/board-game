let gaulsTeam= $('#player1');
let romansTeam= $('#player2');
let result = $('#result')
let winnerImage= $('#winner_image');
let winnerName = $('#winner_name')

/* The game is over */
const gameOver= ()=>{
    // Change the UI
    boardLocation.addClass('hide');  
    $('.game-body').addClass('blue-theme');  
    result.show();

    // Display the winner details
    if(currentPlayer.id===players[0].id){
        romansTeam.addClass('hide');
        winnerImage.attr("src",'images/winnergauls.png');
        winnerName.text('Gauls Team');
    } else{
        gaulsTeam.addClass('hide');
        winnerImage.attr("src",'images/winnerromans.png');
        winnerName.text('Romans Team');
    } 
    romansBtns.remove();
	gaulsBtns.remove();
    romansTitle.removeClass('hide');
    gaulsTitle.removeClass('hide');
    
    // Play again
    $('#play').click( function(){
        window.location.reload();
    });
}

/* Change the UI to battle mode and start the fight */
const uiBattleMode = (presentPlayer) => {    
    let fadeEffect = setInterval(function () {
        if (!boardLocation.css('opacity')) {
            boardLocation.css('opacity') = 1;
        }        
        if (boardLocation.css('opacity')> 0.3) {
            boardLocation.animate({
                opacity: 0.3
             }, 1400);
        }
        else{            
            clearInterval(fadeEffect);
            if(presentPlayer.id===players[0].id){
				gaulsTeam.addClass('scale');
            }
            else{
				romansTeam.addClass('scale');
            }
            fight();
        }
    }, 100);
}

/* Battle */
const fight= ()=> {
    // Display the correct buttons for the battle
    if(currentPlayer.id===players[0].id){            
        gaulsBtns.addClass('show');
        gaulsTitle.addClass('hide');
        $('#gauls_attackBtn').addClass('attack');
        $('#gauls_defendBtn').addClass('defend');
        gaulsTeam.addClass('scale');
        }
    else{
        romansBtns.addClass('show');
        romansTitle.addClass('hide');
        $('#romans_attackBtn').addClass('attack');
        $('#romans_defendBtn').addClass('defend');
        romansTeam.addClass('scale');
    }
    let opponent ;
    let opponentLife;

    $('#main').on('click',function(event){ 
        //  The user clicks the attack button
        if($(event.target).hasClass('attack')){     
            $(event.target).removeClass('attack');
            opponent = currentPlayer.id === players[0].id? players[1] : players[0];
            opponentLife=currentPlayer.attack(opponent);
            opponent.setUiInfo();
            if(opponentLife>0){                        
                switchPlayer(currentPlayer); 
                fight();
            }                            
            else{                             
                gameOver();
            }                               
        }
        // The user clicks the defend button
        else if ($(event.target).hasClass('defend')){
            $(event.target).removeClass('defend');
            currentPlayer.defend();
            switchPlayer(currentPlayer);               
            fight();
        }                    
    
        // Update the team card of the current player on the UI
        if(currentPlayer.id===players[0].id){   
            romansBtns.removeClass('show');
            romansTitle.removeClass('hide'); 
            romansTeam.removeClass('scale');
        }   
        else{
            gaulsBtns.removeClass('show');
            gaulsTitle.removeClass('hide');
            gaulsTeam.removeClass('scale');
        }
    });
}
