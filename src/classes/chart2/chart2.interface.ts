export declare namespace IChart2 {
  export type CallbackClip = (clipData: ClipData[], index: number) => string;

  export interface ClipData {
    name: string;
    color?: string;
    data?: number;
  }

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
    unit?: string;
    labels: Label[];
  }

  export interface YAxis {
    color?: string;
    fontSize?: string;
    unit?: string;
  }

  export interface ConstructorParams {
    targetElementId: string;
    topAreaHeight?: number;
    dataLabelAreaHeight?: number;
    yLabelAreaWidth?: number;
    xLabelAreaHeight?: number;
    dataOneColumnWidth?: number;
    dataJointAreaWidth?: number;
    topBottomMarginHeight?: number;
    chartLeftMarginWidth?: number;
    initTransitionDuration?: number;
    clipFontSize?: string;
    data?: Data[];
    xAxis?: XAxis;
    yAxis?: YAxis;
    callbackClip?: CallbackClip;
  }
}