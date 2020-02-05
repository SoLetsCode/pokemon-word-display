pokemonNameArray = [];
correctCount = 0;
errorCount = 0;

function addEventListenerForm() {
  let form = document.querySelector(".game-arena__input-form");
  form.addEventListener("submit", event => {
    event.preventDefault();

    let indexID = pokemonNameArray.findIndex(name => {
      return name === event.target.usertext.value;
    });

    indexID === -1 ? errorCount++ : correctCount++;

    refreshCounter();
    event.target.reset();
  });
}

function getPokemons() {
  //there are 964 entries
  let pokemons = [];
  let limit = 5;
  let offset = Math.floor(Math.random() * (964 - limit));
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
    pokemonNameArray.push(pokemons.data.results[index].name);
  }
}

function createPokeHTMLList(pokeArray) {
  let list = document.createElement("ul");
  list.classList.add("pokemon__list");

  for (let index in pokeArray) {
    list.appendChild(createPokeListItem(pokeArray[index], index));
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
  ).innerHTML = `Correct: ${errorCount}`;
}

// code to run at startup

getPokemons();
addEventListenerForm();
document.querySelector(".game-arena__input").focus();
refreshCounter();
