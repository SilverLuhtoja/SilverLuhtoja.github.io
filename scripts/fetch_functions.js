import {
  getTransactions,
  getAudits,
//   getName,
  getSkills,
  getXp,
} from './queries.js';
let offset = 0;
export const getAllXp = async nr => {
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

export const getAllAudits = async (nr, type) => {
  nr = offset;
  let variables = { offset: nr, path: current_path, Id: id, type: type };
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

export const getAllSkills = async nr => {
  nr = offset;
  let variables = { offset: nr, Id: id };
  return queryFetch(getSkills, variables).then(data => {
    data.data.transaction.forEach(item => allData.push(item));
    if (allData.length % 50 == 0) {
      offset += 50;
      return getAllSkills(variables);
    } else {
      offset = 0;
      return allData;
    }
  });
};

export function getMaxSkills(arr) {
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

export const getAllTransactions = async (nr) => {
  nr = offset;
  let variables = { offset: nr, path: current_path, Id: id };
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
