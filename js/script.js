let app = document.getElementById("app");
// app.style = "border: 1px solid black; width: 90%; margin:auto;  display:flex; justify-content: space-evenly; flex-wrap:wrap;";

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

async function renderPokemon(array) {
    app.innerHTML = "";

    for (item of pokemon.results) {
        let poke = await fetch(item.url);
        poke = await poke.json();
        console.log(item, poke);

        pokehtml = document.createElement("div");
        // pokehtml.className = "pagination";
        pokehtml.style = "width: 15vw; margin: 10px; box-sizing: border-box;  text-align:center;border:1px solid black;    background: white; padding:10px; user-select: none;";

        pokename = document.createElement("p");
        item.name = item.name[0].toUpperCase() + item.name.slice(1)
        pokename.innerHTML = item.name;
        // pokename.style = "display: flex; justify-content: center;";
        pokename.className = "pagination";

        let pokeimage = document.createElement("img");
        pokeimage.src = poke.sprites.other["official-artwork"].front_default;
        pokeimage.style = "width: 100%; height: auto;";

        pokehtml.appendChild(pokeimage);
        pokehtml.appendChild(document.createElement("br"));
        pokehtml.appendChild(pokename);


        // div.appendChild(pokehtml);
        app.appendChild(pokehtml);
    }

}

window.onload = async () => {
    let res = await fetchPokemon();
    pokemon = res;
    console.log(pokemon);

    nextBtn.setAttribute("href", res.next);

    let div = document.createElement("div");
    div.className = "pagination";

    renderPokemon()

    //   app.append(div);
};
