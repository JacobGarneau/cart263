# Artist's Statement

_The Truman Game_ is a turn-based survival game based on the movie _The Truman Show_, in which the main character (Truman Burbank) is unknowingly also the main character of a television show that has been airing 24/7 since his birth. In this game, you play the part of the show's producer and must make sure that Truman does not realize that his entire life is staged, that the show's budget remains stable, and that the show gets high enough TV ratings to allow for it to continue airing. It is impossible to win the game: the best one can do is to survive for a very long time and beat the previous high score.

The game is presented in the form of a map of the "city" in which Truman lives, divided in seven sectors. A red marker moving from sector to sector represents Truman's position and allows the player to keep track of where he is and where he might go next (Truman will always only move to a sector that is adjacent to the one he is currently in).

The game's interface contains three gauges: a Doubt meter, representing how much Truman doubts the reality of his environment (DBT, from 0% to 100%), an amount of Funds used to cover the show's expenses (in dollars), and a Ratings graph that show how many people are watching at any given moment (RTG, from 0 to 1000). Every turn, the player has to choose between one of two possible actions with the 1 and 2 keys. Each action has different effects on two of the three resources. To survive, the player must manage to maintain some balance between the resources so that none reaches catastrophic levels. Every action the player chooses also increases the day counter by 1. The goal of the game is for the show to last as many days as possible.

Occasionally, an alert will pop up in one of the sectors of the city, representing an equipment deficiency. If Truman enters that sector while the alert is still active, the Doubt meter will go up by a rather large amount. The player can spend funds with the F key to fix all active alerts at once.

## Attribution

**_Code_**

The code for the drawCompositeText function was inspired by an answer from user **Rabbid76** on StackOverflow (https://stackoverflow.com/questions/52614829/p5-js-change-text-color-in-for-a-single-word-in-a-sentence).

**_Music_**

The music used while the game is being played is the track _Wehrmut_ by **Godmode**, from the YouTube Audio Library (https://studio.youtube.com/channel/UCZst6PCRIuC1POlh0uY40zA/music).

**_Sound effects_**

All sound effects were taken from Freesound (https://freesound.org/).

- Alert: user **jobro**
- Select: user **pumodi**
- Game over: user **Euphrosyyn**
- Action: user **Fupicat**
