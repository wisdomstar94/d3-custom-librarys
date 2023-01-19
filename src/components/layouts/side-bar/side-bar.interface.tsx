import React from "react";

export declare namespace ISideBar {
  export interface MenuItem {
    name: string;
    link: string;
    isActive?: boolean;
  }

  export interface Props {
    children?: React.ReactNode;
  }
}