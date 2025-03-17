import { useState, useCallback, useEffect } from "react";
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
  { title: "Name", id: "name" },
  { title: "Company", id: "company" },
  { title: "Email", id: "email" },
  { title: "Phone", id: "phone" },
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
          // headerIcons:
        />
      </div>
    </>
  );
}

export default App;
