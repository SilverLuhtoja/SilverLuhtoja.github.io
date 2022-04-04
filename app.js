import { getTransactions, getName } from './queries.js';

const endPoint = 'https://01.kood.tech/api/graphql-engine/v1/graphql';
// const endPoint = 'https://01.kood.tech/graphql';
// "id": 2127, /anna id
const id  = 1905
// const id = 2127;
let offset = 0
let allGoData = [];
const profileSection = document.getElementById('profile')


//  Easy fetch log 
function logQuery(query){
    queryFetch(query).then(data => console.log(data.data))
}

// for all fetch request
async function queryFetch(query,variable){
    return fetch(endPoint, {
      method: 'POST',
      headers: { 
          'Content-Type': 'application/json',
          'Accept' : 'application/json' 
        },
      body: JSON.stringify({
        query: query,
        variables: variable,

      }),
    })
      .then(res => res.json())
      .catch(err =>
        console.log(`ENDPOINT ERROR: Couldn't fetch data --> ${err}`)
      );
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

const allTransactions = async variable => {
  return queryFetch(getTransactions, { offset: variable , Id : id }).then(data => {
            data.data.transaction.forEach(item => {
                allGoData.push(item);
        });
    if (allGoData.length % 50 == 0) {
      offset += 50;
      return allTransactions(offset);
    } else {
      return allGoData;
    }
  });
};

let some = await allTransactions(offset);
console.log("some is ",some);

const populateExp =  () =>{
    let total = 0
    let div = document.querySelector('.exp_wrapper');
    some.forEach(item => total += item.amount)
     div.innerHTML += `
        <div class="exp_text ">
            <p>EXP:</p>
            <p>1.02Mb / ${Math.floor(total / 1000)}Kb</p>
        </div>
      `;
      console.log("TOTALE",total);
      profileSection.append(div);
}

const populateTransactions = () => {
    let div = document.querySelector('.all_projects');
    let html = ""
    some.forEach(item => {
      let exercise = item.path.split('/')
      exercise = exercise[exercise.length-1]
      let amount = item.amount / 1000
      html += `
         <div class="single_project flex">
              <p>Project -</p>
              <p class="single_project_name">${exercise}</p>
              <p class="single_project_exp">${amount}Kb</p>
          </div>
      
      `;
    })
    div.innerHTML = html
}



// GET PROFILE INFO ///////////////////////////////////////////////////
const  profileName = queryFetch(getName,{Id : id}).then(data => { 
  return data.data.user[0].login;
})
const printName = async () => {
  const profile = await profileName;
  let who = document.querySelector('.who')
  who.innerHTML = `${who.textContent}  ${profile}`
};





const init = () => {
  printName()
  populateExp();
  populateTransactions()
}
init()