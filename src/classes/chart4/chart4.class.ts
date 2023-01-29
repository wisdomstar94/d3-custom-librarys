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
  };
  elements = {
    mainContainer: () => document.querySelector<HTMLElement>('.' + this.elementSelectors.mainContainer),
  };
  defaultConfig = {
    windowMobileMaxWidth: 600,
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
    insert element function
  */
  private insertBasicContainers() {
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

    targetSelectorElement.appendChild(mainContainer);
  }

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
          position: relative;
          align-items: stretch;
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
      </style>
    `.trim();
  }

  /*
    draw function 
  */
  draw(): void {
    this.insertBasicContainers();
  }

  clear(): void {
    this.windowResizeSubscription?.unsubscribe();
  }
}