let moveList = [];

function uniqueSorted(arr) {
    return [...new Set(arr)].sort((a, b) => a - b);
}

function parseInput(text) {
    return uniqueSorted(
        text
            .trim()
            .split(/\s+/)
            .map(val => parseInt(val))
            .filter(val => !isNaN(val))
    );
}

function joinVals(arr) {
    return arr.map(val => String(val)).join("  ");
}

function getMoves(starts, moveTable) {
    let endings = [];

    for (const start of starts) {
        if (moveTable[start]) {
            endings.push(...moveTable[start]);
        }
    }

    return uniqueSorted(endings);
}

function getMysteryMoves(starts) {
    let endings = [];

    for (const start of starts) {
        for (const table of [taxis, buses, metros, ferries]) {
            if (table[start]) {
                endings.push(...table[start]);
            }
        }
    }

    return uniqueSorted(endings);
}

function updateHeaders(previous, current) {
    document.querySelector("#previous-header .wrapped-text").innerText = previous;
    document.querySelector("#current-header .wrapped-text").innerText = current;
}

function setTextarea(text) {
    document.querySelector("textarea").value = text;
}

document.addEventListener("DOMContentLoaded", () => {

    const textarea = document.querySelector("textarea");

    document.querySelectorAll("button").forEach(button => {

        button.addEventListener("click", e => {
            e.preventDefault();

            const action = button.value;
            const inputText = textarea.value.trim();

            let updatedText = "";
            let previousHeader = "-1";

            if (action === "Revealed") {
                moveList = [];
                updateHeaders("-1", "");
                setTextarea("");
                return;
            }

            if (action === "Rewind") {

                if (moveList.length > 0) {
                    moveList.pop();

                    updatedText = moveList.length > 0 ? joinVals(moveList[moveList.length - 1]) : "";

                    if (moveList.length > 0) {
                        moveList.pop();
                    }

                    previousHeader = moveList.length > 0 ? joinVals(moveList[moveList.length - 1]) : "-1";
                }

                updateHeaders(previousHeader, updatedText);
                setTextarea(updatedText);
                return;
            }

            if (inputText === "") return;

            const parsed = parseInput(inputText);
            moveList.push(parsed);

            previousHeader = joinVals(parsed);

            let endings = [];

            if (action === "Taxi") {
                endings = getMoves(parsed, taxis);
            }

            if (action === "Bus") {
                endings = getMoves(parsed, buses);
            }

            if (action === "Metro") {
                endings = getMoves(parsed, metros);
            }

            if (action === "Mystery") {
                endings = getMysteryMoves(parsed);
            }

            updatedText = joinVals(endings);

            updateHeaders(previousHeader, updatedText);
            setTextarea(updatedText);
        });

    });

});