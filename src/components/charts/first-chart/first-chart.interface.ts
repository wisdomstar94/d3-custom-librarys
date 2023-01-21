import React, { CSSProperties } from "react";

export declare namespace IFirstChart {
  export interface Data {
    name: string;
    datas: number[];
  }

  export interface Label {
    text: string;
  }

  export interface XAxis {
    labels: Label[];
  }

  export interface Options {
    data: Data[];
    xAxis: XAxis;
  }

  export interface Props {
    __options?: Options;
    __style?: CSSProperties;
    children?: React.ReactNode;
  }
}
  