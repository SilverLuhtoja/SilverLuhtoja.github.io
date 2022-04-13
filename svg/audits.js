export class Audits {
  constructor(width,height,arr) {
      this.width = width
      this.height = height/2
      this.color = "grey"
      this.arr = arr
      this.ratio = Math.round(this.calcRatio(arr) * 10) * 0.1;
      this.max = arr[0] > arr[1] ? arr[0] : arr[1]
  }

  generateSVG(element) {
    element.innerHTML = '';
    let chart = document.createElement('div');
    chart.classList.add('chart');

    let html = `
        <style>

        </style>
        <svg viewBox="0 0 ${this.width} ${this.height}" class="audits" >
            <rect  width="${this.width }" height="${this.height}" fill="${this.color}"/>
            <text class="ratio_text" x="2" y="8"  fill="black" >
                Audit Ratio : ${this.ratio}
            </text>
              ${this.generateBars()}
        </svg>
    `;
    chart.innerHTML = html;
    element.append(chart);
  }

  generateBars(){
      let bars  
      for( let i in this.arr){
            let ratio = this.arr[i] / this.max
            bars += `
            <g transform="translate(4,4)">
                <text class="ratio_text" x="76" y="${
                  14 + i * 22
                } " fill="black" >
                    ${this.arr[i] == this.max ? 'OUT' : 'IN'}
                </text>
                <text class="ratio_text" x="76" y="${
                  20 + i * 22
                } "  fill="black" >
                    ${this.arr[i] == this.max ? this.max : this.arr[i]}
                </text>
            </g>

             <g transform="translate(2,${7 + i * 20}) scale(${ratio},1.2)">
                <rect x="0" y="9" width="67" height="7" fill="#333333"/>
                 <path  d="M0 2L3 0V7L0 9V2Z" transform="translate(67,7)" fill="#666666"/>
                 <path  d="M3 0H70L67 2H0L4 0Z" transform="translate(0,7)" fill="#222222"/>
            </g>
            `;
      }
      return bars
  }
  calcRatio(arr){
    let max
    let min
    if(arr[0] > arr[1]){
        max = arr[0]
        min = arr[1]
    }else{
        max = arr[1]
        min = arr[1]
    }
    return min / max
  }
}