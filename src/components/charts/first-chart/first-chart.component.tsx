import { line, max, merge, min, range, scaleLinear, select, union, zoom, zoomIdentity, zoomTransform } from "d3";
import { useCallback, useEffect, useRef, useState } from "react";
import { IFirstChart } from "./first-chart.interface";
import styles from "./first-chart.module.scss";

export default function FirstChart(props: IFirstChart.Props) {
  const gRef = useRef<SVGGElement>(null);

  const [options, setOptions] = useState(props.__options);
  useEffect(() => { setOptions(props.__options) }, [props.__options]);

  useEffect(() => {
    console.log('FirstChart.useEffect');

    while (gRef.current?.hasChildNodes() === true) {
      if (gRef.current?.firstChild !== null) {
        gRef.current?.removeChild(gRef.current?.firstChild);
      }
    }

    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getContainerWidth = useCallback(() => {
    if (gRef.current === null || gRef.current.parentElement === null) {
      return 0;
    }

    return gRef.current.parentElement.clientWidth;
  }, []);

  const getContainerHeight = useCallback(() => {
    if (gRef.current === null || gRef.current.parentElement === null) {
      return 0;
    }

    return gRef.current.parentElement.clientHeight;
  }, []);

  const getYRangeAndLinear = useCallback(() => {
    const allNumberDatas = merge<number>(options?.data.map(x => x.datas) ?? []);
    const minNumber = min(allNumberDatas) ?? 0;
    const maxNumber = max(allNumberDatas) ?? 0;

    const size = maxNumber - minNumber;

    const yRange = range(minNumber, maxNumber, Math.ceil(size / 4)).concat(maxNumber);
    const yLinear = scaleLinear().domain([minNumber, maxNumber]).range([getContainerHeight() - 120, 20]);

    return {
      yRange,
      yLinear,
    };
  }, [getContainerHeight, options?.data]);

  const getPointDrawMaterials = useCallback(() => {
    const allNumberDatas = Array.from(union(merge<number>(options?.data.map(x => x.datas) ?? [])));
    // const pointYConverter = scaleLinear().domain([0, max(allNumberDatas) ?? 0]).range([getContainerHeight() - 60, 20]);

    return {
      allNumberDatas,
      yRangeAndLinear: getYRangeAndLinear().yLinear,
    };
  }, [getYRangeAndLinear, options?.data]);

  const drawBackgroundBorder = useCallback(() => {
    const yrl = getYRangeAndLinear();

    select(gRef.current)
    .append('g')
    .selectAll()
    .data(yrl.yRange)
    .enter()
    .append('rect')
    .attr("x", (d, i) => {
      return 40;
    })
    .attr("y", (d, i) => {
      return yrl.yLinear(d);
    })
    .attr("width", getContainerWidth() - 40)
    .attr("height", "1")
    .attr("fill", "#aaa")
    ;
  }, [getContainerWidth, getYRangeAndLinear]);

  const drawYaxis = useCallback(() => {
    const yrl = getYRangeAndLinear();

    select(gRef.current)
    .append('g')
    .selectAll()
    .data(yrl.yRange)
    .enter()
    .append('text')
    .text(d => d.toString())
    .attr("x", (d, i) => {
      return 20;
    })
    .attr("y", (d, i) => {
      return yrl.yLinear(d) + 3;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    ;
  }, [getYRangeAndLinear]);

  const drawXaxis = useCallback(() => {
    select(gRef.current)
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
      return getContainerHeight() - 90;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    ;
  }, [getContainerHeight, options?.xAxis.labels]);

  const drawDataPoint = useCallback(() => {
    options?.data.forEach((item, index) => {
      select(gRef.current)
      .append('g')
      .selectAll()
      .data(item.datas)
      .enter()
      .append('circle')
      .attr('r', 3)
      .attr('cx', (d, i) => {
        return (i * 60) + 78;
      })
      .attr('cy', (d, i) => {
        return getPointDrawMaterials().yRangeAndLinear(d);
      })
      .attr('fill', item.color)
      ;
    });
  }, [getPointDrawMaterials, options?.data]);

  const drawDataLine = useCallback(() => {
    options?.data.forEach((item, index) => {
      const lineGenerator = line();
      const points: [number, number][] = item.datas.map((x, i) => {
        return [(i * 60) + 78, getPointDrawMaterials().yRangeAndLinear(x)];
      });
      console.log('@@points', points);
      const pathOfLine = lineGenerator(points);
      select(gRef.current)
      .append('path')
      .attr('d', pathOfLine)
      .attr('stroke-width', 1)
      .attr("fill", 'none')
      .attr("stroke", item.color)
      ;
    });
  }, [getPointDrawMaterials, options?.data]);

  const draw = useCallback(() => {
    if (gRef.current === null) {
      return;
    }

    // const _zoom = zoom<any, any>().on("zoom", function zoom_actions(){
    //   this.setAttribute("transform", zoomTransform(this).toString());
    // });
    // const g = select(gRef.current);
    // g
    // .call(_zoom)
    // .call(_zoom.transform, zoomIdentity)
    // ;

    drawBackgroundBorder();
    drawYaxis();
    drawXaxis();
    drawDataPoint();
    drawDataLine();
  }, [drawBackgroundBorder, drawDataLine, drawDataPoint, drawXaxis, drawYaxis]);

  return (
    <>
      <div style={props.__style} className={styles['container']}>
        <svg className={styles['svg']}>
          <g ref={gRef}>

          </g>
        </svg>
      </div>
    </>
  );
}