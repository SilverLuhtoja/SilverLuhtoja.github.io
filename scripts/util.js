
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