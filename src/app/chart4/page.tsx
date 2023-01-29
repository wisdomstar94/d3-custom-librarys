"use client";
import { Chart4 } from "@/classes/chart4/chart4.class";
import { useEffect, useRef } from "react";

const FirstMakeChartPage = () => {
  const myChart4 = useRef<Chart4>();

  useEffect(() => {
    myChart4.current = new Chart4();
    const c = myChart4.current;
    c.setOptions((prev) => ({
      ...( prev ?? {} ),
      targetSelector: '#target',
      series: [
        {
          name: 'angular',
          data: [10, 5, 40, 20, 15],
          color: '#f00',
        },
        {
          name: 'react',
          data: [3, 8, 25, 50, 36],
          color: '#00f',
        },
      ]
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