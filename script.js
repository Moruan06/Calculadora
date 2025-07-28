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
    const maxDisplayLength = 12;
    let fixedResult;
    const resultString = String(result);
    if(resultString.length > maxDisplayLength){
      let precision = maxDisplayLength - 5; // para caber os caracteres adicionais

      if(precision < 0) precision = 0;
      fixedResult = result.toExponential(precision);
      fixedResult = fixedResult.replace(/(\.\d*?)0+e/, '  $1e').replace(/\.e/, 'e');
    }else{fixedResult = Number(result.toFixed(10))};
    resultDisplay.textContent = fixedResult;
    firstNumber = resultString;
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
    operationDisplay.textContent = `${firstNumber} ${operator} ${secondNumber}`;
    resultDisplay.textContent = `${secondNumber}`;
    return;
  }
  if (operator !== null) {
    operator = null;
    operationDisplay.textContent = firstNumber;
    resultDisplay.textContent = firstNumber;
    return;
  }
  if (firstNumber !== "0") {
    firstNumber = firstNumber.slice(0, -1);
    if (firstNumber === "") {
      firstNumber = "0";
    }
    operationDisplay.textContent = firstNumber;
    resultDisplay.textContent = firstNumber;
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


//suporte para teclado
document.addEventListener('keydown', (e) => {
  let key = e.key;
  let code = e.code;

  if(!isNaN(parseInt(key)) && key !== ' '){
    if(key >= 0 && key<= 9){
      e.preventDefault();
      numberButtonClicked(key);
      return
    }
  }

  const keyboardMap = {
      '+': () => operationButtonClicked('+'),
      '-': () => operationButtonClicked('-'),
      '*': () => operationButtonClicked('*'),
      '/': () => operationButtonClicked('/'),
      '.': () => floatPointButtonClicked(),
      'Enter': () => startCalc(),
      'Backspace': () => deleteButtonClicked(),
      'NumpadAdd': () => operationButtonClicked('+'),
      'NumpadSubtract': () => operationButtonClicked('-'),
      'NumpadMultiply': () => operationButtonClicked('*'),
      'NumpadDivide': () => operationButtonClicked('/'),
      'NumpadEnter': () => startCalc(),
  }

  if(keyboardMap[key]){
    e.preventDefault();
    keyboardMap[key]();
  }else if(keyboardMap[code]){
    e.preventDefault();
    keyboardMap[code]();
  }
})