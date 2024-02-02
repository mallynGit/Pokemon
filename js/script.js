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

// function recursiveRender(obj, html) {
//     let yes = html
//     for (let key in obj) {
//         if (typeof key == 'object') {
//             recursiveRender(key, yes)
//         } else {
//             let prop = document.createElement('p')
//             prop.innerHTML = key + ': ' + obj[key]
//             yes.appendChild(prop)
//         }
//     }
// }

async function renderInfoFull(pokemon) {
    let types;
    let name = document.createElement('p').innerHTML = `Name: ${pokemon.name} \n`
    let id = document.createElement('p').innerHTML = `ID: ${pokemon.id} \n`
    let height = document.createElement('p').innerHTML = `Height: ${pokemon.height / 10}m \n`
    let weight = document.createElement('p').innerHTML = `Weight: ${pokemon.weight / 10}kg \n`
    let species = document.createElement('p').innerHTML = `Species: ${pokemon.species.name} \n`
    let typeInteractions = {
        halfFrom: [],
        halfTo: [],
        doubleFrom: [],
        doubleTo: [],
        noneFrom: [],
        noneTo: [],
    }
    for (item of pokemon.types) {
        console.log(item, 'test');
        let p = await fetch(item.type.url)
        p = await p.json()
        typeInteractions.doubleFrom = typeInteractions.doubleFrom.concat(p.damage_relations.double_damage_from)
        typeInteractions.doubleTo = typeInteractions.doubleTo.concat(p.damage_relations.double_damage_to)
        typeInteractions.halfFrom = typeInteractions.halfFrom.concat(p.damage_relations.half_damage_from)
        typeInteractions.halfTo = typeInteractions.halfTo.concat(p.damage_relations.half_damage_to)
        typeInteractions.noneFrom = typeInteractions.noneFrom.concat(p.damage_relations.no_damage_from)
        typeInteractions.noneTo = typeInteractions.noneTo.concat(p.damage_relations.no_damage_to)
    }



    console.log(typeInteractions, 'relations');
    if (pokemon.types.length == 2) {
        types = document.createElement('p').innerHTML = `Types: ${pokemon.types[0].type.name} & ${pokemon.types[1].type.name} \n`
    } else {
        types = document.createElement('p').innerHTML = `Types: ${pokemon.types[0].type.name} \n`
    }
    let stats = document.createElement('div')
    stats.append(document.createElement('p').innerHTML = "Stats: ")
    for (stat of pokemon.stats) {
        let statHtml = document.createElement('p')
        statHtml.innerHTML = ` - ${stat.stat.name}: ${stat.base_stat}`
        console.log(stat)
        stats.append(statHtml)
    }
    let interactions = document.createElement('div')
    for (let [key, value] of Object.entries(typeInteractions)) {
        let htm = document.createElement('p')
        htm.innerHTML = `${key} - ${value} `
        
        interactions.append(htm)
    }


    let pokehtml = document.createElement('div')

    pokehtml.append(name, id, height, weight, species, types, stats, interactions)


    return pokehtml

}

async function showPokemon(name) {
    let res = await searchPokemon(name)
    console.log(res);

    const relevantProperties = [
        "name",
        "id",
        "height",
        "weight",
        "species",
        "types",
        "stats",
        "flavor_text_entries" // Include flavor_text_entries to get flavor_text
        // Add more properties as needed
    ];

    // Filter the object to include only relevant properties
    let relevantInfo = Object.fromEntries(
        Object.entries(res).filter(([key]) => relevantProperties.includes(key))
    );

    let container = document.createElement("div");
    container.style = "width: 100%; margin: 10px; box-sizing: border-box; text-align:center; background: white; padding:10px; user-select: none;";
    let pokehtml = document.createElement("div");
    let backButton = document.createElement("button");
    backButton.innerHTML = "Back";
    backButton.addEventListener("click", () => {
        renderPokemon()
    })
    let backButtonContainer = document.createElement("div")
    backButtonContainer.append(backButton)
    backButtonContainer.style = "width: 100%; text-align: center; margin-bottom: 10px;"

    container.append(document.createElement('br'))
    container.style = "display: flex; flex-direction: row; flex-wrap:wrap;"

    let pokeimage = document.createElement("img");
    pokeimage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${res.id}.png`;
    pokeimage.style = "height: 50vh"
    container.append(pokeimage);

    // for (result in res) {
    //     let type = document.createElement("p")
    //     type.innerHTML = result+ ": "+ res[result]
    //     container.appendChild(type)
    // }

    console.log(relevantInfo)
    container.appendChild(await renderInfoFull(relevantInfo));
    app.innerHTML = "";
    app.append(backButtonContainer)

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
            console.log(item);
            let id = item.url.split("/")[6]
            const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
            console.log("XDDXDDD");
            createPokemonElement(item.name, imageUrl);
        }
    } else {
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
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
