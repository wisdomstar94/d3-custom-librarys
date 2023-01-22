export declare namespace IChart2 {
  export interface Data {
    name: string;
    color?: string;
    datas: number[];
  }

  export interface Label {
    text: string;
    color?: string;
    fontSize?: string;
  }

  export interface XAxis {
    labels: Label[];
  }

  export interface YAxis {
    color?: string;
    fontSize?: string;
  }

  export interface ConstructorParams {
    targetElementId: string;
    topAreaHeight?: number;
    dataLabelAreaHeight?: number;
    yLabelAreaWidth?: number;
    xLabelAreaHeight?: number;
    data?: Data[];
    xAxis?: XAxis;
    yAxis?: YAxis;
  }
}