import { IContentArea } from "./content-area.interface";
import styles from './content-area.module.scss';

export default function ContentArea(props: IContentArea.Props) {
  return (
    <>
      <main className={styles['main']}>
        { props.children }
      </main>
    </>
  );
}