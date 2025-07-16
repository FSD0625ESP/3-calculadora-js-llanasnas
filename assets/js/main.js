const display = document.getElementById("display");
const history = document.getElementById("history");
let currentExpression = "";

function updateDisplay(value) {
    if (value === "ERROR") {
        display.textContent = "ERROR";
        display.dataset.value = "ERROR";
        return;
    }
    display.textContent = beautifyExpression(value);
    display.dataset.value = value;
}

function addToHistory(expression, result) {
    const entry = document.createElement("div");
    entry.className = "history-entry";
    expression = beautifyExpression(expression);
    entry.textContent = `${expression} = ${result}`;
    entry.innerHTML += `<span class="remove-entry">X</span>`;
    history.prepend(entry);
}
function beautifyExpression(expression) {
    if (expression === "ERROR") return "ERROR";
    expression = String(expression);
    return expression
        .replace(/\*/g, " × ")
        .replace(/\//g, " ÷ ")
        .replace(/\+/g, " + ")
        .replace(/-/g, " - ")
        .replace(/\^/g, " ^ ")
        .replace(/√/g, "√ ")
        .replace(/%/g, " % ")
        .replace(/π/g, "π ")
        .replace(/([0-9])\(/g, "$1 × (") // Add multiplication sign before parentheses
        .replace(/\)([0-9])/g, ") × $1") // Add multiplication sign after parentheses
}

document.querySelectorAll(".button").forEach(button => {
    button.addEventListener("click", () => {
        const value = button.dataset.value;
        const action = button.dataset.action;
        switch (action) {
            case "calculate":
                try {
                    let result = calculateExpression(currentExpression);
                    /* round to 6 decimals */
                    result = parseFloat(result.toFixed(6));
                    if (result !== "ERROR") {
                        addToHistory(currentExpression, result);
                        currentExpression = result.toString();
                    }
                    updateDisplay(result);
                } catch (e) {
                    updateDisplay("Error");
                    console.error("Calculation error:", e);
                    currentExpression = "";
                }
                break;
            case "clean":
                currentExpression = clear();
                history.innerHTML = "";
                updateDisplay("0");
                break;
            case "delete":
                currentExpression = currentExpression.slice(0, -1);
                updateDisplay(currentExpression || "0");
                break;
            default:
                currentExpression += value;
                updateDisplay(currentExpression);
        }
    });
});

document.addEventListener("keydown", (event) => {
    const key = event.key;
    if (key === "Enter") {
        document.querySelector(".button[data-action='calculate']").click();
    } else if (key === "Escape") {
        document.querySelector(".button[data-action='clean']").click();
    } else if (key === "Backspace") {
        document.querySelector(".button[data-action='delete']").click();
    } else if (key === "Escape") {
        document.querySelector(".button[data-action='clean']").click();
    } else if (/^[0-9+\-*/%^√()]$/.test(key)) {
        const button = document.querySelector(`.button[data-value='${key}']`);
        if (button) {
            button.click();
        }
    }
});
history.addEventListener("click", (event) => {
    if (event.target.classList.contains("history-entry")) {
        /* cojemos el resultado de la operación seleccionada */
        currentExpression = event.target.textContent.split(" = ")[1].replace("X", "").trim();
        currentExpression
        updateDisplay(currentExpression);
    } else if (event.target.classList.contains("remove-entry")) {
        // Al hacer clic en la X, eliminar el entry padre
        const entry = event.target.closest(".history-entry");
        if (entry) {
            entry.remove();
        }
    }
});




/* permitir pegar contenido en el portapapeles */
document.addEventListener("paste", (event) => {
    const pastedData = event.clipboardData.getData("text");
    currentExpression += pastedData;
    updateDisplay(currentExpression);
});