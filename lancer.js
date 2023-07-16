'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Lancer Nabasf',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Abdulkareem Mapelujo',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

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
      <div class="movements__value">${mov}</div>
    </div>
  `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outgoings = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outgoings)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
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
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
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

  const amount = Number(inputTransferAmount.value);
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

  const amount = Number(inputLoanAmount.value);
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
    Number(inputClosePin.value) === currentAccount.pin
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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// Array Methods are methods that we can attach to all arrays in javscript.

// let arr = ['a', 'b', 'c', 'd', 'e'];

// SLICE METHOD
// console.log(arr.slice(2)); // Returns a new array with the extracted part. It does not MUTATE the actual ARRAY.
// console.log(arr.slice(2,4)); // like in strings, the end parameter would not be included.
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -2));
// console.log(arr.slice()); // also creates a shallow copy of the array.

// SPLICE METHOD

// It performs the same function as the slice method, just that the 'splice' method mutates the array.
// console.log(arr.splice(2));
// arr.splice(-1)
// console.log(arr);
// arr.splice(1, 2); // the second parameter specifies the amount of items to be deleted a.k.a the DELETE COUNT.
// console.log(arr);
// Most times, what we are interested in is removing some elements from an array and since the 'splice' method mutates the array, we often use it to achieve that goal.

// REVERSE METHOD
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f']
// console.log(arr2.reverse()); // The Reverse method also mutates the original array.
// console.log(arr2);

// CONCAT METHOD
// const letters = arr.concat(arr2);  // this can also be done using the spread operators.
// console.log(letters);

// JOIN METHOD
// console.log(letters.join(' - '));

// THE NEW (AT) METHODS
// const arr = [23,11,64];
// console.log(arr[0]);
// console.log(arr.at(0)); // returns the value at the index position that was specified.

// traditional methods of getting the last array elements.
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);

// A new ES6 method that we can use tpo get the last element of the array. Helpful in METHOD CHAINING AS WELL
// console.log(arr.at(-1));
// console.log('lancer'.at(3));

/////////////// LOOPING ARRAYS USING THE FOR EACH METHOD

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// Looping using the for Of method.
// for (const movement of movements){
// if(movement > 0){
//   console.log(`You deposited ${movement}`);
// } else {
//   // the Math.abs removes the negative sign in a number.
//   console.log(`You withdrew ${Math.abs(movement)}`);
// }
// }

// Looping using the forEach method
// movements.forEach((mov, i, arr) => {
//   if (mov > 0) {
//     console.log(`Movements ${i + 1}: You deposited ${mov}`);
//   } else {
//     // the Math.abs removes the negative sign in a number.
//     console.log(`Movements ${i + 1}: You withdrew ${Math.abs(mov)}`);
//   }
// });

// The forEach method can take in three arguments in this order,
// the current element
// the index
// the entire array being looped over

// WHEN SHOULD YOU USE THE FOROF OR THE FOREACH LOOP
// You can't continue or break out of a forEach loop, if you need to break out of a loop, use the for of loop.
// Apart from that, it comes down to your personal reference.

// Using the forEach on Maps
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach((value, key, map) => {
  // console.log(`${key}: ${value}`);
});

// Using the forEach on Sets.
const currenciesUnique = new Set(['USD', 'GBP', 'EUR', 'USD', 'EUR']);
// console.log(currenciesUnique);

currenciesUnique.forEach((value, _, map) => {
  // console.log(`${value}: ${value}`);
});

// It is important to note that a set doesn't have keys in them, so in a forEach Method, there is no index to assign a value to. A set just makes use of the values.

// CODING CHALLENGE #1
const checkData = function (dogsJulia, dogsKate) {
  const dogsJuliaNew = [...dogsJulia];
  dogsJuliaNew.shift();
  dogsJuliaNew.splice(-2);

  const dogs = [...dogsJuliaNew, ...dogsKate];
  console.log(dogs);

  dogs.forEach((dog, i) => {
    const dogStr2 = `Dog Number ${i + 1}`;
    if (dog >= 3) {
      console.log(`${dogStr2} is an adult and is ${dog} years old.`);
    } else {
      console.log(`${dogStr2} is still a puppy 🐶`);
    }
  });
};

// checkData([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// checkData([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

// CODING CHALLENGE #2
// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + 4 * age));
//   const adults = humanAges.filter(age => age >= 18);
//   // const average = adults.reduce((acc, age) => acc + age, 0) / adults.length;

//   // Another way of calculating the average
//   const average = adults.reduce(
//     (acc, age, i, arr) => acc + age / arr.length,
//     0
//   );

//   return average;
// };

// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

// CODING CHALLENGE 3
const datas1 = [5, 2, 4, 1, 15, 8, 3];
const datas2 = [16, 6, 10, 5, 6, 1, 4];

const calcAverageHumanAge = ages => {
  const humanAges = ages
    .map(age => (age <= 2 ? 2 * age : 16 + 4 * age))
    .filter(age => age >= 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

  return humanAges;
};

const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(avg1, avg2);

// CODING CHALLENGE #4

const dogs = [
  {weight: 22, curFood: 250, owners: ['Alice', 'Bob']},
  {weight: 8, curFood: 200, owners: ['Matilda']},
  {weight: 13, curFood: 275, owners: ['Sarah', 'John']},
  {weight: 32, curFood: 340, owners: ['Michael']},
]

// Task 1
dogs.forEach(dog => {
  dog.recommendedFood = dog.weight ** 0.75 * 28
})
console.log(dogs);

// TASK 2


// console.log(sarahDog);







































// console.log(
//   `The average of the first array is ${avg1}, The average of the second array is ${avg2}`
// );

// JONAZ METHOD

/////////////////////////////////// ----------------------- DATA TRANSFORMATION: MAP, FILTER, REDUCE ------------------------- /////////////////////////////////////////////////////////////
// MAP: The map method is also used to loop over arrays and it is very similar to the for each method, but with the difference that mapping creates a brand new array based on the original array.
// It returns a NEW ARRAY containing the results of applying an operation on all original array elements.

// FILTER: Used to filter elements in the array that satisfies a given condition.
// It returns a NEW ARRAY containing the array elements that passed a specified test condition.

// REDUCE: this reduces all array elements down to one single value (e.g. adding all elements together).
// It's the reduced value that gets returned in the end.

// MAP METHOD IN PRACTICE
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;
const movementToUsd = movements.map(mov => mov * eurToUsd);

// console.log(movements);
// console.log(movementToUsd);

const movementUsd = [];
for (const mov of movements) movementUsd.push(mov * eurToUsd);
// console.log(movementUsd);

// The map method also has access to the same three parameters that the forEach method has i.e (current element, index, array).
const movementsDescription = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov
    )}`
);

