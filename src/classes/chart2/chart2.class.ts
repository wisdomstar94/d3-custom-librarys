import { extent, line, merge, range, scaleLinear, select, union } from "d3";
import { IChart2 } from "./chart2.interface";
import { v4 } from 'uuid';

const targetElementNames = {
  chartContainer: 'id_' + v4(),
  topRowArea: 'id_' + v4(),
  leftArea: 'id_' + v4(),
  yAxisDisplayArea: 'id_' + v4(),
  yAxisTopBottomMarginBox: 'id_' + v4(),
  yAxisDisplayAreaSvg: 'id_' + v4(),
  rightArea: 'id_' + v4(),
  rightAreaContentArea: 'id_' + v4(),
  rightAreaContentAreaTopBottomMarginBottom: 'id_' + v4(),
  chartDisplayArea: 'id_' + v4(),
  chartDisplayAreaSvg: 'id_' + v4(),
  xAxisDisplayArea: 'id_' + v4(),
  xAxisDisplayAreaSvg: 'id_' + v4(),
  bottomRowArea: 'id_' + v4(),

  svg: 'class_' + v4(),
  topBottomMarginBottom: 'class_' + v4(),
};

const defaultConfig = {
  yLabelAreaWidth: 60,
  xLabelAreaHeight: 90,
  topAreaHeight: 40,
  topBottomMarginHeight: 10,
  dataLabelAreaHeight: 80,
  chartLeftMarginWidth: 30,
  dataOneColumnWidth: 60,
  color: '#333',
};
defaultConfig.chartLeftMarginWidth = defaultConfig.dataOneColumnWidth / 2;

export class Chart2 {
  targetElementId?: string;
  topAreaHeight?: number;
  dataLabelAreaHeight?: number;
  yLabelAreaWidth?: number;
  xLabelAreaHeight?: number;
  dataOneColumnWidth?: number;
  topBottomMarginHeight?: number;
  chartLeftMarginWidth?: number;
  data?: IChart2.Data[];
  xAxis?: IChart2.XAxis;
  yAxis?: IChart2.YAxis;

  constructor(params?: IChart2.ConstructorParams) {
    this.targetElementId = params?.targetElementId;
    this.topAreaHeight = params?.topAreaHeight;
    this.dataLabelAreaHeight = params?.dataLabelAreaHeight;
    this.yLabelAreaWidth = params?.yLabelAreaWidth;
    this.xLabelAreaHeight = params?.xLabelAreaHeight;
    this.dataOneColumnWidth = params?.dataOneColumnWidth;
    this.topBottomMarginHeight = params?.topBottomMarginHeight;
    this.chartLeftMarginWidth = params?.chartLeftMarginWidth;
    this.data = params?.data;
    this.xAxis = params?.xAxis;
    this.yAxis = params?.yAxis;
  }

  /*
    Setter Functions
  */
  setTargetElementId(v: string): Chart2 {
    this.targetElementId = v;
    return this;
  }

  setTopAreaHeight(v: number): Chart2 {
    this.topAreaHeight = v;
    return this;
  }

  setDataLabelAreaHeight(v: number): Chart2 {
    this.dataLabelAreaHeight = v;
    return this;
  }

  setYLabelAreaWidth(v: number): Chart2 {
    this.yLabelAreaWidth = v;
    return this;
  }

  setXLabelAreaHeight(v: number): Chart2 {
    this.xLabelAreaHeight = v;
    return this;
  }

  setDataOneColumnWidth(v: number): Chart2 {
    this.dataOneColumnWidth = v;
    return this;
  }

  setTopBottomMarginHeight(v: number): Chart2 {
    this.topBottomMarginHeight = v;
    return this;
  }

  setData(v: IChart2.Data[]): Chart2 {
    this.data = v;
    return this;
  }

  setXAxis(v: IChart2.XAxis): Chart2 {
    this.xAxis = v;
    return this;
  }

  setYAxis(v: IChart2.YAxis): Chart2 {
    this.yAxis = v;
    return this;
  }

  /*
    Getter Functions
  */
  private getTargetElement(): HTMLElement | null {
    if (typeof this.targetElementId !== 'string') {
      console.error(`targetElementId 가 undefined 입니다.`);
      return null;
    }

    let selector = this.targetElementId;
    if (selector[0] !== '#') {
      selector = '#' + selector;
    }

    return document.querySelector<HTMLElement>(selector);
  }

  private getTargetWidth(): number {
    const target = this.getTargetElement();
    if (target === null) {
      return 0;
    }
    return target.clientWidth;
  }

  private getTargetHeight(): number {
    const target = this.getTargetElement();
    if (target === null) {
      return 0;
    }
    return target.clientHeight;
  }

