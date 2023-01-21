"use client";
import FirstChart from "@/components/charts/first-chart/first-chart.component";
import { IFirstChart } from "@/components/charts/first-chart/first-chart.interface";
import { useEffect, useState } from "react";

const FirstMakeChartPage = () => {
  const [options, setOptions] = useState<IFirstChart.Options>({
    data: [
      {
        name: 'Angular 다운로드 수',
        color: '#f00',
        datas: [10, 210, 40, 20, 70, 40, 100, 50, 120, 70],
      },
      {
        name: 'react 다운로드 수',
        color: '#00f',
        datas: [90, 70, 75, 150, 101, 120, 110, 130, 135, 199],
      },
    ],
    xAxis: {
      labels: [
        {
          text: '2022-10',
        },
        {
          text: '2022-11',
        },
        {
          text: '2022-12',
        },
        {
          text: '2023-01',
        },
        {
          text: '2023-02',
        },
        {
          text: '2023-03',
        },
        {
          text: '2023-04',
        },
        {
          text: '2023-05',
        },
        {
          text: '2023-06',
        },
        {
          text: '2023-07',
        },
      ],
    },
  });

  useEffect(() => {

  }, []);

  return (
    <>
      <FirstChart
        __options={options}
        __style={{
          width: '600px',
          height: '400px',
        }} 
        />
    </>
  );
}

export default FirstMakeChartPage;