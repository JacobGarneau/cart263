"use strict";

/*
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

const animals = [
  "aardvark",
  "alligator",
  "alpaca",
  "antelope",
  "ape",
  "armadillo",
  "baboon",
  "badger",
  "bat",
  "bear",
  "beaver",
  "bison",
  "boar",
  "buffalo",
  "bull",
  "camel",
  "canary",
  "capybara",
  "cat",
  "chameleon",
  "cheetah",
  "chimpanzee",
  "chinchilla",
  "chipmunk",
  "cougar",
  "cow",
  "coyote",
  "crocodile",
  "crow",
  "deer",
  "dingo",
  "dog",
  "donkey",
  "dromedary",
  "elephant",
  "elk",
  "ewe",
  "ferret",
  "finch",
  "fish",
  "fox",
  "frog",
  "gazelle",
  "gila monster",
  "giraffe",
  "gnu",
  "goat",
  "gopher",
  "gorilla",
  "grizzly bear",
  "ground hog",
  "guinea pig",
  "hamster",
  "hedgehog",
  "hippopotamus",
  "hog",
  "horse",
  "hyena",
  "ibex",
  "iguana",
  "impala",
  "jackal",
  "jaguar",
  "kangaroo",
  "koala",
  "lamb",
  "lemur",
  "leopard",
  "lion",
  "lizard",
  "llama",
  "lynx",
  "mandrill",
  "marmoset",
  "mink",
  "mole",
  "mongoose",
  "monkey",
  "moose",
  "mountain goat",
  "mouse",
  "mule",
  "muskrat",
  "mustang",
  "mynah bird",
  "newt",
  "ocelot",
  "opossum",
  "orangutan",
  "oryx",
  "otter",
  "ox",
  "panda",
  "panther",
  "parakeet",
  "parrot",
  "pig",
  "platypus",
  "polar bear",
  "porcupine",
  "porpoise",
  "prairie dog",
  "puma",
  "rabbit",
  "raccoon",
  "ram",
  "rat",
  "reindeer",
  "reptile",
  "rhinoceros",
  "salamander",
  "seal",
  "sheep",
  "shrew",
  "silver fox",
  "skunk",
  "sloth",
  "snake",
  "squirrel",
  "tapir",
  "tiger",
  "toad",
  "turtle",
  "walrus",
  "warthog",
  "weasel",
  "whale",
  "wildcat",
  "wolf",
  "wolverine",
  "wombat",
  "woodchuck",
  "yak",
  "zebra",
];
let successMessages = [
  `Congratulations!`,
  `Good job!`,
  `You're doing great!`,
  `Keep it up!`,
  `That's right!`,
];
let failureMessages = [
  `This is not the answer I was looking for...`,
  `You can do better!`,
  `You're completely wrong!`,
  `Listen closer...`,
  `My disappointment is immeasurable and my day is ruined.`,
];

let currentAnimal = ``;
let currentAnswer = ``;
let score = 0;
let mistakes = 0;
let state = `title`; // title, game, ending
let guessing = false;

/*
p5: Sets up the canvas and the annyang! library
*/
function setup() {
  createCanvas(windowWidth, windowHeight);

  if (annyang) {
    let commands = {
      "I think it is *animal": guessAnimal,
      Start: startGame,
      Next: generateAnimal,
      Reset: reset,
    };
    annyang.addCommands(commands);
    annyang.start();
  }
}

/*
p5: Draws on the canvas
*/
function draw() {
  background(0);

  if (state === `title`) {
    title();
  } else if (state === `game`) {
    game();
  } else if (state === `ending`) {
    ending();
  }
}

/*
Displays the title screen
*/
function title() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(64);
  text(
    `Guess the name of the animal\nthat is spoken backwards!`,
    width / 2,
    height / 2 - 60
  );
  textSize(40);
  text(`Say: "I think it is..."`, width / 2, height / 2 + 60);

  fill(255);
  textSize(24);
  text(`Say "START" to start the game`, width / 2, height - 120);
}

/*
Displays the game
*/
function game() {
  if (currentAnswer === currentAnimal) {
    fill(0, 255, 0);
  } else {
    fill(255, 0, 0);
  }

  textAlign(CENTER, CENTER);
  textSize(72);
  text(currentAnswer, width / 2, height / 2);

  fill(255);
  textSize(24);
  text(`Correct guesses: ${score}`, width / 2, 120);
  text(`Mistakes: ${mistakes}`, width / 2, 160);

  if (guessing) {
    text(`Click to make the voice repeat`, width / 2, height - 120);
  } else {
    if (mistakes >= 3) {
      text(`Say "NEXT" to go to the ending screen`, width / 2, height - 120);
    } else {
      text(`Say "NEXT" to move on to the next animal`, width / 2, height - 120);
    }
  }
}

/*
Displays the ending screen
*/
function ending() {
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(64);
  text(`You got ${score} animals right!`, width / 2, height / 2);

  fill(255);
  textSize(24);
  text(`Say "RESET" to return to the title screen`, width / 2, height - 120);
}

/*
Reverses the provided string
*/
function reverseString(string) {
  // Split the string into an array of characters
  let characters = string.split("");
  // Reverse the array of characters
  let reverseCharacters = characters.reverse();
  // Join the array of characters back into a string
  let result = reverseCharacters.join("");
  // Return the result
  return result;
}

/*
Handles the animal guesses
*/
function guessAnimal(animal) {
  if (guessing) {
    currentAnswer = animal.toLowerCase();
    console.log(currentAnswer);

    if (currentAnswer === currentAnimal) {
      responsiveVoice.speak(random(successMessages), "UK English Female", {
        onend: () => {
          guessing = false;
        },
      });
      score++;
    } else {
      responsiveVoice.speak(random(failureMessages), "UK English Female", {
        onend: () => {
          guessing = false;
        },
      });
      mistakes++;
    }
  }
}

/*
Picks a random animal from the list and reads its name
*/
function generateAnimal() {
  if (!guessing) {
    if (mistakes >= 3) {
      state = `ending`;
      checkHighScore();
    } else {
      currentAnswer = ``;
      currentAnimal = random(animals);
      let reverseAnimal = reverseString(currentAnimal);
      responsiveVoice.speak(reverseAnimal);
      guessing = true;
    }
  }
}

function checkHighScore() {
  let highScore = localStorage.getItem(`highScore`);
  if (highScore !== null && score > highScore) {
    localStorage.setItem(`highScore`, score);
  }
}

/*
Starts the game from the title screen
*/
function startGame() {
  state = `game`;
  generateAnimal();
}

/*
Resets the game and returns to the title screen
*/
function reset() {
  if (state === `ending`) {
    state = `title`;
    score = 0;
    mistakes = 0;
  }
}

/*
p5: Repeats the name of the current animal when clicking the mouse
*/
function mousePressed() {
  let reverseAnimal = reverseString(currentAnimal);
  responsiveVoice.speak(reverseAnimal);
}
