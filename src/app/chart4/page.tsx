"use client";
import { Chart4 } from "@/classes/chart4/chart4.class";
import { IChart4 } from "@/classes/chart4/chart4.interface";
import { randomInt, timeFormat } from "d3";
import { useCallback, useEffect, useRef } from "react";

const randomFn = randomInt(100);

const FirstMakeChartPage = () => {
  const myChart4 = useRef<Chart4>();

  const getSeriesAndLabels = useCallback((dateDistance: IChart4.DateDistance) => {
    let length = 700;
    switch (dateDistance) {
      case '1D': length = 300; break;
      case '1W': length = 100; break;
      case '1M': length = 50; break;
      case '1Y': length = 10; break;
    }

    return {
      series: [
        {
          name: 'angular',
          data: Array.from({ length }).map((item, index) => {
            return randomFn();
          }),
          color: '#f00',
        },
        {
          name: 'react',
          data: Array.from({ length }).map((item, index) => {
            return randomFn();
          }),
          color: '#00f',
        },
      ],
      xAxisLabels: Array.from({ length }).map((item, index) => {
        const date = new Date();
        // date.setHours(date.getHours() + (index));
        let format = timeFormat('%y-%m-%d %H:%M');
        switch (dateDistance) {
          case '1D': 
            date.setDate(date.getDate() + (index)); 
            format = timeFormat('%y-%m-%d');
            break;
          case '1W': 
            date.setDate(date.getDate() + (index * 7)); 
            format = timeFormat('%y-%m-%d');
            break;
          case '1M': 
            date.setMonth(date.getMonth() + (index)); 
            format = timeFormat('%y-%m');
            break;
          case '1Y': 
            date.setFullYear(date.getFullYear() + (index)); 
            format = timeFormat('%Y');
            break;
        }
        return {
          date,
          text: format(date),
        };
      }),
    };
  }, []);

  useEffect(() => {
    myChart4.current = new Chart4();
    const c = myChart4.current;
    const sampleData = getSeriesAndLabels('1H');
    
    c.setOptions((prev) => ({
      ...( prev ?? {} ),
      targetSelector: '#target',
      series: sampleData.series,
      dateDistance: '1D',
      yAxis: {
        fontColor: '#888',
        // width: 20,
      },
      xAxis: {
        labels: sampleData.xAxisLabels,
      },
      onDateDistanceButtonClick(dateDistance) {
        console.log('@onDateDistanceButtonClick.dateDistance', dateDistance);
        const sampleData2 = getSeriesAndLabels(dateDistance);
        c.setOptions((prev2) => ({
          ...( prev2 ?? {}),
          series: sampleData2.series,
          xAxis: {
            ...( prev2?.xAxis ?? {}),
            labels: sampleData2.xAxisLabels,
          },
        }));
        c.draw();
      },
    }));
    c.draw();
    return () => {
      c.clear();
    };
  }, [getSeriesAndLabels]);

  return (
    <>
      <h2>
        chart4...
      </h2>
      <div>
        <div id="target" style={{ width: '80%', position: 'relative', border: '1px solid #ccc' }}>

        </div>
      </div>
      <p>
        <a href="https://dribbble.com/shots/5457182-Samsa-Dashboard-Overview/attachments" target="_blank" rel="noreferrer">
          https://dribbble.com/shots/5457182-Samsa-Dashboard-Overview/attachments
        </a> 
        <br />
        <span>
          위 디자인의 차트를 한번 만들어보겠습니다.
        </span>
      </p>
    </>
  );
}

export default FirstMakeChartPage;