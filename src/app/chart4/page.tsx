"use client";
import { Chart4 } from "@/classes/chart4/chart4.class";
import { randomInt, timeFormat } from "d3";
import { useEffect, useRef } from "react";

const FirstMakeChartPage = () => {
  const myChart4 = useRef<Chart4>();

  useEffect(() => {
    myChart4.current = new Chart4();
    const c = myChart4.current;

    const randomFn = randomInt(100);
    c.setOptions((prev) => ({
      ...( prev ?? {} ),
      targetSelector: '#target',
      series: [
        {
          name: 'angular',
          data: Array.from({ length: 700 }).map((item, index) => {
            return randomFn();
          }),
          color: '#f00',
        },
        {
          name: 'react',
          data: Array.from({ length: 700 }).map((item, index) => {
            return randomFn();
          }),
          color: '#00f',
        },
      ],
      xAxis: {
        labels: Array.from({ length: 700 }).map((item, index) => {
          const date = new Date();
          date.setHours(date.getHours() + (index));
          return {
            date,
          };
        }),
      },
      onDateDistanceButtonClick(dateDistance) {
        console.log('@onDateDistanceButtonClick.dateDistance', dateDistance);
      },
    }));
    c.draw();
    return () => {
      c.clear();
    };
  }, []);

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