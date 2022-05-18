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

    if (resp.status !== 404) {
      allExpense = result.data;
      render();
    } else {
      throw new Error(result.message);
    };
  } catch (error) {
    alert(error);
  };
};

const addExpense = async() => {
  inputTextExpense = document.querySelector(".expense__where-input > input");
  inputSumExpense = document.querySelector(".expense__sum-input > input");

  if(inputTextExpense.value.trim() === '' || inputSumExpense.value.trim() === '') {
    inputTextExpense.value = "";
    inputSumExpense.value = "";
    return alert("Введите данные");
  };
  try {
    const resp = await fetch(`${url}/createExpense`, {
      method: 'POST',
      headers: headersOption,
      body: JSON.stringify({
        titleExpense: inputTextExpense.value,
        date: new Date().toLocaleDateString('en-GB'),
        cost: inputSumExpense.value
      })
    });
    const result = await resp.json();
    console.log(result);
    if (resp.status !== 404) {
      allExpense.push(result);
      inputTextExpense.value = "";
      inputSumExpense.value = "";
    } else {
      throw new Error(result.message);
    }
  render();
  } catch (error) {
    alert(error);
  };
};

const render = () => {
  const list = document.querySelector(".expense__items");
  let totalSum = document.querySelector(".expense__total-sum");
  
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  };

  let initialValue = 0;
  let checkReduce = allExpense.reduce(function (sum, currentSum) {
    return sum += currentSum.cost;
  }, initialValue);

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

    numberExpense.innerText = `${index+1})`;
    expenseName.innerText = titleExpense;
    expenseDate.innerText = date.split('/').join('.');
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

      enterChangeExpense(_id, el);
    };
  }); 
};

const enterChangeExpense = (_id, el) => {
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

  inputWhere.value = el.titleExpense;
  inputDate.type = 'date';
  inputSum.type = 'number';
  inputSum.value = el.cost;
  inputSum.style.width = '60px';
  inputDate.style.width = '100px';
  
  
  expenseWhere.appendChild(inputWhere);
  expenseInfo.appendChild(inputDate);
  expenseInfo.appendChild(inputSum);
  
  saveBtn.onclick = () => {
    if (inputDate.value === '') {
      alert('Выберите дату');
    } else if (inputWhere.value === '') {
      alert('Введите место траты');
    } else if (inputSum.value === '') {
      alert('Введите cумму траты');
    } else {
    saveChangeExpense(_id);
    };
  };  
};

const saveChangeExpense = async(_id) => {
  const inputWhere = document.getElementById(`inputWhere-${_id}`);
  const inputDate = document.getElementById(`inputDate-${_id}`);
  const inputSum = document.getElementById(`inputSum-${_id}`);

  try {
    const resp = await fetch(`${url}/changeExpense`, {
      method: 'PATCH',
      headers: headersOption,
        body: JSON.stringify({
          titleExpense: inputWhere.value,
          date: inputDate.value.split('-').reverse().join('.'),
          cost: inputSum.value,
          _id: _id
        })
      });
    const response = await resp.json();

    if (resp.status !== 404) {
      allExpense = response;
      render();
    } else {
      throw new Error(response.message);
    };
  } catch (error) {
    alert(error);
  };
};

const deleteExpense = async (id) => { 
  try {
    const resp = await fetch(`${url}/deleteExpense/?id=${id}`, {
      method: 'DELETE', 
    });   
    const response = await resp.json();
    
    if (resp.status !== 404) {
      allExpense = allExpense.filter((item) => id !== item._id);
      render();
    } else {
      throw new Error(response.message);
    };
  } catch (error) {
    alert(error);
  };
};