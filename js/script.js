let app = document.getElementById("app");
// app.style = "border: 1px solid black; width: 90%; margin:auto;  display:flex; justify-content: space-evenly; flex-wrap:wrap;";

//cosas del js
let pokemon = [];
let estado;
let favPoke = JSON.parse(localStorage.getItem('favPoke')) || [];


//botones
let nextBtn = document.getElementById("nextBtn");
let prevBtn = document.getElementById("prevBtn");
let resetBtn = document.getElementById("resetBtn");
let searchInput = document.getElementById("searchInput");
let searchButton = document.getElementById("searchBtn");

//boton de mostrar favoritos
let showFavButton = document.createElement('button')
showFavButton.innerHTML = "Mostrar favoritos"

//por alguna razon no tiene el mismo margin-left que los otros botones
showFavButton.style = "margin: 10px 0; padding: 10px; border: none; border-radius: 4px; cursor: pointer; color: white; background-color: #2196F3; margin-left: 5px;"

//esto es un pseudo selector :hover
showFavButton.onmouseenter = () => {
    showFavButton.style = "margin: 10px 0; padding: 10px; border: none; border-radius: 4px; cursor: pointer; color: white; background-color: #2196F3; margin-left: 5px; opacity: 0.8;"
}
showFavButton.onmouseleave = () => {
    showFavButton.style = "margin: 10px 0; padding: 10px; border: none; border-radius: 4px; cursor: pointer; color: white; background-color: #2196F3; margin-left: 5px;"
}

showFavButton.addEventListener("click", async () => {
    showFavorite()
})

//lo aplico despues del boton de reset
resetBtn.after(showFavButton)

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

searchInput.addEventListener("keyup", (e) => {
    if (e.key == "Enter") {
        searchButton.click()
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
    await fetchPokemon(null, pagNumber.value)
    renderPokemon()
})

nextBtn.addEventListener("click", async () => {
    await fetchNext()
    renderPokemon()
})

prevBtn.addEventListener("click", async () => {
    await fetchPrevious().then(() => renderPokemon())
})


//funciones de utilidad
function showError(name) {
    app.innerHTML = ""
    let span = document.createElement("span")
    span.innerHTML = `Pokemon ${name} not found`
    span.className = "error-message"
    app.appendChild(span)
}

async function searchPokemon(name) {
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
        console.error(err)
    }
}

async function fetchNext() {
    await fetchPokemon(pokemon.next);
}

async function fetchPrevious() {
    await fetchPokemon(pokemon.previous)
}

function addFavorite(name, id) {
    let obj = {
        name: name,
        id: id
    }
    favPoke.push(obj)
    localStorage.setItem("favPoke", JSON.stringify(favPoke));
    let fav = document.querySelector('#fav')
    fav.innerHTML = "Quitar de favoritos"
    fav.style.background = "#d32f2f"
}

function removeFavorite(name) {
    favPoke.splice(favPoke.findIndex(obj => obj.name == name), 1)
    localStorage.setItem("favPoke", JSON.stringify(favPoke));
    let fav = document.querySelector('#fav')
    fav.innerHTML = "Añadir a favoritos"
    fav.style.background = "#4caf50"
}

function setFavorite(name, id) {
    console.log(name, id, favPoke, 'favotiteerite');

    if (favPoke.length != 0) {
        if (favPoke.some(obj => obj.name === name)) {
            removeFavorite(name)
        } else {
            addFavorite(name, id)
        }
    } else {
        addFavorite(name, id)
    }
}

