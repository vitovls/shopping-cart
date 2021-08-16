const ITEM_URL = 'https://api.mercadolibre.com/items';
const SEARCH_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=';

const fetchProductItems = async (itemID) => {
  const item = await fetch(`${ITEM_URL}/${itemID}`);
  return item.json();
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const cartProducts = document.querySelector('.cart__item');
function cartItemClickListener() {
  return cartProducts.remove();
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

const totalPrice = () => {
  cartProducts.forEach((cartItemLI) => {
    const cartItemText = cartItemLI.innerText.split('$');
    const total = parseFloat(cartItemText[1]);
    const pricelocal = document.querySelector('total-price');
    const price = `R$ ${total}`;
    pricelocal.innerHTML = price;
  });
};

const createPrice = document.createElement('div');
const cartArea = document.querySelector('.cart');
createPrice.className = 'total-price';
cartArea.appendChild(createPrice);
createPrice.innerText = 'R$ 0';

function createPriceArea() {
  const cartItems = document.querySelectorAll('.cart__item');
  let total = 0;
  cartItems.forEach((cartItemLI) => {
    const cartItemText = cartItemLI.innerText.split('$');
    total += parseFloat(cartItemText[1]);
  });
  const priceLocal = document.querySelector('.total-price');
  const price = `R$ ${total}`;
  priceLocal.innerText = `${price}`;
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.addEventListener('click', totalPrice);
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
    const allCartItens = document.querySelector('.cart__items');
    allCartItens.appendChild(createObjItens);
  });
};

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const buttonAdd = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonAdd.addEventListener('click', () => addButtonClickLister(sku));
  buttonAdd.addEventListener('click', createPriceArea);
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
  document.querySelector('.cart__items').innerHTML = '';
});

window.onload = () => { 
  fetchComputers();
};