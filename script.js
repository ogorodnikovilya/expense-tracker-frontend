let allExpense = [];
const url = 'http://localhost:8080';
const headersOption = {
  'Content-type':'application/json;charset=utf-8',
  'Access-Control-Allow-Origin': '*'
};

window.onload = async() => {
  try {
    const resp = await fetch(`${url}/allExpense`, {
      method: 'GET'
    });
    const result = await resp.json();

    allExpense = result.data;
    render();
  } catch (error) {
    alert('Ошибка загрузки данных');
  };
};

const addExpense = async() => {
  inputTextExpense = document.querySelector(".expense__where-input > input");
  inputSumExpense = document.querySelector(".expense__sum-input > input");

  if(inputTextExpense.value.trim() === '' 
    || inputSumExpense.value.trim() === ''
    || inputTextExpense === null
    || inputSumExpense === null
  ){
    inputTextExpense.value = "";
    inputSumExpense.value = "";
    return;
  };
  try {
    const resp = await fetch(`${url}/createExpense`, {
      method: 'POST',
      headers: headersOption,
      body: JSON.stringify({
        titleExpense: inputTextExpense.value,
        cost: +inputSumExpense.value
      })
    });
    const result = await resp.json();

    allExpense.push(result);
    inputTextExpense.value = "";
    inputSumExpense.value = "";
    render();
  } catch (error) {
    alert('Ошибка добавления данных');
  };
};

const render = () => {
  const list = document.querySelector(".expense__items");
  const totalSum = document.querySelector(".expense__total-sum");

  if (list !== null && totalSum !== null) {
    while (list.firstChild) {
      list.removeChild(list.firstChild);
    };
  
    let checkReduce = allExpense.reduce((sum, currentSum) => {
      return sum += currentSum.cost;
    }, 0);
  
    totalSum.innerText = `${checkReduce} р.`;
  
    allExpense.forEach((el, index) => {
      const {titleExpense, date, _id, cost} = el;
  
      const expenseItem = document.createElement('div');
      const expenseWhere = document.createElement('div');
      const numberExpense = document.createElement('div');
      const expenseName = document.createElement('div');
      const aboutExpense = document.createElement('div');
      const expenseInfo = document.createElement('div');
      const expenseDate = document.createElement('div');
      const expenseSum = document.createElement('div');
      const expenseChange = document.createElement('div');
      const expenseEdit = document.createElement('div');
      const editBtn = document.createElement('button');
      const editImg = document.createElement('img');
      const expenseDelete = document.createElement('div');
      const deleteBtn = document.createElement('button');
      const deleteImg = document.createElement('img');
  
      expenseWhere.id = `expenseWhere-${_id}`;
      expenseChange.id = `expenseChange-${_id}`;
      expenseInfo.id = `expenseInfo-${_id}`;
      expenseDelete.id = `expenseDelete-${_id}`;
  
      expenseItem.classList.add('expense__item');
      expenseWhere.classList.add('expense__item-where');
      numberExpense.classList.add('expense__item-index');
      expenseName.classList.add('expense__item-name');
      aboutExpense.classList.add('expense__item-about');
      expenseInfo.classList.add('expense__item-info');
      expenseDate.classList.add('expense__item-date');
      expenseSum.classList.add('expense__item-sum');
      expenseChange.classList.add('expense__item-icons');
      expenseEdit.classList.add('expense__item-edit');
      editBtn.classList.add('expense__item-edit-btn');
      expenseDelete.classList.add('expense__item-delete');
      deleteBtn.classList.add('expense__item-delete-btn');
  
      numberExpense.innerText = `${index + 1})`;
      expenseName.innerText = titleExpense;
      expenseDate.innerText = moment(date).format('DD.MM.YY');
      expenseSum.innerText = `${cost} р.`;
      editImg.src = 'img/edit.png';
      deleteImg.src = 'img/delete.png';
  
      list.appendChild(expenseItem);
      expenseItem.appendChild(expenseWhere);
      expenseItem.appendChild(aboutExpense);
      expenseWhere.appendChild(numberExpense);
      expenseWhere.appendChild(expenseName);
      aboutExpense.appendChild(expenseInfo);
      aboutExpense.appendChild(expenseChange);
      expenseInfo.appendChild(expenseDate);
      expenseInfo.appendChild(expenseSum);
      expenseChange.appendChild(expenseEdit);
      expenseChange.appendChild(expenseDelete);
      expenseEdit.appendChild(editBtn);
      editBtn.appendChild(editImg);
      expenseDelete.appendChild(deleteBtn);
      deleteBtn.appendChild(deleteImg);
  
      expenseDelete.onclick = () => {
        deleteExpense(_id);
      };
  
      expenseEdit.onclick = () => {
        expenseChange.removeChild(expenseEdit);
        expenseWhere.removeChild(expenseName);
        expenseInfo.removeChild(expenseDate);
        expenseInfo.removeChild(expenseSum);
  
        enterChangeExpense(el);
      };
    });
  } else {
    return;
  };
};

