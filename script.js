const api = "https://hp-api.herokuapp.com/api/characters/";
const table = document.getElementById("students");
table.border = "1px";
const columns = ["name", "dateOfBirth", "house", "wizard", "ancestry", "hogwartsStudent"];
const category = "students";

async function populateTable(url, table, category) {
    const tableHead = table.querySelector("thead");
    const tableBody = table.querySelector("tbody");

    url += category;

    // using await bc fetch and json are asynchronous and we need to wait for the api response
    const response = await fetch(url);
    const studentData = await response.json();

    for (let i = 0; i < studentData.length; i++) {
        const row = document.createElement("tr");
        // for (let j = 0, cellValue; cell = table.rows[0].cells[j]; j++) {
        //     var column = cell.id;
        //     console.log(typeof column);
        //     console.log(studentData[i].name);
        // }

        const nameCell = document.createElement("td");
        nameCell.innerHTML = studentData[i].name;
        row.appendChild(nameCell);

        const dateCell = document.createElement("td");
        dateCell.innerHTML = studentData[i].dateOfBirth;
        row.appendChild(dateCell);

        const houseCell = document.createElement("td");
        houseCell.innerHTML = studentData[i].house;
        row.appendChild(houseCell);

        const wizardCell = document.createElement("td");
        wizardCell.innerHTML = studentData[i].wizard;
        row.appendChild(wizardCell);

        const ancestryCell = document.createElement("td");
        ancestryCell.innerHTML = studentData[i].ancestry;
        row.appendChild(ancestryCell);

        const studentCell = document.createElement("td");
        if (studentData[i].hogwartsStudent === true) {
            studentCell.innerHTML = "student";
        } else if (studentData[i].hogwartsStaff === true) {
            studentCell.innerHTML = "staff";
        } else {
            studentCell.innerHTML = "other";
        }
        row.appendChild(studentCell);

        tableBody.appendChild(row);
    }
}



populateTable(api, table, category)