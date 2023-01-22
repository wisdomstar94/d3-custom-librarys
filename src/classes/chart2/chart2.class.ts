import { extent, merge, range, scaleLinear, select } from "d3";
import { IChart2 } from "./chart2.interface";

const defaultConfig = {
  yLabelAreaWidth: 60,
  xLabelAreaHeight: 90,
  topAreaHeight: 40,
};

export class Chart2 {
  targetElementId?: string;
  topAreaHeight?: number;
  yLabelAreaWidth?: number;
  xLabelAreaHeight?: number;
  data?: IChart2.Data[];
  xAxis?: IChart2.XAxis;
  yAxis?: IChart2.YAxis;

  constructor(params?: IChart2.ConstructorParams) {
    this.targetElementId = params?.targetElementId;
    this.topAreaHeight = params?.topAreaHeight;
    this.yLabelAreaWidth = params?.yLabelAreaWidth;
    this.xLabelAreaHeight = params?.xLabelAreaHeight;
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

  setYLabelAreaWidth(v: number): Chart2 {
    this.yLabelAreaWidth = v;
    return this;
  }

  setXLabelAreaHeight(v: number): Chart2 {
    this.xLabelAreaHeight = v;
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
    Other Functions
  */
  drawBasicContainer(): void {
    const target = this.getTargetElement();
    if (target === null) {
      return;
    }

    const htmlString = `
      <div id="chart-container" style="width: 100%; height: 100%; position: relative; display: flex;">
        <div id="container-left-area" style="width: ${this.getYLabelAreaWidth()}px; height: 100%; position: relative; display: block;">
          <div id="chart-y-axis-display-area" style="width: 100%; height: calc(100% - (${this.getTopAreaHeight()}px + ${this.getXLabelAreaHeight()}px)); position: relative; margin-top: ${this.getTopAreaHeight()}px">

          </div>
        </div>
        <div id="container-right-area" style="width: calc(100% - ${this.getYLabelAreaWidth()}px); height: 100%; position: relative; display: block;">
          <div id="right-top-area" style="width: 100%; height: ${this.getTopAreaHeight()}px; position: relative;">

          </div>
          <div id="chart-display-area" style="width: 100%; height: calc(100% - (${this.getTopAreaHeight()}px + ${this.getXLabelAreaHeight()}px)); position: relative;">

          </div>
          <div id="right-bottom-area" style="width: 100%; height: ${this.getXLabelAreaHeight()}px; position: relative;">

          </div>
        </div>
      </div>
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