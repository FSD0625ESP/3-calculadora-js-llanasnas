function add(a, b) {
    return a + b;
}

function substract(a, b) {
    return a - b;
}

function product(a, b) {
    return a * b;
}

function division(a, b) {
    if (b === 0) return "ERROR";
    return a / b;
}

function modulo(a, b) {
    return a % b;
}

function power(a, b) {
    return Math.pow(a, b);
}

function squareRoot(a) {
    if (a < 0) return "ERROR";
    return Math.sqrt(a);
}

function clear() {
    return "";
}

function doOperation(operation) {
    switch (operation.operator) {
        case "√": return squareRoot(operation.firstOperand);
        case "+": return add(operation.firstOperand, operation.secondOperand);
        case "-": return substract(operation.firstOperand, operation.secondOperand);
        case "*": return product(operation.firstOperand, operation.secondOperand);
        case "/": return division(operation.firstOperand, operation.secondOperand);
        case "%": return modulo(operation.firstOperand, operation.secondOperand);
        case "^": return power(operation.firstOperand, operation.secondOperand);
    }
}

function doPriorityOperations(expressionDivided) {
    let newExpression = [];

    for (let i = 0; i < expressionDivided.length; i++) {
        const item = expressionDivided[i];
        if (item === "√") {
            const number = parseFloat(expressionDivided[i + 1]);
            const result = squareRoot(number);
            if (result === "ERROR") return "ERROR";
            newExpression.push(result.toString());
            i++;
        } else if (["*", "/", "%", "^"].includes(item)) {
            const prev = parseFloat(newExpression.pop());
            const next = parseFloat(expressionDivided[i + 1]);
            const result = doOperation({ firstOperand: prev, operator: item, secondOperand: next });
            if (result === "ERROR") return "ERROR";
            newExpression.push(result.toString());
            i++;
        } else {
            newExpression.push(item);
        }
    }

    return newExpression.join('');
}
function calculateExpression(expression) {

    // Soporte para multiplicación implícita: 2(3+4), (2+3)(4+5), √(9)
    expression = expression.replace(/(\d|\))\(/g, '$1*('); // 2( → 2*(
    expression = expression.replace(/\)(\d|\()/g, ')*$1'); // )2 → )*2
    expression = expression.replace(/\)\(/g, ')*('); // )() → )*(
    expression = expression.replace(/(\d)π/g, '$1*π'); // 2π → 2*π

    // Reemplazar negativos con ~ para diferenciarlos de restas
    expression = expression.replace(/(^|[+\-*/%^√(])-/g, '$1~');
    expression = expression.replace(/π/g, Math.PI.toString()); // Reemplazar π por su valor numérico

    // Evaluar paréntesis de forma recursiva
    while (expression.includes('(')) {
        expression = expression.replace(/\(([^()]+)\)/g, (match, inner) => {
            const result = calculateExpression(inner);
            return result === "ERROR" ? "ERROR" : result.toString();
        });
        if (expression.includes("ERROR")) return "ERROR";
    }

    // Separar por operadores
    let expressionDivided = expression.split(/([+\-*/%^√])/).filter(e => e.trim() !== "");
    expressionDivided = expressionDivided.map(e => e.replace(/~/g, '-'));

    // Si solo hay un número, devolverlo
    if (expressionDivided.length === 1) return parseFloat(expressionDivided[0]);

    // Resolver operaciones prioritarias primero
    expression = doPriorityOperations(expressionDivided);

    if (expression === "ERROR") return "ERROR";
    expression = expression.replace(/(^|[+\-*/%^√(])-/g, '$1~');

    let finalParts = expression.split(/([+\-])/).filter(e => e.trim() !== "");
    finalParts = finalParts.map(e => e.replace(/~/g, '-'));
    let result = parseFloat(finalParts[0]);

    /* realizamos las operaciones restantes con el resultado de la operación prioritaria */
    for (let i = 1; i < finalParts.length; i += 2) {
        const operator = finalParts[i];
        const nextNumber = parseFloat(finalParts[i + 1]);
        result = doOperation({ firstOperand: result, operator, secondOperand: nextNumber });
        if (result === "ERROR") return "ERROR";
    }
    if (isNaN(result)) return "ERROR";

    return result;
}


module.exports = {
    calculateExpression,
    clear
};