const CART_ITEM_CLASS = document.querySelector('.cart__items');
const ITEM_URL = 'https://api.mercadolibre.com/items';
const SEARCH_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=';

const fetchProductItems = async (itemID) => {
  const item = await fetch(`${ITEM_URL}/${itemID}`);
  return item.json();
};

const setStorage = () => {
  localStorage.setItem('itensCart', CART_ITEM_CLASS.innerHTML);
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function calculateTotalPrice() {
  const cartItemsLi = document.querySelectorAll('.cart__item');
  let totalPrice = 0;
  cartItemsLi.forEach((cartItemLi) => {
    const cartItemText = cartItemLi.innerText.split('$');
    totalPrice += parseFloat(cartItemText[1]);
  });
  document.querySelector('.total-price').innerText = totalPrice;
}

function cartItemClickListener(event) {
  event.target.remove();
  calculateTotalPrice();
  setStorage();
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const createTotalPriceElement = () => {
  const createSpanPrice = document.createElement('span');
  createSpanPrice.className = 'total-price';
  createSpanPrice.innerText = 'R$ 0';
  document.querySelector('.cart').appendChild(createSpanPrice);
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addButtonClickLister = (sku) => {
  fetchProductItems(sku)
  .then((results) => {
    const createObjItens = createCartItemElement({
      sku: results.id, 
      name: results.title, 
      salePrice: results.price,
    });
    CART_ITEM_CLASS.appendChild(createObjItens);
    calculateTotalPrice();
    setStorage();
  });
};

function getStorage() {
  CART_ITEM_CLASS.innerHTML = localStorage.getItem('itensCart');
  const cartsLI = document.querySelectorAll('.cart__item');
  cartsLI.forEach((li) => li.addEventListener('click', cartItemClickListener));
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonAdd = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonAdd.addEventListener('click', () => addButtonClickLister(sku));
  section.appendChild(buttonAdd);
  return section;
}

const fetchComputers = () => {
  const search = fetch(`${SEARCH_URL}/computador`)
  .then((computerObj) => computerObj.json())
  .then(({ results }) => results.forEach((computer) => {
    const myObjComputer = {
      sku: computer.id,
      name: computer.title,
      image: computer.thumbnail,
    };
    const listItems = document.querySelector('.items');
    listItems.appendChild(createProductItemElement(myObjComputer));
  }));
  return search;
};

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

document.querySelector('.empty-cart').addEventListener('click', () => {
  CART_ITEM_CLASS.innerHTML = '';
  const priceLocal = document.querySelector('.total-price');
  priceLocal.innerText = 'R$ 0';
});

window.onload = () => {
  fetchComputers();
  createTotalPriceElement();
  getStorage();
  calculateTotalPrice();
};