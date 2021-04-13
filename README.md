# Gauls versus Romans board game
OpenClassrooms Front-End Developer path project: 'Build a turn-based board game in JavaScript'.
## Introduction
   I built the game based on a confrontation between 2 teams: the Gauls and the Romans with one player each.
   
   It is inspired by *Asterix and Obelix*.
The player 1 is Asterix and the player 2 is Caesar.
## Board
- The game starts with a ten by ten board with randomly placed obstacles (20% of the board, with wall aspects), weapons (4) and players (2).
- Each player has a default weapon (sword) that inflicts 10 points of damage. 
## Movements
- Each player can move from 1 to 3 boxes either horizontally or vertically each turn, provided there is no obstacle or player in their way.
- If they pass through a box containing a weapon, they can pick it up and leave their old weapon on site.
- When the players get next to each other horizontally or vertically, the battle begins.
## Fight
- Each player has a set of buttons consisting in offensive buttons and defensive buttons.
- Each turn a player can choose to attack or to defend.
- If the player attacks, the other player loses as many life points as the damage of the weapon the attacking player is holding.
- If the player defends himself, he will sustain 50% less damage during the opponent's next attack.
- As soon as the life points of a player (initially 100) falls to 0, they lose and the game is over. A game over message appears.
## Technologies
I used the following technologies:

- HTML5 
- CSS3
- JavaScript
- jQuery
