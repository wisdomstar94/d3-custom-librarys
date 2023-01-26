export declare namespace IChart3 {
  export interface Series {
    name: string;
    data: number[];
  }

  export interface Options {
    targetSelector?: string;
    series?: Series[];
    innerRadius?: number;
    outerRadius?: number;
    pieMargin?: number;
    pieWeight?: number;
  }
}