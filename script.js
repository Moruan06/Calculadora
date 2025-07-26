const buttons = document.querySelectorAll("button");
const display = document.querySelector("#screen");
let operator = null;
let firstNumber = "0";
let secondNumber = "0";
let waitingForNewNumber = false;

//Funções para o funcionamento dos botões:
function numberButtonClicked(buttonId) {
  if (operator === null) {
    if (firstNumber === "0" || waitingForNewNumber) {
      firstNumber = buttonId;
      waitingForNewNumber = false;
    } else {
      firstNumber += buttonId;
    }
    display.textContent = firstNumber;
  } else {
    if (secondNumber === "0" || waitingForNewNumber) {
      secondNumber = buttonId;
      waitingForNewNumber = false;
    } else {
      secondNumber += buttonId;
    }
    display.textContent = `${firstNumber} ${operator} ${secondNumber}`;
}}

function operationButtonClicked(op) {
  if(operator !== null && secondNumber !== "0") startCalc();
  operator = op;
  waitingForNewNumber = true
  display.textContent = `${firstNumber} ${operator}`;
}

function floatPointButtonClicked() {
  if (operator === null) {
    if (waitingForNewNumber) {
      firstNumber = "0.";
      waitingForNewNumber = false;
    } else if (!firstNumber.includes(".")) {
      firstNumber += ".";
    }
    display.textContent = firstNumber;
  } else {
    if (waitingForNewNumber) {
      secondNumber = "0.";
      waitingForNewNumber = false;
    } else if (!secondNumber.includes(".")) {
      secondNumber += ".";
    }
    display.textContent = `${firstNumber} ${operator} ${secondNumber}`;
  }
}

function startCalc() {
  let result;
  let num1 = parseFloat(firstNumber);
  let num2 = parseFloat(secondNumber);

  const operations = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "/": (a, b) => a / b,
    "*": (a, b) => a * b,
  };

  if (operations[operator] && !isNaN(num1) && !isNaN(num2)) {
    result = operations[operator](num1, num2);
    display.textContent = result;
    firstNumber = String(result);
    secondNumber = "0";
    operator = null;
    waitingForNewNumber = true;
  } else {
    display.textContent = "Erro!";
    clearButton();
  }
}


function deleteButtonClicked() {
    if (operator !== null && secondNumber !== "0") { 
        secondNumber = secondNumber.slice(0, -1);
        if (secondNumber === "") {
            secondNumber = "0";
        }
        display.textContent = `${firstNumber} ${operator}`;
        return;
    }
    if (operator !== null) {
        operator = null;
        display.textContent = firstNumber;
        return;
    }
    if (firstNumber !== "0") {
        firstNumber = firstNumber.slice(0, -1);
        if (firstNumber === "") {
            firstNumber = "0";
        }
        display.textContent = firstNumber;
        return;
    }
}

function clearButton() {
  display.textContent = "0";
  firstNumber = "0";
  secondNumber = "0";
  operator = null;
  waitingForNewNumber = false;
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    //adiciona efeito que faz a tecla parecer que foi realmente clicada
    button.classList.add("buttonClicked");
    setTimeout(() => {
      button.classList.remove("buttonClicked");
    }, 300);

    if (button.classList.contains("operationButton")) {
      operationButtonClicked(button.textContent);
    } else if (button.classList.contains("numberButton")) {
      numberButtonClicked(button.id);
    } else if (button.id === "clear") {
      clearButton();
    } else if (button.id === "result") {
      startCalc();
    } else if (button.id === "delete") {
      deleteButtonClicked();
    } else if (button.id === "floatPoint"){
      floatPointButtonClicked();
    }
  });
});