async function fetchPokemon(url, number) {
    let res
    if (url != null) {

        res = await fetch(url)
    } else if (number == null) {
        res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10&offset=0');
    } else {
        res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${number}&offset=0`);
    }
    res = await res.json();
    estado = res;
    pokemon = res;
}

async function translate(str) {
    let url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=" + encodeURI(str)
    let yes = await fetch(url)
    yes = await yes.json()
    yes = yes[0][0][0]
    return yes
}


//render stuff

async function showFavorite() {
    pokemon = favPoke
    estado = favPoke
    renderPokemon()
}

async function renderInfoFull(pokemon) {
    let types;
    let name = document.createElement('p')
    name.innerHTML = `Nombre: ${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)} \n`
    let id = document.createElement('p')
    id.innerHTML = `ID: ${pokemon.id} \n`
    let height = document.createElement('p')
    height.innerHTML = `Altura: ${pokemon.height / 10}m \n`
    let weight = document.createElement('p')
    weight.innerHTML = `Peso: ${pokemon.weight / 10}kg \n`
    let species = document.createElement('p')
    species.innerHTML = `Especie: ${pokemon.species.name[0].toUpperCase() + pokemon.species.name.slice(1)} \n`
    let typeInteractions = {
        Mitad_de: [],
        Mitad_a: [],
        Doble_de: [],
        Doble_a: [],
        Nada_de: [],
        Nada_a: [],
    }

    //obtengo la info de cada tipo, y miro por las interacciones de daño
    for (item of pokemon.types) {
        let p = await fetch(item.type.url)
        p = await p.json()
        typeInteractions.Doble_de = typeInteractions.Doble_de.concat(p.damage_relations.double_damage_from.map((x) => x.name[0].toUpperCase() + x.name.slice(1)))
        typeInteractions.Doble_a = typeInteractions.Doble_a.concat(p.damage_relations.double_damage_to.map((x) => x.name[0].toUpperCase() + x.name.slice(1)))
        typeInteractions.Mitad_de = typeInteractions.Mitad_de.concat(p.damage_relations.half_damage_from.map((x) => x.name[0].toUpperCase() + x.name.slice(1)))
        typeInteractions.Mitad_a = typeInteractions.Mitad_a.concat(p.damage_relations.half_damage_to.map((x) => x.name[0].toUpperCase() + x.name.slice(1)))
        typeInteractions.Nada_de = typeInteractions.Nada_de.concat(p.damage_relations.no_damage_from.map((x) => x.name[0].toUpperCase() + x.name.slice(1)))
        typeInteractions.Nada_a = typeInteractions.Nada_a.concat(p.damage_relations.no_damage_to.map((x) => x.name[0].toUpperCase() + x.name.slice(1)))
    }



    if (pokemon.types.length == 2) {
        types = document.createElement('p').innerHTML = `Tipos: ${await translate(pokemon.types[0].type.name[0].toUpperCase() + pokemon.types[0].type.name.slice(1))} y ${await translate(pokemon.types[1].type.name[0].toUpperCase() + pokemon.types[1].type.name.slice(1))} \n`
    } else {
        types = document.createElement('p').innerHTML = `Tipos: ${await translate(pokemon.types[0].type.name[0].toUpperCase() + pokemon.types[0].type.name.slice(1))} \n`
    }
    let stats = document.createElement('div')
    let fsd = document.createElement('p')
    fsd.textContent = "Estadisticas base: "
    stats.append(fsd)
    for (stat of pokemon.stats) {
        let statHtml = document.createElement('p')
        if (stat.stat.name == 'hp') {
            stat.stat.name = "Puntos de vida"
        } else {
            stat.stat.name = await translate(stat.stat.name)
            stat.stat.name = stat.stat.name[0].toUpperCase() + stat.stat.name.slice(1)
        }
        statHtml.innerHTML = ` - ${stat.stat.name}: ${stat.base_stat}`
        stats.append(statHtml)
    }
    let interactions = document.createElement('div')
    let typint = document.createElement('p')
    typint.textContent = "Interacciones de daño por tipo: "
    interactions.append(typint)
    for (let [key, value] of Object.entries(typeInteractions)) {
        let htm = document.createElement('p')
        console.log(value)
        htm.innerHTML = ` - ${key.split('_').join(' ')}: ${value == '' ? 'ninguno' : await translate(value.join(', '))} `

        interactions.append(htm)
    }

    let pokehtml = document.createElement('div')

    pokehtml.append(name, id, height, weight, species, types, stats, interactions)

    return pokehtml

}

async function showPokemon(name) {
    let res = await searchPokemon(name)

    let favButton = document.createElement('button')
    favButton.id = "fav"
    favButton.innerHTML = "Favorito"
    favButton.style = "margin: 10px 0; padding: 10px; border: none; border-radius: 4px; cursor: pointer; color: white;"
    favButton.addEventListener("click", () => {
        setFavorite(name, res.id)
    })

    if (favPoke.some(obj => obj.name === name)) {
        favButton.innerHTML = "Quitar de favoritos"
        favButton.style.background = "#d32f2f"
    } else {
        favButton.innerHTML = "Añadir a favoritos"
        favButton.style.background = "#4caf50"
    }

    const relevantProperties = [
        "name",
        "id",
        "height",
        "weight",
        "species",
        "types",
        "stats",
    ];

    // Filter the object to include only relevant properties
    let relevantInfo = Object.fromEntries(
        Object.entries(res).filter(([key]) => relevantProperties.includes(key))
    );

    let container = document.createElement("div");
    container.style = "width: 100%; margin: 10px; box-sizing: border-box; text-align:center; background: white; padding:10px; user-select: none; line-height: 13.5px;";
    let pokehtml = document.createElement("div");
    let backButton = document.createElement("button");
    backButton.innerHTML = "Atrás";
    backButton.addEventListener("click", () => {
        pokemon = estado
        renderPokemon()
    })
    backButton.style = "margin: 10px 0; padding: 10px; border: none; border-radius: 4px; cursor: pointer; background-color: #2196F3; color: white;"
    backButton.style.marginRight = "10px"

    let backButtonContainer = document.createElement("div")
    backButtonContainer.append(backButton)
    backButtonContainer.append(favButton)
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
    let info = await renderInfoFull(relevantInfo)
    info.style = "background: white; line-height: 13.5px; user-select:none; padding-left: 5px; padding-right: 13.5px; border-radius: 10px;"
    container.appendChild(info);
    app.innerHTML = "";
    app.append(backButtonContainer)

    app.appendChild(container)

}

async function renderPokemon() {
    app.innerHTML = "";


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
            await showPokemon(name)
        })

        app.appendChild(pokehtml);
    };

    if (pokemon.results && pokemon.results.length) {
        for (const item of pokemon.results) {
            let id = item.url.split("/")[6]
            const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
            createPokemonElement(item.name, imageUrl);
        }
    } else if (pokemon.id) {
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
        createPokemonElement(pokemon.name, imageUrl);
    } else if (pokemon.length) {
        for (let item of pokemon) {
            const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.id}.png`
            createPokemonElement(item.name, imageUrl)
        }
    }
}


window.onload = async () => {

    await fetchPokemon().then(() => {

        renderPokemon();
    })


    app.after(pagination)
    // let div = document.createElement("div");
    // div.className = "pagination";



    //   app.append(div);
};
