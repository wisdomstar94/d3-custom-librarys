import { useCallback, useEffect, useRef, useState } from "react";
import { IFirstChart } from "./first-chart.interface";
import styles from "./first-chart.module.scss";

export default function FirstChart(props: IFirstChart.Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  const [options, setOptions] = useState(props.__options);
  useEffect(() => { setOptions(props.__options) }, [props.__options]);

  useEffect(() => {
    while (svgRef.current?.hasChildNodes() === true) {
      if (svgRef.current?.firstChild !== null) {
        svgRef.current?.removeChild(svgRef.current?.firstChild);
      }
    }

    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drawXaxis = useCallback(() => {
    // select
  }, []);

  const draw = useCallback(() => {

    drawXaxis();
  }, [drawXaxis]);

  return (
    <>
      <div style={props.__style} className={styles['container']}>
        <svg ref={svgRef}>

        </svg>
      </div>
    </>
  );
}