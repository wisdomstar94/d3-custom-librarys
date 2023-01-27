import { IChart3 } from "./chart3.interface";
import { v4 } from 'uuid';
import { arc, easeCubicOut, easeLinear, format, interpolate, scaleLinear, select } from "d3";
import { debounceTime, fromEvent, Subscription } from 'rxjs';

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
    piePiece: 'class_' + v4(),
    ulSeriesList: 'class_' + v4(),
    listItem: 'class_' + v4(),
    seriesSymbol: 'class_' + v4(),
    seriesName: 'class_' + v4(),
    seriesData: 'class_' + v4(),
    active: 'class_' + v4(),
    mobile: 'class_' + v4(),

    dropShadow: 'id_' + v4(),
  };
  elements = {
    mainContainer: () => document.querySelector<HTMLElement>('.' + this.elementSelectors.mainContainer),
    topRow: () => document.querySelector<HTMLElement>('.' + this.elementSelectors.topRow),
    contentRow: () => document.querySelector<HTMLElement>('.' + this.elementSelectors.contentRow),
    leftArea: () => document.querySelector<HTMLElement>('.' + this.elementSelectors.leftArea),
    leftAreaSvg: () => document.querySelector<SVGElement>('.' + this.elementSelectors.leftAreaSvg),
    rightArea: () => document.querySelector<HTMLElement>('.' + this.elementSelectors.rightArea),
    ulSeriesList: () => document.querySelector<HTMLUListElement>('.' + this.elementSelectors.ulSeriesList),
  };
  defaultConfig = {
    leftAreaWidth: '50%',
    rightAreaWidth: '50%',
    pieMargin: 20,
    pieWeight: 40,
    maxAngle: 6.285, // arc 그릴 때, innerRadius의 값이 6.285 이면 360도!
    color: '#f00',
    boundaryMargin: 0,
    windowMobileMaxWidth: 600,
  };
  options?: IChart3.Options;
  windowResizeSubscription?: Subscription;

  constructor(options?: IChart3.Options) {
    this.options = options;
    this.windowResizeSubscription = 
      fromEvent(window, 'resize')
      .pipe(debounceTime(300))
      .subscribe((event) => {
        this.draw();
      })
    ;
  }

  setOptions(callbackFn: (prev: IChart3.Options | undefined) => IChart3.Options): Chart3 {
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
  private getLeftAreaWidth(): string {
    if (this.options?.leftAreaWidth === undefined) {
      return this.defaultConfig.leftAreaWidth;
    }
    return this.options.leftAreaWidth;
  }

  private getRightAreaWidth(): string {
    if (this.options?.rightAreaWidth === undefined) {
      return this.defaultConfig.rightAreaWidth;
    }
    return this.options.rightAreaWidth;
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
    get created element return function 
  */
  private getMainContainerElement() {
    return document.querySelector<HTMLElement>(`.${this.elementSelectors.mainContainer}`)
  }

  private getUlSeriesLiElements() {
    return document.querySelectorAll<HTMLElement>(`.${this.elementSelectors.ulSeriesList} .${this.elementSelectors.listItem}`);
  }

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
    const div_mainContainer = document.createElement('div');
    div_mainContainer.setAttribute('data-box-title', 'main-container');
    div_mainContainer.classList.add(this.elementSelectors.mainContainer);
    if (this.isMobile()) {
      div_mainContainer.classList.add(this.elementSelectors.mobile);
    }
    
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

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    div_leftArea_svg.appendChild(defs);

    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', this.elementSelectors.dropShadow);
    filter.setAttribute('x', '0');
    filter.setAttribute('y', '0');
    defs.appendChild(filter);

    const feDropShadow = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow');
    feDropShadow.setAttribute('dx', '5');
    feDropShadow.setAttribute('dy', '5');
    feDropShadow.setAttribute('stdDeviation', '5');
    feDropShadow.setAttribute('flood-color', '#000');
    feDropShadow.setAttribute('flood-opacity', '0.4');
    filter.appendChild(feDropShadow);

    // main-container content-row right-area
    const div_rightArea = document.createElement('div');
    div_rightArea.classList.add(this.elementSelectors.rightArea);
    div_rightArea.setAttribute('data-box-title', 'right-area');
    div_contentRow1.appendChild(div_rightArea);

    // main-container content-row right-area ul-series-list
    const ul_series_list = document.createElement('ul');
    ul_series_list.classList.add(this.elementSelectors.ulSeriesList);
    ul_series_list.setAttribute('data-box-title', 'ul-series-list');
    div_rightArea.appendChild(ul_series_list);

    // insert basic elements
    targetSelectorElement.appendChild(div_mainContainer);
  }

  /*
    other function
  */
  private getStyleSheet(): string {
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
          width: ${this.getLeftAreaWidth()};
          aspect-ratio: 1 / 0.8;
          display: flex;
          flex-wrap: wrap;
          position: relative;
          box-sizing: border-box;
        }
        .${this.elementSelectors.mainContainer}.${this.elementSelectors.mobile} .${this.elementSelectors.contentRow} .${this.elementSelectors.leftArea} {
          width: 100%;
        }
        .${this.elementSelectors.mainContainer} .${this.elementSelectors.contentRow} .${this.elementSelectors.rightArea} {
          width: ${this.getRightAreaWidth()};
          display: flex;
          flex-wrap: wrap;
          position: relative;
          box-sizing: border-box;
          align-items: flex-start;
        }
        .${this.elementSelectors.mainContainer}.${this.elementSelectors.mobile} .${this.elementSelectors.contentRow} .${this.elementSelectors.rightArea} {
          width: 100%;
        }
        .${this.elementSelectors.mainContainer} .${this.elementSelectors.ulSeriesList} {
          width: 100%;
          display: block;
          margin: 0;
          padding: 12px;
          position: relative;
          box-sizing: border-box;
        }
        .${this.elementSelectors.mainContainer} .${this.elementSelectors.ulSeriesList} .${this.elementSelectors.listItem} {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          position: relative;
          align-items: center;
          align-content: center;
          justify-content: flex-start;
          box-sizing: border-box;
          padding: 12px;
          border-bottom: 1px solid #F2F4F3;
        }
        .${this.elementSelectors.mainContainer} .${this.elementSelectors.ulSeriesList} .${this.elementSelectors.listItem}:last-child {
          margin-bottom: 0;
        }
        .${this.elementSelectors.mainContainer} .${this.elementSelectors.ulSeriesList} .${this.elementSelectors.listItem}.${this.elementSelectors.active} {
          background-color: #eee;
        }
        .${this.elementSelectors.mainContainer} .${this.elementSelectors.ulSeriesList} .${this.elementSelectors.listItem} .${this.elementSelectors.seriesSymbol} {
          width: 10px;
          margin-right: 10px;
          height: 10px;
          display: inline-flex;
          border-radius: 20px;
        }
        .${this.elementSelectors.mainContainer} .${this.elementSelectors.ulSeriesList} .${this.elementSelectors.listItem} .${this.elementSelectors.seriesName} {
          width: calc((100% - 20px) / 2);
          display: inline-flex;
          font-size: 14px;
          color: #333;
          position: relative;
        }
        .${this.elementSelectors.mainContainer} .${this.elementSelectors.ulSeriesList} .${this.elementSelectors.listItem} .${this.elementSelectors.seriesData} {
          width: calc((100% - 20px) / 2);
          display: inline-flex;
          font-size: 14px;
          color: #333;
          position: relative;
          justify-content: flex-end;
        }

        .${this.elementSelectors.mainContainer} .${this.elementSelectors.svg} {
          width: 100%;
          height: 100%;
          display: block;
          position: relative;
        }
        .${this.elementSelectors.mainContainer} .${this.elementSelectors.piePiece} {
          position: relative;
        }

        


      </style>
    `.trim();
  }

  /*
    draw function 
  */
  private drawPie(): void {
    const leftAreaSvg = this.elements.leftAreaSvg();
    if (leftAreaSvg === null) {
      return;
    }

    const svgWidth = leftAreaSvg.clientWidth;
    const svgHeight = leftAreaSvg.clientHeight;
    const moreSmallSize = svgWidth > svgHeight ? 'height' : 'width';
    const minSize = svgWidth > svgHeight ? svgHeight : svgWidth;
    const translateX = (moreSmallSize === 'height' ? (svgWidth / 2) : (minSize / 2));
    const translateY = (moreSmallSize === 'width' ? (svgHeight / 2) : (minSize / 2));
    const translate = `translate(${translateX}, ${translateY})`;

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

    const g = 
      select(leftAreaSvg)
      .append("g")
    ;
    this.options?.series?.forEach((item, index) => {
      // draw pie piece 
      const pathMouseEvent = (event: MouseEvent) => {
        // console.log('event', event);
        const targetPath = event.target as SVGPathElement;
        switch (event.type) {
          case 'mouseover': {
            const parentG = targetPath.parentElement;
            parentG?.insertAdjacentElement('beforeend', targetPath);
            this.getUlSeriesLiElements()[index]?.classList.add(this.elementSelectors.active);

            select(targetPath)
            .attr('filter', `url(#${this.elementSelectors.dropShadow})`)
            .transition()
            .duration(100)
            .ease(easeLinear)
            .attrTween("d", (d: any) => {
              const start = {
                innerRadius: ((minSize - (this.getPieMargin() * 2)) / 2) - this.getPieWeight(),
                outerRadius: ((minSize - (this.getPieMargin() * 2)) / 2),
                startAngle: needInfoItems[index].startAngle, 
                endAngle: needInfoItems[index].endAngle - this.getBoundaryMargin(),
              };
              const end = {
                innerRadius: ((minSize - (this.getPieMargin() * 2)) / 2) - this.getPieWeight() - 5,
                outerRadius: ((minSize - (this.getPieMargin() * 2)) / 2) + 5,
                startAngle: needInfoItems[index].startAngle - 0.1, 
                endAngle: needInfoItems[index].endAngle - this.getBoundaryMargin() + 0.1,
              };
              const interpolate1 = interpolate(start, end);
              return function (t: number) {
                return arc()(interpolate1(t)) ?? '';
              };
            })
            ;
          } break;
          case 'mouseout': {
            this.getUlSeriesLiElements()[index]?.classList.remove(this.elementSelectors.active);

            select(targetPath)
            .attr('filter', ``)
            .transition()
            .duration(100)
            .ease(easeLinear)
            .attrTween("d", (d: any) => {
              const start = {
                innerRadius: ((minSize - (this.getPieMargin() * 2)) / 2) - this.getPieWeight() - 5,
                outerRadius: ((minSize - (this.getPieMargin() * 2)) / 2) + 5,
                startAngle: needInfoItems[index].startAngle - 0.1, 
                endAngle: needInfoItems[index].endAngle - this.getBoundaryMargin() + 0.1,
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
          } break;
        }
      };

      g
      .append("path")
      // .attr('filter', `url(#${this.elementSelectors.dropShadow})`)
      .attr('class', this.elementSelectors.piePiece)
      .attr('data-class', 'pie-piece')
      .attr('data-index', index)
      .attr('data-translate-x', translateX)
      .attr('data-translate-y', translateY)
      .attr("transform", `${translate}`)
      // .attr('transform-origin', 'center')
      .attr("fill", item.color ?? this.defaultConfig.color)
      .on('mouseover', pathMouseEvent)
      .on('mouseout', pathMouseEvent)
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

  private drawSeries(): void {
    const ulSeriesList = this.elements.ulSeriesList();
    if (ulSeriesList === null) {
      return;
    }

    this.options?.series?.forEach((item, index) => {
      const li = document.createElement('li');
      li.setAttribute('class', this.elementSelectors.listItem);
      li.setAttribute('data-index', index.toString());

      const div_symbol = document.createElement('div');
      div_symbol.setAttribute('class', this.elementSelectors.seriesSymbol);
      div_symbol.style.backgroundColor = item.color ?? this.defaultConfig.color;
      li.appendChild(div_symbol);

      const div_series_name = document.createElement('div');
      div_series_name.setAttribute('class', this.elementSelectors.seriesName);
      div_series_name.innerHTML = item.name;
      li.appendChild(div_series_name);

      const div_series_data = document.createElement('div');
      div_series_data.setAttribute('class', this.elementSelectors.seriesData);
      div_series_data.textContent = format(",")(item.data[0]);
      li.appendChild(div_series_data);

      ulSeriesList.appendChild(li);
    });
  }

  draw(): void {
    this.insertBasicContainers();
    this.drawPie();
    this.drawSeries();
  }
}