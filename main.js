import currency from 'currency.js';
import './style.css';

const inputValue = document.querySelector('#input-value');
const resetBtn = document.querySelector('#reset-btn');
const submitBtn = document.querySelector('#submit-btn');
const randomBtn = document.querySelector('#random-btn');
const audio = document.querySelector('#audio');
const dollars = document.querySelector('#dollars');
const quarters = document.querySelector('#quarters');
const dimes = document.querySelector('#dimes');
const nickels = document.querySelector('#nickels');
const pennies = document.querySelector('#pennies');
const dollarsLabel = document.querySelector('#dollars-label');
const quartersLabel = document.querySelector('#quarters-label');
const dimesLabel = document.querySelector('#dimes-label');
const nickelsLabel = document.querySelector('#nickels-label');
const penniesLabel = document.querySelector('#pennies-label');

const changeElemArray = [dollars, quarters, dimes, nickels, pennies];
const labelsElemArray = [dollarsLabel, quartersLabel, dimesLabel, nickelsLabel, penniesLabel];

const defaultValue = '1.41';
let animating = false; // set to true when animating

const coinImages = ['dime.png', 'dollar.png', 'nickel.png', 'penny.png', 'quarter.png'];
preloadImages('images/coins/', coinImages);
audio.muted = false; // unmute the audio when script loads

function preloadImages(dir, images) {
  images.forEach(image => {
    const imgSrc = `${dir}${image}`;
    new Image().src = imgSrc;
  });
}

function resetInput() {
  inputValue.value = defaultValue;
  if (!animating) {
    clearChangeElems(changeElemArray);
    clearChangeElems(labelsElemArray);
  }
}

function submitInput(random=false) {
  inputValue.value = currency(inputValue.value);
  if (!animating) {
    let value = inputValue.value;
    let change = (random) ? getRandomChange(value) : getChange(value);

    audio.fastSeek(0);
    audio.play();
    clearChangeElems(changeElemArray);
    clearChangeElems(labelsElemArray);
    displayChangeElems(change);
    updateChangeLabels(change);
  }
}

function getChange(value) {
  let change = {dollar: 0, quarter: 0, dime: 0, nickel: 0, penny: 0};
  let v = currency(value);

  while (v > 0) {
    if (v >= 1.00) {
      v = v.subtract(1.00);
      change.dollar += 1;
    } else if (v >= 0.25) {
      v = v.subtract(0.25);
      change.quarter += 1;
    } else if (v >= 0.10) {
      v = v.subtract(0.10);
      change.dime += 1;
    } else if (v >= 0.05) {
      v = v.subtract(0.05);
      change.nickel += 1;
    } else if (v >= 0.01) {
      v = v.subtract(0.01);
      change.penny += 1;
    }
  }
  // console.log(change);
  return change;
}

function getRandomChange(value) {
  const changeValues = {dollar: 1.00, quarter: 0.25, dime: 0.10, nickel: 0.05, penny: 0.01};
  const changeTypes = Object.keys(changeValues);
  let change = {dollar: 0, quarter: 0, dime: 0, nickel: 0, penny: 0};
  let v = currency(value);
  let coin;

  while (v > 0) {
    // Get a random coin
    coin = changeTypes[Math.floor(Math.random() * changeTypes.length)];
    if (v >= changeValues[coin]) {
      change[coin] += 1;
      v = v.subtract(changeValues[coin]);
    }
  }
  console.log(change);
  return change;
}

function createImgElement(type) {
  const newImgElem = document.createElement('img');
  newImgElem.src = `images/coins/${type}.png`;

  switch (type) {
    case 'dollar': newImgElem.style.height = '55px'; break;
    case 'dime': newImgElem.style.height = '35px'; break;
    case 'nickel': newImgElem.style.height = '45px'; break;
    case 'penny': newImgElem.style.height = '40px'; break;
    default: newImgElem.style.height = '50px'; break;
  }
  return newImgElem;
}

function displayChangeElems(change, delay=250) {
  let delayTime = 0;
  let newElem;

  animating = true; // disable submit and reset during animation

  Object.keys(change).forEach((type, i) => {
    Array(change[type]).fill().forEach(() => {
      setTimeout(() => {
        newElem = createImgElement(type);
        changeElemArray[i].append(newElem);
      }, delayTime);
      
      delayTime += Math.floor(delay / change[type]);
    });
  });

  setTimeout(() => {
    animating = false; // reenable when finished
  }, delayTime);
}

function clearChangeElems(elemArray) {
  elemArray.forEach(elem => {
    elem.innerHTML = null;
  });
}

function updateChangeLabels(change) {
  Object.keys(change).forEach((type, i) => {
    Array(change[type]).fill().forEach(() => {
      labelsElemArray[i].innerHTML = `x${change[type]}`;
    });
  });
}

// Event listeners
resetBtn.addEventListener('click', resetInput);
submitBtn.addEventListener('click', () => submitInput(false));
randomBtn.addEventListener('click', () => submitInput(true));

// Shortcut key event listeners
document.addEventListener('keydown', (e) => {
  // console.log(e.key);
  if (e.key === 'Enter') {
    e.preventDefault();
    submitInput();
  } else if (e.key === 'r') {
    e.preventDefault();
    resetInput();
  };
});