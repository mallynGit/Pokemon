let app = document.getElementById("app");
app.style = "border: 1px solid black; width: 90%; margin:auto;  display:flex; justify-content: space-evenly; flex-wrap:wrap;";

let nextBtn = document.getElementById("nextBtn");
let prevBtn = document.getElementById("prevBtn");

let pokemon = [];

// .then(res => res.json())
// .then(data => {
//     pokemon = data.results
//     console.log(pokemon)
// })

async function fetchPokemon(number) {
  if (number == null) {
    number = 0;
  }
  let res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=10&offset=${number * 10}`
  );
  res = await res.json();
  pokemon = res;
  return res;
}

function renderPokemon(array) {}

window.onload = async () => {
  let res = await fetchPokemon();
  pokemon = res;
  console.log(pokemon);

  nextBtn.setAttribute("href", res.next);

  let div = document.createElement("div");
  div.className = "pagination";

  for (item of pokemon.results) {
    let poke = await fetch(item.url);
    poke = await poke.json();
    console.log(item, poke);

    pokehtml = document.createElement("div");
    // pokehtml.className = "pagination";

    pokename = document.createElement("span");
    pokename.innerHTML = item.name;
    // pokename.style = "display: flex; justify-content: center;";
    pokename.className = "pagination";

    let pokeimage = document.createElement("img");
    pokeimage.src = poke.sprites.other["official-artwork"].front_default;
    pokeimage.style = "height: 15vw;";

    pokehtml.appendChild(pokeimage);
    pokehtml.appendChild(document.createElement("br"));
    pokehtml.appendChild(pokename);
    pokehtml.style = "border:1px solid black; width: 15vw;";

    div.appendChild(pokehtml);
    // app.appendChild(pokehtml);
  }
  app.append(div);
};
