'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Lancer Nabasf',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Rider Tokunbo',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// DOM MANIPULATION OF THE BANKIST APP
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">
        ${i + 1} ${type}
      </div>
      <div class="movements__value">${mov.toFixed(2)}</div>
    </div>
  `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const outgoings = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outgoings).toFixed(2)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display Summary
  calcDisplaySummary(acc);
};

// EVENT HANDLERS
let currentAccount;

// IMPLEMENTING THE LOGIN FUNCTION (USING THE FIND METHOD)

btnLogin.addEventListener('click', e => {
  // PREVENTING FORM FROM SUBMITTING
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and Welcome Message
    labelWelcome.textContent = `Welcome Back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clearing Input Fields;
    inputLoginUsername.value = inputLoginPin.value = ''; // This works because the assignment operator starts reading from RIGHT to LEFT.
    inputLoginPin.blur();

    // Updating the UI
    updateUI(currentAccount);
  }
});

// IMPLEMENTING TRANSFERS
btnTransfer.addEventListener('click', e => {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= inputTransferAmount.value &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // featuring the debitation and creditation between both accounts involved.
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Updating the UI
    updateUI(currentAccount);
  } else {
    alert('Transfer Invalid');
  }
});

// REQUESTING A LOAN FROM THE BANK (USING THE SOME METHOD)
btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Adding the amount into the movement array
    currentAccount.movements.push(amount);

    // Updating the UI
    updateUI(currentAccount);
  } else {
    alert('You do not qualify to take this loan');
  }

  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

// IMPLEMENTING CLOSING OF ACCOUNT (USING THE FINDINDEX METHOD)
btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    // Deleting the current account using the splice method
    const index = accounts.findIndex(acc => {
      return acc.username === currentAccount.username;
    });

    // Deleting the account
    accounts.splice(index, 1);

    // Logging out the display on the UI.
    containerApp.style.opacity = 0;
  }
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
});

// IMPLEMENTING THE SORT BUTTON
// Initializing a variable to keep track of the sort boolean

let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// LECTURES //
// console.log(23 === 23.0);
// console.log(0.1 + 0.2);
//
// Converting strings to numbers
// console.log(+'23');

// Parsing strings into numbers
// console.log(Number.parseInt('30px', 10));
// console.log(Number.parseInt('2.5rem', 10));

// console.log(Number.parseFloat('2.5rem'));

// chcking if value is NaN
// console.log(Number.isNaN(20));
// console.log(Number.isNaN(+'20x'));
// console.log(Number.isNaN(23/0));

// Checking if value is a number
// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(+'20x'));
// console.log(Number.isFinite(23 / 0));

// console.log(Number.isInteger(24.0));
// console.log(Number.isInteger(+'23'));

////// MATH METHODS /////////////

// console.log(Math.sqrt(36));
// console.log(27 ** (1/3));

// console.log(Math.max(5,23,434,535,4341));
// console.log(Math.max(1,23,434,+'535',4341));
// console.log(Math.min(1,23,434,+'535',4341));

// console.log(Math.PI * Number.parseFloat('20px') ** 2);
// console.log(Math.trunc(Math.random() * 6) + 1);

// const randomInt  = (min, max) => Math.trunc(Math.random() * (max - min) + 1) + min;
// console.log(randomInt(10,20));

// console.log(Math.trunc(-23.3));
// console.log(Math.floor(-23.3));
// console.log(Math.ceil(-23.3));

// Rounding Decimals
// console.log((2.7).toFixed(0));  // returns a string and not a number
// console.log((2.7).toFixed(2));  // returns a string and not a number
// console.log(+(2.345).toFixed(2));  // modified to return a number

// THE REMAINDER OPERATOR
// - Simply returns the remainder of a division.

// console.log(5 % 2);
// console.log(8 % 3);

// console.log(6 % 2);

// const isEven = n => n % 2 === 0;
// console.log(isEven(3));
// console.log(isEven(4));


// labelBalance.addEventListener('click', () => {
//   [...document.querySelectorAll('.movements__row')].forEach((row, i) => {
//     if (i % 2 === 0) {
//       row.style.backgroundColor = 'orangered';
//     }
//     if (i % 3 === 0) {
//       row.style.backgroundColor = 'blue'
//     }
//   });
// });


//// NUMERICAL OPERATORS //////////////

const diameter = 287_460_000_000;
console.log(diameter);

const price = 345_99;
console.log(price);

const transferFee = 15_00;

const PI = 3.1415;
console.log(PI);

console.log(Number('23_000'));