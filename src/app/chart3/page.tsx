"use client";
import { Chart3 } from "@/classes/chart3/chart3.class";
import { useEffect, useRef } from "react";

const FirstMakeChartPage = () => {
  const myChart3 = useRef<Chart3>();

  useEffect(() => {
    myChart3.current = new Chart3();
    const c = myChart3.current;
    c.setOptions((prev) => ({
      ...(prev ?? {}),
      targetSelector: '#target',
      pieWeight: 50,
      leftAreaWidth: '60%',
      rightAreaWidth: '40%',
      series: [
        {
          name: 'Bitcoin',
          data: [12874],
          color: '#2358E1',
        },
        {
          name: 'Ethereum',
          data: [7267],
          color: '#6C97EC',
        },
        {
          name: 'Monero',
          data: [2189],
          color: '#9BB8F3',
        },
        {
          name: 'Litecoin',
          data: [1346],
          color: '#CBDCF9',
        },
      ],
      boundaryMargin: 0.03,
    }));
    c.draw();

    return () => {
      c.clear();
    };
  }, []);

  return (
    <>
      <h2>
        chart3...
      </h2>
      <div>
        <div id="target" style={{ width: '50%', position: 'relative', border: '1px solid #ccc' }}>

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