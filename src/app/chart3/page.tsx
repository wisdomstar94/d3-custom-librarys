"use client";
import { Chart3 } from "@/classes/chart3/chart3.class";
import { useEffect } from "react";

const FirstMakeChartPage = () => {
  useEffect(() => {
    const myChart3 = new Chart3();
    myChart3.setOptions((prev) => ({
      ...(prev ?? {}),
      targetSelector: '#target',
      pieWeight: 30,
      series: [
        {
          name: 'angular',
          data: [30],
          color: '#f00',
        },
        {
          name: 'react',
          data: [90],
          color: '#00f',
        },
        {
          name: 'vue',
          data: [40],
          color: '#0f0',
        },
      ],
      boundaryMargin: 0.03,
    }));
    myChart3.draw();
  }, []);

  return (
    <>
      <h2>
        chart3...
      </h2>
      <div>
        <div id="target" style={{ width: '600px', position: 'relative', border: '1px solid #ccc' }}>

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