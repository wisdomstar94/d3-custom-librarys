import { IChart4 } from "./chart4.interface";
import { v4 } from 'uuid';
import { debounceTime, fromEvent, Subscription } from 'rxjs';

export class Chart4 {
  elementSelectors = {
    mainContainer: 'main-container_' + v4(),
    ulContentRowList: 'ul-content-row-list_' + v4(),
    ulContentRowItem: 'ul-content-row-item_' + v4(),
    leftArea: 'left-area_' + v4(),
    rightArea: 'right-area_' + v4(),
    ulHorizontalList: 'ul-horizontal-list_' + v4(),
    ulHorizontalItem: 'ul-horizontal-item_' + v4(),
    dateDistanceButtonItem: 'date-distance-button_' + v4(),
    textWrapper: 'text_wrapper_' + v4(),
    hiddenText: 'hidden_text_' + v4(),
    text: 'text_' + v4(),
    seriesItem: 'series_item_' + v4(),
    seriesSymbol: 'series_symbol_' + v4(),
    seriesText: 'series_text_' + v4(),
    yAxisArea: 'yaxis_area_' + v4(),
    svg: 'svg_' + v4(),
  };
  elements = {
    mainContainer: () => document.querySelector<HTMLElement>('.' + this.elementSelectors.mainContainer),
  };
  defaultConfig = {
    windowMobileMaxWidth: 600,
    color: '#333',
    yAxis: {
      width: 0,
      height: 200,
      paddingTop: 5,
      paddingBottom: 5,
    },
  };
  dateDistanceButtonItems = [
    { name: '1H', value: '1H' },
    { name: '1D', value: '1D' },
    { name: '1W', value: '1W' },
    { name: '1M', value: '1M' },
    { name: '1Y', value: '1Y' },
    { name: 'ALL', value: 'ALL' },
  ];
  options?: IChart4.Options;
  windowResizeSubscription?: Subscription;

  constructor(options?: IChart4.Options) {
    this.options = options;
    this.windowResizeSubscription = 
      fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe((event) => {
        // this.draw();
      })
    ;
  }

  setOptions(callbackFn: (prev: IChart4.Options | undefined) => IChart4.Options): Chart4 {
    this.options = callbackFn(this.options);
    return this;
  }

  /*
    is funciton
  */
  private isMobile() {
    return (this.getTargetSelectorElement()?.clientWidth ?? 0) < this.defaultConfig.windowMobileMaxWidth;
  }

  /*
    getter function
  */
  private getYaxisWidth(): number {
    if (this.options?.yAxis?.width === undefined) {
      return this.defaultConfig.yAxis.width;
    }
    return this.options.yAxis.width;
  }

  private getYaxisHeight(): number {
    if (this.options?.yAxis?.height === undefined) {
      return this.defaultConfig.yAxis.height;
    }
    return this.options.yAxis.height;
  }

  private getYaxisPaddingTop(): number {
    if (this.options?.yAxis?.paddingTop === undefined) {
      return this.defaultConfig.yAxis.paddingTop;
    }
    return this.options.yAxis.paddingTop;
  }

  private getYaxisPaddingBottom(): number {
    if (this.options?.yAxis?.paddingBottom === undefined) {
      return this.defaultConfig.yAxis.paddingBottom;
    }
    return this.options.yAxis.paddingBottom;
  }

  /*
    get rendered element return functions
  */
  private getTargetSelectorElement() {
    if (this.options?.targetSelector === undefined) {
      return null;
    }
    return document.querySelector<HTMLElement>(this.options.targetSelector);
  }

  /*
    get created element return function 
  */
  

