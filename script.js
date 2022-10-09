const api = "https://hp-api.herokuapp.com/api/characters/";
const table = document.getElementById("students");
const category = "students";
let studentData = null;
let sortMode = null;

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

    // console.log({ studentData })

    for (let i = 0; i < studentData.length; i++) {
        const row = document.createElement("tr");
        // for (let j = 0, cellValue; cell = table.rows[0].cells[j]; j++) {
        //     var column = cell.id;
        //     console.log(typeof column);
        //     console.log(studentData[i].name);
        // }

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
    const modal = document.getElementById("modal");
    const modalImg = modal.querySelector("img");
    const modalName = document.getElementById("modal__name");
    const modalInfoList = document.getElementById("modal__info");
    const characterInfo = ["actor", "ancestry", "dateOfBirth", "eyeColour", "gender", "hairColour", "house", "patronus", "species", "wand"];

    modalImg.src = character.image;
    modalName.innerHTML = character.name;

    // cant get attribute from string
    for (info of characterInfo) {
        console.log(character.info);
    }

    modal.style.display = 'block';
}

function closeCharacterModal() {
    const modal = document.getElementById("modal");
    modal.style.display = 'none';
}

renderTable(category);


// sortowanie dat
// wyświetlanie danych w modalu
//