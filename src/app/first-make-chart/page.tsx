"use client";
import FirstChart from "@/components/charts/first-chart/first-chart.component";
import { IFirstChart } from "@/components/charts/first-chart/first-chart.interface";
import { useState } from "react";

export default function FirstMakeChartPage() {
  const [options, setOptions] = useState<IFirstChart.Options>();

  return (
    <>
      <FirstChart
        __options={options}
        __style={{
          width: '600px',
          height: '400px',
        }} />
    </>
  );
}