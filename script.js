const api = "https://hp-api.herokuapp.com/api/characters/", // link to the api
    table = document.getElementById("students"); // html table

let studentData = null, // data fetched from api
    sortMode = null; // sorting direction

let openedCharacter = null, // using for modal info
    house = null, // using for caption and row colors
    favourites;

let rowColors = { "gryffindor": "#7F0909", "slytherin": "#196027", "ravenclaw": "#003875", "hufflepuff": "#b55d1d", "gryffindor0": "#cf9797", "gryffindor1": "#ffd54d", "slytherin0": "#98d4a4", "slytherin1": "#dcfaf6", "ravenclaw0": "#8a9fb8", "ravenclaw1": "#cae1fc", "hufflepuff0": "#d9b78f", "hufflepuff1": "#ffd498" };

async function fetchData(category) {
    let url = api;
    url += category;

    // using await bc fetch and json are asynchronous and we need to wait for the api response
    const response = await fetch(url),
        studentData = await response.json();

    return studentData;
}

async function renderTable(category, sortBy) {
    const table = document.getElementById("students");
    let tableBody = table.querySelector("tbody");

    // 
    if (house) {
        // catching error when category doesn't contain "/"
        try {
            house = category.split("/")[1];
            let title = document.getElementById("students__title")
            title.innerHTML = house.charAt(0).toUpperCase() + house.slice(1);
            title.style.color = rowColors[house];

        } catch (TypeError) {}
    } else document.getElementById("students__title").innerHTML = "All Students";


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

    // populating table with (filtered) student data
    for (let i = 0; i < studentData.length; i++) {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td"),
            dateCell = document.createElement("td"),
            houseCell = document.createElement("td"),
            wizardCell = document.createElement("td"),
            ancestryCell = document.createElement("td");

        nameCell.textContent = studentData[i].name;
        row.appendChild(nameCell);

        dateCell.textContent = studentData[i].dateOfBirth;
        row.appendChild(dateCell);

        houseCell.textContent = studentData[i].house;
        row.appendChild(houseCell);

        wizardCell.textContent = studentData[i].wizard;
        row.appendChild(wizardCell);

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

        // alternating table row colors
        if (!house) house = "gryffindor";
        row.style.backgroundColor = rowColors[house + (i % 2).toString()];

        tableBody.appendChild(row);
    }

    // set table header bg color 
    document.getElementById("tableHeader").style.backgroundColor = rowColors[house];

    // set table border color 
    const tableElements = document.querySelectorAll('table, table th, table td');

    tableElements.forEach(cell => {
        cell.style.borderColor = rowColors[house];
    });
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

    const modal = document.getElementById("modal"),
        modalImg = modal.querySelector("img"),
        modalName = document.getElementById("modal__name"),
        modalInfoList = document.getElementById("modal__info");

    // list of character attributes that get displayed in modal
    const characterInfo = ["actor", "ancestry", "dateOfBirth", "eyeColour", "gender", "hairColour", "house", "patronus", "species"];

    modalInfoList.innerHTML = "";

    for (info of characterInfo) {
        const listElement = document.createElement("li");
        const infoText = info.replace(/([A-Z])/g, " $1"); // adding spaces to camelCase
        listElement.innerHTML = infoText.charAt(0).toUpperCase() + infoText.slice(1) + ": " + character[info]
        modalInfoList.appendChild(listElement)
    }

    modalImg.src = character.image;
    if (!character.image) {
        if (character.gender === "male") modalImg.src = "images/defaultWizard.png";
        else if (character.gender === "female") modalImg.src = "images/defaultWitch.png";
    }
    modalName.innerHTML = character.name;

    if (checkFavourites()) document.getElementById("modal__fav").style.backgroundImage = "url('icons/heart-solid.svg')";
    else document.getElementById("modal__fav").style.backgroundImage = "url('icons/heart-regular.svg')";

    modal.style.display = 'block';
}

function closeCharacterModal() {
    openedCharacter = null;

    const modal = document.getElementById("modal");
    modal.style.display = 'none';
}

function getFavourites() {
    if (document.cookie.length != 0) {
        let cookieArr = document.cookie.split("=");
        favourites = cookieArr[1];

        return favourites;
    }
    return [];
}

function addToFavourites() {
    favourites = getFavourites();
    characterStr = JSON.stringify(openedCharacter);

    if (favourites.includes(characterStr)) {
        if (favourites.includes(characterStr + ",")) document.cookie = "fav=" + favourites.replace(characterStr + ",", ""); // character isn't the last
        else if (favourites.includes("," + characterStr)) document.cookie = "fav=" + favourites.replace("," + characterStr, ""); // character is at the end
        else document.cookie = "fav=" + favourites.replace(characterStr, ""); // there's only one character

        document.getElementById("modal__fav").style.backgroundImage = "url('icons/heart-regular.svg')";
        console.log("removed from favourites");
        return;
    }

    document.getElementById("modal__fav").style.backgroundImage = "url('icons/heart-solid.svg')";

    if (favourites.length != 0) favourites += ",";

    favourites += characterStr;
    document.cookie = "fav=" + favourites;
    console.log("added " + openedCharacter.name + " to favourites");
}

function checkFavourites() {
    favourites = getFavourites();
    characterStr = JSON.stringify(openedCharacter);

    if (favourites.includes(characterStr)) return true;
    return false;
}

function renderFavourites() {
    favourites = JSON.parse("[" + getFavourites() + "]");

    favouritesList = document.getElementById("favourites");
    favouritesList.innerHTML = "";

    for (let i = 0; i < favourites.length; i++) {
        favouritesListItem = document.createElement("div");
        favouritesListImage = document.createElement("img");
        favouritesListName = document.createElement("h3");
        favouritesListRemoveButton = document.createElement("button");

        favouritesListItem.className = "favourites__tile";

        // default profile pic
        favouritesListImage.src = favourites[i].image;
        if (!favourites[i].image) {
            if (favourites[i].gender === "male") favouritesListImage.src = "images/defaultWizard.png";
            else if (favourites[i].gender === "female") favouritesListImage.src = "images/defaultWitch.png";
        }
        favouritesListName.innerHTML = favourites[i].name;

        // remove favourite button
        favouritesListRemoveButton.className = "button favourites__remove";
        favouritesListRemoveButton.addEventListener('click', function() {
            favourites.splice(i, 1);
            cookieStr = JSON.stringify(favourites);
            document.cookie = "fav=" + cookieStr.substring(1, cookieStr.length - 1);
            renderFavourites();
        })

        favouritesListItem.appendChild(favouritesListImage);
        favouritesListItem.appendChild(favouritesListName);
        favouritesListItem.appendChild(favouritesListRemoveButton);
        favouritesList.appendChild(favouritesListItem);
    }
}

function clearFavourites() {
    document.cookie = "fav=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.getElementById("favourites").innerHTML = "";
    return "cleared favourites";
}

function changeRowNumber(rowNumber) {
    columnTemplate = "grid-template-columns: " + "1fr ".repeat(rowNumber) + ";";
    document.getElementById("favourites").style = columnTemplate;
}