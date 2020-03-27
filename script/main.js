let pokemonNameArray = [];
let pokemonMasterArray = [];
let correctCount = 0;
let errorCount = 0;
let numOfPokemon = 5; //sets the number of pokemon to be shown
let timerInSeconds = 20;

function addEventListenerPlayButton() {
  let button = document.querySelector(".play__button");
  button.addEventListener("click", () => {
    //reset counters, word field and refill timer bar etc.
    correctCount = 0;
    errorCount = 0;
    document.querySelector(".game-arena__timer").style.transition = "";
    document.querySelector(".game-arena__timer").style.width = "100%";
    document.querySelector(".pokemon").innerHTML = "";
    pokemonNameArray = [];
    document.querySelector(".game-arena__input").value = "";

    getPokemons();
    refreshCounter();
    document.querySelector(".game-arena__input").removeAttribute("disabled");
    document.querySelector(".game-arena__input").focus();
    button.style.display = "none";
  });
}

function addEventListenerForm() {
  let form = document.querySelector(".game-arena__input-form");
  form.addEventListener("submit", event => {
    event.preventDefault();

    let index = pokemonNameArray.findIndex(object => {
      return object.name === event.target.usertext.value;
    });

    if (index === -1) {
      errorCount++;
    } else {
      correctCount++;
      removeItem(
        index,
        document.querySelector(".pokemon__list").childNodes[index].id
      );
      pokemonNameArray = fillPokeNameArray(numOfPokemon, pokemonNameArray);
      document
        .querySelector(".pokemon__list")
        .appendChild(
          createPokeListItem(
            pokemonNameArray[pokemonNameArray.length - 1].name,
            pokemonNameArray[pokemonNameArray.length - 1].htmlID
          )
        );
    }

    refreshCounter();
    event.target.reset();
  });
}

function createUniqueID() {
  let id = "";
  id = id + Date.now().toString();
  id =
    id +
    Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substr(0, 10);

  return id;
}

function createPokemonArray(pokemons) {
  let tempPokeArray = [];

  for (let index in pokemons.data.results) {
    let pokeObj = {};
    pokeObj.name = pokemons.data.results[index].name;
    pokeObj.htmlID = createUniqueID();
    tempPokeArray.push(pokeObj);
  }

  return tempPokeArray;
}

function getPokemons() {
  //there are 964 entries
  let pokemons = [];
  let limit = 50;
  let offset = Math.floor(Math.random() * (964 - limit - 500)); //remove 500 to get full list
  let request = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  let pokemonPromise = axios.get(request);

  pokemonPromise
    .then(response => {
      pokemons = response;
      pokemonMasterArray = createPokemonArray(pokemons);
      pokemonNameArray = fillPokeNameArray(numOfPokemon, pokemonNameArray); //alter this number to change list length
      document
        .querySelector(".pokemon")
        .appendChild(createPokeHTMLList(pokemonNameArray));
      timer(timerInSeconds);
    })
    .catch(error => {
      console.log(error);
    });
}

function createPokeHTMLList(pokeArray) {
  let list = document.createElement("ul");
  list.classList.add("pokemon__list");

  for (let index in pokeArray) {
    list.appendChild(
      createPokeListItem(pokeArray[index].name, pokeArray[index].htmlID)
    );
  }

  return list;
}

function createPokeListItem(name, id) {
  let listItem = document.createElement("li");
  listItem.classList.add("pokemon__list-item");
  listItem.id = id;
  listItem.innerHTML = name;

  return listItem;
}

function fillPokeNameArray(number, pokemonNameArray) {
  //number is how much to fill the array to provided there are items left in masterArray
  let tempPokeArray = pokemonNameArray;
  while (tempPokeArray.length < number && pokemonMasterArray.length > 0) {
    let randomNum = Math.floor(Math.random() * (pokemonMasterArray.length - 1));
    tempPokeArray.push(pokemonMasterArray[randomNum]);
    pokemonMasterArray.splice(randomNum, 1);
  }

  return tempPokeArray;
}

function refreshCounter() {
  document.querySelector(
    ".game-arena__correct-score"
  ).innerHTML = `Correct: ${correctCount}`;
  document.querySelector(
    ".game-arena__error-score"
  ).innerHTML = `Error: ${errorCount}`;
}

function removeItem(index, id) {
  document.getElementById(id).remove();
  pokemonNameArray.splice(index, 1);
}

function timer(seconds) {
  let timer = document.querySelector(".game-arena__timer");
  timer.style.transition = `width ${seconds}s`;
  timer.style.width = 0;

  setTimeout(() => {
    console.log("GAME OVER!");
    document.querySelector(".game-arena__input").setAttribute("disabled", true);
    document.querySelector(".play__button").style.display = "inline-block";
  }, seconds * 1000);
}

// code to run at startup

addEventListenerForm();
addEventListenerPlayButton();