const enterChangeExpense = (el) => {
  const {titleExpense, _id, cost, date} = el;
  const expenseChange = document.getElementById(`expenseChange-${_id}`);
  const expenseInfo = document.getElementById(`expenseInfo-${_id}`);
  const expenseWhere = document.getElementById(`expenseWhere-${_id}`);
  const expenseDelete = document.getElementById(`expenseDelete-${_id}`);
  
  const expenseSave = document.createElement('div');
  const saveBtn = document.createElement('button');
  const saveImg = document.createElement('img');

  expenseSave.classList.add('expense__item-edit');
  saveBtn.classList.add('expense__item-edit-btn');
  saveImg.src = 'img/done.png';
  
  expenseChange.appendChild(expenseSave);
  expenseSave.appendChild(saveBtn);
  saveBtn.appendChild(saveImg);
  expenseChange.appendChild(expenseDelete);

  const inputWhere = document.createElement("input");
  const inputDate = document.createElement("input");
  const inputSum = document.createElement("input");

  inputWhere.id = `inputWhere-${_id}`;
  inputDate.id = `inputDate-${_id}`;
  inputSum.id = `inputSum-${_id}`;

  inputWhere.classList.add('expense__item-name');
  inputDate.classList.add('expense__item-date');
  inputSum.classList.add('expense__item-sum');

  inputWhere.value = titleExpense;
  inputDate.type = 'date';
  inputDate.value = moment(date).format('YYYY-MM-DD')
  inputSum.type = 'number';
  inputSum.value = cost;
  
  expenseWhere.appendChild(inputWhere);
  expenseInfo.appendChild(inputDate);
  expenseInfo.appendChild(inputSum);
  
  saveBtn.onclick = () => {
    if (inputDate.value === '') {
      alert('Выберите дату');
      return;
    };
    if (inputWhere.value === '') {
      alert('Введите место траты');
      return;
    };
    if (inputSum.value === '') {
      alert('Введите cумму траты');
      return;
    };
    saveChangeExpense(_id);
  };
};

const saveChangeExpense = async(id) => {
  const inputWhere = document.getElementById(`inputWhere-${id}`);
  const inputDate = document.getElementById(`inputDate-${id}`);
  const inputSum = document.getElementById(`inputSum-${id}`);

  try {
    const resp = await fetch(`${url}/changeExpense`, {
      method: 'PATCH',
      headers: headersOption,
      body: JSON.stringify({
        titleExpense: inputWhere.value,
        date: moment(inputDate.value),
        cost: +inputSum.value,
        _id: id
      })
    });
    const response = await resp.json();
    const {_id, titleExpense, date, cost} = response;

    allExpense.forEach(el => {
      if (el._id === _id) {
        el.titleExpense = titleExpense;
        el.date = date;
        el.cost = cost;
      };
    });
    render();
  } catch (error) {
    alert('Ошибка сохранения данных');
  };
};

const deleteExpense = async (id) => { 
  try {
    await fetch(`${url}/deleteExpense/?id=${id}`, {
      method: 'DELETE', 
    });

    allExpense = allExpense.filter((item) => id !== item._id);
    render();
  } catch (error) {
    alert('Ошибка удаления данных');
  };
};