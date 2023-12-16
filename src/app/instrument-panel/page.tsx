"use client"

import { useAddEventListener } from "@wisdomstar94/react-add-event-listener";
import { arc, interpolate, scaleLinear, select } from "d3";
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
  const [cornerRadius, setCornerRadius] = useState(14);
  const [startFillColor, setStartFillColor] = useState('#87e9ff');
  const [endFillColor, setEndFillColor] = useState('#e5880d');

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

    g
      .selectAll(`path[data-title='bg-value-line']`)
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
        // if (index !== 0) return;
        // console.log('@node', node);
        const fillAngle = unitAngle / 1.5;

        const angleInfo = getAngleInfo({ strokeWidthAngle, unitCount, unitAngle: fillAngle, minimumValue, maximumValue });

        const startAngle = angleInfo.startAngle + (index * fillAngle) + (index * angleInfo.emptyUnitAngle);
        const endAgle = startAngle + fillAngle;

        const lineOuterRadius = outerRadius - (strokeWeight + 10);
        const lineInnerRadius = lineOuterRadius - 5;

        select(node)
          .attr(
            'd', 
            arc<unknown>() 
              .innerRadius(lineInnerRadius) 
              .outerRadius(lineOuterRadius) 
              .startAngle(startAngle) 
              .endAngle(endAgle)
              .cornerRadius(cornerRadius)
          )
          .style('fill', '#ddd')
          // .attr('transform', `translate(${translateX}, ${translateY})`)
        ;
      })
    ;

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
  }, [cornerRadius, endFillColor, maximumValue, minimumValue, padding, startFillColor, strokeWeight, strokeWidthAngle, unitAngle, unitCount, value]);

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
            cornerRadius : <input className="inline-flex border border-gray-500 px-1" type="number" value={cornerRadius} onChange={e => setCornerRadius(Number(e.target.value))} />
          </li>
          <li className="w-full relative">
            startFillColor : <input className="inline-flex border border-gray-500 px-1" type="text" value={startFillColor} onChange={e => setStartFillColor(e.target.value)} />
          </li>
          <li className="w-full relative">
            endFillColor : <input className="inline-flex border border-gray-500 px-1" type="text" value={endFillColor} onChange={e => setEndFillColor(e.target.value)} />
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
  const startDeg = - (totalDeg / 2);

  const totalEmptyAngleValue = strokeWidthAngle - (unitCount * unitAngle);
  const emptyUnitAngle = totalEmptyAngleValue / (unitCount - 1);

  const startAngle = -((strokeWidthAngle) / 2);

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

  return {
    totalEmptyAngleValue,
    emptyUnitAngle,
    startAngle,
    totalDeg,
    startDeg,
    getFillAngleInfo,
    getEndColorOpacity,
  };
}

function getPercent(target: number, value: number) {
  return (value * 100) / target;
}