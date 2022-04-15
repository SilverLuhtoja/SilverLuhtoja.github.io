
// Same structure to every fetch
const endPoint = 'https://01.kood.tech/api/graphql-engine/v1/graphql';
export async function queryFetch(query,variables){
  return fetch(endPoint, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept' : 'application/json' 
    },
    body: JSON.stringify({
      query,
      variables,
      
    })
  }).then(res => res.json())
}

// For easy loging
export function logQuery(query, variables) {
  queryFetch(query, variables).then(data => console.log(data.data));
}


// return new array without given regex
export const filterOut = (arr, reg) => {
    let newArr = [];
    arr.forEach(item => {
        if (!item.path.match(new RegExp(reg))) {
            newArr.push(item);
        }
    });
    return newArr;
};

// return year-month-day
export const fixTime = string => {
  // /^.*(?=(\T))/
  let date = string.match(new RegExp(/^.*(?=(\T))/));
  return date[0];
};


export const  calculateTotal = (arr) => {
  let total  = 0
  arr.forEach(item => {
    total += item.amount;
  });
  return Math.round(total / 10000) * 0.01
}

// Days from timestamp
export function calculateDays(nr) {
  return Math.floor(nr / (1000 * 60 * 60 * 24));
}

// get normal date string
export function formatTimeByDays(days) {
  const currentTime = new Date();
  const pastTime = new Date(currentTime.getTime() - 1000 * 60 * 60 * 24 * days);
  return `${pastTime.getFullYear()}-${String(pastTime.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(pastTime.getDate()).padStart(2, '0')}`;
}

// normal bubble sort
export function sortArray(arr) {
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - 1; j++) {
      if (arr[j].pastDays > arr[j + 1].pastDays) {
        let tmp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tmp;
      }
    }
  }
  return arr;
}

// calculate amount on the same date
export function combineDates(arr) {
// Making deep copy (will not change original array)
  let newArr = JSON.parse(JSON.stringify(arr))
  let total = 0;
  let startCounting = true;
  for (let i = 0; i < newArr.length - 1; i++) {
    if (newArr[i].time == newArr[i + 1].time) {
      if (startCounting) {
        total = newArr[i].amount;
        startCounting = false;
      }
      total += newArr[i + 1].amount;
      newArr[i] = '';
    } else {
      if (newArr[i - 1] == '') {
        newArr[i].amount = total;
      }
      total = 0;
      startCounting = true;
    }
  }
  return newArr.filter(item => item);
}

// sort by dates
export function sortByDates(arr) {
  for (let j = 0; j < arr.length - 1; j++) {
    if (
      new Date(arr[j].createdAt).getTime() >
      new Date(arr[j + 1].createdAt).getTime()
    ) {
      let tmp = arr[j];
      arr[j] = arr[j + 1];
      arr[j + 1] = tmp;
    }
  }
  return arr;
}