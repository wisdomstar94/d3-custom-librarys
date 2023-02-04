export declare namespace IChart4 {
  export interface Series {
    name: string;
    data: number[];
    color?: string;
  }

  export type DateDistance = 
    '1H' |
    '1D' |
    '1W' |
    '1M' |
    '1Y' |
    'ALL' |
    ''
  ;

  export interface DateDistanceButtonItem {
    name: string;
    dateDistance: DateDistance;
  }

  export interface Label {
    text: string;
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
    fontColor?: string;
  }

  export interface Point {
    x: number;
    y: number;
  }

  export interface Options {
    // leftAreaWidth?: string;
    // rightAreaWidth?: string;
    targetSelector?: string;
    series?: Series[];
    xAxis?: Xaxis;
    yAxis?: Yaxis;
    dateDistance?: DateDistance;
    onDateDistanceButtonClick?: (dateDistance: DateDistance) => void;
  }
}