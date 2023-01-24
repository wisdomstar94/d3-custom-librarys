"use client";
import { Chart2 } from "@/classes/chart2/chart2.class";
import { IChart2 } from "@/classes/chart2/chart2.interface";
import { useEffect, useState } from "react";

const FirstMakeChartPage = () => {
  useEffect(() => {
    const myChart2 = new Chart2();
    myChart2
      .setTargetElementId('#target')
      .setXAxis({
        labels: [
          { text: '2022-10' },
          { text: '2022-11' },
          { text: '2022-12' },
          { text: '2023-01' },
          { text: '2023-02' },
          { text: '2023-03' },
          { text: '2023-04' },
          { text: '2023-05' },
          { text: '2023-06' },
          { text: '2023-07' },
          { text: '2023-08' },
          { text: '2023-09' },
        ],
      })
      .setData([
        {
          name: 'angular',
          color: '#f00',
          datas: [
            10, 
            70, 
            30, 
            100, 
            50, 
            20, 
            40, 
            150, 
            10, 
            70, 
            40, 
            60,
          ],
        },
        {
          name: 'react',
          color: '#00f',
          datas: [
            30, 
            20, 
            90, 
            180, 
            80, 
            70, 
            30, 
            148, 
            50, 
            60, 
            10, 
            136,
          ],
        },
      ])
    ;
    myChart2.draw();
  }, []);

  return (
    <>
      <h2>
        chart2...
      </h2>
      <article>
        <div id="target" style={{ width: '600px', height: '400px', position: 'relative', border: '1px solid #ccc' }}>

        </div>
      </article>
    </>
  );
}

export default FirstMakeChartPage;