// console.log(movementsDescription);

//// THE FILTER METHOD.
// It takes in a call back function which has access to the current element, index and arry as the forEach Method.
// const deposits = movements.filter(mov => {
//   return mov > 0;
// });

// const withdrawals = [];

// for (const mov of movements){
//   if (mov < 0) withdrawals.push(mov);
// }
// for (const mov of movements) {
//   if (mov < 0) withdrawals.push(mov);
// }

// console.log(deposits);
// console.log(withdrawals);

// THE REDUCE METHOD
// used to boil down all the elements in an array intp one single value.
// the reduce method tskes in 2 parameters,
// - A CALL BACK FUNCTION that speciies what to be done in each iteration,
// - A SECOND PARAMETER that sets the value of the accumulator.

// console.log(movements);

// acc stands for accumulator, and it's like a parameter that's used to keep accumulating the stored values.
const balance = movements.reduce((acc, cur, i) => acc + cur, 0);

// console.log(balance);

let balance2 = 0;
for (const mov of movements) balance2 += mov;
// console.log(balance2);

// The reduce method can also be used for other different scenarios. In this use case, we'll be using it to get the maximum value of the movements.
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return (acc = mov);
}, movements[0]);

// console.log(max);

//////////////// --------------------- CHAINING METHOD ------------------------- ////////////////////////////

