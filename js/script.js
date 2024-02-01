let app = document.getElementById("app");
// app.style = "border: 1px solid black; width: 90%; margin:auto;  display:flex; justify-content: space-evenly; flex-wrap:wrap;";

//cosas del js
let pokemon = [];
let estado;

//botones
let nextBtn = document.getElementById("nextBtn");
let prevBtn = document.getElementById("prevBtn");
let resetBtn = document.getElementById("resetBtn");
let searchInput = document.getElementById("searchInput");
let searchButton = document.getElementById("searchBtn");


//paginacion, cantidad de pokemon a buscar
let pagination = document.createElement("div");
pagination.className = "pagination";
pagination.style = "display: block; width: 100%; height:35px; text-align:center;"
let pagNumber = document.createElement("input")
pagNumber.type = "text"
pagNumber.style = "text-align: center; width:35px; height: 30px; font-size: 20px";
pagNumber.id = "pagNumber"
pagNumber.value = 10
pagination.append(pagNumber)

//eventlisteners de botones
pagNumber.addEventListener("change", async () => {
    let e = await fetchPokemon(null, pagNumber.value)
    if (e == "error") {
        showError()
    } else {
        renderPokemon()
    }
})

searchButton.addEventListener("click", async () => {
    let e = await searchPokemon(searchInput.value.toLowerCase())
    if (e == "error") {
        showError(searchInput.value)
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


//fuinciones
function showError(name) {
    app.innerHTML = ""
    let span = document.createElement("span")
    span.innerHTML = `Pokemon ${name} not found`
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
        if (res.status == 404) {
            return "error"
        }
        res = await res.json()
        pokemon = res
        return res
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

async function fetchPokemon(url, number) {
    let res
    console.log(url, number, 'desd efetcdh')
    if (url != null) {
        res = await fetch(url)
        estado = url
    } else if (number == null) {
        estado = 'https://pokeapi.co/api/v2/pokemon?limit=10&offset=0'
        res = await fetch(estado);
    } else {
        estado = `https://pokeapi.co/api/v2/pokemon?limit=${number}&offset=0`
        res = await fetch(estado);
    }
    res = await res.json();
    // pokemon = []
    // for(result of res.results){
    //     pokemon.push(result)
    // }
    pokemon = res;
}

async function showPokemon(name) {
    let res = await searchPokemon(name)
    console.log(res);

    delete res['moves']
    delete res['game_indices']

    let container = document.createElement("div");
    container.style = "width: 100%; margin: 10px; box-sizing: border-box; text-align:center; background: white; padding:10px; user-select: none;";
    let pokehtml= document.createElement("div");
    let backButton = document.createElement("button");
    backButton.innerHTML = "Back";
    backButton.addEventListener("click", () => {
        renderPokemon()
    })
    container.append(backButton)

    let pokeimage = document.createElement("img");
    pokeimage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${res.id}.png`;
    container.appendChild(pokeimage);

    // for (result in res) {
    //     let type = document.createElement("p")
    //     type.innerHTML = result+ ": "+ res[result]
    //     container.appendChild(type)
    // }

    for (let result in res) {
        if (res.hasOwnProperty(result)) {
            if(res[result].length!=(undefined||0)){
            let type = document.createElement("p");
            type.innerHTML = result + ": " + res[result];
            pokehtml.appendChild(type);
            }
        }
    }

    container.appendChild(pokehtml);
    app.innerHTML = "";
    app.appendChild(container)

}

async function renderPokemon() {
    app.innerHTML = "";

    console.log(pokemon);

    const createPokemonElement = (name, imageUrl) => {
        const pokehtml = document.createElement("div");
        pokehtml.style = "width: 15vw; margin: 10px; box-sizing: border-box; text-align:center; background: white; padding:10px; user-select: none;";
        pokehtml.style.cursor = "pointer";

        const pokename = document.createElement("p");
        const capitalizedPokeName = name[0].toUpperCase() + name.slice(1);

        pokename.innerHTML = capitalizedPokeName;
        pokename.style = "display: flex;justify-content: center;margin-top: 20px;";

        const pokeimage = document.createElement("img");
        pokeimage.src = imageUrl;
        pokeimage.style = "width: 100%; height: auto;";

        pokehtml.appendChild(pokeimage);
        pokehtml.appendChild(pokename);
        pokehtml.addEventListener("click", async () => {
            console.log(name, 'aneiasdksandsankdjasnksda')
            await showPokemon(name)
        })

        app.appendChild(pokehtml);
    };

    if (pokemon.results && pokemon.results.length) {
        for (const item of pokemon.results) {
            const poke = await fetch(item.url);
            const pokeData = await poke.json();

            const imageUrl = pokeData.sprites.other["official-artwork"].front_default;
            console.log("XDDXDDD");
            createPokemonElement(item.name, imageUrl);
        }
    } else {
        const imageUrl = pokemon.sprites.other["official-artwork"].front_default;
        console.log("no");
        createPokemonElement(pokemon.name, imageUrl);
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
