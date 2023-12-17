"use client"

import { useAddEventListener } from "@wisdomstar94/react-add-event-listener";
import { arc, interpolate, interpolateArray, nice, quantile, scaleLinear, select } from "d3";
import { useCallback, useEffect, useRef, useState } from "react";

// https://www.pinterest.co.kr/pin/311241024259236439/

export default function Page() {
  const svgRef = useRef<SVGSVGElement>(null);
  // const [percent, setPercent] = useState(42.55);
  const [unitCount, setUnitCount] = useState(45);
  const [unitAngle, setUnitAngle] = useState(Math.PI / 100);
  // const [width, setWidth] = useState(0);
  // const [height, setHeight] = useState(0);
  const [padding, setPadding] = useState(20);
  const [strokeWidthAngle, setStrokeWidthAngle] = useState(Math.PI * (4 / 3));
  const [strokeWeight, setStrokeWeight] = useState(18);
  const [minimumValue, setMinimumValue] = useState(0);
  const [maximumValue, setMaximumValue] = useState(150);
  const [value, setValue] = useState(120);
  const [valueUnit, setValueUnit] = useState('km/h');
  const [cornerRadius, setCornerRadius] = useState(14);
  const [startFillColor, setStartFillColor] = useState('#87e9ff');
  const [endFillColor, setEndFillColor] = useState('#e5880d');
  const [displayLineUnitCount, setDisplayLineUnitCount] = useState(5);
  const [unitAndLinePeriod, setUnitAndLinePeriod] = useState(10);

  const drawChart = useCallback(() => {
    const svg = svgRef.current;
    if (svg === null) return;
    // if (width === 0) return;
    // if (height === 0) return;
    const width = svg.clientWidth;
    const height = svg.clientHeight;

    console.log(`@drawArc`);

    const minLength = Math.min(...[width, height]);
    
    const outerRadius = (minLength / 2) - (padding);
    const innerRadius = outerRadius - strokeWeight;

    // const totalEmptyAngleValue = strokeWidthAngle - (unitCount * unitAngle);
    // const emptyUnitAngle = totalEmptyAngleValue / (unitCount - 1);
    const angleInfo = getAngleInfo({ strokeWidthAngle, unitCount, unitAngle, minimumValue, maximumValue });

    const translateX = outerRadius + ((width - (outerRadius * 2)) / 2);
    const translateY = outerRadius + padding + 10;

    const g = select(svg)
      .selectAll(`g[data-title='chart-container']`)
      .data([NaN])
      .join(
        enter => enter.append('g'),
        update => update.attr('data-timestamp', Date.now().toString()),
        exit => exit.remove(),
      )
      .attr('data-title', 'chart-container')
      .attr('transform', `translate(${translateX}, ${translateY})`)
    ;

    g
      .selectAll(`path[data-title='bg-unit']`)
      .data(Array.from<number>({ length: unitCount }))
      .join(
        enter => enter.append('path'),
        update => update.attr('data-timestamp', Date.now().toString()),
        exit => exit.remove(),
      )
      .attr('data-title', 'bg-unit')
      .attr('data-index', function(data: number, index: number, targetElements: any) {
        return index;
      })
      .nodes()
      .forEach((node, index) => {
        const startAngle = angleInfo.startAngle + (index * unitAngle) + (index * angleInfo.emptyUnitAngle);
        const endAgle = startAngle + unitAngle;

        select(node)
          .attr(
            'd', 
            arc<unknown>() 
              .innerRadius(innerRadius) 
              .outerRadius(outerRadius) 
              .startAngle(startAngle) 
              .endAngle(endAgle)
              .cornerRadius(cornerRadius)
          )
          .style('fill', '#ddd')
          // .attr('transform', `translate(${translateX}, ${translateY})`)
        ;
      })
    ;

    g
      .selectAll(`path[data-title='fill-unit']`)
      .data(Array.from<number>({ length: unitCount }))
      .join(
        enter => enter.append('path'),
        update => update.attr('data-timestamp', Date.now().toString()),
        exit => exit.remove(),
      )
      .attr('data-title', 'fill-unit')
      .attr('data-index', function(data: number, index: number, targetElements: any) {
        return index;
      })
      .nodes()
      .forEach((node, index) => {
        const startAngle = angleInfo.startAngle + (index * unitAngle) + (index * angleInfo.emptyUnitAngle);
        const endAngle = startAngle + unitAngle;
        
        const filledAngle = angleInfo.getFillAngleInfo(startAngle, endAngle, value);
        console.log('@filledAngle', filledAngle);

        if (filledAngle === undefined) {
          select(node).remove();
          return;
        }
        // const filledStartAngle = filledAngle.startAngle;

        const intr = interpolate(startFillColor, endFillColor);

        select(node)
          .attr(
            'd', 
            arc<unknown>() 
              .innerRadius(innerRadius) 
              .outerRadius(outerRadius) 
              .startAngle(filledAngle.startAngle) 
              .endAngle(filledAngle.endAngle)
              .cornerRadius(cornerRadius)
          )
          .style('fill', intr(angleInfo.getEndColorOpacity(index)))
          // .attr('transform', `translate(${translateX}, ${translateY})`)
        ;
      })
    ;

    const lineOuterRadius = outerRadius - (strokeWeight + unitAndLinePeriod);
    const lineInnerRadius = lineOuterRadius - 5;
    const lineStrokeWeight = lineOuterRadius - lineInnerRadius;

    const gValueLineContainer = g.selectAll(`g[data-title='value-line-container']`)
      .data(Array.from<number>({ length: unitCount }))
      .join(
        enter => enter.append('g'),
        update => update.attr('data-timestamp', Date.now().toString()),
        exit => exit.remove(),
      )
      .attr('data-title', 'value-line-container')
      .attr('data-index', function(data: number, index: number, targetElements: any) {
        return index;
      })
    ; 

    gValueLineContainer
      .nodes()
      .forEach((node, index) => {
        // path
        const fillAngle = unitAngle / 1.5;

        const angleInfo = getAngleInfo({ strokeWidthAngle, unitCount, unitAngle: fillAngle, minimumValue, maximumValue });

        const startAngle = angleInfo.startAngle + (index * fillAngle) + (index * angleInfo.emptyUnitAngle);
        const endAngle = startAngle + fillAngle;

        select(node)
          .selectAll(`path[data-title='bg-value-line']`)
          .data([NaN])
          .join(
            enter => enter.append('path'),
            update => update.attr('data-timestamp', Date.now().toString()),
            exit => exit.remove(),
          )
          .attr('data-title', 'bg-value-line')
          .attr('data-index', index)
          .attr(
            'd', 
            arc<unknown>() 
              .innerRadius(lineInnerRadius) 
              .outerRadius(lineOuterRadius) 
              .startAngle(startAngle) 
              .endAngle(endAngle)
              .cornerRadius(cornerRadius)
          )
          .style('fill', '#ddd')
          // .attr('transform', `translate(${translateX}, ${translateY})`)
        ;

        // text
        const arr = [0, unitCount - 1];
        const linearGenerator = scaleLinear()
          .domain([0, displayLineUnitCount - 1])
          .range([0, 1])
        ;
        const quantileArr = Array.from({ length: displayLineUnitCount }).map((k, i) => Math.round(quantile(arr, linearGenerator(i)) ?? 100000));
        if (!quantileArr.includes(index)) {
          select(node)
            .selectAll(`text[data-title='value-line-data']`)  
            .remove();
          return;
        }

        const valueLineDataLinearGenerator = scaleLinear()
          .domain([0, unitCount - 1])
          .range([0, maximumValue])
        ;

        console.log('@@[0, unitCount - 1]', [0, unitCount - 1]);
        console.log('@@[0, maximumValue]', [0, maximumValue]);
        console.log(`@valueLineDataLinearGenerator(${index})`, valueLineDataLinearGenerator(index));

        const distance = outerRadius - padding - (strokeWeight + unitAndLinePeriod + lineStrokeWeight);
        const currentIndexAtValue = valueLineDataLinearGenerator(index);
        const degInfo = angleInfo.getDegInfo(startAngle, endAngle, currentIndexAtValue, distance);
        console.log('@@@@', {
          distance,
          startAngle,
          endAngle,
        });

        select(node)
          .selectAll(`text[data-title='value-line-data']`)
          .data([NaN])
          .join(
            enter => enter.append('text'),
            update => update.attr('data-timestamp', Date.now().toString()),
            exit => exit.remove(),
          )
          .attr('data-title', 'value-line-data')
          .attr('data-index', index)
          .attr('y', degInfo.y)
          .attr('x', degInfo.x)
          // .attr('transform', `translate(0, ${-(outerRadius - padding - (strokeWeight + unitAndLinePeriod + lineStrokeWeight))})`)
          .selectAll(`tspan[data-title='value-line-data-tspan']`)
          .data([NaN])
          .join(
            enter => enter.append('tspan'),
            update => update.attr('data-timestamp', Date.now().toString()),
            exit => exit.remove(),
          )
          .attr('data-title', `value-line-data-tspan`)
          .text(currentIndexAtValue.toFixed(2))
          .attr("text-anchor", "middle")
          .attr("font-family", "sans-serif")
          .attr("font-size", "10px")
          .attr("fill", "#888")
        ;
      })
    ;


    // gValueLineContainer
    //   .selectAll(`path[data-title='bg-value-line']`)
    //   .data([NaN])
    //   .join(
    //     enter => enter.append('path'),
    //     update => update.attr('data-timestamp', Date.now().toString()),
    //     exit => exit.remove(),
    //   )
    //   .attr('data-title', 'bg-value-line')
    //   .attr('data-index', function(data: number, index: number, targetElements: any) {
    //     return index;
    //   })
    //   .nodes()
    //   .forEach((node, index) => {
    //     // if (index !== 0) return;
    //     // console.log('@node', node);
    //     const fillAngle = unitAngle / 1.5;

    //     const angleInfo = getAngleInfo({ strokeWidthAngle, unitCount, unitAngle: fillAngle, minimumValue, maximumValue });

    //     const startAngle = angleInfo.startAngle + (index * fillAngle) + (index * angleInfo.emptyUnitAngle);
    //     const endAgle = startAngle + fillAngle;

    //     select(node)
    //       .attr(
    //         'd', 
    //         arc<unknown>() 
    //           .innerRadius(lineInnerRadius) 
    //           .outerRadius(lineOuterRadius) 
    //           .startAngle(startAngle) 
    //           .endAngle(endAgle)
    //           .cornerRadius(cornerRadius)
    //       )
    //       .style('fill', '#ddd')
    //       // .attr('transform', `translate(${translateX}, ${translateY})`)
    //     ;
    //   })
    // ;

    // gValueLineContainer
    //   .selectAll(`text[data-title='value-line-data']`)
    //   .data([NaN])
    //   .join(
    //     enter => enter.append('text'),
    //     update => update.attr('data-timestamp', Date.now().toString()),
    //     exit => exit.remove(),
    //   )
    //   .attr('data-title', 'value-line-data')
    //   .text(function(d, index) {
    //     console.log('@d', d);
    //     console.log('@index', index);

    //     const arr = [0, unitCount - 1];
    //     const linearGenerator = scaleLinear()
    //       .domain([0, displayLineUnitCount - 1])
    //       .range([0, 1])
    //     ;

    //     const quantileArr = Array.from({ length: displayLineUnitCount }).map((k, i) => Math.round(quantile(arr, linearGenerator(i)) ?? 100000));
    //     console.log(`@quantileArr...`, quantileArr);

    //     if (!quantileArr.includes(index)) return null;

    //     const valueLineDataLinearGenerator = scaleLinear()
    //       .domain([0, unitCount - 1])
    //       .range([0, maximumValue])
    //     ;

    //     return valueLineDataLinearGenerator(index);
    //   })
    // ;

    const gValueDisplayContainer = g
      .selectAll(`g[data-title='value-display-container']`)
      .data([NaN])
      .join(
        enter => enter.append('g'),
        update => update.attr('data-timestamp', Date.now().toString()),
        exit => exit.remove(),
      )
      .attr('data-title', 'value-display-container')
    ;

    const centerTextContainer = gValueDisplayContainer
      .selectAll(`text[data-title='center-text-container']`)
      .data([value])
      .join(
        enter => enter.append('text'),
        update => update.attr('data-timestamp', Date.now().toString()),
        exit => exit.remove(),
      )
      .attr('data-title', 'center-text-container')
      // .text(value)
      // .attr("font-family", "sans-serif")
      // .attr("font-size", "56px")
      // .attr("fill", "black")
      .attr("text-anchor", "middle")
    ;

    centerTextContainer
      .selectAll(`tspan[data-title='text-value']`)
      .data([value])
      .join(
        enter => enter.append('tspan'),
        update => update.attr('data-timestamp', Date.now().toString()),
        exit => exit.remove(),
      )
      .attr('data-title', 'text-value')
      .text(value)
      .attr("font-family", "sans-serif")
      .attr("font-size", "56px")
      .attr("fill", "#888")
    ;

    centerTextContainer
      .selectAll(`tspan[data-title='text-value-unit']`)
      .data([value])
      .join(
        enter => enter.append('tspan'),
        update => update.attr('data-timestamp', Date.now().toString()),
        exit => exit.remove(),
      )
      .attr('data-title', 'text-value-unit')
      .text(valueUnit)
      .attr("font-family", "sans-serif")
      .attr("font-size", "22px")
      .attr("fill", "#888")
      .attr('dx', 6)
    ;
      // .attr("text-anchor", "middle")


    // select(svg)
    //   .selectAll(`path[data-title='center-circle-bg']`)
    //   .data([NaN])
    //   .join(
    //     enter => enter.append('path'),
    //     update => update.attr('data-timestamp', Date.now().toString()),
    //     exit => exit.remove(),
    //   )
    //   .attr('data-title', 'center-circle-bg')
    //   .style('fill', '#ddd')
    //   .attr('transform', `translate(${translateX}, ${translateY})`)
    //   .attr(
    //     'd', 
    //     arc<unknown>() 
    //       .innerRadius(0) 
    //       .outerRadius(10) 
    //       .startAngle(0) 
    //       .endAngle(Math.PI * 2)
    //   )
    // ;

    // select(svg)
    //   .selectAll(`g[data-title='arrow-container']`)
    //   .data([NaN])
    //   .join(
    //     enter => enter.append('path'),
    //     update => update.attr('data-timestamp', Date.now().toString()),
    //     exit => exit.remove(),
    //   )
    //   .attr('data-title', 'arrow-container')
    //   .selectAll(``)
    // ;
  }, [cornerRadius, displayLineUnitCount, endFillColor, maximumValue, minimumValue, padding, startFillColor, strokeWeight, strokeWidthAngle, unitAndLinePeriod, unitAngle, unitCount, value, valueUnit]);

  useAddEventListener({
    windowEventRequiredInfo: {
      eventName: `resize`,
      eventListener(event) {
        drawChart();
      },
    },
  });

  // useEffect(() => {
  //   const svg = svgRef.current;
  //   if (svg === null) return;
  //   setWidth(svg.clientWidth);
  //   setHeight(svg.clientHeight);
  // }, []);

  useEffect(() => {
    drawChart();
  }, [drawChart]);

  return (
    <>
      <div className="w-full relative">
        <svg 
          ref={svgRef}
          className="w-full aspect-video relative"
          />
      </div>
      <div className="w-full relative">
        <ul className="w-full relative block">
          <li className="w-full relative">
            value : <input className="inline-flex border border-gray-500 px-1" type="number" value={value} onChange={e => setValue(Number(e.target.value))} />
          </li>
          <li className="w-full relative">
            minimum : <input className="inline-flex border border-gray-500 px-1" type="number" value={minimumValue} onChange={e => setMinimumValue(Number(e.target.value))} />
          </li>
          <li className="w-full relative">
            maximum : <input className="inline-flex border border-gray-500 px-1" type="number" value={maximumValue} onChange={e => setMaximumValue(Number(e.target.value))} />
          </li>
          <li className="w-full relative">
            unitCount : <input className="inline-flex border border-gray-500 px-1" type="number" value={unitCount} onChange={e => setUnitCount(Number(e.target.value))} />
          </li>
          <li className="w-full relative">
            unitAngle : <input className="inline-flex border border-gray-500 px-1" type="number" value={unitAngle} onChange={e => setUnitAngle(Number(e.target.value))} />
          </li>
          <li className="w-full relative">
            strokeWidthAngle : <input className="inline-flex border border-gray-500 px-1" type="number" value={strokeWidthAngle} onChange={e => setStrokeWidthAngle(Number(e.target.value))} />
          </li>
          <li className="w-full relative">
            strokeWeight : <input className="inline-flex border border-gray-500 px-1" type="number" value={strokeWeight} onChange={e => setStrokeWeight(Number(e.target.value))} />
          </li>
          <li className="w-full relative">
            cornerRadius : <input className="inline-flex border border-gray-500 px-1" type="number" value={cornerRadius} onChange={e => setCornerRadius(Number(e.target.value))} />
          </li>
          <li className="w-full relative">
            startFillColor : <input className="inline-flex border border-gray-500 px-1" type="text" value={startFillColor} onChange={e => setStartFillColor(e.target.value)} />
          </li>
          <li className="w-full relative">
            endFillColor : <input className="inline-flex border border-gray-500 px-1" type="text" value={endFillColor} onChange={e => setEndFillColor(e.target.value)} />
          </li>
          <li className="w-full relative">
            displayLineUnitCount : <input className="inline-flex border border-gray-500 px-1" type="number" value={displayLineUnitCount} onChange={e => setDisplayLineUnitCount(Number(e.target.value))} />
          </li>
        </ul>
      </div>
    </>
  );
}