// PIPELINE
// It's hard debugging Pipeline Chaining Method like these especially when one doesn't know where the error is from.
// In order to debug easily, we log and check the array at each method call.
// We do this using the (arr) parameter that's availabe in the call back functions.
const totalDepositsUsd = movements
  .filter(mov => mov > 0)
  // .map(mov => mov * eurToUsd)
  .map((mov, i, arr) => {
    // console.log(arr);
    return mov * eurToUsd;
  })
  .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUsd);

// NOTE: It's only possible to chain methods when the first method call returns an array, as methods are called on arrays.
// Chaining should not be over used, instead it should be optimized. It can cause performance issues when it involves really large arrays in large scale applications..
// It's bad practice in Javascript to chain methods that mutates the original array. e.g the SPLICE METHOD, THE REVERSE METHOD.

////////////////////////// ---------------  THE FIND METHOD ------------- //////////////////////////

// Using the find method, we can retrieve an element of an array based on a certain condition.
// The find method is also another kind of method that loops over an array and what it does when looping
// is that it retrieves a particular element of the array. It also takes in a call back function.
// Just like the filter method, the find method takes in a call back function that returns a boolean.
// Unlike the filter method, it does not return a new array, instead it retrieves / returns the first element that satisfies that condition.

const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

let acc = [];
for (const account of accounts) {
  if (account.owner === 'Jessica Davis') {
    acc.push(account);
    // console.log(acc);
  }
}
// console.log(acc);

///// ---------------- THE FIND INDEX METHOD ----------- ///////////////
// It works almost the same way as the find method just that the find index method returns the index of the element and not the element itself
// It works with a condition that returns a true or false value.
//

/////////////// ----------------- SOME AND EVERY METHOD -------------------- ///////////////////////
// console.log(movements);
// console.log(movements.includes(-130)); // checks only for equality.

// The include methods returns true if what is specified is completely equal.
// However, if we want to check if an array includes a certain condition, the includes method won't do that.
// That is where the some and every method comes in

// SOME: CONDITION
const anyDeposits = movements.some(mov => mov > 1500); // checks for conditions.
// what the some method does is that it takes in a callback function, and in that callback function a condition is specified
// if any value in the array matches or holds true for that condition, the method returns true.
// console.log(anyDeposits);

// EVERY:
// The every method is similar to the some method in the sense that it also works based on conditions..
// The difference however is that the every method only returns true if all the element in that array satisfies the specified condition.
// The some method however just needs one of the elements in that particular array to satisfy that condition for it to return true.

// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// Separate Call Backs
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

////////////// ----------------- FLAT AND FLATMAP METHODS --------------------- //////////////////////////
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// The flat and flatMap methods are new methods that were introduced in 2019.
// console.log(arr.flat()); // It does not take in any call backs.

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2)); // goes in 2 levels deep and flatens the array.

// Using the flat method
const overallMoveementsBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
// console.log(overallMoveementsBalance);

// As a result of developers chaining the map and then the flat method immediately, a new method was introduced called the FLATMAP method.
// It combines both the map and flat into one convenient method.

// Using the flatMap method
const overallMoveementsBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
// console.log(overallMoveementsBalance2);

// The flatMap method only goes one level deep and it cannot be changed or modified. If going deeper than 1 level is required, the flat method is to be used.

/////////////////////// ------------------- SORTING ARRAYS ---------------------- /////////////////////////////

// Strings
const owners = ['Lancer', 'Jonas', 'Faiq', 'Faiza'];
// console.log(owners.sort()); // Sorts the array alphabetically from A - Z;

