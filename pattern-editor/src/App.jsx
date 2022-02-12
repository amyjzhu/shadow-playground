import React, { useState } from "react";
import { HEIGHT, WIDTH } from "./constants";
import "./styles/App.scss";
import DrawingPanel from "./DrawingPanel";
import KnitViewer from "./KnitViewer";
import Viewer from "./Viewer";

export default function App() {
  // TODO: Make dimensions configurable
  let defaultRows = [];
  for (let row = 0; row < HEIGHT; row++) {
    let row = [];
    for (let col = 0; col < WIDTH; col++) {
      row.push("#673ab7");
    }
    defaultRows.push(row);
  }

  let [rows, setRows] = useState(defaultRows);

  function updatePixel(row, col, color) {
    let newRows = [...rows];
    newRows[row][col] = color;
    setRows(newRows);
  }

  // TODO: Might be nice to show some instructions about what this means?
  return (
    <div style={{ display: "flex" }} className="App">
      <DrawingPanel
        style={{ float: "left" }}
        rows={rows}
        updatePixel={updatePixel}
        title={"Editor"}
      />
      <KnitViewer style={{ float: "right" }} rows={rows} />
      <div id="viewer">
        <Viewer style={{ float: "right" }} rows={rows} />
      </div>
    </div>
  );
}
