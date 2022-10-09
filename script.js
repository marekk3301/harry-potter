const api = "https://hp-api.herokuapp.com/api/characters/"; // link to the api
// const category = "students"; // api route
const table = document.getElementById("students"); // html table
let studentData = null; // data fetched from api
let sortMode = null; // sorting direction

let openedCharacter = null;
let favourites;

function getFavourites() {
    if (document.cookie.length != 0) {
        let cookieArr = document.cookie.split("=");
        favourites = cookieArr[1];

        return favourites;
    }
    return [];
}

// getFavourites();
// favourites = 

const title = document.getElementById("students__title");

async function fetchData(category) {
    let url = api;
    url += category;

    // using await bc fetch and json are asynchronous and we need to wait for the api response
    const response = await fetch(url);
    const studentData = await response.json();

    return studentData;
}

async function renderTable(category, sortBy) {
    const table = document.getElementById("students");
    let tableBody = table.querySelector("tbody");

    if (!tableBody) {
        tableBody = document.createElement("tbody");
        table.appendChild(tableBody);
    }

    tableBody.innerHTML = "";

    if (category !== null) {
        // fetch new data from api 
        studentData = await fetchData(category);
    } else if (sortBy === "name") {
        studentData.sort(function(a, b) {
            if (sortMode === 'asc') {
                return ('' + a.name).localeCompare(b.name);
            }
            return ('' + b.name).localeCompare(a.name);
        });
    } else if (sortBy === "dateOfBirth") {
        studentData.sort(function(a, b) {
            // definitely not a way to sort dates :D
            if (sortMode === 'asc') {
                return ('' + a.dateOfBirth).localeCompare(b.dateOfBirth);
            }
            return ('' + b.dateOfBirth).localeCompare(a.dateOfBirth);
        });
    } else if (sortBy === "house") {
        studentData.sort(function(a, b) {
            if (sortMode === 'asc') {
                return ('' + a.house).localeCompare(b.house);
            }
            return ('' + b.house).localeCompare(a.house);
        });
    }

    for (let i = 0; i < studentData.length; i++) {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = studentData[i].name;
        row.appendChild(nameCell);

        const dateCell = document.createElement("td");
        dateCell.textContent = studentData[i].dateOfBirth;
        row.appendChild(dateCell);

        const houseCell = document.createElement("td");
        houseCell.textContent = studentData[i].house;
        row.appendChild(houseCell);

        const wizardCell = document.createElement("td");
        wizardCell.textContent = studentData[i].wizard;
        row.appendChild(wizardCell);

        const ancestryCell = document.createElement("td");
        ancestryCell.textContent = studentData[i].ancestry;
        row.appendChild(ancestryCell);

        const studentCell = document.createElement("td");
        if (studentData[i].hogwartsStudent === true) {
            studentCell.textContent = "student";
        } else if (studentData[i].hogwartsStaff === true) {
            studentCell.textContent = "staff";
        } else {
            studentCell.textContent = "other";
        }
        row.appendChild(studentCell);

        row.addEventListener('click', function() {
            openCharacterModal(studentData[i]);
        })

        tableBody.appendChild(row);
    }
}

function sortTable(col) {
    if (sortMode === null || sortMode === "desc") {
        sortMode = 'asc';
    } else if (sortMode === 'asc') {
        sortMode = 'desc';
    }

    renderTable(null, col);
}

function openCharacterModal(character) {
    openedCharacter = character;

    const modal = document.getElementById("modal");
    const modalImg = modal.querySelector("img");
    const modalName = document.getElementById("modal__name");
    const modalInfoList = document.getElementById("modal__info");

    const characterInfo = ["actor", "ancestry", "dateOfBirth", "eyeColour", "gender", "hairColour", "house", "patronus", "species"];

    modalInfoList.innerHTML = "";

    for (info of characterInfo) {
        const listElement = document.createElement("li");
        listElement.innerHTML = info + ": " + character[info]
        modalInfoList.appendChild(listElement)
    }


    modalImg.src = character.image;
    modalName.innerHTML = character.name;


    modal.style.display = 'block';
}

function closeCharacterModal() {
    openedCharacter = null;

    const modal = document.getElementById("modal");
    modal.style.display = 'none';
}

function addToFavourites() {
    // console.log(JSON.stringify(openedCharacter));

    favourites = getFavourites();
    if (favourites.length != 0) favourites += ",";
    // favourites.push(openedCharacter);
    favourites += JSON.stringify(openedCharacter);

    document.cookie = "fav=" + favourites;
    console.log("added " + openedCharacter.name + " to favourites");
}

function renderFavourites() {
    favourites = JSON.parse("[" + getFavourites() + "]");

    favouritesList = document.getElementById("favourites");

    for (let i = 0; i < favourites.length; i++) {
        favouritesListItem = document.createElement("div");
        favouritesListImage = document.createElement("img");
        favouritesListName = document.createElement("h3");
        favouritesListRemoveButton = document.createElement("button");

        favouritesListItem.className = "favourites__tile";

        favouritesListImage.src = favourites[i].image;
        favouritesListName.innerHTML = favourites[i].name;

        favouritesListRemoveButton.className = "button favourites__remove";
        favouritesListRemoveButton.addEventListener('click', function() {
            favourites.remove(favourites[i]);
            console.log(favourites);
            // document.cookie = "fav=" + JSON.stringify(favourites);
            // renderFavourites();
        })

        favouritesListItem.appendChild(favouritesListImage)
        favouritesListItem.appendChild(favouritesListName)
        favouritesListItem.appendChild(favouritesListRemoveButton)
        favouritesList.appendChild(favouritesListItem)


    }


}

function clearFavourites() {
    document.cookie = "fav=; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
    return "cleared favourites";
}



// ----- Funkcjonalność -----
// sortowanie dat
// usuwanie z ulubionych
// sprawdzić czy postaci już nie ma w ulubionych

// ----- Style -----
// Dane postaci camelCase -> sentence case
// wygląd wszystkiego xD
// responsywność
//