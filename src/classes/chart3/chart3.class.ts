import { IChart3 } from "./chart3.interface";
import { v4 } from 'uuid';

export class Chart3 {
  elementSelectors = {
    mainContainer: 'class_' + v4(),
    topRow: 'class_' + v4(),
    contentRow: 'class_' + v4(),
    leftArea: 'class_' + v4(),
    rightArea: 'class_' + v4(),
  };
  defaultConfig = {
    leftAreaWidth: '50%',
    rightAreaWidth: '50%',
  };
  options?: IChart3.Options;

  constructor(options?: IChart3.Options) {
    this.options = options;
  }

  setOptions(callbackFn: (prev: IChart3.Options | undefined) => IChart3.Options): Chart3 {
    this.options = callbackFn(this.options);
    return this;
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
    get create element return function 
  */
  insertBasicContainerStyles() {
    const targetSelectorElement = this.getTargetSelectorElement();
    if (targetSelectorElement === null) {
      return;
    }
    targetSelectorElement.innerHTML = this.getStyleSheet();
  }

  insertBasicContainers() {
    const targetSelectorElement = this.getTargetSelectorElement();
    if (targetSelectorElement === null) {
      return;
    }

    while (targetSelectorElement?.hasChildNodes() === true) {
      if (targetSelectorElement?.firstChild !== null) {
        targetSelectorElement?.removeChild(targetSelectorElement?.firstChild);
      }
    }

    // style
    this.insertBasicContainerStyles();

    // main-container
    const div_mainContainer = document.createElement('div');
    div_mainContainer.setAttribute('data-box-title', 'main-container');
    div_mainContainer.classList.add(this.elementSelectors.mainContainer);
    
    // main-container top-row
    const div_topRow = document.createElement('div');
    div_topRow.classList.add(this.elementSelectors.topRow);
    div_topRow.setAttribute('data-box-title', 'top-row');
    div_mainContainer.appendChild(div_topRow);

    // main-container content-row
    const div_contentRow1 = document.createElement('div');
    div_contentRow1.classList.add(this.elementSelectors.contentRow);
    div_contentRow1.setAttribute('data-box-title', 'content-row-1');
    div_mainContainer.appendChild(div_contentRow1);

    // main-container content-row left-area
    const div_leftArea = document.createElement('div');
    div_leftArea.classList.add(this.elementSelectors.leftArea);
    div_leftArea.setAttribute('data-box-title', 'left-area');
    div_contentRow1.appendChild(div_leftArea);

    // main-container content-row right-area
    const div_rightArea = document.createElement('div');
    div_rightArea.classList.add(this.elementSelectors.rightArea);
    div_rightArea.setAttribute('data-box-title', 'right-area');
    div_contentRow1.appendChild(div_rightArea);

    targetSelectorElement.appendChild(div_mainContainer);
  }

  /*
    other function
  */
  getStyleSheet(): string {
    return `
      <style>
        .${this.elementSelectors.mainContainer} {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          position: relative;
          align-items: stretch;
          justify-content: flex-start;
        }
        .${this.elementSelectors.mainContainer} .${this.elementSelectors.topRow} {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          box-sizing: border-box;
          /* padding: 12px; */
          position: relative;
        }
        .${this.elementSelectors.mainContainer} .${this.elementSelectors.contentRow} {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          align-items: stretch;
          position: relative;
        }
        .${this.elementSelectors.mainContainer} .${this.elementSelectors.contentRow} .${this.elementSelectors.leftArea} {
          width: 50%;
          display: flex;
          flex-wrap: wrap;
          position: relative;
          box-sizing: border-box;
        }
        .${this.elementSelectors.mainContainer} .${this.elementSelectors.contentRow} .${this.elementSelectors.rightArea} {
          width: 50%;
          display: flex;
          flex-wrap: wrap;
          position: relative;
          box-sizing: border-box;
        }
      </style>
    `.trim();
  }

  /*
    draw function 
  */

  draw() {
    this.insertBasicContainers();
  }
}