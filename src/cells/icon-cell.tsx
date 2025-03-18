import {
  type CustomCell,
  measureTextCached,
  type CustomRenderer,
  getMiddleCenterBias,
  GridCellKind,
} from "@glideapps/glide-data-grid";
import * as React from "react";
// import { roundedRect } from "../draw-fns.js";

interface IconCellProps {
  readonly kind: "icon-cell";
  readonly value: number;
  readonly min: number;
  readonly max: number;
  readonly step: number;
  readonly label?: string;
  readonly measureLabel?: string;
  readonly readonly?: boolean;
}

export type IconCell = CustomCell<IconCellProps>;

export const iconCellRenderer: CustomRenderer<IconCell> = {
  kind: GridCellKind.Custom,
  isMatch: (cell): cell is IconCell => {
    return (cell?.data as any).cellType === "icon-cell";
  },
  draw: (args) => drawIconCell(args),
  needsHover: () => true,
};

const drawIconCell = (args) => {};
