window.onload = function() {
    // Reset the form on page load
    document.getElementById("form").reset();

    // Add click listener to submit button
    document.getElementById("submit").addEventListener("click", calcAndUpdate);
};

function BMR() {
    console.log("Calculating BMR");

    let weightLbs = Number(document.getElementById("weight").value);
    let heightIn = Number(document.getElementById("height").value);
    let age = Number(document.getElementById("age").value);
    let weightInKg = weightLbs / 2.205;
    let heightCm = heightIn * 2.54;
    let bmr;
    if (document.getElementById("male").checked) {
        bmr = (10 * weightInKg) + (6.25 * heightCm) - (5 * age) + 5;
        bmr = Math.ceil(bmr);
    } else if (document.getElementById("female").checked) {
        bmr = (10 * weightInKg) + (6.25 * heightCm) - (5 * age) - 161;
        bmr = Math.ceil(bmr);
    }
    console.log("BMR:", bmr);
    return bmr;
}

function tdee() {
    console.log("Calculating TDEE");

    let bmr = BMR();
    let activityLevel = Number(document.getElementById("activity").value);
    let tdee = bmr * activityLevel;
    console.log("TDEE:", tdee);
    return tdee;
}

function table() {
    console.log("Generating Table");

    let bmrValue = BMR();
    let tdeeValue = tdee();
    if (bmrValue === null || tdeeValue === null) return;

    let existingTable = document.getElementById("bmrTable");
    if (existingTable) {
        existingTable.remove();
    }

    const body = document.body;
    const tbl = document.createElement("table");
    const tblBody = document.createElement("tbody");

    const headers = ["BMR:", bmrValue, "TDEE:", Math.ceil(tdeeValue)];
    let count = 0;
    for (let j = 0; j < 2; j++) {
        const row = document.createElement('tr');
        for (let i = 0; i < 2; i++) {
            const cell = document.createElement('td');
            const cellText = document.createTextNode(headers[count]);
            count += 1;
            cell.appendChild(cellText);
            row.appendChild(cell);
        }
        tblBody.appendChild(row);
    }
    tbl.appendChild(tblBody);
    body.appendChild(tbl);
    tbl.setAttribute("border", "2");
    tbl.setAttribute("id", "bmrTable");
}

function tdeeDaily() {
    console.log("Calculating TDEE Daily");

    let weightOverTime = [];
    let tdeeOverTime = [];
    let currentTdee = tdee();
    let maxDef = currentTdee - 1000;
    let startWeight = Number(document.getElementById("weight").value);
    let endWeight = Number(document.getElementById("goal").value);
    let time = Number(document.getElementById("time").value);
    let totalCal = (startWeight - endWeight) * 3500;
    let dailyCalDef = totalCal / time;
    let dailyCalIn = currentTdee - dailyCalDef;

    if (dailyCalIn < maxDef) {
        alert("A deficit of greater than " + maxDef + " calories is not recommended long term. Please extend your diet duration or raise your goal weight.");
        
        // Return -1 if alert is triggered to prevent further actions
        return -1;
    } else {
        let existingText = document.getElementById("text");
        if (existingText) {
            existingText.remove();
        }
    
        const head = document.createElement("h2");
        head.innerText = "To reach " + endWeight + " in " + time + " days you'll need to follow a caloric deficit of " + dailyCalDef + " meaning you can eat " + Math.ceil(dailyCalIn) + " calories a day";
        document.body.appendChild(head);
        head.setAttribute("id", "text");
    }
}

function calcAndUpdate() {
    // Run tdeeDaily and check if the caloric deficit is too high
    let deficitStatus = tdeeDaily();
    if (deficitStatus === -1) {
        // If the deficit is too high, prevent further actions and exit the function early
        document.getElementById("form").reset(); // Reset the form only when the deficit is too high
        location.reload(true);
        return; // Exit the function early
    }

    // Remove any existing table and text before generating new ones
    let existingTable = document.getElementById("bmrTable");
    if (existingTable) {
        existingTable.remove();
    }

    let existingText = document.getElementById("text");
    if (existingText) {
        existingText.remove();
    }

    // Generate and display the table and daily calorie text
    table();
    tdeeDaily();
    // Shift the form to the left after submission
    document.getElementById("form").classList.add("shift-left");

}
