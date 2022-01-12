'use strict';

const middleColumn = document.querySelector('.middle-column');
async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch('https://web-lab3k.herokuapp.com/v1/graphql', {
    method: 'POST',
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

const getItems = `query MyQuery {
  accordion {
    content
    title
  }
}`;

const displayItems = items => {
  middleColumn.innerHTML = '';
  const itemsEl = document.createElement('div');
  itemsEl.classList.add('items');
  middleColumn.appendChild(itemsEl);

  items.forEach((item, index) => {
    const itemEl = document.createElement('div');
    itemEl.classList.add('item');
    itemEl.innerHTML = `
        <input type="radio" id="radio${index}" name="radio">
        <label class="item-title" for="radio${index}">${item.title}</label>
        <div class="item-content">
          ${item.content}
        </div>`;

    itemsEl.appendChild(itemEl);
  });
};

fetchGraphQL(getItems, 'MyQuery', {}).then(output => {
  const items = output.data.accordion;
  displayItems(items);
});

