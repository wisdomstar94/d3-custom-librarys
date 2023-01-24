import { easeBackOut, extent, index, line, merge, pointers, range, scaleLinear, select, union } from "d3";
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
  bottomRowAreaDataLabelNamesArea: 'id_' + v4(),
  clipBoxArea: 'id_' + v4(),
  clipBoxAreaTopRow: 'id_' + v4(),
  clipBoxAreaBottomRow: 'id_' + v4(),
  xAxisUnitArea: 'id_' + v4(),

  show: 'class_' + v4(),
  active: 'class_' + v4(),
  overflowVisible: 'class_' + v4(),
  svg: 'class_' + v4(),
  topBottomMarginBottom: 'class_' + v4(),
  clipDataRow: 'class_' + v4(),
  clipDataRowTitleArea: 'class_' + v4(),
  clipDataRowContentArea: 'class_' + v4(),
  dataLabelNameItem: 'class_' + v4(),
  dataLabelNameItemSymbol: 'class_' + v4(),
  dataLabelNameItemName: 'class_' + v4(),
  xAxisLabelItem: 'class_' + v4(),
  xAxisLabelItemTextArea: 'class_' + v4(),
};

const defaultConfig = {
  yLabelAreaWidth: 32,
  xLabelAreaHeight: 40,
  topAreaHeight: 40,
  topBottomMarginHeight: 10,
  dataLabelAreaHeight: 80,
  chartLeftMarginWidth: 30,
  dataOneColumnWidth: 60,
  dataJointAreaWidth: 20,
  color: '#333',
  fontColor: '#333',
  fontGrayColor: '#aaa',
  initTransitionDuration: 1000,
  clipFontSize: '12px',
  fontSize: '12px',
};
defaultConfig.chartLeftMarginWidth = defaultConfig.dataOneColumnWidth / 2;

export class Chart2 {
  targetElementId?: string;
  topAreaHeight?: number;
  dataLabelAreaHeight?: number;
  yLabelAreaWidth?: number;
  xLabelAreaHeight?: number;
  dataOneColumnWidth?: number;
  dataJointAreaWidth?: number;
  topBottomMarginHeight?: number;
  chartLeftMarginWidth?: number;
  initTransitionDuration?: number;
  clipFontSize?: string;
  data?: IChart2.Data[];
  xAxis?: IChart2.XAxis;
  yAxis?: IChart2.YAxis;
  callbackClip?: IChart2.CallbackClip;

  // currentChartDisplayPointer?: { x: number; y: number; };

  constructor(params?: IChart2.ConstructorParams) {
    this.targetElementId = params?.targetElementId;
    this.topAreaHeight = params?.topAreaHeight;
    this.dataLabelAreaHeight = params?.dataLabelAreaHeight;
    this.yLabelAreaWidth = params?.yLabelAreaWidth;
    this.xLabelAreaHeight = params?.xLabelAreaHeight;
    this.dataOneColumnWidth = params?.dataOneColumnWidth;
    this.dataJointAreaWidth = params?.dataJointAreaWidth;
    this.topBottomMarginHeight = params?.topBottomMarginHeight;
    this.chartLeftMarginWidth = params?.chartLeftMarginWidth;
    this.initTransitionDuration = params?.initTransitionDuration;
    this.clipFontSize = params?.clipFontSize;
    this.data = params?.data;
    this.xAxis = params?.xAxis;
    this.yAxis = params?.yAxis;
    this.callbackClip = params?.callbackClip;
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

  setDataJointAreaWidth(v: number): Chart2 {
    this.dataJointAreaWidth = v;
    return this;
  }

  setClipFontSize(v: string): Chart2 {
    this.clipFontSize = v;
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

  setInitTransitionDuration(v: number): Chart2 {
    this.initTransitionDuration = v;
    return this;
  }

  setCallbackClip(fn: IChart2.CallbackClip): Chart2 {
    this.callbackClip = fn;
    return this;
  }

  // private setCurrentChartDisplayPointer(x: number, y: number): void {
  //   this.currentChartDisplayPointer = {
  //     x,
  //     y,
  //   };
  // }

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
      // console.warn(`topAreaHeight 값이 설정되어 있지 않아 default 값인 ${defaultConfig.topAreaHeight} 으로 적용됩니다.`);
      return defaultConfig.topAreaHeight;
    }
    return this.topAreaHeight;
  }

