let app = document.getElementById("app");
// app.style = "border: 1px solid black; width: 90%; margin:auto;  display:flex; justify-content: space-evenly; flex-wrap:wrap;";

let nextBtn = document.getElementById("nextBtn");
let prevBtn = document.getElementById("prevBtn");
let resetBtn = document.getElementById("resetBtn");
let searchInput = document.getElementById("searchInput");
let searchButton = document.getElementById("searchBtn");

let pagination = document.createElement("div");
pagination.className = "pagination";
pagination.style = "display: block; width: 100%; height:35px; text-align:center;"
let pagNumber = document.createElement("input")
pagNumber.type = "text"
pagNumber.style = "text-align: center; width:35px; height: 30px; font-size: 20px";
pagNumber.id = "pagNumber"
pagNumber.value = 10
pagination.append(pagNumber)

pagNumber.addEventListener("change", async () => {
    let e = await fetchPokemon(null, pagNumber.value)
    if (e == "error") {
        showError()
    } else {
        renderPokemon()
    }
})

searchButton.addEventListener("click", async () => {
    let e = await searchPokemon(searchInput.value)
    if (e == "error") {
        showError()
    } else {
        renderPokemon()
    }
})

resetBtn.addEventListener("click", async () => {
    await fetchPokemon()
    renderPokemon()
})

nextBtn.addEventListener("click", async () => {
    await fetchNext()
    renderPokemon()
})

prevBtn.addEventListener("click", async () => {
    await fetchPrevious()
    renderPokemon()
})

let pokemon = [];

// .then(res => res.json())
// .then(data => {
//     pokemon = data.results
//     console.log(pokemon)
// })

function showError() {
    app.innerHTML = ""
    let span = document.createElement("span")
    span.innerHTML = "Pokemon not found"
    span.className = "error-message"
    app.appendChild(span)
}

async function searchPokemon(name) {
    console.log(name)
    if (name == "") {
        return "error"
    }
    try {
        res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
        res = await res.json()
        console.log(res)
        pokemon = res
    }
    catch (err) {
        console.log(err)
    }
}

async function fetchNext() {
    await fetchPokemon(pokemon.next);
}

async function fetchPrevious() {
    if (pokemon.previous == null) {

    } else {
        fetchPokemon(pokemon.previous)
    }
}

async function fetchPokemon(offset, number) {
    let res
    console.log(offset,number,'desd efetcdh')
    if (offset != null) {
        res = await fetch(offset)
    } else if(number==null){
        res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10&offset=0');
    }else {
        res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${number}&offset=0`);
    }
    res = await res.json();
    // pokemon = []
    // for(result of res.results){
    //     pokemon.push(result)
    // }
    pokemon = res;
}

async function renderPokemon() {
    app.innerHTML = "";

    console.log(pokemon)

    if (pokemon.results) {
        if (pokemon.results.length != undefined) {
            for (item of pokemon.results) {

                let poke = await fetch(item.url);

                poke = await poke.json();


                pokehtml = document.createElement("div");
                // pokehtml.className = "pagination";
                pokehtml.style = "width: 15vw; margin: 10px; box-sizing: border-box; text-align:center; background: white; padding:10px; user-select: none;";

                pokename = document.createElement("p");
                item.name = item.name[0].toUpperCase() + item.name.slice(1)
                pokename.innerHTML = item.name;
                pokename.style = "display: flex;justify-content: center;margin-top: 20px;"

                let pokeimage = document.createElement("img");
                pokeimage.src = poke.sprites.other["official-artwork"].front_default;
                pokeimage.style = "width: 100%; height: auto;";

                pokehtml.appendChild(pokeimage);
                pokehtml.appendChild(pokename);


                // div.appendChild(pokehtml);
                app.appendChild(pokehtml);
            }
        }
    } else {
        console.log(pokemon);


        pokehtml = document.createElement("div");
        // pokehtml.className = "pagination";
        pokehtml.style = "width: 15vw; margin: 10px; box-sizing: border-box; text-align:center; background: white; padding:10px; user-select: none;";

        pokename = document.createElement("p");
        pokemon.name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1)
        pokename.innerHTML = pokemon.name;
        pokename.style = "text-weight: 900;";
        pokename.className = "pagination";

        let pokeimage = document.createElement("img");
        pokeimage.src = pokemon.sprites.other["official-artwork"].front_default;
        pokeimage.style = "width: 100%; height: auto;";

        pokehtml.appendChild(pokeimage);
        pokehtml.appendChild(pokename);


        // div.appendChild(pokehtml);
        app.appendChild(pokehtml);
    }
}

window.onload = async () => {

    await fetchPokemon()
    console.log('before')
    await renderPokemon()
    console.log('after')

    app.after(pagination)
    // let div = document.createElement("div");
    // div.className = "pagination";



    //   app.append(div);
};
