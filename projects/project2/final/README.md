# Project 2 - Anything

## Artist Statement

This statement should succinctly explain your artistic vision, the desired user experience, and how you believe you accomplished this both technically and artistically.

_Phoenix of the Arctic_ is a single-player exploration and survival game. In it, the player controls the **Phoenix**, a legendary fire bird that got lost in the Arctic and must now free it from the **Spirits** that haunt the region.

The idea for this project was to create a game that played with the idea of being lost in the cold and having to find a way through a randomly generated world, all while struggling for survival. I wanted the player to feel as lost as their character. I tried to create a game experience that focused simultaneously on resource management, world exploration, and combat. With the game being about a phoenix, I also wanted death and resurrection to play a big part in it by including them as mechanics and putting a twist on the classic idea of getting a game over when the character runs out of health.

When I was showing the game to other people so they could test it, the feedback I received was very positive. Based on what I learned from it and my own experience, I think the movement and combat system are satisfying and reflect the idea that the character being controlled is a bird in flight well. I am also satisfied with the progression aspect of the game and think I have succeeded in designing interesting abilities that feel worth obtaining. On the programming side of things, I am glad to say that I have succeeded in adding game-save functionality by integrating JSON data and the localStorage into a p5-based project. The JSON data also helped with managing the large amount of information that were required to handle the player's attacks, their ability progression and the terrain generation.

## How to Play

### Objective

To beat the game, the player will have to find all five **Shrines** and defeat the **Great Spirit** at each one of them. Each Shrine is located in one of the four quadrants of the map. Once this is done, the final boss will appear at the first Shrine (the one the player started the game at). Defeating it will complete the game.

### Controlling the Phoenix

The **Phoenix** can be controlled with the W, A, S, and D keys for movement. It will never completely stop once it has started moving and can only turn to change direction. As the player progresses in the game, they will unlock new abilities. The controls for these abilities will be indicated next to their icon in the UI.

### Health and Warmth

The player two gauges to manage while playing the game: **Health** and **Warmth**. Health is lost by getting hit by Spirits' attacks. Hunting small game and fish will restore Health. Warmth is lost over time because of the extreme cold of the environment or can be spent to use certain abilities. In that case, a marker will be displayed on the Warmth gauge to indicate the minimum amount required to use the ability. To regain Warmth, the player will have to either attack Spirits or stay at a tile where there is a Shrine whose Great Spirit has already been defeated.

If the player's Health reaches 0, they die. What happens next depends on the amount of Warmth they had at the moment of their death. If the Warmth gauge was completely empty, the death is definitive and the game is over. However, if the player still had some Warmth left, they will be able to respawn at the last Shrine they visited with the progress they had at that moment.

### Fighting Spirits

When the player is fighting a Spirit, colored circles will appear. They indicate the range at which the Spirit's various abilities will be triggered:

- Standing inside the red circle for too long will make the Spirit perform a melee attack on the player. This attack is unavoidable.
- Standing outside the green circle for too long will make the Spirit shoot a projectile at the player. This projectile will curve its trajectory to follow the player but will disappear after a short while.
- Standing outside the blue circle (only active on the final boss) for too long will make the boss summon another Spirit that will also try to attack the player.

### Shrines and Saving the Game

When a **Great Spirit** is defeated, the Shrine it haunted is activated. To visit the Shrine, the player must press the spacebar while near to it. This will save the game and bring up the ability purchase menu. This menu can be navigated with the mouse. Pressing the escape key or hitting the spacebar again will close the menu.

While there is active save data, the title screen will display the option to resume the game at the last Shrine visited. Starting a new game in these conditions will erase all current save data.

### Abilities and Sun Points

The player will start off with a single ability: a basic peck attack. As they defeat Spirits, they will gain **Sun Points**, which are a currency that can be exchanged at Shrines in order to unlock new abilities. Each ability has its own cost and prerequisites that the player must meet before purchasing it, which are shown by the small sun icon next to it and the white lines that connect all of the abilities. Hovering on an ability in the purchase menu will display its name and bring up a short description of what it does.

### Biomes

The various biomes are mostly for aesthetic purposes, but there are some slight mechanical differences. While the player is in the **Sea** biome, they will lose Warmth much faster. However, the fish that can be found there will restore larger quantities of Health other types of game.

### Optimal Resolution

The game is optimized for a screen resolution of 1920 x 1080 pixels. Other resolutions may possibly experience some minor issues with displaying the elements (mountains, trees, glaciers, and lakes) on the map.

## Attribution

All icons were taken from **FontAwesome** (fontawesome.com) under Creative Commons license.

All sound effects were taken from **Freesound** (freesound.org) under Creative Commons license. Here are the users credited for each of the sound effects:

dash: user **InspectorJ**
fireBreath: user **qubodup**
flameNova: user **midimagician**
wingAttack: user **AgentDD**
minimap: user **partheeban**
shrineDefeated: user **BOSS MUSIC**
abilityPurchased: user **InspectorJ**
chimes: user **InspectorJ**
peck: user **oldhiccup**
summon: user **chrisw92**
spiritDefeat: user **HorrorAudio**
rotateHum: user **kaboose102**
spiritDamage: user **ash_rez**
spiritHit: user **qubodup**
spiritShoot: user **Leszek_Szary**
death: user **PhonosUPF**
menu: user **broumbroum**
spawn: user **broumbroum**
tick: user **Snapper4298**
wind: user **InspectorJ**
rabbitDamage: user **JoseAgudelo**
fishDamage: user **CGEffex**
