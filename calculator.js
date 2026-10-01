const resultDisplay = document.querySelector('#result');
const expressionDisplay = document.querySelector('#expression');
const keypad = document.querySelector('.keypad');

let currentInput = '0';
let storedValue = null;
let pendingOperator = null;
let shouldReplaceInput = false;
let lastOperation = null;
let expression = '';

const operatorSymbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };

function formatValue(value) {
  if (!Number.isFinite(value)) return 'Error';
  const rounded = Number.parseFloat(value.toPrecision(11));
  return Object.is(rounded, -0) ? '0' : String(rounded);
}

function render() {
  resultDisplay.textContent = currentInput;
  expressionDisplay.textContent = expression || '\u00a0';
}

function enterDigit(digit) {
  if (currentInput === 'Error' || shouldReplaceInput) {
    currentInput = digit;
    shouldReplaceInput = false;
  } else if (currentInput.replace('-', '').replace('.', '').length < 12) {
    currentInput = currentInput === '0' ? digit : currentInput + digit;
  }
  render();
}

function enterDecimal() {
  if (currentInput === 'Error' || shouldReplaceInput) {
    currentInput = '0.';
    shouldReplaceInput = false;
  } else if (!currentInput.includes('.')) {
    currentInput += '.';
  }
  render();
}

function calculate(left, right, operator) {
  switch (operator) {
    case '+': return left + right;
    case '-': return left - right;
    case '*': return left * right;
    case '/': return right === 0 ? NaN : left / right;
    default: return right;
  }
}

function chooseOperator(operator) {
  if (currentInput === 'Error') clearAll();
  const value = Number(currentInput);

  if (pendingOperator && !shouldReplaceInput) {
    const nextValue = calculate(storedValue, value, pendingOperator);
    currentInput = formatValue(nextValue);
    storedValue = Number(currentInput);
  } else {
    storedValue = value;
  }

  pendingOperator = operator;
  lastOperation = null;
  expression = `${formatValue(storedValue)} ${operatorSymbols[operator]}`;
  shouldReplaceInput = true;
  render();
}

function showError() {
  currentInput = 'Error';
  storedValue = null;
  pendingOperator = null;
  lastOperation = null;
  expression = 'Cannot divide by zero';
  shouldReplaceInput = true;
}

function calculateResult() {
  if (currentInput === 'Error') return;

  let left;
  let right;
  let operator;

  if (pendingOperator) {
    left = storedValue;
    right = Number(currentInput);
    operator = pendingOperator;
    lastOperation = { operator, operand: right };
  } else if (lastOperation) {
    left = Number(currentInput);
    right = lastOperation.operand;
    operator = lastOperation.operator;
  } else {
    return;
  }

  const answer = calculate(left, right, operator);
  if (!Number.isFinite(answer)) {
    showError();
    render();
    return;
  }

  expression = `${formatValue(left)} ${operatorSymbols[operator]} ${formatValue(right)} =`;
  currentInput = formatValue(answer);
  storedValue = null;
  pendingOperator = null;
  shouldReplaceInput = true;
  render();
}

function clearAll() {
  currentInput = '0';
  storedValue = null;
  pendingOperator = null;
  shouldReplaceInput = false;
  lastOperation = null;
  expression = '';
  render();
}

function applyAction(action) {
  if (action === 'clear') {
    clearAll();
  } else if (action === 'equals') {
    calculateResult();
  } else if (action === 'decimal') {
    enterDecimal();
  } else if (action === 'sign' && currentInput !== 'Error' && Number(currentInput) !== 0) {
    currentInput = formatValue(-Number(currentInput));
    render();
  } else if (action === 'percent' && currentInput !== 'Error') {
    currentInput = formatValue(Number(currentInput) / 100);
    shouldReplaceInput = false;
    render();
  } else if (action === 'backspace' && currentInput !== 'Error' && !shouldReplaceInput) {
    currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
    if (currentInput === '-') currentInput = '0';
    render();
  }
}

keypad.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  if (button.dataset.digit !== undefined) enterDigit(button.dataset.digit);
  else if (button.dataset.operator) chooseOperator(button.dataset.operator);
  else if (button.dataset.action) applyAction(button.dataset.action);
});

document.addEventListener('keydown', (event) => {
  if (/^[0-9]$/.test(event.key)) enterDigit(event.key);
  else if (event.key === '.') enterDecimal();
  else if (['+', '-', '*', '/'].includes(event.key)) chooseOperator(event.key);
  else if (event.key === 'Enter' || event.key === '=') {
    event.preventDefault();
    calculateResult();
  } else if (event.key === 'Backspace') {
    event.preventDefault();
    applyAction('backspace');
  } else if (event.key === 'Escape') clearAll();
  else if (event.key === '%') applyAction('percent');
});

render();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((error) => {
      console.error('Service worker registration failed:', error);
    });
  });
}
