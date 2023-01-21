import { select } from "d3";
import { useCallback, useEffect, useRef, useState } from "react";
import { IFirstChart } from "./first-chart.interface";
import styles from "./first-chart.module.scss";

export default function FirstChart(props: IFirstChart.Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  const [options, setOptions] = useState(props.__options);
  useEffect(() => { setOptions(props.__options) }, [props.__options]);

  useEffect(() => {
    console.log('FirstChart.useEffect');

    while (svgRef.current?.hasChildNodes() === true) {
      if (svgRef.current?.firstChild !== null) {
        svgRef.current?.removeChild(svgRef.current?.firstChild);
      }
    }

    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getContainerWidth = useCallback(() => {
    if (svgRef.current === null) {
      return 0;
    }

    return svgRef.current.clientWidth;
  }, []);

  const getContainerHeight = useCallback(() => {
    if (svgRef.current === null) {
      return 0;
    }

    return svgRef.current.clientHeight;
  }, []);

  const drawXaxis = useCallback(() => {
    select(svgRef.current)
    .append('g')
    .selectAll()
    .data(options?.xAxis.labels ?? [])
    .enter()
    .append('text')
    .text(d => d.text)
    .attr("x", (d, i) => {
      return (i * 60) + 60;
    })
    .attr("y", (d, i) => {
      return getContainerHeight() - 30;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    ;
  }, [getContainerHeight, options?.xAxis.labels]);

  const draw = useCallback(() => {

    drawXaxis();
  }, [drawXaxis]);

  return (
    <>
      <div style={props.__style} className={styles['container']}>
        <svg ref={svgRef} className={styles['svg']}>

        </svg>
      </div>
    </>
  );
}