function getAngleInfo(params: {
  strokeWidthAngle: number;
  unitCount: number;
  unitAngle: number;
  minimumValue: number;
  maximumValue: number;
}) {
  const {
    strokeWidthAngle,
    unitCount,
    unitAngle,
    minimumValue,
    maximumValue,
  } = params;

  // const strokeWidthPercent = (strokeWidthAngle * 100) / (Math.PI * 2);
  // console.log('@strokeWidthAngle', strokeWidthAngle);

  const strokeWidthPercent = getPercent(Math.PI * 2, strokeWidthAngle);
  const totalDeg = 360 * (strokeWidthPercent / 100);
  const remainDeg = 360 - totalDeg;
  const startDeg = - (totalDeg / 2);

  const totalEmptyAngleValue = strokeWidthAngle - (unitCount * unitAngle);
  const emptyUnitAngle = totalEmptyAngleValue / (unitCount - 1);

  // const startAngle = -((strokeWidthAngle) / 2);
  const startAngle = Math.PI + (((Math.PI * 2) - strokeWidthAngle) / 2);

  console.log('@startAngle', startAngle);

  function getFillAngleInfo(angle1: number, angle2: number, value: number): { startAngle: number; endAngle: number; } | undefined {
    const valueFilledAngle = startAngle + (strokeWidthAngle * (getPercent(maximumValue, value) / 100));
    console.log('@valueFilledAngle', valueFilledAngle);
    if (angle1 <= valueFilledAngle && angle2 <= valueFilledAngle) {
      return { startAngle: angle1, endAngle: angle2 };
    } else if (angle1 <= valueFilledAngle && angle2 > valueFilledAngle) {
      return { startAngle: angle1, endAngle: valueFilledAngle };
    }
    return undefined;
  }

  const endColorOpacityGenerator = scaleLinear()
    .domain([0, unitCount - 1])
    .range([0, 1])
  ;

  function getEndColorOpacity(index: number) {
    return endColorOpacityGenerator(index);
  }

  function getDegInfo(angle1: number, angle2: number, value: number, distance: number) {
    const angleArea = getAngleArea(angle1, angle2);
    console.log('@angle1, angle1', `${angle1},${angle2}`);
    console.log('@angleArea', angleArea);

    const valuePercent = getPercent(maximumValue, value);
    const deg = totalDeg * (valuePercent / 100);
    let triangleDeg = 0;
    let x = 0;
    let y = 0;

    switch(angleArea) {
      case 'left-bottom': {
        triangleDeg = (remainDeg / 2) + deg;
        const sin = Math.sin((triangleDeg * Math.PI) / 180);
        x = -(distance * sin);
        const cos = Math.cos((triangleDeg * Math.PI) / 180);
        y = (distance * cos);
      } break;
      case 'left-top': {
        triangleDeg = deg - (90 - (remainDeg / 2));
        const cos = Math.cos((triangleDeg * Math.PI) / 180);
        x = -(distance * cos);
        const sin = Math.sin((triangleDeg * Math.PI) / 180);
        y = -(distance * sin);
      } break;
      case 'right-up': {
        triangleDeg = 90 - (deg - (totalDeg / 2));
        const sin = Math.sin((triangleDeg * Math.PI) / 180);
        y = -(distance * sin);
        const cos = Math.cos((triangleDeg * Math.PI) / 180);
        x = (distance * cos);
      } break;
      case 'right-bottom': {
        triangleDeg = 360 - ((remainDeg / 2) + deg);
        const cos = Math.cos((triangleDeg * Math.PI) / 180);
        y = (distance * cos);
        const sin = Math.sin((triangleDeg * Math.PI) / 180);
        x = distance * sin;
      } break;
    }

    return {
      angleArea,
      deg,
      triangleDeg,
      x,
      y,
    };
  }

  return {
    totalEmptyAngleValue,
    emptyUnitAngle,
    startAngle,
    totalDeg,
    startDeg,
    getFillAngleInfo,
    getEndColorOpacity,
    getDegInfo,
  };
}

