import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { CompactPicker } from "react-color";

import { HEIGHT, WIDTH } from "./constants";
import "./styles/App.scss";
import DrawingPanel from "./DrawingPanel";
import Viewer from "./Viewer";

export default function App() {
  let defaultRows = [];
  for (let row = 0; row < HEIGHT; row++) {
    let newRow = [];
    for (let col = 0; col < WIDTH; col++) {
      newRow.push("#fff");
    }
    defaultRows.push(newRow);
  }

  let [selectedColor, setSelectedColor] = useState("#653294");
  let [rows, setRows] = useState(defaultRows);
  let [width, setWidth] = useState(WIDTH);
  let [height, setHeight] = useState(HEIGHT);

  function resize(newWidth, newHeight) {
    let oldRows = rows;
    let newRows = [];
    for (let row = 0; row < newHeight; row++) {
      let newRow = [];
      for (let col = 0; col < newWidth; col++) {
        if (oldRows[row] && oldRows[row][col]) {
          newRow.push(oldRows[row][col]);
        } else {
          newRow.push("#fff");
        }
      }
      newRows.push(newRow);
    }
    setRows(newRows);
  }

  function updatePixel(row, col) {
    let newRows = [...rows];
    newRows[row][col] = selectedColor;
    setRows(newRows);
  }

  function handleChangeHeight(e) {
    const newHeight = parseInt(e.target.value);
    if (!newHeight) {
      return;
    }
    setHeight(newHeight);
    resize(width, newHeight);
  }

  function handleChangeWidth(e) {
    const newWidth = parseInt(e.target.value);
    if (!newWidth) {
      return;
    }
    setWidth(newWidth);
    resize(newWidth, height);
  }

  // TODO: Might be nice to show some instructions about what this means?
  return (
    <div>
      <h1>Pattern Editor/Visualizer</h1>
      <div style={{ marginTop: 20 }}>
        <TextField
          style={styles.textField}
          id="height"
          label="Rows"
          variant="outlined"
          defaultValue={HEIGHT}
          onBlur={handleChangeHeight}
        />
        <TextField
          style={styles.textField}
          id="width"
          label="Stitches per Row"
          variant="outlined"
          defaultValue={WIDTH}
          onBlur={handleChangeWidth}
        />
      </div>
      <CompactPicker
        color={selectedColor}
        onChangeComplete={(color) => setSelectedColor(color.hex)}
      />
      <div style={{ display: "flex" }} className="App">
        <DrawingPanel
          style={{ float: "left" }}
          rows={rows}
          updatePixel={updatePixel}
          title={"Editor"}
        />
        <div id="viewer">
          <Viewer style={{ float: "right" }} rows={rows} />
        </div>
      </div>
    </div>
  );
}

const styles = {
  optionsContainer: { display: "flex" },
  textField: { padding: 10 },
};
