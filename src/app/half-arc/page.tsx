"use client"

import { DefaultArcObject, ValueFn, arc, path, select, PieArcDatum } from "d3";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [percent, setPercent] = useState(42.55);

  useEffect(() => {
    const svg = svgRef.current;
    if (svg === null) return;
    
    console.log(`@drawArc`);

    // const _arc: ValueFn<any, number, string | null> = arc() 
    const _bgArc = arc<number>() 
      .innerRadius(30) 
      .outerRadius(45) 
      .startAngle(-(Math.PI / 2)) 
      .endAngle(Math.PI / 2)
      // .cornerRadius(10)
    ;
    
    const fullAbsoluteValue = Math.PI;
    const fillValue = fullAbsoluteValue * (percent / 100);

    const _fillArc = arc<number>() 
      .innerRadius(30) 
      .outerRadius(45) 
      .startAngle(-(Math.PI / 2)) 
      .endAngle((-(Math.PI / 2)) + fillValue)
      // .cornerRadius(10)
    ;
    
    select(svg)
      .selectAll(`path[data-title='bg']`)
      .data([NaN])
      .join(
        enter => enter.append('path'),
        update => update.attr('data-timestamp', Date.now().toString()),
        exit => exit.remove(),
      )
      // .attr('d', function(data: number, index: number, targetElements: Array<HTMLElement>) {
      //   return _arc;
      // })
      .attr('data-title', 'bg')
      .attr('d', _bgArc)
      .style("fill", "#ccc")
      .attr('transform', 'translate(50, 50)')
    ;

    select(svg)
      .selectAll(`path[data-title='fill']`)
      .data([NaN])
      .join(
        enter => enter.append('path'),
        update => update.attr('data-timestamp', Date.now().toString()),
        exit => exit.remove(),
      )
      // .attr('d', function(data: number, index: number, targetElements: Array<HTMLElement>) {
      //   return _arc;
      // })
      .attr('data-title', 'fill')
      .attr('d', _fillArc)
      .style("fill", "red")
      .attr('transform', 'translate(50, 50)')
    ;
  }, [percent]);

  if (percent > 100) {
    setPercent(100);
  }

  return (
    <>
      <div className="w-full relative">
        <svg 
          ref={svgRef}
          className="w-full aspect-video relative"
          />
      </div>
      <div className="w-full relative">
        <input type="number" value={percent} onChange={e => setPercent(Number(e.target.value))} />
        {/* <button
          className="inline-flex px-2 py-0.5 text-xs text-black border border-black rounded-sm cursor-pointer hover:bg-gray-100"
          onClick={() => {

          }}>
          percent 바꾸기
        </button> */}
      </div>
    </>
  );
}