  private getDataLabelAreaHeight(): number {
    if (this.dataLabelAreaHeight === undefined) {
      // console.warn(`dataLabelAreaHeight 값이 설정되어 있지 않아 default 값인 ${defaultConfig.dataLabelAreaHeight} 으로 적용됩니다.`);
      return defaultConfig.dataLabelAreaHeight;
    }
    return this.dataLabelAreaHeight;
  }

  private getYLabelAreaWidth(): number {
    if (this.yLabelAreaWidth === undefined) {
      // console.warn(`yLabelAreaWidth 값이 설정되어 있지 않아 default 값인 ${defaultConfig.yLabelAreaWidth} 으로 적용됩니다.`);
      return defaultConfig.yLabelAreaWidth;
    }
    return this.yLabelAreaWidth;
  }

  private getXLabelAreaHeight(): number {
    if (this.xLabelAreaHeight === undefined) {
      // console.warn(`xLabelAreaHeight 값이 설정되어 있지 않아 default 값인 ${defaultConfig.xLabelAreaHeight} 으로 적용됩니다.`);
      return defaultConfig.xLabelAreaHeight;
    }
    return this.xLabelAreaHeight;
  }

  private getDataOneColumnWidth(): number {
    if (this.dataOneColumnWidth === undefined) {
      // console.warn(`dataOneColumnWidth 값이 설정되어 있지 않아 default 값인 ${defaultConfig.dataOneColumnWidth} 으로 적용됩니다.`);
      return defaultConfig.dataOneColumnWidth;
    }
    return this.dataOneColumnWidth;
  }

  private getChartDrawAreaHeight(): number {
    const element = this.getChartDisplayAreaElement();
    return element === null ? 0 : element.clientHeight;
  }

  private getDataJointAreaWidth(): number {
    if (this.dataJointAreaWidth === undefined) {
      // console.warn(`dataJointAreaWidth 값이 설정되어 있지 않아 default 값인 ${defaultConfig.dataJointAreaWidth} 으로 적용됩니다.`);
      return defaultConfig.dataJointAreaWidth;
    }
    return this.dataJointAreaWidth;
  }

  private getTopBottomMarginHeight(): number {
    if (this.topBottomMarginHeight === undefined) {
      // console.warn(`topBottomMarginHeight 값이 설정되어 있지 않아 default 값인 ${defaultConfig.topBottomMarginHeight} 으로 적용됩니다.`);
      return defaultConfig.topBottomMarginHeight;
    }
    return this.topBottomMarginHeight;
  }

  private getChartLeftMarginWidth(): number {
    if (this.chartLeftMarginWidth === undefined) {
      // console.warn(`chartLeftMarginWidth 값이 설정되어 있지 않아 default 값인 ${defaultConfig.chartLeftMarginWidth} 으로 적용됩니다.`);
      return defaultConfig.chartLeftMarginWidth;
    }
    return this.chartLeftMarginWidth;
  }

