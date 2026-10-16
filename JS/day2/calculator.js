function start() {
  const expr = prompt("계산식을 입력해 (예: 3 + 5 * 2 - 8 / 4):");
  if (!expr) return;

  // 1. 공백 제거 후 숫자와 연산자(+ - * /) 분리
  const tokens = expr.replace(/\s+/g, "").match(/(\d+(\.\d+)?|[+\-*/])/g);
  if (!tokens) return console.log("올바른 수식이 아니야.");

  // 2. 1단계: 곱셈(*)과 나눗셈(/) 먼저 처리
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

  // 3. 2단계: 덧셈(+)과 뺄셈(-) 순차 처리
  let result = Number(pass1[0]);
  for (let i = 1; i < pass1.length; i += 2) {
    const op = pass1[i];
    const next = Number(pass1[i + 1]);
    if (op === "+") result += next;
    else if (op === "-") result -= next;
  }

  console.log(`결과: ${expr} = ${result}`);
}