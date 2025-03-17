import { useState, useCallback, useEffect, useMemo } from "react";
import {
  DataEditor,
  GridSelection,
  CompactSelection,
  GridColumn,
  GridCell,
  EditableGridCell,
  GridCellKind,
  Item,
  DrawHeaderCallback,
  DrawCellCallback,
} from "@glideapps/glide-data-grid";
import "@glideapps/glide-data-grid/dist/index.css";
import { dataGenerator } from "./utils/data-generator";

export interface DataItem {
  name: string;
  company: string;
  email: string;
  phone: string;
}

const data = dataGenerator(["name", "email", "phone", "company"], 2000);

const columns: GridColumn[] = [
  { title: "Name", id: "name", icon: "nameIcon" },
  { title: "Email", id: "email", icon: "emailIcon" },
  { title: "Phone", id: "phone", icon: "phoneIcon" },
  { title: "Company", id: "company", icon: "companyIcon" },
];

function App() {
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selection, setSelection] = useState<GridSelection>({
    columns: CompactSelection.empty(),
    rows: CompactSelection.empty(),
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.code === "KeyF") {
        setShowSearch((prev) => !prev);
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // listens for key+f for search

  const getCellContent = useCallback((cell: Item): GridCell => {
    const [col, row] = cell;
    const dataRow = data[row];
    const keys: (keyof DataItem)[] = ["name", "company", "email", "phone"];
    const value = dataRow ? dataRow[keys[col]] : "";

    return {
      kind: GridCellKind.Text,
      allowOverlay: true,
      readonly: false,
      displayData: value,
      data: value,
    };
  }, []);

  const onCellEdited = useCallback((cell: Item, newValue: EditableGridCell) => {
    if (newValue.kind !== GridCellKind.Text) {
      return;
    }
    const indexes: (keyof DataItem)[] = ["name", "company", "email", "phone"];
    const [col, row] = cell;
    const key = indexes[col];
    data[row][key] = newValue.data;
  }, []);

  const drawHeader: DrawHeaderCallback = useCallback((args, draw) => {
    const { ctx, rect, isHovered } = args;
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    const lg = ctx.createLinearGradient(0, rect.y, 0, rect.y + rect.height);
    // lg.addColorStop(0, "#ff00d934");
    lg.addColorStop(1, "#00a2ff34");
    ctx.fillStyle = lg;
    if (isHovered) ctx.fill();
    draw(); // draw at end to draw under the header
  }, []);

  const drawCell: DrawCellCallback = useCallback((args, draw) => {
    draw();
    const { ctx, rect, highlighted } = args;
    const size = 12;
    ctx.beginPath();
    ctx.moveTo(rect.x + rect.width - size, rect.y + 1);
    ctx.lineTo(rect.x + rect.width, rect.y + size + 1);
    ctx.lineTo(rect.x + rect.width, rect.y + 1);
    ctx.closePath();
    ctx.save();
    ctx.fillStyle = "#ff0000";
    if (highlighted) ctx.fill();
    ctx.restore();
  }, []);

  const headerIcons = useMemo(() => {
    return {
      nameIcon: (p) =>
        `<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="8" fill="${p.bgColor}" />
        <text x="10" y="14" text-anchor="middle" fill="${p.fgColor}" font-size="12" font-weight="bold">N</text>
      </svg>`,
      emailIcon: (p) =>
        `<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="5" width="14" height="10" fill="${p.bgColor}" />
        <path d="M3 5l7 5l7-5" stroke="${p.fgColor}" stroke-width="2"/>
      </svg>`,
      phoneIcon: (p) =>
        `<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="3" width="10" height="14" fill="${p.bgColor}" />
        <circle cx="10" cy="15" r="1" fill="${p.fgColor}" />
      </svg>`,
      companyIcon: (p) =>
        `<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="6" width="12" height="8" fill="${p.bgColor}" />
        <rect x="6" y="2" width="8" height="4" fill="${p.fgColor}" />
      </svg>`,
    };
  }, []);

  return (
    <>
      <h1>Glide Data Grid</h1>
      <div
        style={{
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <DataEditor
          getCellContent={getCellContent}
          onCellEdited={onCellEdited}
          gridSelection={selection}
          onGridSelectionChange={setSelection}
          columns={columns}
          rows={2000}
          width={600}
          height={500}
          smoothScrollX={true}
          smoothScrollY={true}
          fixedShadowY={true}
          fixedShadowX={false}
          searchResults={[]}
          getCellsForSelection={true}
          onSearchValueChange={setSearchValue}
          searchValue={searchValue}
          showSearch={showSearch}
          rowMarkers={"number"}
          onSearchClose={() => {
            setShowSearch(false);
            setSearchValue("");
          }}
          freezeColumns={2}
          freezeTrailingRows={2}
          drawHeader={drawHeader}
          drawCell={drawCell}
          headerIcons={headerIcons}
        />
      </div>
    </>
  );
}

export default App;
