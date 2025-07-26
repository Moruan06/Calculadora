const buttons = document.querySelectorAll("button");
const resultDisplay = document.querySelector("#resultDisplay p");
const operationDisplay = document.querySelector("#operationDisplay");
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
    operationDisplay.textContent = firstNumber;
    resultDisplay.textContent = firstNumber;
  } else {
    if (secondNumber === "0" || waitingForNewNumber) {
      secondNumber = buttonId;
      waitingForNewNumber = false;
    } else {
      secondNumber += buttonId;
    }
    operationDisplay.textContent = `${firstNumber} ${operator} ${secondNumber}`;
    resultDisplay.textContent = secondNumber;
  }
}

function operationButtonClicked(op) {
  if (operator !== null && secondNumber !== "0") startCalc();
  operator = op;
  operationDisplay.textContent = `${firstNumber} ${operator}`;
}

function floatPointButtonClicked() {
  if (operator === null) {
    if (waitingForNewNumber) {
      firstNumber = "0.";
      waitingForNewNumber = false;
    } else if (!firstNumber.includes(".")) {
      firstNumber += ".";
    }
    operationDisplay.textContent = firstNumber;
    resultDisplay.textContent = firstNumber;
  } else {
    if (waitingForNewNumber) {
      secondNumber = "0.";
      waitingForNewNumber = false;
    } else if (!secondNumber.includes(".")) {
      secondNumber += ".";
    }
    operationDisplay.textContent = `${firstNumber} ${operator} ${secondNumber}`;
    resultDisplay.textContent = secondNumber;
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

  result = operations[operator](num1, num2);
  if (!isNaN(result) && isFinite(result)) {
    resultDisplay.textContent = Number(result.toFixed(10));
    firstNumber = String(result);
    secondNumber = "0";
    operator = null;
    waitingForNewNumber = true;
  } else {
    clearButton();
    resultDisplay.textContent = "Erro";
  }
}

function deleteButtonClicked() {
  if (waitingForNewNumber) {
    clearButton();
    return;
  }
  if (operator !== null && secondNumber !== "0") {
    secondNumber = secondNumber.slice(0, -1);
    if (secondNumber === "") {
      secondNumber = "0";
    }
    operationDisplay.textContent = `${firstNumber} ${operator}`;
    return;
  }
  if (operator !== null) {
    operator = null;
    operationDisplay.textContent = firstNumber;
    return;
  }
  if (firstNumber !== "0") {
    firstNumber = firstNumber.slice(0, -1);
    if (firstNumber === "") {
      firstNumber = "0";
    }
    operationDisplay.textContent = firstNumber;
    return;
  }
}

function clearButton() {
  resultDisplay.textContent = "0";
  operationDisplay.textContent = "";
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
    } else if (button.id === "floatPoint") {
      floatPointButtonClicked();
    }
  });
});
