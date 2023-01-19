"use client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { ISideBar } from "./side-bar.interface";
import styles from './side-bar.module.scss';


export default function SideBar(props: ISideBar.Props) {
  const router = useRouter();

  const [menuItems, setMenuItems] = useState<ISideBar.MenuItem[]>([
    { name: '첫번째로 만들어보는 차트', link: '/first-make-chart' },
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