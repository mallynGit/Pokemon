let app = document.getElementById('app');

let nextBtn = document.getElementById('nextBtn');
let prevBtn = document.getElementById('prevBtn');


let pokemon = [

]



// .then(res => res.json())
// .then(data => {
//     pokemon = data.results
//     console.log(pokemon)
// })

window.onload = async () => {

    let res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10&offset=0')
    res = await res.json()
    pokemon = res
    console.log(pokemon)

    nextBtn.setAttribute('href', res.next)

    for (item of pokemon.results) {
        console.log(item)
        let div = document.createElement('div')
        div.innerHTML = item.name;
        div.className = 'pagination';
        app.append(div);
    }
}


