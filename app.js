import {  getTransactions,  getAudits,  getName,  getSkills,  getXp,} from './scripts/queries.js';
import {  filterOut,  fixTime,  queryFetch,calculateTotal} from './scripts/util.js';
import { calculateDIVPoints } from './scripts/exp.js';
import { Skills } from './svg/skills.js';
import { Audits } from './svg/audits.js';
import { Exp } from './svg/exp.js';

// "id": 2127, /anna id
const id = 1905;
const language = document.getElementById('language');
const trans_btn = document.querySelector('.trans_btn');
let allDIVData, allSkills, auditsIn, auditsOut, transactionData, total;
let offset = 0;
let current_path = '/johvi/div-01/';



// ///////////////////////////////////////////////////////////////////////
language.addEventListener('change', function () {
  switch (this.value) {
    case 'GO':
      current_path = '/johvi/piscine-go/';
      break;
    case 'DIV01':
      current_path = '/johvi/div-01/';
      break;
    case 'JS':
      current_path = '/johvi/div-01/piscine-js/';
      break;
  }
  init();
});

// Show transactions when arrow is clicked
trans_btn.addEventListener('click', (e) => {
    let projects = document.querySelector('.projects_wrapper')
    projects.classList.toggle('hide')
    trans_btn.classList.toggle('rotate')
})

let allData = [];
async function fetch(func) {
  allData = [];
  return await func;
}

const init = async () => {
  console.log(`%cCURRENT MODUL IS  ${language.value}`, 'color:orange');
  transactionData = await fetch(getAllTransactions());
  allDIVData = await fetch(getAllXp())
  allDIVData = calculateDIVPoints(allDIVData)
  if (language.value == "DIV01") {
    auditsIn = await fetch(getAllAudits(0, 'up'));
    auditsOut = await fetch(getAllAudits(0, 'down'));
    allSkills = await fetch(getAllSkills(0));

    transactionData = filterOut(transactionData, '/piscine-js/');
    let audits = [calculateTotal(auditsOut),calculateTotal(auditsIn),];
    populateAuditsGraph(audits);
    populateFirstGraph(allSkills);
    populateSecondGraph(allSkills);
  }
    
    
  printName();
  populateExpGraph();
  populateTransactions();

};
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//  EXP QUERY //////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
const getAllXp = async (nr) => {
  nr = offset;
  let variables = { offset: nr, Id: id };
  return queryFetch(getXp, variables).then(data => {
    data.data.transaction.forEach(item => allData.push(item));
    if (allData.length % 50 == 0) {
      offset += 50;
      return getAllXp(variables);
    } else {
      offset = 0;
      return allData;
    }
  });
};
    

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//  AUDITS QUERY //////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

const getAllAudits = async (nr,type) => {
  nr = offset
  let variables = { offset: nr, path: current_path, Id: id, type: type};
  return queryFetch(getAudits, variables).then(data => {
    data.data.transaction.forEach(item => allData.push(item));
    if (allData.length % 50 == 0) {
      offset += 50;
      return getAllAudits(nr, type);
    } else {
      offset = 0;
      return allData;
    }
  });
};

