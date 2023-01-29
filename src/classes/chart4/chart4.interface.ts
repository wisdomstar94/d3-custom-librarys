export declare namespace IChart4 {
  export interface Series {
    name: string;
    data: number[];
    color?: string;
  }

  export interface Label {
    // text: string;
    date?: Date;
    // color?: string;
    fontSize?: string;
  }

  export interface Xaxis {
    labels: Label[];
  }

  export interface Yaxis {
    unit?: string;
    width?: number;
    height?: number;
    paddingTop?: number;
    paddingBottom?: number;
  }

  export interface Options {
    leftAreaWidth?: string;
    rightAreaWidth?: string;
    targetSelector?: string;
    series?: Series[];
    xAxis?: Xaxis;
    yAxis?: Yaxis;
  }
}