  /*
    other function
  */
  private getStyleSheet(): string {
    return `
      <style>
        .${this.elementSelectors.mainContainer} {
          width: 100%;
          display: block;
          position: relative;
          font-size: 12px;
          box-sizing: border-box;
          padding: 14px;
        }
        .${this.elementSelectors.ulContentRowList} {
          width: 100%;
          display: block;
          margin: 0;
          padding: 0;
          position: relative;
        }
        .${this.elementSelectors.ulContentRowList} > .${this.elementSelectors.ulContentRowItem} {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          margin: 0;
          padding: 0;
          position: relative;
          box-sizing: border-box;
        }
        .${this.elementSelectors.ulContentRowList} > .${this.elementSelectors.ulContentRowItem} > .${this.elementSelectors.leftArea} {
          width: 50%;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: flex-start;
          position: relative;
        }
        .${this.elementSelectors.ulContentRowList} > .${this.elementSelectors.ulContentRowItem} > .${this.elementSelectors.rightArea} {
          width: 50%;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: flex-end;
          position: relative;
        }

        .${this.elementSelectors.ulHorizontalList} {
          display: inline-flex;
          margin: 0;
          padding: 0;
          flex-wrap: wrap;
          align-items: stretch;
          align-content: center;
          justify-content: flex-start;
          position: relative;
        }
        .${this.elementSelectors.ulHorizontalList} > .${this.elementSelectors.ulHorizontalItem} {
          display: inline-flex;
          flex-wrap: wrap;
          align-items: center;
          align-content: center;
          position: relative;
        }

        .${this.elementSelectors.dateDistanceButtonItem} {
          margin-right: 4px;
        }
        .${this.elementSelectors.dateDistanceButtonItem}:last-child {
          margin-right: 0;
        }
        .${this.elementSelectors.dateDistanceButtonItem} > button {
          display: inline-flex;
          flex-wrap: wrap;
          position: relative;
          border: 0;
          background-color: rgba(255, 255, 255, 0);
          cursor: pointer;
          margin: 0;
          padding: 2px 6px;
          border-radius: 4px;
          color: #919AAB;
        }
        .${this.elementSelectors.dateDistanceButtonItem} > button:hover {
          background-color: #E7EEFD;
          color: #2650B0;
          font-weight: bolder;
        }
        .${this.elementSelectors.seriesItem} {
          margin-right: 20px;
        }
        .${this.elementSelectors.seriesItem}:last-child {
          margin-right: 0;
        }
        .${this.elementSelectors.seriesItem} > .${this.elementSelectors.seriesSymbol} {
          width: 8px;
          height: 8px;
          display: inline-flex;
          border-radius: 20px;
          margin-right: 6px;
        }
        .${this.elementSelectors.seriesItem} > .${this.elementSelectors.seriesText} {
          display: inline-flex;
          color: #919AAB;
        }

        .${this.elementSelectors.yAxisArea} {
          width: ${this.getYaxisWidth()}px;
          height: ${this.getYaxisHeight()}px;
          display: block;
          position: relative;
          padding-top: ${this.getYaxisPaddingTop()}px;
          padding-bottom: ${this.getYaxisPaddingBottom()}px;
          box-sizing: border-box;
          z-index: 2;
        }

        .${this.elementSelectors.textWrapper} {
          display: inline-block;
          position: relative;
        }
        .${this.elementSelectors.hiddenText} {
          font-weight: 900;
          color: rgba(0, 0, 0, 0);
          z-index: -1;
          position: relative;
        }
        .${this.elementSelectors.text} {
          width: 100%;
          height: 100%;
          display: block;
          text-align: center;
          position: absolute;
          top: 0;
          left: 0;
        }
        .${this.elementSelectors.svg} {
          width: 100%;
          height: 100%;
          position: relative;
        }
      </style>
    `.trim();
  }

