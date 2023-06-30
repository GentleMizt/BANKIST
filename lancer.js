'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
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
const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach((mov, i) => {
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
displayMovements(account1.movements);

const createUsernames = function(accs){
  accs.forEach((acc)=>{
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  })
};
createUsernames(accounts);

const calcPrintBalance = function(movements){
  const balance = movements.reduce((acc, cur, i)=> acc + cur, 0)
  labelBalance.textContent = balance;
};
calcPrintBalance(account1.movements);
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

// const checkData = function (dogsJulia, dogsKate) {
//   const dogsJuliaNew = [...dogsJulia];
//   dogsJuliaNew.shift();
//   dogsJuliaNew.splice(-2);

//   const dogs = [...dogsJuliaNew, ...dogsKate];
//   console.log(dogs);

//   dogs.forEach((dog, i) => {
//     // const age = dog > 3 ? 'an adult' : 'still a puppy'
//     // const dogStr = `Dog Number ${i + 1} is ${age} and is ${dog} years old.`
//     // console.log(dogStr);

//     const dogStr2 = `Dog Number ${i + 1}`;
//     if (dog >= 3) {
//       console.log(`${dogStr2} is an adult and is ${dog} years old.`);
//     } else {
//       console.log(`${dogStr2} is still a puppy 🐶`);
//     }
//   });
// };

// checkData([3,5,2,12,7], [4,1,15,8,3]);
// checkData([9,16,6,8,3], [10,5,6,1,4]);



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

const movementUsd = []
for (const mov of movements) movementUsd.push(mov * eurToUsd);
// console.log(movementUsd);

// The map method also has access to the same three parameters that the forEach method has i.e (current element, index, array).
const movementsDescription = movements.map((mov, i)=>  `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`);

// console.log(movementsDescription);


//// THE FILTER METHOD.
// It takes in a call back function which has access to the current element, index and arry as the forEach Method.
const deposits = movements.filter((mov)=>{
  return mov > 0;
});

const withdrawals = [];

// for (const mov of movements){
//   if (mov < 0) withdrawals.push(mov);
// }
for (const mov of movements){ if(mov < 0) withdrawals.push(mov)}

// console.log(deposits);
// console.log(withdrawals);


// THE REDUCE METHOD
// used to boil down all the elements in an array intp one single value.
// the reduce method tskes in 2 parameters, 
// - A CALL BACK FUNCTION that speciies what to be done in each iteration,
// - A SECOND PARAMETER that sets the value of the accumulator.

// console.log(movements);

// acc stands for accumulator, and it's like a parameter that's used to keep accumulating the stored values.
const balance = movements.reduce((acc, cur, i)=> acc + cur, 0); 

// console.log(balance);

let balance2 = 0;
for (const mov of movements) balance2 += mov;
// console.log(balance2);

