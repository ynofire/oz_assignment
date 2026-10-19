const display = document.querySelector("#display");
const numberBtns = document.querySelectorAll(".number");
const operatorBtns = document.querySelectorAll(".operator");
const clearBtn = document.querySelector(".clear");
const enterBtn = document.querySelector(".enter");
const powerBtn = document.querySelector(".on-off");

let isOn = true;

function calculate(expr) {
  const tokens = expr.replace(/\s+/g, "").match(/(\d+(\.\d+)?|[+\-*/])/g);
  if (!tokens) return 0;

  const pass1 = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === "*" || token === "/") {
      const prev = Number(pass1.pop());
      const next = Number(tokens[++i]);
      pass1.push(token === "*" ? prev * next : prev / next);
    } else {
      pass1.push(token);
    }
  }

  let result = Number(pass1[0]);
  for (let i = 1; i < pass1.length; i += 2) {
    const op = pass1[i];
    const next = Number(pass1[i + 1]);
    if (op === "+") result += next;
    else if (op === "-") result -= next;
  }

  return result;
}

numberBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!isOn) return;
    if (display.value === "0" || display.value === "Error") {
      display.value = btn.textContent;
    } else {
      display.value += btn.textContent;
    }
  });
});

operatorBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!isOn) return;
    display.value += btn.textContent;
  });
});

clearBtn.addEventListener("click", () => {
  display.value = "0";
});

powerBtn.addEventListener("click", () => {
  isOn = !isOn;
  display.value = isOn ? "0" : "";
});

enterBtn.addEventListener("click", () => {
  if (!isOn) return;
  try {
    display.value = calculate(display.value);
  } catch (e) {
    display.value = "Error";
  }
});
