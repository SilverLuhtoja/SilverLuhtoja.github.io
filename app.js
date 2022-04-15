import {getTransactions,getAudits,getName,getSkills,OnlyDivPart,pointsRequestByObjectID,} from './scripts/queries.js';
import {fixTime,  queryFetch,calculateTotal, combineDates,sortArray,formatTimeByDays, calculateDays} from './scripts/util.js';
import { Skills } from './svg/skills.js';
import { Audits } from './svg/audits.js';
import { Exp } from './svg/exp.js';
import { LineChart } from './svg/linechart.js';

// "id": 2127, /anna id
// const id = 1905;
const id = 932;
const language = document.getElementById('language');
const trans_btn = document.querySelector('.trans_btn');
const currentTime = new Date();
let allSkills,auditsIn,auditsOut,transactionData,total,onlyDIV;
let fullDiv = []
let offset = 0;
let totalDIVXP = 0
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
  update()
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

const update = async() =>{
  console.log(`%cCURRENT MODUL IS  ${language.value}`, 'color:orange');
  transactionData = await fetch(getAllTransactions());
  getCorrectDates(transactionData);
  populateExpGraph();
  populateTransactions();
} 


const init = async () => {
  transactionData = await fetch(getAllTransactions());
  if (language.value == "DIV01") {
    onlyDIV = await divRequest(id);
    auditsIn = await fetch(getAllAudits(0, 'up'));
    auditsOut = await fetch(getAllAudits(0, 'down'));
    allSkills = await fetch(getAllSkills(0));
    let audits = [calculateTotal(auditsOut),calculateTotal(auditsIn),];
    populateAuditsGraph(audits);
    populateFirstGraph(allSkills);
    populateSecondGraph(onlyDIV);
  }
  printName();
  populateExpGraph();
  populateTransactions();
};



function getCorrectDates(arr){

  for(let j = 0 ; j <arr.length-1 ; j++){
      if (new Date(arr[j].createdAt).getTime() > new Date(arr[j+1].createdAt).getTime()) {
            let tmp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = tmp;
      }
  }
  return arr
}

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
  switch(language.value){
    case("GO"): 
        totalAmount = "1.02"
        break;
    case("DIV01"): 
        totalAmount = "4.2"
        total = Math.round(totalDIVXP/1000);
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
    arr = sortArray(onlyDIV);
    getCorrectDates(arr)
    arr.forEach(item => {
        let exercise = item.object.name;
        let amount = item.object.amount / 1000;
        let time = fixTime(item.createdAt);
        html += `
    <div class="single_project flex">
    <p class="single_project_type">${item.object.type} -</p>
    <p class="single_project_name">${exercise}</p>
    <p class="single_project_time">${time}</p>
    <p class="single_project_exp">${amount}Kb</p>
    </div>
    `;
      });
  }else{
    arr = transactionData;
    getCorrectDates(arr);
    arr.forEach(item => {
      let exercise = item.object.name;
      let amount = item.amount / 1000;
      let time = fixTime(item.createdAt);
      html += `
      <div class="single_project flex">
      <p class="single_project_type">${item.object.type} -</p>
      <p class="single_project_name">${exercise}</p>
      <p class="single_project_time">${time}</p>
      <p class="single_project_exp">${amount}Kb</p>
      </div>
      `;
    });
  }
  projects_total.textContent = arr.length;
  div.innerHTML = html;
};

////////////////////////////////////////////////////////////////////////////////////////////
// GET PROFILE INFO ////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
const printName = async () => {
  const profile = await queryFetch(getName, { Id: id }).then(data => {
  return data.data.user[0].login});
  let who = document.querySelector('.who');
  who.innerHTML = `Welcome, ${profile}`
}

////////////////////////////////////////////////////////////////////////////////////////////
// GRAPH 1 ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
function populateFirstGraph(arr) {
  const graph = document.querySelector('.graph1');
  const chart = new Skills('200', '200');
  chart.generateSVG(graph, arr);
}

////////////////////////////////////////////////////////////////////////////////////////////
// GRAPH 2 ////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
function populateSecondGraph(arr) {
  const timePeriod = document.getElementById('time') 
  const graph = document.querySelector('.graph2');
  const chart = new LineChart('200', '160');
  const timeSelection = {
    'week': 7,
    'month': 30,
    'half-year': 180,
  };
  
  let dateArr = []
  dateArr = arr.map(item => {
     return {
       time: fixTime(item.createdAt),
       name: item.object.name,
       amount: item.object.amount/1000,
       pastDays: calculateDays(currentTime - new Date(fixTime(item.createdAt)).getTime()),
      };
    })

  console.log(dateArr);
  // For First Run
  let selectedValue = timePeriod.value;
  let svgArr = arr.filter(item => item.pastDays <= timeSelection[selectedValue]);
  let days = timeSelection[selectedValue];
  let dateFrom = formatTimeByDays(days);
  chart.generateSVG(graph, combineDates(svgArr.reverse()), days, dateFrom);

  // new chart , when value change
  timePeriod.addEventListener('change', function () {
    svgArr =[]
    selectedValue = timePeriod.value;
    days = timeSelection[selectedValue];
    dateFrom = formatTimeByDays(timeSelection[selectedValue]);
    sortArray(dateArr).forEach(item => {
      if (item.pastDays <= timeSelection[selectedValue]) {
        svgArr.push(item);
      }
    });
    chart.generateSVG(graph, combineDates(svgArr.reverse()), days, dateFrom);
  });
}

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


async function divRequest(id) {
  let variables = { Id: id };
  return await queryFetch(OnlyDivPart,variables)
    .then(data => {
      data.data.progress.forEach(item => {
        calculatePoints(item.objectId).then(result => {
          item.object["amount"] = result
          totalDIVXP += result
          if (result > 0) {
            fullDiv.push(item);
          }
        });
      });
      return fullDiv;
  })
}

async function calculatePoints(objectId) {
  let variables = { objectId: objectId,Id:id };
  return  queryFetch(pointsRequestByObjectID, variables).then(data2 => {
    let maxNumber = 0;
    if (data2.data.transaction.length > 0) {
      data2.data.transaction.forEach(oneElement => {
        if (
          oneElement.type == 'up' ||
          oneElement.type == 'down' ||
          oneElement.type == 'xp'
        ) {
          if (maxNumber < oneElement.amount) {
            maxNumber = oneElement.amount;
          }
        } 
      });
    }
    return maxNumber;
  });
}

  init();

