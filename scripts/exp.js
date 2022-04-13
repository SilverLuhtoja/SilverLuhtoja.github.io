let selectedDIV = [];
let totalDIV;
export function calculateDIVPoints(arr) {
    selectedDIV = [];
    totalDIV = 0;
    let count = 0;
    let middleAmount = 0;
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i].path == '/johvi/div-01/piscine-js') {
        totalDIV += arr[i].amount;
        selectedDIV.push(arr[i]);
        } else {
        if (arr[i].path == arr[i + 1].path) {
            if (arr[i].type == 'down') {
            count++;
            }
            if (middleAmount < arr[i].amount) {
            middleAmount = arr[i].amount;
            }
        } else {
            if ((arr[i].type = 'down')) {
            count++;
            }
            if (arr[i].amount > middleAmount) {
            middleAmount = arr[i].amount;
            }
            if (
            count >= 3 &&
            arr[i].path != '/johvi/div-01/typing-in-progress'
            ) {
            arr[i].amount = middleAmount;
            totalDIV += arr[i].amount;
            selectedDIV.push(arr[i]);
            }
            count = 0;
            middleAmount = 0;
        }
    }
  }
  return [Math.round(totalDIV/1000 + 70),selectedDIV]
}
