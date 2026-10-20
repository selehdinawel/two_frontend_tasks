const display = document.getElementById("display");
const history = document.getElementById("history");
let expression = "";

function refresh() {
  display.textContent = expression || "0";
}

function addValue(value) {
  if (expression === "Error") expression = "";

  if (value === ".") {
    const parts = expression.split(/[+\-*/%]/);
    if (parts[parts.length - 1].includes(".")) return;
    if (!expression || /[+\-*/%]$/.test(expression)) expression += "0";
  }

  if (/[+\-*/%]/.test(value)) {
    if (!expression && value !== "-") return;
    if (/[+\-*/%]$/.test(expression)) {
      expression = expression.slice(0, -1) + value;
    } else {
      expression += value;
    }
  } else {
    expression += value;
  }
  refresh();
}

function clearAll() {
  expression = "";
  history.textContent = "";
  refresh();
}

function deleteLast() {
  expression = expression.slice(0, -1);
  refresh();
}

function calculate() {
  if (!expression) return;
  if (!/[0-9]$/.test(expression)) return;

  try {
    const safeExpression = expression.replace(/%/g, "/100");
    const result = Function('"use strict"; return (' + safeExpression + ')')();

    if (!Number.isFinite(result)) throw new Error("Invalid");
    history.textContent = expression.replace(/\*/g, "×").replace(/\//g, "÷") + " =";
    expression = String(Number(result.toFixed(10)));
    refresh();
  } catch {
    expression = "Error";
    refresh();
    setTimeout(clearAll, 900);
  }
}

document.querySelectorAll(".key").forEach(button => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    if (action === "clear") clearAll();
    else if (action === "delete") deleteLast();
    else if (action === "equals") calculate();
    else addValue(button.dataset.value);
  });
});

document.addEventListener("keydown", e => {
  if (/^[0-9.]$/.test(e.key)) addValue(e.key);
  else if (["+", "-", "*", "/", "%"].includes(e.key)) addValue(e.key);
  else if (e.key === "Enter" || e.key === "=") calculate();
  else if (e.key === "Backspace") deleteLast();
  else if (e.key === "Escape" || e.key.toLowerCase() === "c") clearAll();
});

refresh();