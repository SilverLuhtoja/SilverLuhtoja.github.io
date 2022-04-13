export class Skills{
    constructor(width,height){
        this.width = width
        this.height = height
        this.color = "none"
    }

    generateSVG(element,arr){
        element.innerHTML = ""
        let chart = document.createElement('div')
        chart.classList.add('chart')
        
        let html = `
            <svg viewBox="0 0 ${
              this.width
            } ${this.height}">
            <style>
                .triangle{
                    transform-origin: 50%;
                }
               
            </style>
                ${this.generateCircle(this.width / 2)}
                ${this.generateSkills(arr)}
        </svg>
    `;
        chart.innerHTML = html
        element.append(chart)
    }

    generateCircle(radius){
          return ` <circle cx='${radius}' cy='${radius}' r='${radius-2}' fill='${this.color}'/>;`;
    }

    generateSkills(arr){
        let branches =""
        let count = 0
        for(let [key,value] of Object.entries(arr)){
            let size = (value / 100) * 1.5;
            let rotation = count * 60
            branches += ` 
            <g>
            <path
            d='M156 20L100 100L58 10'
            fill='${`rgba(21, 163, 92, ${value / 100 + 0.05} )`}'
            class='triangle'rotation
            transform="rotate(${rotation}) scale(${size})"
            class="triangle"
            />${key}};
            <text x="160" y="100" class="text"  transform="rotate(${-85 + (rotation)})">${key.toUpperCase()}  ${value}%</text>
           </g>
            `;
            count++
        }
        return branches
    }

    generateLines(nr){
        let lines = ""
        let count = 0
        for(let i = 0 ; i< nr;i++){
            lines += `
            <g>
                <line x1="calc(12 * (3.1416 * 96)/100)" y1="50" x2="100" y2="100" stroke="black"></line>
            </g>
            `;
        }
        return lines
    }
}
