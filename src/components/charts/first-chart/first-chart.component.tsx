import { IFirstChart } from "./first-chart.interface";
import styles from "./first-chart.module.scss";

export default function FirstChart(props: IFirstChart.Props) {
  return (
    <>
      <div style={props.__style} className={styles['container']}>

      </div>
    </>
  );
}