function getPercent(target: number, value: number) {
  return (value * 100) / target;
}

function getAngleArea(angle1: number, angle2: number) {
  let period = angle2 - angle1;
  if (period < 0) {
    period = -period;
  }

  let realAngle1 = angle1 > (Math.PI * 2) ? angle1 % (Math.PI * 2) : angle1;
  let realAngle2 = realAngle1 + period;

  const middleAngle = realAngle1 + (period / 2);
  console.log('@@@middleAngle', middleAngle);

  if (middleAngle >= 0 && middleAngle <= (Math.PI / 2)) {
    return 'right-up';
  }

  if (middleAngle >= (Math.PI / 2) && middleAngle <= Math.PI) {
    return 'right-bottom';
  }

  if (middleAngle >= Math.PI && middleAngle <= ((Math.PI * 2) * (3 / 4))) {
    return 'left-bottom';
  }

  if (middleAngle >= ((Math.PI * 2) * (3 / 4)) && middleAngle <= (Math.PI * 2)) {
    return 'left-top';
  }

  return '';
}

function getLineValueXY(angle1: number, angle2: number) {
  let x = 0;
  let y = 0;

  const angleArea = getAngleArea(angle1, angle2);
  switch(angleArea) {
    case 'left-bottom': {

    } break;
  }

  return {
    x, 
    y,
  };
}

