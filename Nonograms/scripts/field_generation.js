import {clickOnCell} from "./logic.js";

function calculateCrosswordNumbers(crosswordData) {
  const rowNumbers = [];
  const colNumbers = [];

  // Генерируем номера для строк
  for (let i = 0; i < crosswordData.length; i++) {
    const row = [];
    let count = 0;
    for (let j = 0; j < crosswordData[i].length; j++) {
      if (crosswordData[i][j] === '#') {
        count++;
      } else if (count > 0) {
        row.push(count);
        count = 0;
      }
    }
    if (count > 0) {
      row.push(count);
    }
    rowNumbers.push(row);
  }

  // Генерируем номера для столбцов
  for (let j = 0; j < crosswordData[0].length; j++) {
    const col = [];
    let count = 0;
    for (let i = 0; i < crosswordData.length; i++) {
      if (crosswordData[i][j] === '#') {
        count++;
      } else if (count > 0) {
        col.push(count);
        count = 0;
      }
    }
    if (count > 0) {
      col.push(count);
    }
    colNumbers.push(col);
  }

  return { rowNumbers, colNumbers };
}

function correctNumbersField(numberField) {
  const fixedFieldSize = numberField.reduce((max, col) => Math.max(max, col.length), 0);
  for (let i = 0; i < numberField.length; i++) {
    if (numberField[i].length < fixedFieldSize) {
      const n = fixedFieldSize - numberField[i].length
      for (let j = 0; j < n; j++) {
        numberField[i].unshift(0);
      }
    }
  }
  return numberField
}

function generateColNumbersField(fixedColumnNumbers){
  const colTable = document.getElementById('column-field');
  for (let i = 0; i < fixedColumnNumbers[0].length; i++) {
    const colRow = document.createElement('tr');
    for (let j = 0; j < fixedColumnNumbers.length; j++) {
      const tdNum = document.createElement('td');
      const num = fixedColumnNumbers[j][i];
      tdNum.classList.add(num !== 0 ? 'num' : 'num-empty');
      tdNum.textContent = num !== 0 ? num : '';
      colRow.appendChild(tdNum);
    }
    colTable.appendChild(colRow);
  }
}
function generateRowNumbersField(fixedRowNumbers){
  const rowTable = document.getElementById('row-field');
  for (let i = 0; i < fixedRowNumbers.length; i++) {
    const rowRow = document.createElement('tr');
    for (let j = 0; j < fixedRowNumbers[0].length; j++) {
      const tdNum = document.createElement('td');
      const num = fixedRowNumbers[i][j];
      tdNum.classList.add(num !== 0 ? 'num' : 'num-empty');
      tdNum.textContent = num !== 0 ? num : '';
      rowRow.appendChild(tdNum);
    }
    rowTable.appendChild(rowRow);
  }
}

function generateCrosswordField(width, height) {
  const field = document.getElementById('crossword-field');
  for (let i = 0; i < height; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < width; j++) {
      const cell = document.createElement('td');
      cell.classList.add('cell-empty');
      cell.onclick = () => clickOnCell(cell);
      cell.setAttribute('id',`cell_${j}_${i}`)
      row.appendChild(cell);
    }
    field.appendChild(row);
  }
}
export function generateCrosswordNumbers(crosswordData) {
  // Получаем объект с массивами чисел для строк и столбцов
  const crosswordNumbers = calculateCrosswordNumbers(crosswordData);
  const colNumbers = correctNumbersField(crosswordNumbers.colNumbers);
  const rowNumbers = correctNumbersField(crosswordNumbers.rowNumbers);
  generateColNumbersField(colNumbers);
  generateRowNumbersField(rowNumbers);
  generateCrosswordField(colNumbers.length, rowNumbers.length);
}