"use client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { ISideBar } from "./side-bar.interface";
import styles from './side-bar.module.scss';


export default function SideBar(props: ISideBar.Props) {
  const router = useRouter();

  const [menuItems, setMenuItems] = useState<ISideBar.MenuItem[]>([
    { name: 'axis-test-1', link: '/axis-test-1' },
    { name: 'first-make-chart', link: '/first-make-chart' },
    { name: 'chart2', link: '/chart2' },
    { name: 'chart3', link: '/chart3' },
    { name: 'chart4', link: '/chart4' },
  ]);

  const menuItemClick = useCallback((item: ISideBar.MenuItem) => {
    if (item.link === '') {
      return;
    }

    router.push(item.link);
  }, [router]);

  return (
    <>
      <div className={styles['side-bar']}>
        <ul className={styles['menu-list']}>
          {
            menuItems.map((item, index) => {
              return (
                <li key={index} className={styles['item']} onClick={e => menuItemClick(item)}>
                  { item.name }
                </li>
              );
            })
          }
        </ul>
      </div>
    </>
  );
}