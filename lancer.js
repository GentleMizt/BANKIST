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

// DOM MANIPULATION OF THE BANKIST APP //

// FUNCTIONS //
const formatCur = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const formatMovementDate = (date, locale) => {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">
        ${i + 1} ${type}
      </div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>
  `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  const formattedMov = formatCur(acc.balance, acc.locale, acc.currency);
  labelBalance.textContent = `${formattedMov}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${formatCur(incomes, acc.locale, acc.currency)}`;

  const outgoings = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${formatCur(Math.abs(outgoings), acc.locale, acc.currency)}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${formatCur(interest, acc.locale, acc.currency)}`;
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
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display Summary
  calcDisplaySummary(acc);
};

// EVENT HANDLERS
let currentAccount;

// FAKE ALWAYS LOGGED IN
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

// Experimenting with the INTERNALIZATION API
// const now = new Date();
// const options = {
//   hour: 'numeric',
//   minute: 'numeric',
//   day: 'numeric',
//   month: 'long',
//   year: 'numeric',
//   weekday: 'short'
// };
// const locale = navigator.language;
// console.log(locale);
// labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);

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

    // Create current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'short'
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

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

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

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

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());

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

  displayMovements(currentAccount, !sorted);
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

// const diameter = 287_460_000_000;
// console.log(diameter);

// const price = 345_99;
// console.log(price);

// const transferFee = 15_00;

// const PI = 3.1415;
// console.log(PI);

// console.log(Number('23_000'));

////////// BIGINT /////////////
// console.log(2 ** 53-1);
// console.log(Number.MAX_SAFE_INTEGER);

// console.log(4358573845738758345784572348573485734534957328532095n);
// console.log(BigInt(4358573845738758345784572348573485734534957328532095));

// // Operations with the BigInt
// console.log(10000n + 10000n);
// console.log(434534543543543534534534545435345345n * 334345235345345345345235345345325345345345n);

// const huge = 3453453453453245325345345n;
// const regular = 23;

// console.log(huge * BigInt(regular));

// Exceptions in BigInt
// console.log(20n > 13);
// console.log(20n === 20);
// console.log(typeof 20n);
// console.log(typeof 20);

// console.log(huge + ' is REALLY BIG');

// Divisions
// console.log(15n/3n);
// console.log(10/3);

/////////// CREATING DATES //////////////

// Create a Date. (There are four ways of creating a date.)\

// const now = new Date(); // 1.
// console.log(now);

// console.log(new Date('Sep 12 2023 12:52:04 ')); // 2.

// console.log(new Date('April 28, 2004'));

// console.log(new Date(account1.movementsDates[0]));

// console.log(new Date(2037, 3, 28, 1, 23, 5)); // 3.

// console.log(new Date(0));
// console.log(new Date(3 * 24 * 60 * 60 * 1000));

// Working with Dates
// const future = new Date(2037, 3, 28, 1, 23);
// console.log(future);

// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());
// console.log(future.getTime());

// console.log(new Date(2124490980000));

// console.log(Date.now()); // To get the current TimeStamp

// future.setFullYear(2040);
// console.log(future);

//// OPERATIONS WITH DATES ////////////

// const future = new Date(2037, 3, 28, 1, 23);
// console.log(+future);

// const calcDaysPassed = (date1, date2) =>
//   Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);
// const days1 = calcDaysPassed(new Date(2037, 3, 18), new Date(2037, 3, 28));
// console.log(days1);

// console.log(new Date('September 05, 2023').toISOString());

// INTERNALIZING DATES //

// const num = 43238843.23;

// const options = {
//   style: 'currency',
//   currency: 'USD',
//   unit: 'mile-per-hour',
//   useGrouping: true,
// }

// console.log('US:',new Intl.NumberFormat('en-US', options).format(num));
// console.log('Germany:',new Intl.NumberFormat('de-DE', options).format(num));
// console.log('Syria:',new Intl.NumberFormat('ar-SY', options).format(num));
// console.log('Navigator Language:',new Intl.NumberFormat(navigator.language, options).format(num));