  private getTopAreaHeight(): number {
    if (this.topAreaHeight === undefined) {
      console.warn(`topAreaHeight 값이 설정되어 있지 않아 default 값인 ${defaultConfig.topAreaHeight} 으로 적용됩니다.`);
      return defaultConfig.topAreaHeight;
    }
    return this.topAreaHeight;
  }

  private getDataLabelAreaHeight(): number {
    if (this.dataLabelAreaHeight === undefined) {
      console.warn(`dataLabelAreaHeight 값이 설정되어 있지 않아 default 값인 ${defaultConfig.dataLabelAreaHeight} 으로 적용됩니다.`);
      return defaultConfig.dataLabelAreaHeight;
    }
    return this.dataLabelAreaHeight;
  }

  private getYLabelAreaWidth(): number {
    if (this.yLabelAreaWidth === undefined) {
      console.warn(`yLabelAreaWidth 값이 설정되어 있지 않아 default 값인 ${defaultConfig.yLabelAreaWidth} 으로 적용됩니다.`);
      return defaultConfig.yLabelAreaWidth;
    }
    return this.yLabelAreaWidth;
  }

  private getXLabelAreaHeight(): number {
    if (this.xLabelAreaHeight === undefined) {
      console.warn(`xLabelAreaHeight 값이 설정되어 있지 않아 default 값인 ${defaultConfig.xLabelAreaHeight} 으로 적용됩니다.`);
      return defaultConfig.xLabelAreaHeight;
    }
    return this.xLabelAreaHeight;
  }

  private getDataOneColumnWidth(): number {
    if (this.dataOneColumnWidth === undefined) {
      console.warn(`dataOneColumnWidth 값이 설정되어 있지 않아 default 값인 ${defaultConfig.dataOneColumnWidth} 으로 적용됩니다.`);
      return defaultConfig.dataOneColumnWidth;
    }
    return this.dataOneColumnWidth;
  }

  private getChartDrawAreaHeight(): number {
    const element = this.getChartDisplayAreaElement();
    return element === null ? 0 : element.clientHeight;
  }

  private getTopBottomMarginHeight(): number {
    if (this.topBottomMarginHeight === undefined) {
      console.warn(`topBottomMarginHeight 값이 설정되어 있지 않아 default 값인 ${defaultConfig.topBottomMarginHeight} 으로 적용됩니다.`);
      return defaultConfig.topBottomMarginHeight;
    }
    return this.topBottomMarginHeight;
  }

  private getChartLeftMarginWidth(): number {
    if (this.chartLeftMarginWidth === undefined) {
      console.warn(`chartLeftMarginWidth 값이 설정되어 있지 않아 default 값인 ${defaultConfig.chartLeftMarginWidth} 으로 적용됩니다.`);
      return defaultConfig.chartLeftMarginWidth;
    }
    return this.chartLeftMarginWidth;
  }

  private getRightAreaContentAreaWidth(): string {
    if (this.data === undefined) {
      return '100%';
    }

    const firstData = this.data[0];
    if (firstData === undefined) {
      return '100%';
    }

    return (this.getDataOneColumnWidth() * firstData.datas.length) + 'px';
  }

  private getYRangeAndLinear() {
    const allNumberDatas = merge<number>(this.data?.map(x => x.datas) ?? []);
    let [minNumber, maxNumber] = extent(allNumberDatas);
    if (minNumber === undefined) { minNumber = 0; }
    if (maxNumber === undefined) { maxNumber = 0; }
    const size = maxNumber - minNumber;

    const yRange = range(minNumber, maxNumber, Math.ceil(size / 4)).concat(maxNumber);
    const yLinear = scaleLinear().domain([minNumber, maxNumber]).range([this.getChartDrawAreaHeight(), 0]);

    return {
      yRange,
      yLinear,
    };
  }

  private getPointDrawMaterials() {
    const allNumberDatas = Array.from(union(merge<number>(this.data?.map(x => x.datas) ?? [])));
    // const pointYConverter = scaleLinear().domain([0, max(allNumberDatas) ?? 0]).range([getContainerHeight() - 60, 20]);

    return {
      allNumberDatas,
      yRangeAndLinear: this.getYRangeAndLinear().yLinear,
    };
  }

  /*
    Getter Element Function
  */
  private getChartContainerElement(): HTMLDivElement | null {
    return document.querySelector<HTMLDivElement>(`#${targetElementNames.chartContainer}`);
  }

  private getTopRowAreaElement(): HTMLDivElement | null {
    return document.querySelector<HTMLDivElement>(`#${targetElementNames.topRowArea}`);
  }

  private getLeftAreaElement(): HTMLDivElement | null {
    return document.querySelector<HTMLDivElement>(`#${targetElementNames.leftArea}`);
  }

