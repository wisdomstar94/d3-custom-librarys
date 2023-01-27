import { IChart3 } from "./chart3.interface";
import { v4 } from 'uuid';
import { arc, easeCubicOut, easeLinear, interpolate, scaleLinear, select } from "d3";

export class Chart3 {
  elementNameSpaces = {
    svg: 'http://www.w3.org/2000/svg',
  };
  elementSelectors = {
    mainContainer: 'class_' + v4(),
    topRow: 'class_' + v4(),
    contentRow: 'class_' + v4(),
    leftArea: 'class_' + v4(),
    leftAreaSvg: 'class_' + v4(),
    rightArea: 'class_' + v4(),
    svg: 'class_' + v4(),
  };
  elements = {
    mainContainer: () => document.querySelector<HTMLElement>('.' + this.elementSelectors.mainContainer),
    topRow: () => document.querySelector<HTMLElement>('.' + this.elementSelectors.topRow),
    contentRow: () => document.querySelector<HTMLElement>('.' + this.elementSelectors.contentRow),
    leftArea: () => document.querySelector<HTMLElement>('.' + this.elementSelectors.leftArea),
    leftAreaSvg: () => document.querySelector<SVGElement>('.' + this.elementSelectors.leftAreaSvg),
    rightArea: () => document.querySelector<HTMLElement>('.' + this.elementSelectors.rightArea),
  };
  defaultConfig = {
    leftAreaWidth: '50%',
    rightAreaWidth: '50%',
    innerRadius: 50,
    outerRadius: 100,
    pieMargin: 20,
    pieWeight: 40,
    maxAngle: 6.285,
    color: '#f00',
    boundaryMargin: 0,
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
    getter function
  */
  private getInnerRadius(): number {
    if (this.options?.innerRadius === undefined) {
      return this.defaultConfig.innerRadius;
    }
    return this.options.innerRadius;
  }

  private getOuterRadius(): number {
    if (this.options?.outerRadius === undefined) {
      return this.defaultConfig.outerRadius;
    }
    return this.options.outerRadius;
  }

  private getPieMargin(): number {
    if (this.options?.pieMargin === undefined) {
      return this.defaultConfig.pieMargin;
    }
    return this.options.pieMargin;
  }

  private getPieWeight(): number {
    if (this.options?.pieWeight === undefined) {
      return this.defaultConfig.pieWeight;
    }
    return this.options.pieWeight;
  }

  private getBoundaryMargin(): number {
    if (this.options?.boundaryMargin === undefined) {
      return this.defaultConfig.boundaryMargin;
    }
    return this.options.boundaryMargin;
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
  getMainContainerElement() {
    return document.querySelector<HTMLElement>(`.${this.elementSelectors.mainContainer}`)
  }

  /*
    insert element function
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

    // insert style
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

    // main-container content-row left-area svg
    const div_leftArea_svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    div_leftArea_svg.classList.add(this.elementSelectors.svg);
    div_leftArea_svg.classList.add(this.elementSelectors.leftAreaSvg);
    div_leftArea_svg.setAttribute('data-box-title', 'left-area-svg');
    div_leftArea.appendChild(div_leftArea_svg);

    // main-container content-row right-area
    const div_rightArea = document.createElement('div');
    div_rightArea.classList.add(this.elementSelectors.rightArea);
    div_rightArea.setAttribute('data-box-title', 'right-area');
    div_contentRow1.appendChild(div_rightArea);

    // insert basic elements
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
          aspect-ratio: 1 / 0.8;
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

        .${this.elementSelectors.svg} {
          width: 100%;
          height: 100%;
          display: block;
          position: relative;
        }
      </style>
    `.trim();
  }

  /*
    draw function 
  */
  drawPie(): void {
    const leftAreaSvg = this.elements.leftAreaSvg();
    if (leftAreaSvg === null) {
      return;
    }

    const svgWidth = leftAreaSvg.clientWidth;
    const svgHeight = leftAreaSvg.clientHeight;
    const moreSmallSize = svgWidth > svgHeight ? 'height' : 'width';
    const minSize = svgWidth > svgHeight ? svgHeight : svgWidth;
    const translate = `translate(${(moreSmallSize === 'height' ? (svgWidth / 2) : (minSize / 2))}, ${(moreSmallSize === 'width' ? (svgHeight / 2) : (minSize / 2))})`;

    const totalValue = this.options?.series?.reduce((prev, current) => {
      return prev + current.data[0];
    }, 0) ?? 0;
    const scaleConverter = scaleLinear().domain([0, totalValue]).range([0, this.defaultConfig.maxAngle]);
    const needInfoItems: IChart3.NeedInfoItem[] = [];
    this.options?.series?.forEach((item, index) => {
      const value = item.data[0];
      const angleSize = scaleConverter(value);
      const startAngle = index === 0 ? 0 : needInfoItems[index - 1].endAngle;
      const endAngle = startAngle + angleSize;
      const newItem = {
        startAngle,
        endAngle,
      };
      needInfoItems.push(newItem);
    });

    this.options?.series?.forEach((item, index) => {
      // innerRadius의 값이 6.3 이면 360도!
      select(leftAreaSvg)
      .append("g")
      .append("path")
      // .attr("class", "arc")
      .attr("d", (d) => {
        return arc()({
          innerRadius: ((minSize - (this.getPieMargin() * 2)) / 2) - this.getPieWeight(),
          outerRadius: ((minSize - (this.getPieMargin() * 2)) / 2),
          // outerRadius 와 innerRadius 사이의 영역에 호가 그려집니다. 즉, 호의 굵기를 크게하려면 outerRadius - innerRadius 값이 크게 나오게 하면 됨.
          startAngle: needInfoItems[index].startAngle, // 호의 시작 각도, 0 이 12시 방향이고 값이 커질 수록 시계방향으로 이동됨.
          endAngle: needInfoItems[index].startAngle, // 호의 끝 각도, 0 이 12시 방향이고 값이 커질 수록 시계방향으로 이동됨.
          // 각도 증가폭이 커서 소숫점 단위로 증가시켜야 그려지는 각도가 조금씩만 증가함.
        });
      })
      .attr("fill", item.color ?? this.defaultConfig.color)
      .attr("transform", `${translate}`)
      .transition()
      .delay(index * 200)
      .duration(200)
      .ease(easeLinear)
      .attrTween("d", (d: any) => {
        const start = {
          innerRadius: ((minSize - (this.getPieMargin() * 2)) / 2) - this.getPieWeight(),
          outerRadius: ((minSize - (this.getPieMargin() * 2)) / 2),
          // outerRadius 와 innerRadius 사이의 영역에 호가 그려집니다. 즉, 호의 굵기를 크게하려면 outerRadius - innerRadius 값이 크게 나오게 하면 됨.
          startAngle: needInfoItems[index].startAngle, // 호의 시작 각도, 0 이 12시 방향이고 값이 커질 수록 시계방향으로 이동됨.
          endAngle: needInfoItems[index].startAngle, // 호의 끝 각도, 0 이 12시 방향이고 값이 커질 수록 시계방향으로 이동됨.
        };
        const end = {
          innerRadius: ((minSize - (this.getPieMargin() * 2)) / 2) - this.getPieWeight(),
          outerRadius: ((minSize - (this.getPieMargin() * 2)) / 2),
          startAngle: needInfoItems[index].startAngle, 
          endAngle: needInfoItems[index].endAngle - this.getBoundaryMargin(),
        };
        const interpolate1 = interpolate(start, end);
        return function (t: number) {
          return arc()(interpolate1(t)) ?? '';
        };
      })
      ;
    });
  }

  draw(): void {
    this.insertBasicContainers();
    this.drawPie();
  }
}