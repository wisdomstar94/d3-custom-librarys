"use client";
import FirstChart from "@/components/charts/first-chart/first-chart.component";
import { IFirstChart } from "@/components/charts/first-chart/first-chart.interface";
import { useEffect, useState } from "react";

const FirstMakeChartPage = () => {
  const [options, setOptions] = useState<IFirstChart.Options>({
    data: [

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