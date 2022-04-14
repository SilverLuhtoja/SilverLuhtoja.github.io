export class LineChart {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.lineBoxWidth = 180;
    this.lineBoxTop = this.height/2;
    this.lineBoxBottom = this.height - 20;
    this.margin = 10
  }

  generateSVG(element, arr, days, fromDate) {
    element.innerHTML = '';
    let chart = document.createElement('div');
    let html = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${
              this.width
            } ${this.height} ">
                <rect width="${this.width}" height="${this.height}" />
                <rect class="time_container" x="10" y="${this.height / 2 - 20}" width="180" height="${
      this.height / 2
    }" />
                ${this.generateLines(arr, days)}
                <g>  
                    <text x="${this.margin}" y="${
      this.height - 10
    }" fill="white" >
                    ${fromDate}
                    </text>
                    <text x="${this.margin}" y="${
      this.height - 2
    }" fill="white" >
                        0 kb
                    </text>
                </g>  
            </svg>
            `;

    chart.innerHTML = html;
    element.append(chart);
  }

  generateLines(arr, days) {
    let step = Math.round(this.lineBoxWidth / days);
    let points = arr.length;
    let heightStep = (this.lineBoxBottom - this.lineBoxTop) / points;
    let endPoint = ` ${this.width - this.margin},${this.lineBoxTop}`;   // finishing position (right-top corner)
    let lines = `${this.margin},${this.height - 20}`;       // starting position (left-bottom corner)
    let text, groups;
    let total = 0;
    for (let i in arr) {
      total += arr[i].amount;
      let yVal = this.lineBoxTop + heightStep * (points - i) - heightStep;
      let xVal = 14 + this.lineBoxWidth - Math.round(arr[i].pastDays * step);
      lines += `
      ${xVal},${yVal}
      `;

      groups += `
            <g class="single_point">
              <circle class="hoverThis" r="1" cx="${xVal}" cy="${yVal}" />
              <g class="point_text">
                <text  x="${xVal - 2}" y="${yVal - 4}" fill="white">+${arr[i].amount}Kb </text>
                <text  x="${xVal }" y="${yVal - 8}" fill="white">${arr[i].time}</text>
              </g>

            </g>
            `;
    }

    lines += endPoint;
    text += `
      <text x="${this.lineBoxWidth - 8}" y="${
      this.lineBoxTop - 30
    }" fill="white"  >Total</text>
      <text x="${this.lineBoxWidth - 8}" y="${
      this.lineBoxTop - 22
    }" fill="white"  >${Math.round(total)} Kb</text>
    `;
    return `
        <polyline
        fill="none"
        stroke-width="0.7"
        points="${lines}"
        />
        ${groups}
        ${text}
        `;
  }
}