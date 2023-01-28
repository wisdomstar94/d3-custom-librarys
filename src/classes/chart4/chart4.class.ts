import { IChart4 } from "./chart4.interface";
import { v4 } from 'uuid';
import { arc, easeCubicOut, easeLinear, format, interpolate, scaleLinear, select } from "d3";
import { debounceTime, fromEvent, Subscription } from 'rxjs';

export class Chart4 {
  elementSelectors = {
    
  };
  elements = {
    
  };
  defaultConfig = {
    windowMobileMaxWidth: 600,
  };
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
  private insertBasicContainerStyles() {
    const targetSelectorElement = this.getTargetSelectorElement();
    if (targetSelectorElement === null) {
      return;
    }
    targetSelectorElement.innerHTML = this.getStyleSheet();
  }

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

    // insert style
    this.insertBasicContainerStyles();

    // main-container
    const htmlString = `
    
    `;

    // insert basic elements
    targetSelectorElement.innerHTML = htmlString;
  }

  /*
    other function
  */
  private getStyleSheet(): string {
    return `
      <style>

      </style>
    `.trim();
  }

  /*
    draw function 
  */
  draw(): void {
    this.insertBasicContainers();
  }
}