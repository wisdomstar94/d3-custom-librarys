import { extent, merge, range, scaleLinear, select } from "d3";
import { IChart2 } from "./chart2.interface";
import { v4 } from 'uuid';

const targetElementNames = {
  chartContainer: 'id_' + v4(),
  topRowArea: 'id_' + v4(),
  leftArea: 'id_' + v4(),
  yAxisDisplayArea: 'id_' + v4(),
  rightArea: 'id_' + v4(),
  rightAreaContentArea: 'id_' + v4(),
  chartDisplayArea: 'id_' + v4(),
  xAxisDisplayArea: 'id_' + v4(),
  bottomRowArea: 'id_' + v4(),

  svg: 'class_' + v4(),
};

const defaultConfig = {
  yLabelAreaWidth: 60,
  xLabelAreaHeight: 90,
  topAreaHeight: 40,
  dataLabelAreaHeight: 80,
  dataOneColumnWidth: 80,
};

export class Chart2 {
  targetElementId?: string;
  topAreaHeight?: number;
  dataLabelAreaHeight?: number;
  yLabelAreaWidth?: number;
  xLabelAreaHeight?: number;
  dataOneColumnWidth?: number;
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
  getTargetElement(): HTMLElement | null {
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

  getTargetWidth(): number {
    const target = this.getTargetElement();
    if (target === null) {
      return 0;
    }
    return target.clientWidth;
  }

  getTargetHeight(): number {
    const target = this.getTargetElement();
    if (target === null) {
      return 0;
    }
    return target.clientHeight;
  }

  getTopAreaHeight(): number {
    if (this.topAreaHeight === undefined) {
      console.warn(`topAreaHeight 값이 설정되어 있지 않아 default 값인 ${defaultConfig.topAreaHeight} 으로 적용됩니다.`);
      return defaultConfig.topAreaHeight;
    }
    return this.topAreaHeight;
  }

  getDataLabelAreaHeight(): number {
    if (this.dataLabelAreaHeight === undefined) {
      console.warn(`dataLabelAreaHeight 값이 설정되어 있지 않아 default 값인 ${defaultConfig.dataLabelAreaHeight} 으로 적용됩니다.`);
      return defaultConfig.dataLabelAreaHeight;
    }
    return this.dataLabelAreaHeight;
  }

  getYLabelAreaWidth(): number {
    if (this.yLabelAreaWidth === undefined) {
      console.warn(`yLabelAreaWidth 값이 설정되어 있지 않아 default 값인 ${defaultConfig.yLabelAreaWidth} 으로 적용됩니다.`);
      return defaultConfig.yLabelAreaWidth;
    }
    return this.yLabelAreaWidth;
  }

  getXLabelAreaHeight(): number {
    if (this.xLabelAreaHeight === undefined) {
      console.warn(`xLabelAreaHeight 값이 설정되어 있지 않아 default 값인 ${defaultConfig.xLabelAreaHeight} 으로 적용됩니다.`);
      return defaultConfig.xLabelAreaHeight;
    }
    return this.xLabelAreaHeight;
  }

  getDataOneColumnWidth(): number {
    if (this.dataOneColumnWidth === undefined) {
      console.warn(`dataOneColumnWidth 값이 설정되어 있지 않아 default 값인 ${defaultConfig.dataOneColumnWidth} 으로 적용됩니다.`);
      return defaultConfig.dataOneColumnWidth;
    }
    return this.dataOneColumnWidth;
  }

  getYRangeAndLinear() {
    const allNumberDatas = merge<number>(this.data?.map(x => x.datas) ?? []);
    let [minNumber, maxNumber] = extent(allNumberDatas);
    if (minNumber === undefined) { minNumber = 0; }
    if (maxNumber === undefined) { maxNumber = 0; }
    const size = maxNumber - minNumber;

    const yRange = range(minNumber, maxNumber, Math.ceil(size / 4)).concat(maxNumber);
    const yLinear = scaleLinear().domain([minNumber, maxNumber]).range([this.getTargetHeight() - this.getXLabelAreaHeight(), this.getTopAreaHeight()]);

    return {
      yRange,
      yLinear,
    };
  }

  /*
    Getter Element Function
  */
  getChartContainerElement(): HTMLDivElement | null {
    return document.querySelector<HTMLDivElement>(`#${targetElementNames.chartContainer}`);
  }

  getTopRowAreaElement(): HTMLDivElement | null {
    return document.querySelector<HTMLDivElement>(`#${targetElementNames.topRowArea}`);
  }

  getLeftAreaElement(): HTMLDivElement | null {
    return document.querySelector<HTMLDivElement>(`#${targetElementNames.leftArea}`);
  }

  getYAxisDisplayAreaElement(): HTMLDivElement | null {
    return document.querySelector<HTMLDivElement>(`#${targetElementNames.yAxisDisplayArea}`);
  }

  getRightAreaElement(): HTMLDivElement | null {
    return document.querySelector<HTMLDivElement>(`#${targetElementNames.rightArea}`);
  }

  getRightAreaContentAreaElement(): HTMLDivElement | null {
    return document.querySelector<HTMLDivElement>(`#${targetElementNames.rightAreaContentArea}`);
  }

  getChartDisplayAreaElement(): HTMLDivElement | null {
    return document.querySelector<HTMLDivElement>(`#${targetElementNames.chartDisplayArea}`);
  }

  getXAxisDisplayAreaElement(): HTMLDivElement | null {
    return document.querySelector<HTMLDivElement>(`#${targetElementNames.xAxisDisplayArea}`);
  }

  getBottomRowAreaElement(): HTMLDivElement | null {
    return document.querySelector<HTMLDivElement>(`#${targetElementNames.bottomRowArea}`);
  }

  /*
    Other Functions
  */
  drawBasicContainer(): void {
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
            <svg class="${targetElementNames.svg}">

            </svg>
          </div>
        </div>
        <div id="${targetElementNames.rightArea}" data-id="right-area">
          <div id="${targetElementNames.rightAreaContentArea}" data-id="right-area-content-area">
            <div id="${targetElementNames.chartDisplayArea}" data-id="chart-display-area">
              <svg class="${targetElementNames.svg}">

              </svg>
            </div>
            <div id="${targetElementNames.xAxisDisplayArea}" data-id="x-axis-display-area">
              <svg class="${targetElementNames.svg}">

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
          height: calc(100% - ${this.getXLabelAreaHeight()}px);
          display: block;
          position: relative;
        }
        #${targetElementNames.rightArea} {
          width: calc(100% - ${this.getYLabelAreaWidth()}px);
          height: calc(100% - (${this.getTopAreaHeight()}px + ${this.getDataLabelAreaHeight()}px));
          display: block;
          position: relative;
          overflow-x: scroll;
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
          width: 100%;
          height: 100%;
          display: flex;
          flex-wrap: wrap;
          position: relative;
        }
        #${targetElementNames.chartDisplayArea} {
          width: 100%;
          height: calc(100% - ${this.getXLabelAreaHeight()}px);
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
          position: relative;
        }
      </style>
    `.trim();
    target.innerHTML = htmlString;
  }

  draw(): void {
    const target = this.getTargetElement();
    while (target?.hasChildNodes() === true) {
      if (target?.firstChild !== null) {
        target?.removeChild(target?.firstChild);
      }
    }

    this.drawBasicContainer();
  }
}