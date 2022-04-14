export class Exp{
    constructor(radius) {
      this.radius = radius
      this.middlePoint = radius/2
    }

    generateSVG(element,obj){
        element.innerHTML = '';
        let chart = document.createElement('div');
        let percent = 100 - ((obj.myAmount * 0.1) / obj.totalAmount)
        let html = `
        <svg viewBox='0 0 ${this.radius} ${this.radius}'>
          <g >
          <circle cx='${this.middlePoint}' cy='${this.middlePoint}' r='${
          this.middlePoint
        }'  stroke-width='2' 
        />
          <rect y="${percent}" width="100" height="100"/> 
          ${this.generateText(obj)}
          </g>
        </svg>
        `;

        chart.innerHTML = html;
        element.append(chart);
    }
    generateText(obj){
      return `
        <text class= "text" x="${this.middlePoint}" y="${this.middlePoint/1.2} " fill="white">EXP</text> 
        <text class= "text" x="${this.middlePoint}" y="${this.middlePoint}" fill="white">${obj.totalAmount < 1 ? obj.totalAmount * 1000 + "Kb": obj.totalAmount + "Mb"} / ${obj.myAmount}Kb</text> 
      
      `;
    }
}