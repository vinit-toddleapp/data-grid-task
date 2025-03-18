import {
  type CustomCell,
  type CustomRenderer,
  getMiddleCenterBias,
  GridCellKind,
} from "@glideapps/glide-data-grid";
import * as React from "react";

interface TextCellProps {
  readonly kind: "text-cell";
  readonly value: string;
  readonly align?: "left" | "center" | "right";
  readonly bold?: boolean;
  readonly italic?: boolean;
  readonly color?: string;
}

export type TextCell = CustomCell<TextCellProps>;

const renderer: CustomRenderer<TextCell> = {
  kind: GridCellKind.Custom,
  isMatch: (c): c is TextCell => (c.data as any).kind === "text-cell",
  draw: (args, cell) => {
    const { ctx, theme, rect } = args;
    const { value, align = "left", bold, italic, color = "red" } = cell.data;

    ctx.save();
    let fontStyle = "";
    if (bold) fontStyle += "bold";
    if (italic) fontStyle += "italic ";
    ctx.font = `${fontStyle}12px ${theme.fontFamily}`;
    ctx.fillStyle = color ?? theme.textDark;

    let x = rect.x + theme.cellHorizontalPadding;
    if (align === "center") x = rect.x + rect.width / 2;
    if (align === "right") x = rect.x + rect.width - theme.cellHorizontalPadding;

    ctx.textAlign = align;
    ctx.fillText(value, x, rect.y + rect.height / 2 + getMiddleCenterBias(ctx, ctx.font));

    ctx.restore();
    return true;
  },
  provideEditor: () => {
    return (p) => {
      const { data } = p.value;
      const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        p.onChange({
          ...p.value,
          data: {
            ...data,
            value: e.target.value,
          },
        });
      };

      return (
        <input
          type="text"
          value={data.value}
          onChange={onChange}
          style={{ width: "100%" }}
        />
      );
    };
  },
  onPaste: (v, d) => {
    return {
      ...d,
      value: v,
    };
  },
};

export default renderer;