  /*
    draw function 
  */
  private drawBasicContainers() {
    const targetSelectorElement = this.getTargetSelectorElement();
    if (targetSelectorElement === null) {
      return;
    }

    while (targetSelectorElement?.hasChildNodes() === true) {
      if (targetSelectorElement?.firstChild !== null) {
        targetSelectorElement?.removeChild(targetSelectorElement?.firstChild);
      }
    }

    // basic-container

    // style
    targetSelectorElement.innerHTML = this.getStyleSheet();

    // main-container
    const mainContainer = document.createElement('div');
    mainContainer.classList.add(this.elementSelectors.mainContainer);

    // main-container ul-content-row-list
    const ulContentRowList = document.createElement('ul');
    ulContentRowList.classList.add(this.elementSelectors.ulContentRowList);
    mainContainer.appendChild(ulContentRowList);

    // main-container ul-content-row-list li.top-row
    const li_topRow = document.createElement('li');
    li_topRow.classList.add(this.elementSelectors.ulContentRowItem);
    li_topRow.setAttribute('data-element-name', 'top-row')
    ulContentRowList.appendChild(li_topRow);

    // main-container ul-content-row-list li.top-row left-area 
    const leftArea = document.createElement('div');
    leftArea.classList.add(this.elementSelectors.leftArea);
    li_topRow.appendChild(leftArea);

    // main-container ul-content-row-list li.top-row left-area ul-horizontal-list
    const ulHorizontalList_dateDistanceButtonList = document.createElement('ul');
    ulHorizontalList_dateDistanceButtonList.classList.add(this.elementSelectors.ulHorizontalList);
    ulHorizontalList_dateDistanceButtonList.setAttribute('data-element-name', 'date-distance-button-list');
    leftArea.appendChild(ulHorizontalList_dateDistanceButtonList);

    // main-container ul-content-row-list li.top-row left-area ul-horizontal-list li
    for (const item of this.dateDistanceButtonItems) {
      const li = document.createElement('li');
      li.classList.add(this.elementSelectors.ulHorizontalItem);
      li.classList.add(this.elementSelectors.dateDistanceButtonItem);

      const button = document.createElement('button');
      // button.textContent = item.name;
      button.setAttribute('data-value', item.value);
      button.addEventListener('click', () => {
        console.log('item', item);
      });
      li.appendChild(button);

      /*
        바로 button 밑에 text 를 넣어도 되는데 굳이 이렇게 wrapper, hidden, text 구조로 작성하는 이유는
        hover 나 active 시 font 에 bold 효과가 추가되었을때 버튼의 width 크기가 변동되지 않게 하기 위함입니다. 
      */
      const button_text_wrapper = document.createElement('div');
      button_text_wrapper.classList.add(this.elementSelectors.textWrapper);
      button.appendChild(button_text_wrapper);

      const hidden_text = document.createElement('div');
      hidden_text.classList.add(this.elementSelectors.hiddenText);
      hidden_text.textContent = item.name;
      button_text_wrapper.appendChild(hidden_text);

      const text = document.createElement('div');
      text.classList.add(this.elementSelectors.text);
      text.textContent = item.name;
      button_text_wrapper.appendChild(text);

      ulHorizontalList_dateDistanceButtonList.appendChild(li);
    }

    // main-container ul-content-row-list li.top-row right-area 
    const rightArea = document.createElement('div');
    rightArea.classList.add(this.elementSelectors.rightArea);
    li_topRow.appendChild(rightArea);

    // main-container ul-content-row-list li.top-row right-area ul-horizontal-list
    const ulHorizontalList_series_list = document.createElement('ul');
    ulHorizontalList_series_list.classList.add(this.elementSelectors.ulHorizontalList);
    ulHorizontalList_series_list.setAttribute('data-element-name', 'series-list');
    rightArea.appendChild(ulHorizontalList_series_list);

    for (const item of this.options?.series ?? []) {
      const li = document.createElement('li');
      li.classList.add(this.elementSelectors.ulHorizontalItem);
      li.classList.add(this.elementSelectors.seriesItem);
      
      const symbol = document.createElement('div');
      symbol.classList.add(this.elementSelectors.seriesSymbol);
      symbol.style.backgroundColor = item.color ?? this.defaultConfig.color;
      li.appendChild(symbol);

      const seriesText = document.createElement('div');
      seriesText.classList.add(this.elementSelectors.seriesText);
      seriesText.textContent = item.name;
      li.appendChild(seriesText);

      ulHorizontalList_series_list.appendChild(li);
    }

    // main-container ul-content-row-list li.chart-row
    const li_chartRow = document.createElement('li');
    li_chartRow.classList.add(this.elementSelectors.ulContentRowItem);
    li_chartRow.setAttribute('data-element-name', 'chart-row')
    ulContentRowList.appendChild(li_chartRow);

    // main-container ul-content-row-list li.chart-row yaxis-area 
    const yaxis_area = document.createElement('div');
    yaxis_area.classList.add(this.elementSelectors.yAxisArea);
    li_chartRow.appendChild(yaxis_area);

    // main-container ul-content-row-list li.chart-row yaxis-area svg
    const yaxis_area_svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    yaxis_area_svg.classList.add(this.elementSelectors.svg);
    yaxis_area.appendChild(yaxis_area_svg);

    targetSelectorElement.appendChild(mainContainer);
  }

  private drawYaxis(): void {
    
  } 

  draw(): void {
    this.drawBasicContainers();
    this.drawYaxis();
  }

  clear(): void {
    this.windowResizeSubscription?.unsubscribe();
  }
}