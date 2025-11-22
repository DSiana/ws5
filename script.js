const originalContent = {};

window.onload = function () {
  const blocks = document.querySelectorAll("[data-block-id]");
  blocks.forEach((block) => {
    originalContent[block.getAttribute("data-block-id")] = block.innerHTML;
  });

  swapXY();

  calculateAndShowCircleArea();

  handleCookiesTask();

  handleColorChangeTask();

  initBlockEditing();
};

function swapXY() {
  const x = document.getElementById("x");
  const y = document.getElementById("y");

  if (x && y) {
    const temp = x.innerHTML;
    x.innerHTML = y.innerHTML;
    y.innerHTML = temp;
  }
}

function calculateAndShowCircleArea() {
  const radius = 10;

  function circleArea(r) {
    return Math.PI * Math.pow(r, 2);
  }

  const area = circleArea(radius);
  const block3 = document.querySelector('[data-block-id="3"]');
  if (block3) {
    const resultDiv = document.createElement("div");
    resultDiv.style.marginTop = "15px";
    resultDiv.style.borderTop = "1px solid #333";
    resultDiv.innerHTML = `<b>Завдання 2:</b> Площа кола (R=${radius}) = ${area.toFixed(
      2
    )}`;
    block3.appendChild(resultDiv);
  }
}

function handleCookiesTask() {
  const cookieName = "maxCountResult";
  const savedCookie = getCookie(cookieName);
  if (savedCookie) {
    const userDelete = confirm(
      `Збережений результат (кількість макс. чисел): ${savedCookie}.\nВидалити дані з cookies?`
    );
    if (userDelete) {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      location.reload();
    } else {
      alert(
        "Cookies наявні. Для роботи з формою необхідно перезавантажити сторінку після видалення cookies."
      );
    }
  } else {
    const block3 = document.querySelector('[data-block-id="3"]');
    const formContainer = document.createElement("div");
    formContainer.innerHTML = `
            <h3>Завдання 3: Введіть 10 чисел</h3>
            <form id="numbersForm">
                ${Array.from(
                  { length: 10 },
                  (_, i) =>
                    `<input type="number" name="num" style="width: 40px; margin: 2px;" required>`
                ).join("")}
                <br><button type="submit">Знайти кількість максимальних</button>
            </form>
        `;
    block3.appendChild(formContainer);

    document
      .getElementById("numbersForm")
      .addEventListener("submit", function (e) {
        e.preventDefault();
        const inputs = this.querySelectorAll('input[name="num"]');
        const values = Array.from(inputs).map((input) =>
          parseFloat(input.value)
        );
        const maxVal = Math.max(...values);
        const countMax = values.filter((v) => v === maxVal).length;
        alert(`Максимальне число: ${maxVal}. Кількість входжень: ${countMax}`);
        document.cookie = `${cookieName}=${countMax}; path=/;`;
      });
  }
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

function handleColorChangeTask() {
  const block2 = document.querySelector('[data-block-id="2"]');
  const storageKey = "block2Color";
  const savedColor = localStorage.getItem(storageKey);
  if (savedColor) {
    block2.style.backgroundColor = savedColor;
  }
  const colorInputDiv = document.createElement("div");
  colorInputDiv.innerHTML = `<p><i>Введіть колір (напр. red, #f00):</i> <input type="text" id="colorInput"></p>`;
  block2.appendChild(colorInputDiv);
  const input = document.getElementById("colorInput");
  input.addEventListener("blur", function () {
    const color = this.value;
    if (color) {
      block2.style.backgroundColor = color;
      localStorage.setItem(storageKey, color);
    }
  });
}

function initBlockEditing() {
  const blocks = document.querySelectorAll("[data-block-id]");
  blocks.forEach((block) => {
    const id = block.getAttribute("data-block-id");
    const savedContent = localStorage.getItem(`block${id}_content`);
    if (savedContent) {
      block.innerHTML = savedContent;
      block.style.backgroundColor =
        localStorage.getItem(`block${id}_bgcolor`) || "";
      addRestoreButton(block, id);
    }

    block.addEventListener("dblclick", function (e) {
      if (e.target.tagName === "TEXTAREA" || e.target.tagName === "BUTTON")
        return;

      enableEditing(this, id);
    });
  });
}

function enableEditing(block, id) {
  const currentContent = block.innerHTML;
  block.innerHTML = "";
  const textarea = document.createElement("textarea");
  textarea.style.width = "95%";
  textarea.style.height = "100px";
  textarea.value = currentContent;
  const saveBtn = document.createElement("button");
  saveBtn.innerText = "Зберегти";

  saveBtn.onclick = function () {
    const newContent = textarea.value;
    localStorage.setItem(`block${id}_content`, newContent);
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    localStorage.setItem(`block${id}_bgcolor`, randomColor);
    block.style.backgroundColor = randomColor;
    block.innerHTML = newContent;
    addRestoreButton(block, id);
  };

  block.appendChild(textarea);
  block.appendChild(document.createElement("br"));
  block.appendChild(saveBtn);
}

function addRestoreButton(block, id) {
  const restoreBtn = document.createElement("button");
  restoreBtn.innerText = "Відновити початковий вміст";
  restoreBtn.style.display = "block";
  restoreBtn.style.marginTop = "10px";

  restoreBtn.onclick = function () {
    localStorage.removeItem(`block${id}_content`);
    localStorage.removeItem(`block${id}_bgcolor`);
    block.innerHTML = originalContent[id];
    block.style.backgroundColor = "";
  };

  block.appendChild(restoreBtn);
}