  private getClipFontSize(): string {
    if (this.clipFontSize === undefined) {
      // console.warn(`clipFontSize 값이 설정되어 있지 않아 default 값인 ${defaultConfig.clipFontSize} 으로 적용됩니다.`);
      return defaultConfig.clipFontSize;
    }
    return this.clipFontSize;
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

  private getInitTransitionDuration() {
    if (this.initTransitionDuration === undefined) {
      // console.warn(`initTransitionDuration 값이 설정되어 있지 않아 default 값인 ${defaultConfig.initTransitionDuration} 으로 적용됩니다.`);
      return defaultConfig.initTransitionDuration;
    }
    return this.initTransitionDuration;
  }

  private getOffsetPointer(event: MouseEvent | TouchEvent) {
    const pointer = {
      x: 0,
      y: 0,
    };

    if (event instanceof MouseEvent) {
      pointer.x = event.offsetX;
      pointer.y = event.offsetY;
    } else {
      pointer.x = event.touches[0].pageX;
      pointer.y = event.touches[0].pageY;
    }

    return pointer;
  }

  getMouseOveredDataJointAreaOffsetLeft(event: MouseEvent | TouchEvent): number {
    const rightAreaElement = this.getRightAreaElement();
    if (rightAreaElement === null) {
      return 0;
    }
    const scrollLeft = rightAreaElement.scrollLeft;

    const target = event.target as HTMLElement;
    const offsetLeft = target.offsetLeft;

    return offsetLeft - scrollLeft;
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

  private getBottomRowAreaDataLabelNamesArea(): HTMLDivElement | null {
    return document.querySelector<HTMLDivElement>(`#${targetElementNames.bottomRowAreaDataLabelNamesArea}`);
  }

  private getClipBoxAreaElement(): HTMLDivElement | null {
    return document.querySelector<HTMLDivElement>(`#${targetElementNames.clipBoxArea}`);
  }

  private getClipBoxAreaTopRowElement(): HTMLDivElement | null {
    return document.querySelector<HTMLDivElement>(`#${targetElementNames.clipBoxAreaTopRow}`);
  }

  private getClipBoxAreaBottomRowElement(): HTMLDivElement | null {
    return document.querySelector<HTMLDivElement>(`#${targetElementNames.clipBoxAreaBottomRow}`);
  }

  private getXAxisUnitAreaElement(): HTMLDivElement | null {
    return document.querySelector<HTMLDivElement>(`#${targetElementNames.xAxisUnitArea}`);
  }

  /*
    callback Functions
  */
  private callbackDataJoinMouseEvent<T>(event: MouseEvent | TouchEvent, d: IChart2.Label): void {
    const elem = event.target as HTMLElement;
    const index = Number(elem.getAttribute('data-index'));
    const left = Number(elem.style.left.split('px')[0]);
    const clipBoxAreaElement = this.getClipBoxAreaElement();
    const pointer = this.getOffsetPointer(event);

    const clipDatas: IChart2.ClipData[] | undefined = this.data?.map((x) => {
      return {
        name: x.name,
        color: x.color,
        data: x.datas.find((value, i) => i === index),
      };
    });

    // left 계산
    const getLeft = (): number => {
      const offsetLeft = this.getMouseOveredDataJointAreaOffsetLeft(event);
      console.log('offsetLeft', offsetLeft);
      if (offsetLeft < (this.getRightAreaElement()?.clientWidth ?? 0) / 2) {
        return left + 20;
      } else {
        return left - ((this.getClipBoxAreaElement()?.clientWidth ?? 0));
      }
    };

    const xAxisLabelTargetElements = document.querySelectorAll(`.${targetElementNames.xAxisLabelItem}`);
    const chartDisplayAreaSvgElement = this.getChartDisplayAreaSvgElement();

    if (clipBoxAreaElement !== null) {
      if (event.type === 'mouseenter') {
        // left 계산하기
        clipBoxAreaElement.classList.add(targetElementNames.show);
        clipBoxAreaElement.style.left = getLeft() + 'px';

        const clipBoxAreaTopRowElement = this.getClipBoxAreaTopRowElement();
        if (clipBoxAreaTopRowElement !== null) {
          clipBoxAreaTopRowElement.textContent = d.text;
          clipBoxAreaTopRowElement.style.color = d.color ?? defaultConfig.fontColor;
        }

        const clipBoxAreaBottomRowElement = this.getClipBoxAreaBottomRowElement();
        if (clipBoxAreaBottomRowElement !== null) {
          let htmlString = ``;
          if (this.callbackClip !== undefined) {
            htmlString = this.callbackClip(clipDatas ?? [], index);
          } else {
            clipDatas?.forEach((item, i) => {
              htmlString += `
                <div class="${targetElementNames.clipDataRow}">
                  <div class="${targetElementNames.clipDataRowTitleArea}" style="color: ${item.color ?? defaultConfig.fontColor};">
                    ${item.name}
                  </div>
                  <div class="${targetElementNames.clipDataRowContentArea}" style="color: ${item.color ?? defaultConfig.fontColor};">
                    ${item.data}
                  </div>
                </div>
              `.trim();
            });
          }
          clipBoxAreaBottomRowElement.innerHTML = htmlString;
        }

        if (xAxisLabelTargetElements[index] !== null) {
          xAxisLabelTargetElements[index].classList.add(targetElementNames.active);
        }
        if (chartDisplayAreaSvgElement !== null) {
          select(chartDisplayAreaSvgElement)
          .selectAll('g.point-bg')
          .selectAll('circle')
          .filter(`:nth-child(${index + 1})`)
          .transition()
          .duration(300)
          .attr('opacity', 0.5)
          ;
        }
      } else if (event.type === 'mousemove') {
        clipBoxAreaElement.style.top = pointer.y + 'px'; 
      } else if (event.type === 'mouseleave') {
        if (xAxisLabelTargetElements[index] !== null) {
          xAxisLabelTargetElements[index].classList.remove(targetElementNames.active);
        }
        if (chartDisplayAreaSvgElement !== null) {
          select(chartDisplayAreaSvgElement)
          .selectAll('g.point-bg')
          .selectAll('circle')
          .filter(`:nth-child(${index + 1})`)
          .transition()
          .duration(300)
          .attr('opacity', 0)
          ;
        }
      }
    }
  }

  private callbackChartDisplayMouseEvent(event: MouseEvent): void {
    const clipBoxAreaElement = this.getClipBoxAreaElement();
    if (clipBoxAreaElement !== null) {
      if (event.type === 'mouseleave') {
        clipBoxAreaElement.classList.remove(targetElementNames.show);
      } 
    }
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
            <svg class="${targetElementNames.svg} ${targetElementNames.overflowVisible}" id="${targetElementNames.yAxisDisplayAreaSvg}">

            </svg>
          </div>
        </div>
        <div id="${targetElementNames.rightArea}" data-id="right-area">
          <div id="${targetElementNames.rightAreaContentArea}" data-id="right-area-content-area">
            <div id="${targetElementNames.rightAreaContentAreaTopBottomMarginBottom}" class="${targetElementNames.topBottomMarginBottom}" data-id="right-area-content-area-top-bottom-margin-box"></div>
            <div id="${targetElementNames.chartDisplayArea}" data-id="chart-display-area">
              <svg class="${targetElementNames.svg} ${targetElementNames.overflowVisible}" id="${targetElementNames.chartDisplayAreaSvg}">

              </svg>
            </div>
            <div id="${targetElementNames.xAxisDisplayArea}" data-id="x-axis-display-area">
              <svg class="${targetElementNames.svg}" id="${targetElementNames.xAxisDisplayAreaSvg}">

              </svg>
            </div>
            <div id="${targetElementNames.clipBoxArea}" data-id="clip-box-area">
              <div id="${targetElementNames.clipBoxAreaTopRow}" data-id="clip-box-area-top-row">

              </div>
              <div id="${targetElementNames.clipBoxAreaBottomRow}" data-id="clip-box-area-bottom-row">

              </div>
            </div>
          </div>
        </div>
        <div id="${targetElementNames.bottomRowArea}" data-id="bottom-row-area">
          <div id="${targetElementNames.xAxisUnitArea}" data-id="x-axis-unit-area">

          </div>
          <div id="${targetElementNames.bottomRowAreaDataLabelNamesArea}" data-id="bottom-row-area-data-label-names-area">
            
          </div>
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
          display: flex;
          flex-wrap: wrap;
          position: relative;
        }
        #${targetElementNames.xAxisDisplayArea} {
          width: 100%;
          height: ${this.getXLabelAreaHeight()}px;
          display: block;
          position: relative;
        }
        #${targetElementNames.clipBoxArea} {
          width: 100px;
          display: block;
          position: absolute;
          top: 10px;
          left: 10px;
          opacity: 0;
          z-index: 1;
          background-color: #fff;
          border: 1px solid #ccc;
          transition: 0.3s all;
        }
        #${targetElementNames.clipBoxArea}.${targetElementNames.show} {
          opacity: 1;
        }
        #${targetElementNames.clipBoxAreaTopRow} {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          position: relative;
          background-color: #dfdfdf;
          font-size: ${this.getClipFontSize()};
          color: #222;
          box-sizing: border-box;
          padding: 6px;
        }
        #${targetElementNames.clipBoxAreaBottomRow} {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          position: relative;
          padding: 6px;
        }
        #${targetElementNames.bottomRowArea} {
          width: 100%;
          height: ${this.getDataLabelAreaHeight()}px;
          display: flex;
          flex-wrap: wrap;
          position: relative;
          justify-content: center;
          align-items: center;
          alugn-content: center;
        }
        #${targetElementNames.bottomRowAreaDataLabelNamesArea} {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          position: relative;
          justify-content: center;
          align-items: center;
          align-content: center;
        }
        #${targetElementNames.xAxisUnitArea} {
          position: absolute;
          top: 6px;
          right: 8px;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          font-size: ${defaultConfig.fontSize};
          color: ${defaultConfig.fontGrayColor};
        }

        .${targetElementNames.svg} {
          width: 100%;
          height: 100%;
          display: block;
          position: relative;
        }
        .${targetElementNames.svg}.${targetElementNames.overflowVisible} {
          overflow: visible;
        }
        .${targetElementNames.topBottomMarginBottom} {
          width: 100%;
          display: block;
          height: ${this.getTopBottomMarginHeight()}px;
          position: relative;
        }
        .${targetElementNames.clipDataRow} {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 4px;
          position: relative;
        }
        .${targetElementNames.clipDataRow}:last-child {
          margin-bottom: 0;
        }
        .${targetElementNames.clipDataRowTitleArea} {
          width: 50px;
          display: inline-flex;
          flex-wrap: wrap;
          align-items: center;
          box-sizing: border-box;
          padding: 4px;
          position: relative;
          font-size: ${this.getClipFontSize()};
          color: #333;
        }
        .${targetElementNames.clipDataRowContentArea} {
          width: calc(100% - 50px);
          display: inline-flex;
          flex-wrap: wrap;
          align-items: center;
          box-sizing: border-box;
          padding: 4px;
          position: relative;
          font-size: ${this.getClipFontSize()};
          color: #333;
        }
        .${targetElementNames.dataLabelNameItem} {
          display: inline-flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: flex-start;
          position: relative;
          margin-right: 16px;
        }
        .${targetElementNames.dataLabelNameItem}:last-child {
          margin-right: 0;
        }
        .${targetElementNames.dataLabelNameItemSymbol} {
          width: 8px;
          margin-right: 4px;
          height: 8px;
          display: flex;
          border-radius: 10px;
          position: relative;
        }
        .${targetElementNames.dataLabelNameItemName} {
          width: calc(100% - 12px);
          display: flex;
          flex-wrap: wrap;
          position: relative;
          font-size: 12px;
        }
        .${targetElementNames.xAxisLabelItem} {
          width: ${this.getDataOneColumnWidth()}px;
          display: inline-flex;
          flex-wrap: wrap;
          margin-top: 14px;
          justify-content: center;
          align-items: center;
          align-content: center;
          position: relative;
          box-sizing: border-box;
          padding: 4px;
          border-radius: 4px;
          transition: 0.3s all;
        }
        .${targetElementNames.xAxisLabelItem}.${targetElementNames.active} {
          background-color: rgba(0, 0, 0, 0.1);
        }
        .${targetElementNames.xAxisLabelItem}:first-child {
          margin-left: ${this.getChartLeftMarginWidth() - (this.getDataOneColumnWidth() / 2)}px;
        }
        .${targetElementNames.xAxisLabelItemTextArea} {
          display: inline-flex;
          flex-wrap: wrap;
          position: relative;
          font-size: 12px;
        }
      </style>
    `.trim();
    target.innerHTML = htmlString;

    this.getChartDisplayAreaElement()?.addEventListener('mouseleave', (e) => this.callbackChartDisplayMouseEvent(e))
    this.getChartDisplayAreaElement()?.addEventListener('mousemove', (e) => this.callbackChartDisplayMouseEvent(e), { capture: false });
  }

  private drawYAxis(): void {
    const svgElement = this.getYAxisDisplayAreaSvgElement();
    if (svgElement === null) {
      return;
    }

    const yrl = this.getYRangeAndLinear();
    // console.log('yrl', yrl);

    select(svgElement)
    .append('g')
    .append('text')
    .text(this.yAxis?.unit ?? '')
    .attr("font-family", "sans-serif")
    .attr("font-size", defaultConfig.fontSize)
    .attr('x', 10)
    .attr('y', -22)
    .attr('fill', defaultConfig.fontGrayColor)
    ;

    select(svgElement)
    .append('g')
    .selectAll()
    .data(yrl.yRange)
    .enter()
    .append('text')
    .text(d => d.toString())
    .attr("x", (d, i) => {
      return 10;
    })
    .attr("y", (d, i) => {
      return yrl.yLinear(d) + 3;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", defaultConfig.fontSize)
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
      .attr('class', 'point-bg')
      .selectAll()
      .data(item.datas)
      .enter()
      .append('circle')
      .attr('r', 8)
      .attr('cx', (d, i) => {
        return (i * this.getDataOneColumnWidth()) + this.getChartLeftMarginWidth();
      })
      .attr('cy', (d, i) => {
        return this.getPointDrawMaterials().yRangeAndLinear(d);
      })
      .attr('fill', item.color ?? defaultConfig.color)
      .attr('opacity', 0)
      ;

      select(svgElement)
      .append('g')
      .attr('class', 'point')
      .selectAll()
      .data(item.datas)
      .enter()
      .append('circle')
      .attr('r', 0)
      .attr('cx', (d, i) => {
        return (i * this.getDataOneColumnWidth()) + this.getChartLeftMarginWidth();
      })
      .attr('cy', (d, i) => {
        return this.getPointDrawMaterials().yRangeAndLinear(d);
      })
      .attr('fill', item.color ?? defaultConfig.color)
      .transition()
      .delay((d, i) => {
        return i * (this.getInitTransitionDuration() / (item.datas.length + 5));
      })
      .ease(easeBackOut)
      .duration(300)
      .attr('r', 5)
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
      // console.log('@@points', points);
      const pathOfLine = lineGenerator(points);
      select(svgElement)
      .append('g')
      .append('path')
      .attr('d', pathOfLine)
      .attr('stroke-width', 1)
      .attr("fill", 'none')
      .attr("stroke", item.color ?? defaultConfig.color)
      .style("clip-path", "polygon(0 0, 0% 0, 0% 100%, 0% 100%)")
      .transition()
      .duration(this.getInitTransitionDuration())
      .ease(easeBackOut)
      .style("clip-path", "polygon(0 0, 100% 0, 100% 100%, 0% 100%)")
      ;
    });
  }

  private drawXAxis() {
    const targetElement = this.getXAxisDisplayAreaElement();
    if (targetElement === null) {
      return;
    }

    let htmlString = ``;
    this.xAxis?.labels.forEach((item, index) => {
      htmlString += `
        <div class="${targetElementNames.xAxisLabelItem}" data-index="${index}">
          <div class="${targetElementNames.xAxisLabelItemTextArea}" style="color: ${item.color ?? defaultConfig.fontColor};">
            ${item.text}
          </div>
        </div>
      `.trim();
    });
    targetElement.innerHTML = htmlString;

    const xAxisUnitAreaElement = this.getXAxisUnitAreaElement();
    if (xAxisUnitAreaElement !== null) {
      xAxisUnitAreaElement.textContent = this.xAxis?.unit ?? '';
    }
  }

  private drawDataJoint(): void {
    const t = this;

    const targetElement = this.getChartDisplayAreaElement();
    if (targetElement === null) {
      return;
    }

    const svgElement = this.getChartDisplayAreaSvgElement();
    if (svgElement === null) {
      return;
    }

    select(svgElement)
    .append('g')
    .selectAll()
    .data(this.xAxis?.labels ?? [])
    .enter()
    .append('line')
    .attr('x1', (d, i) => (i * this.getDataOneColumnWidth()) + this.getChartLeftMarginWidth())
    .attr('y1', 0)
    .attr('x2', (d, i) => (i * this.getDataOneColumnWidth()) + this.getChartLeftMarginWidth())
    .attr('y2', this.getChartDrawAreaHeight())
    .attr('stroke', '#aaa')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '2, 2')
    ;

    select(targetElement)
    .selectAll()
    .data(this.xAxis?.labels ?? [])
    .enter()
    .append('div')
    .attr('data-index', (d, i) => i)
    .style('position', 'absolute')
    .style('z-index', 2)
    .style('width', `${this.getDataJointAreaWidth()}px`)
    .style('height', '100%')
    .style('top', 0)
    .style('left', (d, i) => (i * this.getDataOneColumnWidth()) + (this.getChartLeftMarginWidth() - (this.getDataJointAreaWidth() / 2)) + 'px')
    .style('cursor', 'pointer')
    .on('mouseenter', (event, d) => t.callbackDataJoinMouseEvent(event, d))
    .on('mouseleave', (event, d) => t.callbackDataJoinMouseEvent(event, d))
    .on('mousemove', (event, d) => t.callbackDataJoinMouseEvent(event, d))
    .on('touchstart', (event, d) => t.callbackDataJoinMouseEvent(event, d))
    .on('touchend', (event, d) => t.callbackDataJoinMouseEvent(event, d))
    .on('touchmove', (event, d) => t.callbackDataJoinMouseEvent(event, d))
    ;
  }

  private drawDataLabelNames(): void {
    const targetElement = this.getBottomRowAreaDataLabelNamesArea();
    if (targetElement === null) {
      return;
    }

    let htmlString = ``;
    this.data?.forEach((item, index) => {
      htmlString += `
        <div class="${targetElementNames.dataLabelNameItem}">
          <div class="${targetElementNames.dataLabelNameItemSymbol}" style="background-color: ${item.color ?? defaultConfig.color};">

          </div>
          <div class="${targetElementNames.dataLabelNameItemName}">
            ${ item.name }
          </div>
        </div>
      `.trim();
    });
    targetElement.innerHTML = htmlString;
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
    this.drawDataJoint(); // 데이터가 꺾이는 영역을 그립니다.
    this.drawDataLabelNames(); // 데이터 이름 목록이 표시되는 영역을 그립니다.
  }
}