  private getYAxisDisplayAreaElement(): HTMLDivElement | null {
    return document.querySelector<HTMLDivElement>(`#${targetElementNames.yAxisDisplayArea}`);
  }

  private getYAxisDisplayAreaSvgElement(): SVGElement | null {
    return document.querySelector<SVGElement>(`#${targetElementNames.yAxisDisplayAreaSvg}`);
  }

  private getRightAreaElement(): HTMLDivElement | null {
    return document.querySelector<HTMLDivElement>(`#${targetElementNames.rightArea}`);
  }

  private getRightAreaContentAreaElement(): HTMLDivElement | null {
    return document.querySelector<HTMLDivElement>(`#${targetElementNames.rightAreaContentArea}`);
  }

  private getChartDisplayAreaElement(): HTMLDivElement | null {
    return document.querySelector<HTMLDivElement>(`#${targetElementNames.chartDisplayArea}`);
  }

  private getChartDisplayAreaSvgElement(): SVGElement | null {
    return document.querySelector<SVGElement>(`#${targetElementNames.chartDisplayAreaSvg}`);
  }

  private getXAxisDisplayAreaElement(): HTMLDivElement | null {
    return document.querySelector<HTMLDivElement>(`#${targetElementNames.xAxisDisplayArea}`);
  }

  private getXAxisDisplayAreaSvgElement(): SVGElement | null {
    return document.querySelector<SVGElement>(`#${targetElementNames.xAxisDisplayAreaSvg}`);
  }

  private getBottomRowAreaElement(): HTMLDivElement | null {
    return document.querySelector<HTMLDivElement>(`#${targetElementNames.bottomRowArea}`);
  }

  /*
    draw Functions
  */
  private drawBasicContainer(): void {
    const target = this.getTargetElement();
    if (target === null) {
      return;
    }

    const htmlString = `
      <div id="${targetElementNames.chartContainer}" data-id="chart-container">
        <div id="${targetElementNames.topRowArea}" data-id="top-row-area">

        </div>
        <div id="${targetElementNames.leftArea}" data-id="left-area">
          <div id="${targetElementNames.yAxisDisplayArea}" data-id="y-axis-display-area">
            <div id="${targetElementNames.yAxisTopBottomMarginBox}" class="${targetElementNames.topBottomMarginBottom}" data-id="y-axis-top-bottom-margin-box"></div>
            <svg class="${targetElementNames.svg} overflow-visible" id="${targetElementNames.yAxisDisplayAreaSvg}">

            </svg>
          </div>
        </div>
        <div id="${targetElementNames.rightArea}" data-id="right-area">
          <div id="${targetElementNames.rightAreaContentArea}" data-id="right-area-content-area">
            <div id="${targetElementNames.rightAreaContentAreaTopBottomMarginBottom}" class="${targetElementNames.topBottomMarginBottom}" data-id="right-area-content-area-top-bottom-margin-box"></div>
            <div id="${targetElementNames.chartDisplayArea}" data-id="chart-display-area">
              <svg class="${targetElementNames.svg} overflow-visible" id="${targetElementNames.chartDisplayAreaSvg}">

              </svg>
            </div>
            <div id="${targetElementNames.xAxisDisplayArea}" data-id="x-axis-display-area">
              <svg class="${targetElementNames.svg}" id="${targetElementNames.xAxisDisplayAreaSvg}">

              </svg>
            </div>
          </div>
        </div>
        <div id="${targetElementNames.bottomRowArea}" data-id="bottom-row-area">

        </div>
      </div>
      <style>
        #${targetElementNames.chartContainer} {
          width: 100%;
          height: 100%;
          display: flex;
          flex-wrap: wrap;
          position: relative;
        }
        #${targetElementNames.topRowArea} {
          width: 100%;
          height: ${this.getTopAreaHeight()}px;
          display: block;
          position: relative;
        }
        #${targetElementNames.leftArea} {
          width: ${this.getYLabelAreaWidth()}px;
          height: calc(100% - (${this.getTopAreaHeight()}px + ${this.getDataLabelAreaHeight()}px));
          display: block;
          position: relative;
        }
        #${targetElementNames.yAxisDisplayArea} {
          width: 100%;
          height: calc(100% - ${this.getXLabelAreaHeight() + this.getTopBottomMarginHeight()}px);
          display: block;
          position: relative;
        }
        #${targetElementNames.rightArea} {
          width: calc(100% - ${this.getYLabelAreaWidth()}px);
          height: calc(100% - (${this.getTopAreaHeight()}px + ${this.getDataLabelAreaHeight()}px));
          display: block;
          position: relative;
          overflow-x: scroll;
          overflow-y: visible;
        }
        #${targetElementNames.rightArea}::-webkit-scrollbar {
          width: 0;
          height: 1px;
        }
        #${targetElementNames.rightArea}::-webkit-scrollbar-track {
          background-color: rgba(0, 0, 0, 0.05);
        }
        #${targetElementNames.rightArea}::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.3);
        }
        #${targetElementNames.rightAreaContentArea} {
          /* width: 100%; */
          width: ${this.getRightAreaContentAreaWidth()};
          height: 100%;
          display: flex;
          flex-wrap: wrap;
          position: relative;
        }
        #${targetElementNames.chartDisplayArea} {
          width: 100%;
          height: calc(100% - ${this.getXLabelAreaHeight() + this.getTopBottomMarginHeight()}px);
          display: block;
          position: relative;
        }
        #${targetElementNames.xAxisDisplayArea} {
          width: 100%;
          height: ${this.getXLabelAreaHeight()}px;
          display: block;
          position: relative;
        }
        #${targetElementNames.bottomRowArea} {
          width: 100%;
          height: ${this.getDataLabelAreaHeight()}px;
          display: block;
          position: relative;
        }

        .${targetElementNames.svg} {
          width: 100%;
          height: 100%;
          display: block;
          position: relative;
        }
        .${targetElementNames.svg}.overflow-visible {
          overflow: visible;
        }
        .${targetElementNames.topBottomMarginBottom} {
          width: 100%;
          display: block;
          height: ${this.getTopBottomMarginHeight()}px;
          position: relative;
        }
      </style>
    `.trim();
    target.innerHTML = htmlString;
  }

