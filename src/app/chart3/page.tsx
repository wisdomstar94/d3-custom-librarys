"use client";
import { Chart3 } from "@/classes/chart3/chart3.class";
import { useEffect } from "react";

const FirstMakeChartPage = () => {
  useEffect(() => {
    const myChart3 = new Chart3();
    myChart3.setOptions((prev) => {
      const newObj = prev !== undefined ? { ...prev } : {};
      newObj.targetSelector = '#target';
      return newObj;
    });
    myChart3.draw();
  }, []);

  return (
    <>
      <h2>
        chart3...
      </h2>
      <article>
        <div id="target" style={{ width: '600px', position: 'relative', border: '1px solid #ccc' }}>

        </div>
      </article>
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