function populateAuditsGraph(arr) {
  let graph = document.querySelector('.audits_bars');
  let chart = new Audits('100', '100', arr);
  chart.generateSVG(graph);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//  SKILLS QUERY //////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

const getAllSkills = async (nr) => {
  nr = offset
  let variables = {offset: nr,Id: id};
  return queryFetch(getSkills, variables).then(data => {
    data.data.transaction.forEach(item => allData.push(item));
    if (allData.length % 50 == 0) {
      offset += 50;
      return getAllSkills(variables);
    } else {
      offset = 0;
      return getMaxSkills(allData);
    }
  });
};

function getMaxSkills(arr) {
  // {amount: 15, type: 'skill_game'}
  let maxSkills = {
    go: 0,
    js: 0,
    html: 0,
    css: 0,
    sql: 0,
    docker: 0,
  };
  const biggerThan = (a, b) => {
    if (maxSkills[a] < b) {
      maxSkills[a] = b;
    }
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  for (let i in arr) {
    for (let [key, value] of Object.entries(arr[i])) {
      if (key == 'type') {
        let skill = value.split('_')[1];
        switch (skill) {
          case 'go':
            biggerThan(skill, arr[i].amount);
            break;
          case 'js':
            biggerThan(skill, arr[i].amount);
            break;
          case 'html':
            biggerThan(skill, arr[i].amount);
            break;
          case 'css':
            biggerThan(skill, arr[i].amount);
            break;
          case 'sql':
            biggerThan(skill, arr[i].amount);
            break;
          case 'docker':
            biggerThan(skill, arr[i].amount);
            break;
        }
      }
    }
  }
  return maxSkills;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///  TOP SECTION ////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const getAllTransactions = async (nr) => {
  nr = offset;
  let variables = {offset: nr, path: current_path, Id: id };
  return queryFetch(getTransactions, variables).then(data => {
    data.data.transaction.forEach(item => allData.push(item));
    if (allData.length % 50 == 0) {
      offset += 50;
      return getAllTransactions(variables);
    } else {
      offset = 0;
      return allData;
    }
  });
};

const populateExpGraph = async () => {
  let div = document.querySelector('.exp_circle');
  transactionData.forEach(item => (total += item.amount));
  total = Math.round(total / 1000)
  let totalAmount = 0
  console.log(language.value);
  switch(language.value){
    case("GO"): 
        totalAmount = "1.02"
        break;
    case("DIV01"): 
        totalAmount = "4.21"
        // total = calculateDIVPoints(allDIVData)[0];
        total = allDIVData[0];
        break;
    case("JS"): 
        totalAmount = "0.178"
      break;
  }
  let chart = new Exp(100)
  chart.generateSVG(div,{totalAmount:totalAmount , myAmount:total})
};

const populateTransactions = async () => {
  let div = document.querySelector('.all_projects');
  let projects_total = document.querySelector('.projects_total');
  let html = '';
  let arr
  if (language.value == 'DIV01'){
    // arr = calculateDIVPoints(allDIVData)[1];
    arr = allDIVData[1];
  }else{
    arr = transactionData;
  }
  arr.forEach(item => {
    let exercise = item.object.name;
    let amount = item.amount / 1000;
    let time = fixTime(item.createdAt);
    html += `
    <div class="single_project flex">
    <p>Project -</p>
    <p class="single_project_name">${exercise}</p>
    <p class="single_project_time">${time}</p>
    <p class="single_project_exp">${amount}Kb</p>
    </div>
    `;
  });
  projects_total.textContent = arr.length;
  div.innerHTML = html;
};

// GET PROFILE INFO ///////////////////////////////////////////////////
const printName = async () => {
  const profile = await queryFetch(getName, { Id: id }).then(data => {
  return data.data.user[0].login});
  let who = document.querySelector('.who');
  who.innerHTML = `Welcome, ${profile}`
}

////////////////////////////////////////////////////////////////////////////////////////////
// GRAPH 1 ///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
function populateFirstGraph(arr) {
  let graph = document.querySelector('.graph1');
  let chart = new Skills('200', '200');
  chart.generateSVG(graph, arr);
}

////////////////////////////////////////////////////////////////////////////////////////////
// GRAPH 2 ///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
function calculateDays(nr){
   return Math.floor(nr / (1000 * 60 * 60 * 24));
}
function formatTimeByDays(days){
  const currentTime = new Date();
  const pastTime = new Date(currentTime.getTime() - (1000 * 60 * 60 * 24 ) * days);
  return `${pastTime.getFullYear()}-${String(pastTime.getMonth() + 1).padStart(2,'0')}-${String(pastTime.getDate()).padStart(2, '0')}`;
}

const timeSelection = {
  "week" : 7,
  "month" : 30,
  "half-year" : 180,
}


// month length 30 days
function populateSecondGraph(arr) {
  let graph = document.querySelector('.graph2');
  const currentTime = new Date();
  const timePeriod = document.getElementById('time') 
  const dateArr = allDIVData[1].map(item => {
     return {
       time: fixTime(item.createdAt),
       pastDays: calculateDays(currentTime - new Date(fixTime(item.createdAt)).getTime()),
       amount: item.amount/1000,
       exercise: item.object.name,
     };
  })
  console.log("DATEARR",dateArr);
  timePeriod.addEventListener('change', function () {
    let selectedValue = timePeriod.value;
    switch (selectedValue) {
      case 'week':
        console.log('FROM : ', formatTimeByDays(timeSelection[selectedValue]));
        dateArr.forEach(item => {
          if (item.pastDays <= timeSelection[selectedValue]) {
            console.log(item);
          }
        });
        break;
      case 'month':
        console.log('FROM : ', formatTimeByDays(timeSelection[selectedValue]));
        dateArr.forEach(item => {
          if (item.pastDays <= timeSelection[selectedValue]) {
            console.log(item);
          }
        });
        break;
      case 'half-year':
        console.log('FROM : ', formatTimeByDays(timeSelection[selectedValue]));
        dateArr.forEach(item => {
          if (item.pastDays <= timeSelection[selectedValue]) {
            console.log(item);
          }
        });
        break;
    }
  });
}

init();