  private drawYAxis(): void {
    const svgElement = this.getYAxisDisplayAreaSvgElement();
    if (svgElement === null) {
      return;
    }

    const yrl = this.getYRangeAndLinear();
    console.log('yrl', yrl);

    select(svgElement)
    .append('g')
    .selectAll()
    .data(yrl.yRange)
    .enter()
    .append('text')
    .text(d => d.toString())
    .attr("x", (d, i) => {
      return 20;
    })
    .attr("y", (d, i) => {
      return yrl.yLinear(d) + 3;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    ; 
  }

  private drawPoint(): void {
    const svgElement = this.getChartDisplayAreaSvgElement();
    if (svgElement === null) {
      return;
    }

    this.data?.forEach((item, index) => {
      select(svgElement)
      .append('g')
      .selectAll()
      .data(item.datas)
      .enter()
      .append('circle')
      .attr('r', 3)
      .attr('cx', (d, i) => {
        return (i * this.getDataOneColumnWidth()) + this.getChartLeftMarginWidth();
      })
      .attr('cy', (d, i) => {
        return this.getPointDrawMaterials().yRangeAndLinear(d);
      })
      .attr('fill', item.color ?? defaultConfig.color)
      ;
    });
  }

  private drawLine(): void {
    const svgElement = this.getChartDisplayAreaSvgElement();
    if (svgElement === null) {
      return;
    }

    this.data?.forEach((item, index) => {
      const lineGenerator = line();
      const points: [number, number][] = item.datas.map((x, i) => {
        return [(i * this.getDataOneColumnWidth()) + this.getChartLeftMarginWidth(), this.getPointDrawMaterials().yRangeAndLinear(x)];
      });
      console.log('@@points', points);
      const pathOfLine = lineGenerator(points);
      select(svgElement)
      .append('g')
      .append('path')
      .attr('d', pathOfLine)
      .attr('stroke-width', 1)
      .attr("fill", 'none')
      .attr("stroke", item.color ?? defaultConfig.color)
      ;
    });
  }

  private drawXAxis() {
    const svgElement = this.getXAxisDisplayAreaSvgElement();
    if (svgElement === null) {
      return;
    }

    select(svgElement)
    .append('g')
    .selectAll()
    .data(this.xAxis?.labels ?? [])
    .enter()
    .append('text')
    .text(d => d.text)
    .attr("x", (d, i) => {
      return (i * this.getDataOneColumnWidth()) + this.getChartLeftMarginWidth();
    })
    .attr("y", (d, i) => {
      return 28;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    ;
  }

  draw(): void {
    const target = this.getTargetElement();
    while (target?.hasChildNodes() === true) {
      if (target?.firstChild !== null) {
        target?.removeChild(target?.firstChild);
      }
    }

    this.drawBasicContainer(); // 기본 골격을 그립니다.
    this.drawYAxis(); // y 축을 데이터 수치 영역을 그립니다.
    this.drawPoint(); // data 의 point 를 그립니다.
    this.drawLine(); // data 의 line 을 그립니다.
    this.drawXAxis(); // x 축 라벨 영역을 그립니다.
  }
}