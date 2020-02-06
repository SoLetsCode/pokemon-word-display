pokemonNameArray = [];
correctCount = 0;
errorCount = 0;

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

function getPokemons() {
  //there are 964 entries
  let pokemons = [];
  let limit = 5;
  let offset = Math.floor(Math.random() * (964 - limit - 500)); //remove 500 to get full list
  let request = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  let pokemonPromise = axios.get(request);

  pokemonPromise
    .then(response => {
      pokemons = response;
      createPokemonArray(pokemons);
      document
        .querySelector(".pokemon")
        .appendChild(createPokeHTMLList(pokemonNameArray));
    })
    .catch(error => {
      console.log(error);
    });
}

function createPokemonArray(pokemons) {
  for (let index in pokemons.data.results) {
    let pokeObj = {};
    pokeObj.name = pokemons.data.results[index].name;
    pokeObj.htmlID = createUniqueID();
    pokemonNameArray.push(pokeObj);
  }
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

function createPokeListItem(name, index) {
  let listItem = document.createElement("li");
  listItem.classList.add("pokemon__list-item");
  listItem.id = index;
  listItem.innerHTML = name;

  return listItem;
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
  pokemonNameArray = pokemonNameArray
    .slice(0, index)
    .concat(pokemonNameArray.slice(index + 1));
}

function timer() {
  let timerWidth = document.querySelector(".game-arena__timer").offsetWidth;
  let timer = document.querySelector(".game-arena__timer");
  timer.style.transition = "width 30s";
  timer.style.width = 0;
}

// code to run at startup

getPokemons();
addEventListenerForm();
document.querySelector(".game-arena__input").focus();
refreshCounter();