// Sorting Mutates the original array, meaning it directly affects the array when it was initially called.

//  Numbers
// console.log(movements);
// console.log(movements.sort());

// when calling the sort method on an array of numbers, it treats the numbers in the array as though it was a string, which is not what we want.
// To fix this, a COMPARE CALL BACK FUNCTION has to be passed into the sort method as it is called.
// This call back function takes in 2 parameters, the first which is usually the CURRENT VALUE, while the second is the NEXT value.

// return value < 0, A before B (keeps the order)
// return value > 0 B before A (switches the order)

// SORTING IN ASCENDING ORDER

// movements.sort((a,b) => {
//   if (a > b)
//     return 1;
//   if (a < b)
//     return -1
// });

// Improving the code
movements.sort((a, b) => a - b);
// console.log(`In Ascending Order ${movements.join(', ')}`);

// SORTING IN DESCENDING ORDER
// movements.sort((a,b) => {
//   if (a > b)
//     return -1;
//   if (a < b)
//     return 1
// });

movements.sort((a, b) => b - a);
// console.log(`In Descending Order ${movements.join(', ')}`);

// If the array is a mixed one i.e it contains both strings and numbers, then it is advisable not to use the sort method at all as there would be no point in doing so.

////////////// -------------- MORE METHODS OF CREATING ND FILLING ARRAYS ---------------- ////////////////////////////
// How to programmatically create and fill arrays.

// EMPTY ARRAYS + FILL METHOD
const x = new Array(7); // creates an array with 7 empty spaces
// console.log(x);
// x.fill(1) // fills up the array with the element specified in the argument, it mutates the underlying array.
// x.fill(1,3, 5)
// console.log(x);

// FILL METHOD ON DEFINED ARRAYS
// the fill method can also be applied on arrays that have already been defined and not just empty arrays.
const arr3 = new Array(1, 2, 3, 4, 5, 6, 7); // creates an array of the elements passed into it as arguments.
// console.log(arr3);
arr3.fill(50, 2, 6);
// console.log(arr3);

// Array.from
// The Array.from was originally introduced into js to create arrays from array like structures
// The querySelectorAll returns a nodelist which is similiar to ab array but at the same time it's not, it's an ARRAY-LIKE STRUCTURE as a result it does not have access to most array methods like, map, reduce e.t.c
// In order to make use of those array methods on nodelists, they need to be converted to an array and Array.from() is the man for the job.
// The Array.from takes in 2 parameters, the first is an iterable and the second is a map function i.e a function to be carried on each iterable element.

const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// assignment
const diceRolls = Array.from({ length: 100 }, () =>
  Math.ceil(Math.random() * 6)
);
// console.log(diceRolls);

labelBalance.addEventListener('click', e => {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  // console.log(movementsUI.map(el => Number(el.textContent.replace('€', ''))));
  // console.log(movementsUI);
});

////////////////////// -------------------- SUMMARY ON WHICH ARRAY METHOD TO USE ----------------- ///////////////////////

//////////////////////// ------------------ PRACTICING ARRAY METHODS --------------------------- ////////////////////////
// 1.

const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);
// console.log(bankDepositSum);

// 2.
// const numDeposits1000 = accounts.flatMap(acc => acc.movements).filter(mov => mov >= 1000).length; // METHOD 1
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0); // METHOD 2
// console.log(numDeposits1000);

let a = 10;
// console.log(++a);

// 3.
const {deposits, withdrawals} = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur, i) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

  // console.log(deposits, withdrawals);

// 5.
const converTitleCase = (title) => {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with', 'and'];

  const titleCase = title.toLowerCase().split(' ').map(word => exceptions.includes(word) ? word : capitalize(word)).join(' ')
  return capitalize(titleCase)
}
// console.log(converTitleCase('this is a nice title'));
// console.log(converTitleCase('this is a LONG title but not too long'));
// console.log(converTitleCase('and here is another title with an example'));